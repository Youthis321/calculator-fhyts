// Advanced Calculator Application
let display = '';
let currentMode = 'basic';
let memory = 0;

// Unit conversion data
const unitCategories = {
  length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    names: ['Millimeter', 'Centimeter', 'Meter', 'Kilometer', 'Inch', 'Foot', 'Yard', 'Mile']
  },
  weight: {
    units: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
    names: ['Milligram', 'Gram', 'Kilogram', 'Ounce', 'Pound', 'Ton']
  },
  temperature: {
    units: ['C', 'F', 'K'],
    names: ['Celsius', 'Fahrenheit', 'Kelvin']
  },
  area: {
    units: ['mm2', 'cm2', 'm2', 'km2', 'in2', 'ft2', 'yd2', 'ac', 'ha'],
    names: ['Square mm', 'Square cm', 'Square m', 'Square km', 'Square in', 'Square ft', 'Square yd', 'Acre', 'Hectare']
  },
  volume: {
    units: ['ml', 'l', 'gal', 'qt', 'pt', 'cup', 'fl_oz', 'm3'],
    names: ['Milliliter', 'Liter', 'Gallon', 'Quart', 'Pint', 'Cup', 'Fluid Ounce', 'Cubic Meter']
  }
};

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
  clearDisplay();
  setupModeSwitch();
  updateUnits();
  loadHistory();
});

// Basic Calculator Functions
function appendToDisplay(value) {
  const displayElement = document.getElementById('display');
  
  if (display === '0' || display === 'Error') {
    display = value;
  } else {
    display += value;
  }
  
  displayElement.value = display;
  updateExpressionDisplay();
}

function clearDisplay() {
  display = '';
  document.getElementById('display').value = '0';
  updateExpressionDisplay();
}

function clearEntry() {
  const lastOperatorIndex = Math.max(
    display.lastIndexOf('+'),
    display.lastIndexOf('-'),
    display.lastIndexOf('*'),
    display.lastIndexOf('/')
  );
  
  if (lastOperatorIndex > -1) {
    display = display.substring(0, lastOperatorIndex + 1);
  } else {
    display = '';
  }
  
  document.getElementById('display').value = display || '0';
  updateExpressionDisplay();
}

function deleteLast() {
  if (display.length > 0) {
    display = display.slice(0, -1);
  }
  document.getElementById('display').value = display || '0';
  updateExpressionDisplay();
}

function updateExpressionDisplay() {
  const expressionElement = document.getElementById('expressionDisplay');
  if (expressionElement) {
    expressionElement.textContent = display || '';
  }
}

async function calculate() {
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expression: display })
    });

    const data = await response.json();
    
    if (data.success) {
      display = data.result.toString();
      document.getElementById('display').value = data.formatted;
      updateExpressionDisplay();
      loadHistory(); // Refresh history
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Network error occurred');
  }
}

// Scientific Calculator Functions
async function scientificOperation(operation) {
  const value = parseFloat(display || '0');
  const angleMode = document.querySelector('input[name="angleMode"]:checked')?.value || 'rad';
  
  try {
    const response = await fetch('/api/scientific', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        operation: operation, 
        value: value,
        angle: angleMode 
      })
    });

    const data = await response.json();
    
    if (data.success) {
      display = data.result.toString();
      document.getElementById('display').value = data.formatted;
      updateExpressionDisplay();
      loadHistory();
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Network error occurred');
  }
}

// Memory Functions
async function memoryOperation(operation) {
  const value = parseFloat(display || '0');
  
  try {
    const response = await fetch('/api/memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        operation: operation, 
        value: value 
      })
    });

    const data = await response.json();
    
    if (data.success) {
      memory = data.memory;
      updateMemoryIndicator();
      
      if (operation === 'recall') {
        display = data.memory.toString();
        document.getElementById('display').value = data.formatted;
        updateExpressionDisplay();
      }
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Network error occurred');
  }
}

function updateMemoryIndicator() {
  const indicator = document.getElementById('memoryIndicator');
  if (indicator) {
    indicator.style.display = memory !== 0 ? 'block' : 'none';
  }
}

// Mode Switching
function setupModeSwitch() {
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modes = document.querySelectorAll('.calculator-mode');
  
  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      
      // Update active button
      modeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show/hide modes
      modes.forEach(modeDiv => {
        modeDiv.style.display = modeDiv.id === mode + 'Mode' ? 'block' : 'none';
      });
      
      currentMode = mode;
      
      if (mode === 'history') {
        loadHistory();
      }
    });
  });
}

// Unit Converter Functions
function updateUnits() {
  const category = document.getElementById('conversionCategory').value;
  const fromUnit = document.getElementById('fromUnit');
  const toUnit = document.getElementById('toUnit');
  
  // Clear existing options
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';
  
  // Add new options
  unitCategories[category].units.forEach((unit, index) => {
    const fromOption = new Option(unitCategories[category].names[index], unit);
    const toOption = new Option(unitCategories[category].names[index], unit);
    fromUnit.add(fromOption);
    toUnit.add(toOption);
  });
  
  // Set default selections
  if (fromUnit.options.length > 0) fromUnit.selectedIndex = 0;
  if (toUnit.options.length > 1) toUnit.selectedIndex = 1;
}

async function convertUnits() {
  const fromValue = parseFloat(document.getElementById('fromValue').value);
  const fromUnit = document.getElementById('fromUnit').value;
  const toUnit = document.getElementById('toUnit').value;
  const category = document.getElementById('conversionCategory').value;
  
  if (isNaN(fromValue) || !fromUnit || !toUnit) {
    document.getElementById('toValue').value = '';
    return;
  }
  
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: fromValue,
        fromUnit: fromUnit,
        toUnit: toUnit,
        category: category
      })
    });

    const data = await response.json();
    
    if (data.success) {
      document.getElementById('toValue').value = data.formatted;
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Network error occurred');
  }
}

// History Functions
async function loadHistory() {
  try {
    const response = await fetch('/api/history');
    const data = await response.json();
    
    if (data.success) {
      displayHistory(data.history);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

function displayHistory(history) {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  if (history.length === 0) {
    historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
    return;
  }
  
  historyList.innerHTML = history.map(item => `
    <div class="history-item" onclick="useHistoryValue('${item.result}')">
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">= ${item.result}</div>
      <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}

function useHistoryValue(value) {
  display = value.toString();
  document.getElementById('display').value = value;
  updateExpressionDisplay();
  
  // Switch back to basic mode
  document.querySelector('[data-mode="basic"]').click();
}

async function clearHistory() {
  try {
    const response = await fetch('/api/history', {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      loadHistory();
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Network error occurred');
  }
}

// Error Handling
function showError(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('errorMessage');
  
  if (modal && messageElement) {
    messageElement.textContent = message;
    modal.style.display = 'block';
  } else {
    alert(message); // Fallback
  }
  
  display = 'Error';
  document.getElementById('display').value = 'Error';
}

function closeErrorModal() {
  document.getElementById('errorModal').style.display = 'none';
  clearDisplay();
}

// Keyboard Support
document.addEventListener('keydown', function(event) {
  const key = event.key;
  
  // Only handle keyboard input in basic mode
  if (currentMode !== 'basic') return;
  
  if (key >= '0' && key <= '9' || key === '.') {
    appendToDisplay(key);
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    appendToDisplay(key);
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
  } else if (key === 'Backspace') {
    deleteLast();
  }
});

// Modal close on outside click
window.onclick = function(event) {
  const modal = document.getElementById('errorModal');
  if (event.target === modal) {
    closeErrorModal();
  }
};