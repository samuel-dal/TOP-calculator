const allBtns = document.querySelectorAll('.bottom-container .btn-container button');
const resultNum = document.querySelector('.result-num');
const allOperations = document.querySelectorAll('.operations');
const screenResult = document.querySelector('.screen-result');
const root = document.querySelector(':root');

let numString = '0';
let parsedNumString = 0;//used to calculate
let currentSign = '';
let resultString = '';//used in result `${resultString}${parsedNumString}`

resultNum.textContent = numString;

const displayText = (stringToDisplay) => {
  resultNum.textContent = stringToDisplay;
}

const allClear = () => {
  numString = '0';
  parsedNumString = 0;
  currentSign = '';
  resultString = '';
}

const clearEntry = () => {
  if (numString.length > 1 && numString !== '0') {
    numString = numString.substring(0, numString.length -1);
      return displayText(numString);
  }

   allClear();
  displayText(numString);
}

const inputBtn = (eventTextContent) => {
  if (numString.length === 1 && numString === '0') {
    numString = '';
  }
  numString += eventTextContent;
  displayText(numString);
}


const pushSign = (event) => {
  currentSign = event.target.value;//string like times,plus,minus,divide
  parsedNumString += parseFloat(numString);
  numString = '';
  console.log(parsedNumString);
}

const equalSign = () => {
  switch (currentSign) {
    case 'plus':
      parsedNumString += parseFloat(numString);
      return;

    case 'minus':
      parsedNumString -= parseFloat(numString);
      return;

    case 'times':
      parsedNumString *= parseFloat(numString);
      return;

    case 'divide':
      parsedNumString /= parseFloat(numString);
      return;

  }
}

let resultSize = 4;

let changeStylesArr = [['--number-result-justify', '--number-result-align', '--number-result-word-break', '--number-result-overflow'], // changeStylesArr[0] :root variables
                       ['start', 'start', 'break-all', 'auto'],//changeStylesArr[1] toggle css style
                       ['end', 'center', 'none', 'none']];//changeStylesArr[2] default css style;

const resultDisplayBehavior = () => {
  if (screenResult.clientWidth <  resultNum.clientWidth) {
    resultSize = 2;
    root.style.setProperty('--result-number-size', `${resultSize}rem`);

    if (resultSize === 2) {
      for (let i = 0; i < changeStylesArr[0].length; i++){
        root.style.setProperty(changeStylesArr[0][i], changeStylesArr[1][i]);
      }
      return;
    }

    return;
  } 

  if (screenResult.clientWidth >  resultNum.clientWidth && numString.length <= 10) {//bug
    resultSize = 4;

    for (let i = 0; i < changeStylesArr[0].length; i++){
      root.style.setProperty(changeStylesArr[0][i], changeStylesArr[2][i]);
    }
    root.style.setProperty('--result-number-size', `${resultSize}rem`);
  }
}


allBtns.forEach(btn => {
  btn.addEventListener('mousedown', (mousedownEvent) => {
    let targetValue = mousedownEvent.target.value;
    let classValue = mousedownEvent.target.classList.value;
    let contentValue = mousedownEvent.target.textContent;

    if (classValue === 'numbers' || classValue === 'operations') {
       resultString += contentValue;
     }

    if (targetValue === 'all-clear') {
       allClear();
       displayText(numString);
       return;
    }

    if (targetValue === 'clear-entry') {
      return clearEntry();
    }

    if (classValue === 'numbers') {
      inputBtn(contentValue);
      displayText(numString);
      return;
    }

    if (classValue === 'operations' && targetValue !== 'equal') {
      if (currentSign && targetValue === 'minus' || !currentSign & numString === '0') {
        inputBtn(contentValue);
        return;
      }
      pushSign(mousedownEvent);
      displayText(numString);
      return;
    }

    if (targetValue === 'equal') {
      equalSign();
      displayText(`${resultString}${parsedNumString}`);
      allClear();
      return
    }

    // numString += contentValue;
    // displayText(numString);
  })
});

document.addEventListener('keydown', (keydownEvent) => {
  if (parseInt(keydownEvent.key) || keydownEvent.key === '0'){
    inputBtn(keydownEvent.key);
    resultString += keydownEvent.key;
  }

  if (keydownEvent.key === 'Backspace') {
    clearEntry();
  }

  if (keydownEvent.key === 'Enter') {
    equalSign();
    resultString += '=';
    displayText(`${resultString}${parsedNumString}`);
    allClear();
  }
  resultDisplayBehavior();
});

document.addEventListener('mousedown', (e) => {
  resultDisplayBehavior();
});