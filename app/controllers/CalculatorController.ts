import { Controller, Request, Response, Views } from 'fhyts';

export class CalculatorController extends Controller {
  private views = new Views();
  private static calculationHistory: Array<{
    expression: string;
    result: number;
    timestamp: Date;
  }> = [];
  
  private static memory: number = 0;
  
  async index(req: Request, res: Response) {
    const page = this.views.render('calculator', { 
      title: 'Advanced Calculator - FhyTS',
      history: CalculatorController.calculationHistory.slice(-10) // Last 10 calculations
    });
    return res.status(200).html(page);
  }

  // Basic calculation endpoint
  async calculate(req: Request, res: Response) {
    try {
      const { expression } = req.body;
      
      if (!expression || typeof expression !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid expression' 
        });
      }

      // Sanitize and validate expression
      const sanitizedExpression = this.sanitizeExpression(expression);
      const result = this.evaluateExpression(sanitizedExpression);
      
      // Add to history
      CalculatorController.calculationHistory.push({
        expression: sanitizedExpression,
        result: result,
        timestamp: new Date()
      });

      // Keep only last 100 calculations
      if (CalculatorController.calculationHistory.length > 100) {
        CalculatorController.calculationHistory = CalculatorController.calculationHistory.slice(-100);
      }

      return res.status(200).json({
        success: true,
        result: result,
        expression: sanitizedExpression,
        formatted: this.formatNumber(result)
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: (error instanceof Error) ? error.message : 'Calculation error'
      });
    }
  }

  // Scientific calculator operations
  async scientific(req: Request, res: Response) {
    try {
      const { operation, value, angle = 'rad' } = req.body;
      
      let result: number;
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        throw new Error('Invalid number');
      }

      switch (operation) {
        // Trigonometric functions
        case 'sin':
          result = angle === 'deg' ? Math.sin(numValue * Math.PI / 180) : Math.sin(numValue);
          break;
        case 'cos':
          result = angle === 'deg' ? Math.cos(numValue * Math.PI / 180) : Math.cos(numValue);
          break;
        case 'tan':
          result = angle === 'deg' ? Math.tan(numValue * Math.PI / 180) : Math.tan(numValue);
          break;
        case 'asin':
          result = angle === 'deg' ? Math.asin(numValue) * 180 / Math.PI : Math.asin(numValue);
          break;
        case 'acos':
          result = angle === 'deg' ? Math.acos(numValue) * 180 / Math.PI : Math.acos(numValue);
          break;
        case 'atan':
          result = angle === 'deg' ? Math.atan(numValue) * 180 / Math.PI : Math.atan(numValue);
          break;

        // Logarithmic functions
        case 'log':
          result = Math.log10(numValue);
          break;
        case 'ln':
          result = Math.log(numValue);
          break;
        case 'log2':
          result = Math.log2(numValue);
          break;

        // Power and root functions
        case 'sqrt':
          result = Math.sqrt(numValue);
          break;
        case 'cbrt':
          result = Math.cbrt(numValue);
          break;
        case 'square':
          result = Math.pow(numValue, 2);
          break;
        case 'cube':
          result = Math.pow(numValue, 3);
          break;
        case 'pow10':
          result = Math.pow(10, numValue);
          break;
        case 'exp':
          result = Math.exp(numValue);
          break;

        // Other functions
        case 'factorial':
          result = this.factorial(Math.floor(numValue));
          break;
        case 'abs':
          result = Math.abs(numValue);
          break;
        case 'floor':
          result = Math.floor(numValue);
          break;
        case 'ceil':
          result = Math.ceil(numValue);
          break;
        case 'round':
          result = Math.round(numValue);
          break;

        // Constants
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;

        default:
          throw new Error('Unknown operation');
      }

      // Add to history
      const expression = `${operation}(${value})`;
      CalculatorController.calculationHistory.push({
        expression: expression,
        result: result,
        timestamp: new Date()
      });

      return res.status(200).json({
        success: true,
        result: result,
        operation: operation,
        formatted: this.formatNumber(result)
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: (error instanceof Error) ? error.message : 'Scientific calculation error'
      });
    }
  }

  // Memory operations
  async memory(req: Request, res: Response) {
    try {
      const { operation, value } = req.body;
      
      switch (operation) {
        case 'store':
          CalculatorController.memory = parseFloat(value) || 0;
          break;
        case 'recall':
          // Memory recall - return current memory value
          break;
        case 'add':
          CalculatorController.memory += parseFloat(value) || 0;
          break;
        case 'subtract':
          CalculatorController.memory -= parseFloat(value) || 0;
          break;
        case 'clear':
          CalculatorController.memory = 0;
          break;
        default:
          throw new Error('Unknown memory operation');
      }

      return res.status(200).json({
        success: true,
        memory: CalculatorController.memory,
        operation: operation,
        formatted: this.formatNumber(CalculatorController.memory)
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: (error instanceof Error) ? error.message : 'Memory operation error'
      });
    }
  }

  // Get calculation history
  async history(req: Request, res: Response) {
    const { limit = 20 } = req.query;
    const historyLimit = Math.min(parseInt(limit as string) || 20, 100);
    
    return res.status(200).json({
      success: true,
      history: CalculatorController.calculationHistory.slice(-historyLimit).reverse(),
      total: CalculatorController.calculationHistory.length
    });
  }

  // Clear history
  async clearHistory(req: Request, res: Response) {
    CalculatorController.calculationHistory = [];
    
    return res.status(200).json({
      success: true,
      message: 'History cleared'
    });
  }

  // Unit conversion
  async convert(req: Request, res: Response) {
    try {
      const { value, fromUnit, toUnit, category } = req.body;
      
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        throw new Error('Invalid number');
      }

      let result: number;

      switch (category) {
        case 'length':
          result = this.convertLength(numValue, fromUnit, toUnit);
          break;
        case 'weight':
          result = this.convertWeight(numValue, fromUnit, toUnit);
          break;
        case 'temperature':
          result = this.convertTemperature(numValue, fromUnit, toUnit);
          break;
        case 'area':
          result = this.convertArea(numValue, fromUnit, toUnit);
          break;
        case 'volume':
          result = this.convertVolume(numValue, fromUnit, toUnit);
          break;
        default:
          throw new Error('Unknown conversion category');
      }

      const expression = `${value} ${fromUnit} → ${toUnit}`;
      CalculatorController.calculationHistory.push({
        expression: expression,
        result: result,
        timestamp: new Date()
      });

      return res.status(200).json({
        success: true,
        result: result,
        fromValue: numValue,
        fromUnit: fromUnit,
        toUnit: toUnit,
        formatted: this.formatNumber(result)
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        error: (error instanceof Error) ? error.message : 'Conversion error'
      });
    }
  }

  // Private helper methods
  private sanitizeExpression(expression: string): string {
    // Replace common symbols
    return expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/\s/g, '');
  }

  private evaluateExpression(expression: string): number {
    // Basic validation
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
      throw new Error('Invalid characters in expression');
    }

    // Prevent division by zero
    if (expression.includes('/0')) {
      throw new Error('Division by zero');
    }

    try {
      // Use Function constructor for safer evaluation
      const result = Function('"use strict"; return (' + expression + ')')();
      
      if (!isFinite(result)) {
        throw new Error('Result is not finite');
      }
      
      return Number(result);
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  }

  private formatNumber(num: number): string {
    // Format number for display
    if (Number.isInteger(num)) {
      return num.toString();
    }
    
    // Round to 10 decimal places to avoid floating point issues
    const rounded = Math.round(num * 10000000000) / 10000000000;
    
    // Use scientific notation for very large or very small numbers
    if (Math.abs(rounded) >= 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
      return rounded.toExponential(6);
    }
    
    return rounded.toString();
  }

  private factorial(n: number): number {
    if (n < 0 || n > 170) {
      throw new Error('Factorial input out of range');
    }
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Unit conversion methods
  private convertLength(value: number, from: string, to: string): number {
    const meters = this.toMeters(value, from);
    return this.fromMeters(meters, to);
  }

  private toMeters(value: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mm': 0.001,
      'cm': 0.01,
      'm': 1,
      'km': 1000,
      'in': 0.0254,
      'ft': 0.3048,
      'yd': 0.9144,
      'mi': 1609.344
    };
    return value * (conversions[unit] || 1);
  }

  private fromMeters(meters: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mm': 1000,
      'cm': 100,
      'm': 1,
      'km': 0.001,
      'in': 39.3701,
      'ft': 3.28084,
      'yd': 1.09361,
      'mi': 0.000621371
    };
    return meters * (conversions[unit] || 1);
  }

  private convertWeight(value: number, from: string, to: string): number {
    const grams = this.toGrams(value, from);
    return this.fromGrams(grams, to);
  }

  private toGrams(value: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mg': 0.001,
      'g': 1,
      'kg': 1000,
      'oz': 28.3495,
      'lb': 453.592,
      'ton': 1000000
    };
    return value * (conversions[unit] || 1);
  }

  private fromGrams(grams: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mg': 1000,
      'g': 1,
      'kg': 0.001,
      'oz': 0.035274,
      'lb': 0.00220462,
      'ton': 0.000001
    };
    return grams * (conversions[unit] || 1);
  }

  private convertTemperature(value: number, from: string, to: string): number {
    let celsius: number;
    
    // Convert to Celsius first
    switch (from) {
      case 'C':
        celsius = value;
        break;
      case 'F':
        celsius = (value - 32) * 5/9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        throw new Error('Unknown temperature unit');
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'C':
        return celsius;
      case 'F':
        return celsius * 9/5 + 32;
      case 'K':
        return celsius + 273.15;
      default:
        throw new Error('Unknown temperature unit');
    }
  }

  private convertArea(value: number, from: string, to: string): number {
    const sqMeters = this.toSquareMeters(value, from);
    return this.fromSquareMeters(sqMeters, to);
  }

  private toSquareMeters(value: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mm2': 0.000001,
      'cm2': 0.0001,
      'm2': 1,
      'km2': 1000000,
      'in2': 0.00064516,
      'ft2': 0.092903,
      'yd2': 0.836127,
      'ac': 4046.86,
      'ha': 10000
    };
    return value * (conversions[unit] || 1);
  }

  private fromSquareMeters(sqMeters: number, unit: string): number {
    const conversions: Record<string, number> = {
      'mm2': 1000000,
      'cm2': 10000,
      'm2': 1,
      'km2': 0.000001,
      'in2': 1550,
      'ft2': 10.7639,
      'yd2': 1.19599,
      'ac': 0.000247105,
      'ha': 0.0001
    };
    return sqMeters * (conversions[unit] || 1);
  }

  private convertVolume(value: number, from: string, to: string): number {
    const liters = this.toLiters(value, from);
    return this.fromLiters(liters, to);
  }

  private toLiters(value: number, unit: string): number {
    const conversions: Record<string, number> = {
      'ml': 0.001,
      'l': 1,
      'gal': 3.78541,
      'qt': 0.946353,
      'pt': 0.473176,
      'cup': 0.236588,
      'fl_oz': 0.0295735,
      'm3': 1000
    };
    return value * (conversions[unit] || 1);
  }

  private fromLiters(liters: number, unit: string): number {
    const conversions: Record<string, number> = {
      'ml': 1000,
      'l': 1,
      'gal': 0.264172,
      'qt': 1.05669,
      'pt': 2.11338,
      'cup': 4.22675,
      'fl_oz': 33.814,
      'm3': 0.001
    };
    return liters * (conversions[unit] || 1);
  }
}
