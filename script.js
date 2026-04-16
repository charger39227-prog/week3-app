// Calculator state
let expression = '';
let justCalculated = false;

const displayResult = document.getElementById('result');
const displayExpression = document.getElementById('expression');

// Append value to expression
function appendVal(val) {
  const operators = ['+', '-', '*', '/'];

  if (justCalculated && !operators.includes(val)) {
    expression = '';
    justCalculated = false;
  }

  const lastChar = expression.slice(-1);

  // Prevent double operators
  if (operators.includes(val) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1);
  }

  // Prevent multiple decimals in same number
  if (val === '.') {
    const parts = expression.split(/[\+\-\*\/]/);
    if (parts[parts.length - 1].includes('.')) return;
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
    displayExpression.textContent = formatExpression(expression) + ' =';
    const result = Function('"use strict"; return (' + expression + ')')();

    if (!isFinite(result)) {
      displayResult.textContent = 'Error';
      expression = '';
      return;
    }

    const rounded = parseFloat(result.toFixed(10));
    displayResult.textContent = rounded;
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
  displayResult.textContent = expression === '' ? '0' : formatExpression(expression);
  displayExpression.textContent = '';
}

// Format expression for display
function formatExpression(expr) {
  return expr.replace(/\*/g, '×').replace(/\//g, '÷');
}

// Keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') appendVal(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) { e.preventDefault(); appendVal(e.key); }
  else if (e.key === '.') appendVal('.');
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
