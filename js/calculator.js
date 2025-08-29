// calculator.js - ক্যালকুলেটর অ্যাপ
function launchCalculator() {
  const wrap = document.createElement("div");
  wrap.className = "app-calculator";
  
  wrap.innerHTML = `
        <div class="calculator-display">
            <div class="previous-operand"></div>
            <div class="current-operand">0</div>
        </div>
        
        <div class="calculator-buttons">
            <button class="calc-btn clear">C</button>
            <button class="calc-btn delete">DEL</button>
            <button class="calc-btn operation">%</button>
            <button class="calc-btn operation">÷</button>
            
            <button class="calc-btn number">7</button>
            <button class="calc-btn number">8</button>
            <button class="calc-btn number">9</button>
            <button class="calc-btn operation">×</button>
            
            <button class="calc-btn number">4</button>
            <button class="calc-btn number">5</button>
            <button class="calc-btn number">6</button>
            <button class="calc-btn operation">-</button>
            
            <button class="calc-btn number">1</button>
            <button class="calc-btn number">2</button>
            <button class="calc-btn number">3</button>
            <button class="calc-btn operation">+</button>
            
            <button class="calc-btn number zero">0</button>
            <button class="calc-btn number">.</button>
            <button class="calc-btn equals">=</button>
        </div>
        
        <div class="calculator-history">
            <h3>History</h3>
            <div class="history-items"></div>
        </div>
    `;
  
  let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;
  let shouldResetScreen = false;
  
  const display = {
    current: wrap.querySelector('.current-operand'),
    previous: wrap.querySelector('.previous-operand')
  };
  
  const historyContainer = wrap.querySelector('.history-items');
  
  // Button event listeners
  wrap.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent;
      
      if (button.classList.contains('number')) {
        appendNumber(buttonText);
      } else if (button.classList.contains('operation')) {
        chooseOperation(buttonText);
      } else if (button.classList.contains('equals')) {
        compute();
      } else if (button.classList.contains('clear')) {
        clear();
      } else if (button.classList.contains('delete')) {
        deleteNumber();
      }
      
      updateDisplay();
    });
  });
  
  function appendNumber(number) {
    if (shouldResetScreen) {
      currentOperand = '';
      shouldResetScreen = false;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
      currentOperand = number;
    } else {
      currentOperand += number;
    }
  }
  
  function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
  }
  
  function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }
    
    addToHistory(`${previousOperand} ${operation} ${currentOperand} = ${computation}`);
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
  }
  
  function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
  }
  
  function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') {
      currentOperand = '0';
    }
  }
  
  function updateDisplay() {
    display.current.textContent = currentOperand;
    if (operation != null) {
      display.previous.textContent = `${previousOperand} ${operation}`;
    } else {
      display.previous.textContent = '';
    }
  }
  
  function addToHistory(calculation) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = calculation;
    historyContainer.prepend(historyItem);
  }
  
  // Keyboard support
  document.addEventListener('keydown', handleKeyboardInput);
  
  function handleKeyboardInput(e) {
    if (/[0-9]/.test(e.key)) {
      appendNumber(e.key);
    } else if (e.key === '.') {
      appendNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      chooseOperation(convertOperator(e.key));
    } else if (e.key === 'Enter' || e.key === '=') {
      compute();
    } else if (e.key === 'Backspace') {
      deleteNumber();
    } else if (e.key === 'Escape') {
      clear();
    }
    updateDisplay();
  }
  
  function convertOperator(keyboardOperator) {
    if (keyboardOperator === '/') return '÷';
    if (keyboardOperator === '*') return '×';
    return keyboardOperator;
  }
  
  createWindow("Calculator", wrap, "calculator");
}

// apps.js এ যোগ করুন
apps.calculator = {
  id: 'calculator',
  name: 'Calculator',
  icon: '🧮',
  description: 'Scientific calculator with history',
  isOpen: false,
  launch: launchCalculator
};