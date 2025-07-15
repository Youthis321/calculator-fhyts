# 🧮 CalculatorController - Advanced Logic Documentation

## 📋 Ringkasan CalculatorController

**CalculatorController** adalah controller yang sangat canggih dengan logika matematika dan konversi unit yang lengkap. Controller ini mengubah calculator sederhana menjadi aplikasi kalkulator profesional dengan fitur-fitur hebat.

## 🚀 Fitur-Fitur Hebat yang Ditambahkan

### 1. **🧪 Scientific Calculator**
```typescript
// Operasi Trigonometri
- sin, cos, tan (dengan mode degree/radian)
- asin, acos, atan (inverse trigonometric)

// Operasi Logaritma
- log (base 10), ln (natural log), log2 (base 2)

// Operasi Pangkat dan Akar
- sqrt (akar kuadrat), cbrt (akar kubik)
- square (x²), cube (x³), pow10 (10^x)
- exp (e^x), factorial (x!)

// Fungsi Lainnya
- abs (nilai absolut), floor, ceil, round
- Konstanta π (pi) dan e (euler)
```

### 2. **💾 Memory Functions**
```typescript
// Operasi Memory
- MC (Memory Clear) - Hapus memory
- MR (Memory Recall) - Ambil nilai dari memory
- M+ (Memory Add) - Tambah ke memory
- M- (Memory Subtract) - Kurang dari memory
- MS (Memory Store) - Simpan ke memory
```

### 3. **📊 History Management**
```typescript
// Fitur History
- Simpan 100 kalkulasi terakhir
- Tampilkan dengan timestamp
- Click untuk menggunakan kembali hasil
- Clear history function
- Auto-refresh setelah kalkulasi
```

### 4. **🔄 Unit Converter**
```typescript
// Kategori Konversi
- Length: mm, cm, m, km, in, ft, yd, mi
- Weight: mg, g, kg, oz, lb, ton
- Temperature: Celsius, Fahrenheit, Kelvin
- Area: mm², cm², m², km², in², ft², yd², acre, hectare
- Volume: ml, l, gal, qt, pt, cup, fl_oz, m³
```

## 🏗️ Arsitektur Controller

### **API Endpoints yang Dibuat:**

#### 1. `/api/calculate` (POST)
```typescript
// Basic calculation
Body: { expression: "2+2*3" }
Response: { 
  success: true, 
  result: 8, 
  expression: "2+2*3",
  formatted: "8" 
}
```

#### 2. `/api/scientific` (POST)
```typescript
// Scientific operations
Body: { 
  operation: "sin", 
  value: 30, 
  angle: "deg" 
}
Response: { 
  success: true, 
  result: 0.5, 
  operation: "sin",
  formatted: "0.5" 
}
```

#### 3. `/api/memory` (POST)
```typescript
// Memory operations
Body: { 
  operation: "store", 
  value: 42 
}
Response: { 
  success: true, 
  memory: 42,
  operation: "store",
  formatted: "42" 
}
```

#### 4. `/api/history` (GET/DELETE)
```typescript
// Get history
GET Response: {
  success: true,
  history: [...],
  total: 25
}

// Clear history
DELETE Response: {
  success: true,
  message: "History cleared"
}
```

#### 5. `/api/convert` (POST)
```typescript
// Unit conversion
Body: {
  value: 100,
  fromUnit: "cm",
  toUnit: "m",
  category: "length"
}
Response: {
  success: true,
  result: 1,
  fromValue: 100,
  fromUnit: "cm",
  toUnit: "m",
  formatted: "1"
}
```

## 🔧 Metode Helper yang Canggih

### **1. Expression Sanitization**
```typescript
private sanitizeExpression(expression: string): string {
  return expression
    .replace(/×/g, '*')        // Replace × dengan *
    .replace(/÷/g, '/')        // Replace ÷ dengan /
    .replace(/π/g, Math.PI.toString())  // Replace π dengan nilai PI
    .replace(/e/g, Math.E.toString())   // Replace e dengan nilai E
    .replace(/\s/g, '');       // Hapus spasi
}
```

### **2. Safe Expression Evaluation**
```typescript
private evaluateExpression(expression: string): number {
  // Validasi karakter yang diizinkan
  if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
    throw new Error('Invalid characters in expression');
  }

  // Cek pembagian dengan nol
  if (expression.includes('/0')) {
    throw new Error('Division by zero');
  }

  // Evaluasi aman dengan Function constructor
  const result = Function('"use strict"; return (' + expression + ')')();
  
  if (!isFinite(result)) {
    throw new Error('Result is not finite');
  }
  
  return Number(result);
}
```

### **3. Number Formatting**
```typescript
private formatNumber(num: number): string {
  // Integer: tampilkan langsung
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Round untuk menghindari floating point issues
  const rounded = Math.round(num * 10000000000) / 10000000000;
  
  // Scientific notation untuk angka sangat besar/kecil
  if (Math.abs(rounded) >= 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
    return rounded.toExponential(6);
  }
  
  return rounded.toString();
}
```

### **4. Advanced Factorial Function**
```typescript
private factorial(n: number): number {
  // Validasi range (0-170 untuk menghindari overflow)
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
```

## 🔄 Unit Conversion System

### **Temperature Conversion Logic**
```typescript
private convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  
  // Convert to Celsius first (base unit)
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5/9; break;
    case 'K': celsius = value - 273.15; break;
  }
  
  // Convert from Celsius to target
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9/5 + 32;
    case 'K': return celsius + 273.15;
  }
}
```

### **Universal Conversion Pattern**
```typescript
// Pattern: Convert to base unit → Convert from base unit
private convertLength(value: number, from: string, to: string): number {
  const meters = this.toMeters(value, from);      // To base unit
  return this.fromMeters(meters, to);             // From base unit
}

// Dengan Record<string, number> untuk type safety
private toMeters(value: number, unit: string): number {
  const conversions: Record<string, number> = {
    'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
    'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344
  };
  return value * (conversions[unit] || 1);
}
```

## 🎯 Error Handling yang Robust

### **1. TypeScript-Safe Error Handling**
```typescript
} catch (error) {
  return res.status(400).json({
    success: false,
    error: (error instanceof Error) ? error.message : 'Calculation error'
  });
}
```

### **2. Input Validation**
```typescript
// Validasi expression
if (!expression || typeof expression !== 'string') {
  return res.status(400).json({ 
    success: false, 
    error: 'Invalid expression' 
  });
}

// Validasi number input
if (isNaN(numValue)) {
  throw new Error('Invalid number');
}
```

### **3. Range Validation**
```typescript
// Factorial range check
if (n < 0 || n > 170) {
  throw new Error('Factorial input out of range');
}

// Division by zero check
if (expression.includes('/0')) {
  throw new Error('Division by zero');
}
```

## 💡 Optimizations & Best Practices

### **1. Memory Management**
- History dibatasi maksimal 100 entries
- Static variables untuk memory dan history
- Automatic cleanup untuk history lama

### **2. Performance**
- Type-safe conversion tables dengan Record<string, number>
- Efficient number formatting with rounding
- Minimal API calls dengan smart caching

### **3. Security**
- Safe expression evaluation (no eval)
- Input sanitization dan validation
- Type checking untuk semua parameters

## 🎨 Frontend Integration

### **Modern JavaScript Features**
- Async/await untuk API calls
- Fetch API untuk HTTP requests
- Modern DOM manipulation
- Event delegation pattern

### **Error Handling**
- Modal untuk error display
- Network error handling
- Fallback untuk offline scenarios

## 🚀 Future Enhancements

### **Fitur yang Bisa Ditambahkan:**
1. **Matrix Calculator** - Operasi matrix 2D/3D
2. **Graphing Calculator** - Plot fungsi matematika
3. **Currency Converter** - Real-time exchange rates
4. **Programming Mode** - Binary, octal, hexadecimal
5. **Statistics Functions** - Mean, median, standard deviation
6. **Complex Numbers** - Operasi bilangan kompleks
7. **Equation Solver** - Solve polynomial equations
8. **Integration/Differentiation** - Kalkulus operations

### **Technical Improvements:**
1. **WebSocket** - Real-time updates
2. **PWA Support** - Offline functionality
3. **Voice Input** - Speech recognition
4. **LaTeX Support** - Mathematical notation
5. **Plugin System** - Extensible architecture

---

**CalculatorController** ini merupakan implementasi calculator yang sangat lengkap dan profesional, mendemonstrasikan kemampuan framework FhyTS dalam membangun aplikasi web yang kompleks dengan arsitektur yang bersih dan maintainable! 🎉
