let mathMethods = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '/': (a, b) => a / b,
  '**': (a, b) => a ** b,
  
  '!': function factorial(x) {
    let result = 1;
  
    for (let i = 2; i <= x; i++) {
      result *= i;
    }
  
    return result;
  },
};

function operate(op, a, b) {
  return mathMethods[op](+a, +b);
}

let operand1 = null;
let operand2 = null;
let operator;
let outputElem = document.querySelector('.output');
let resultElem = document.querySelector('.result');

function display(value) {
  outputElem.textContent += value;
}

function showResult() {
  resultElem.style.visibility = 'visible';
}

function setResult(value) {
  resultElem.textContent = value;
}

function clearDisplay() {
  resetOutput();
  resetResult();
}

function resetOutput() {
  outputElem.textContent = '';
  operand1 = null;
  operand2 = null;
  operator = null;
}

function resetResult() {
  resultElem.textContent = '';
  resultElem.style.visibility = '';
}
