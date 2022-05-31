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
