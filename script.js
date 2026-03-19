// Calculator state
let expression = '';
let justCalculated = false;

const displayResult = document.getElementById('result');
const displayExpression = document.getElementById('expression');

// Append value to expression
function appendVal(val) {
  const operators = ['+', '-', '*', '/'];

  // If just calculated, start fresh on number press
  if (justCalculated) {
    if (!operators.includes(val)) {
      expression = '';
    }
    justCalculated = false;
  }

  // Prevent double operators
  const lastChar = expression.slice(-1);
  if (operators.includes(val) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1);
  }

  // Prevent multiple decimals in same number
  if (val === '.') {
    const parts = expression.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
  }

  expression += val;
  updateDisplay();
}

// Clear everything
function clearAll() {
  expression = '';
  justCalculated = false;
  displayResult.textContent = '0';
  displayExpression.textContent = '';
  displayResult.classList.remove('updated');
}

// Delete last character
function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Calculate result
function calculate() {
  if (!expression) return;

  try {
    // Show expression in top display
    displayExpression.textContent = formatExpression(expression) + ' =';

    // Evaluate safely
    const result = Function('"use strict"; return (' + expression + ')')();

    // Handle division by zero
    if (!isFinite(result)) {
      displayResult.textContent = 'Error';
      expression = '';
      return;
    }

    // Round to avoid floating point issues
    const rounded = parseFloat(result.toFixed(10));
    displayResult.textContent = rounded;

    // Flash accent color
    displayResult.classList.add('updated');
    setTimeout(() => displayResult.classList.remove('updated'), 400);

    expression = String(rounded);
    justCalculated = true;

  } catch (e) {
    displayResult.textContent = 'Error';
    expression = '';
  }
}

// Update live display
function updateDisplay() {
  if (expression === '') {
    displayResult.textContent = '0';
    displayExpression.textContent = '';
  } else {
    displayResult.textContent = formatExpression(expression);
    displayExpression.textContent = '';
  }
}

// Replace operators with readable symbols
function formatExpression(expr) {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
}

// Keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') appendVal(e.key);
  else if (e.key === '+') appendVal('+');
  else if (e.key === '-') appendVal('-');
  else if (e.key === '*') appendVal('*');
  else if (e.key === '/') { e.preventDefault(); appendVal('/'); }
  else if (e.key === '.') appendVal('.');
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
