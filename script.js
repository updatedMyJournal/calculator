let mathMethods = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
};

let stack = {
  prev: null,
  operand1: null,
  operand2: null,
  operator: null,
};

let outputElem = document.querySelector('.output');
let resultElem = document.querySelector('.result');
let buttonsWrapperElem = document.querySelector('.buttons-wrapper');

buttonsWrapperElem.onpointerup = (e) => {
  let button = e.target.closest('button');
  
  if (!button) return;

  // clear
  if (button.classList.contains('clear')) {
    clearDisplay();

    return;
  }

  resetResult();

  // equals
  if (button.classList.contains('equals')) {
    let result;

    if (stack.operand2 != null) {
      result = operate(stack.operator, stack.operand1, stack.operand2);
    } else if (stack.prev) {
      result = stack.operand1;
    } else {
      return;
    }

    setResult(result);
    showResult();
    resetOutput();
    
    return;
  }

  // digits
  if (button.classList.contains('digit')) {

    if (stack.operator && stack.operand2 != null) {
      stack.operand2 += button.value; 
    } else if (stack.operator) {
      stack.operand2 = button.value;
    } else if (stack.operand1 != null) {
      stack.operand1 += button.value;
    } else {
      stack.operand1 = button.value;
    }
  }

  // operators
  if (button.classList.contains('operator')) {

    if (stack.operand1 == null) return;

    if (stack.operand2 != null) {
      let prevOperationResult = operate(stack.operator, stack.operand1, stack.operand2); 
      
      stack = { prev: stack };
      stack.operand1 = prevOperationResult;
      stack.operator = button.value;
    } else {
      if (stack.operator) removeLastSymbolFromOutput();

      stack.operator = button.value;
    } 
  }

  display(button.value);
};

function operate(op, a, b) {
  return mathMethods[op](+a, +b);
}

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
  stack = {};
}

function resetResult() {
  resultElem.textContent = '';
  resultElem.style.visibility = '';
}

function removeLastSymbolFromOutput() {
  let text = outputElem.textContent;

  outputElem.textContent = text.slice(0, text.length - 1);
}
