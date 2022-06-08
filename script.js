let mathMethods = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => {
    if (b == 0) throw new DivByZeroError('Division by zero');

    return a / b;
  },
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

  // backspace
  if (button.classList.contains('backspace')) {
    if (outputElem.textContent.length <= 0) return;

    if (stack.operand2 != null) {
      if (String(stack.operand2).length > 1) {
        stack.operand2 = getBackspacedText(stack.operand2);
      } else {
        stack.operand2 = null;
      }
    } else if (stack.operator) {
      if (stack.prev) {
        stack = stack.prev;
      } else {
        stack.operator = null;
      }
    } else if (stack.operand1 != null) {
      if (String(stack.operand1).length > 1) {
        stack.operand1 = getBackspacedText(stack.operand1);
      } else {
        stack.operand1 = null;
      }
    }

    removeLastSymbolFromOutput();
  }

  resetResult();

  // equals
  if (button.classList.contains('equals')) {
    let result;

    if (stack.operand2 != null && stack.operand2 != '-') {
      try {
        result = operate(stack.operator, stack.operand1, stack.operand2);

        if (isNaN(result)) {
          throw new WrongExpressionError('Wrong expression');
        }
      } catch(e) {
        if (e instanceof DivByZeroError) {
          showErrorMessage('You can\'t divide by zero!');
        } else if (e instanceof WrongExpressionError) {
          showErrorMessage('Wrong expression');
        }

        return;
      }
    } else if (stack.prev) {
      result = stack.operand1;
    } else {
      return;
    }

    if (!Number.isInteger(Number(result))) result = result.toFixed(2);

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
    if (stack.operand1 == null && button.classList.contains('substract')) {
      stack.operand1 = button.value;
    } else if (
      stack.operator
      && stack.operand2 == null
      && button.classList.contains('substract')
    ) {
      stack.operand2 = button.value;
    } else if (
      stack.operand1 == null
      || stack.operand1 == '-'
      || stack.operand1 == '.'
      || stack.operand2 == '.'
    ) {
      return;
    } else if (stack.operand2 != null) {
      let prevOperationResult; 

      try {
        prevOperationResult = operate(stack.operator, stack.operand1, stack.operand2);

        if (isNaN(prevOperationResult)) {
          throw new WrongExpressionError('Wrong expression');
        }
      } catch(e) {
        if (e instanceof DivByZeroError) {
          showErrorMessage('You can\'t divide by zero!');
        } else if (e instanceof WrongExpressionError) {
          showErrorMessage('Wrong expression');
        }
        
        return;
      }
      
      stack = { prev: stack };
      stack.operand1 = prevOperationResult;
      stack.operator = button.value;
    } else {
      if (stack.operator) removeLastSymbolFromOutput();

      stack.operator = button.value;
    } 
  }

  // dot
  if (button.classList.contains('dot')) {
    if (stack.operator) {
      if (stack.operand2 != null && String(stack.operand2).includes('.')) return;

      stack.operand2 = addDot(stack.operand2);
    } else {
      if (stack.operand1 != null && String(stack.operand1).includes('.')) return;

      stack.operand1 = addDot(stack.operand1);
    }
  }

  display(button.value);
};

class DivByZeroError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class WrongExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

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
  resultElem.style.color = '';
}

function removeLastSymbolFromOutput() {
  let text = outputElem.textContent;

  outputElem.textContent = text.slice(0, text.length - 1);
}

function getBackspacedText(value) {
  let text = String(value);

  return text.slice(0, text.length - 1);
}

function showErrorMessage(message = 'Error') {
  clearDisplay();
  showResult()
  resultElem.style.color = 'red';
  resultElem.textContent = message;
}

function addDot(value) {
  return value == null ? '.' : value + '.';
}
