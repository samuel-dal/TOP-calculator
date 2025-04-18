const resultNum = document.querySelector('.result-num');
const root = document.querySelector(':root');
const screenResult = document.querySelector('.screen-result');
const allBtns = document.querySelectorAll('.bottom-container .btn-container button');
const operatorsBtns = document.querySelectorAll('.operators'); 
const fractionBtns = document.querySelectorAll('.fraction');
const numBtns = document.querySelectorAll('.numbers');
const equalBtn = operatorsBtns[0];
const percentBtn = fractionBtns[0];
const dotBtn = fractionBtns[1];

let stringEl = '';//for UI 
let arrEl = [];//for calculation

const operatorsRegex = /[*/+\-]/g;
const operatorsRegex2 = /[*/+]/g;
const numberRegex = /[0-9]/g;
const numberWithDotRegex = /[0-9.]/g;

let activeDecimal = false;
let isPercent = false;
let isEqual = false;
let activeOperator = false;
let negativeValue = false;
let changeOperator = false;
let equationCount = 0;

const update = () => {
   if (!stringEl.length) {
      arrEl.push('0');
   }
   stringEl = arrEl.join('');
   resultNum.textContent = stringEl;
}
update();

//---------------------------
const allClear = () => {
   stringEl = '';
   arrEl = [];
   strNum = '';
   strOpe = '';
   strElArr = [];
   activeDecimal = false;
   isPercent = false;
   isEqual = false;
   equationCount = 0;
   update();
}

const clearEntry = () => {
   const arrElLength = arrEl.length;

   if (!arrElLength || arrElLength < 2) {
      allClear();
      return;
   }

   if (negativeValue && arrEl[arrElLength - 2].match(operatorsRegex)) {
      negativeValue = false;
      arrEl.pop();
      activeOperator = true;
      return update();
   }

   if (arrEl[arrElLength - 1].includes('.')) {
      activeDecimal = false;
      isPercent = false;
   }
   isEqual = false;
   arrEl.pop();
   update();
}

const percentage = (isCalculate) => {

   if (!isCalculate || isPercent || isEqual || activeDecimal) {
      //console.log('disable percentage');
      return;
   }

   if (arrEl[arrEl.length - 1] === '0' && arrEl[0] === '0') {
       arrEl.push('.', '0', '0');
       return update();
   }

   let percentArr = [];
   let stop = false;
   for (let i = arrEl.length - 1; i >= 0; i--) {
      const lastVal = arrEl[i];

      if (lastVal.match(operatorsRegex)) {
         stop = true;
      }

      if (!stop) {
         percentArr.unshift(lastVal);
         arrEl.pop();
      }
   }

   let strPercentage = String((parseFloat(percentArr.join('')) / 100).toFixed(2));

   if (parseFloat(strPercentage)) {
      for (let i = 0; i < strPercentage.length; i++) {
         arrEl.push(strPercentage[i]);
      }
   }
   isPercent = true;
   update();
}

 let resultSize = 4;

 let changeStylesArr = [
   ['--number-result-justify', '--number-result-align', '--number-result-word-break', '--number-result-overflow'], 
   ['start', 'start', 'break-all', 'auto'], ['end', 'center', 'none', 'none']
 ];

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

   if (screenResult.clientWidth >  resultNum.clientWidth && stringEl.length <= 1) {//bug
     resultSize = 4;

     for (let i = 0; i < changeStylesArr[0].length; i++){
       root.style.setProperty(changeStylesArr[0][i], changeStylesArr[2][i]);
     }
     root.style.setProperty('--result-number-size', `${resultSize}rem`);
   }
 }

//-------------------------------

const separateTypes = () => {
   let strNum = '';
   let strOpe = '';
   let strElArr = [];
   let stringElLength = stringEl.length;

   for (let i = 0; i < stringElLength; i++) {
      let currentVal = stringEl[i];

      if (strOpe.length > 1 && currentVal.match(numberWithDotRegex)) {
         strNum += strOpe[1];
      }

      if (currentVal.match(numberWithDotRegex)) {
          strNum += currentVal;
      }

      if (currentVal.match(operatorsRegex)) {
          strOpe += currentVal;
      }

      if (strNum && currentVal.match(operatorsRegex) || i === stringElLength - 1 && strNum !== '') {
         strElArr.push(strNum);
         strNum = '';
      }

      if (strOpe && currentVal.match(numberWithDotRegex) || i === stringElLength - 1 && strOpe !== '') {
         strElArr.push(strOpe[0]);
         strOpe = '';
      }
         
   }
   resultNum.textContent = stringEl;
   return strElArr;
}

const calculate = (convertedArray) => {//left to right
   let firstCalculation = true;
   let calculation = 0;
   let modifiedArr = [];

   //firstCalculation
   for (let i = 0; i < convertedArray.length; i++) {
      modifiedArr.push(convertedArray[i + 3]);

      if (firstCalculation) {
         const firstVal = parseFloat(convertedArray[i]);
         const secondVal = convertedArray[i + 1];//operator
         const thirdVal = parseFloat(convertedArray[i + 2]);

         if (secondVal === '+') {
            calculation += firstVal + thirdVal;
         }

         if (secondVal === '-') {
            calculation += firstVal - thirdVal;
         }

         if (secondVal === '*') {
            calculation += firstVal * thirdVal;
         }

         if (secondVal === '/') {
            calculation += firstVal / thirdVal;
         }

         firstCalculation = false;
      }
   }
   //calculate all
   for (let i = 0; i < modifiedArr.length; i++) {
      const firstVal = modifiedArr[i];
      const secondVal = parseFloat(modifiedArr[i + 1]);

      if (firstVal === '+') {
         calculation += secondVal;
      }

      if (firstVal === '-') {
         calculation -= secondVal;
      }
         
      if (firstVal === '*') {
         calculation *= secondVal;
      }

      if (firstVal === '/') {
         calculation /= secondVal;
      }
   }
   return calculation;
}

numBtns.forEach(numItem => {
   numItem.addEventListener('mousedown', (numItemEvent) => {
      const eventTarget = numItemEvent.target;
      const targetValue = eventTarget.value;
      const arrElLength = arrEl.length;

      if (isEqual && targetValue === '0') {
         allClear();
         return update();
      }

      if (isEqual) {
         allClear();
      }

      if (arrEl[0] === '0' && arrElLength < 2) {
         arrEl.pop();
      }

      if (equationCount < 1 || equationCount >= 2) {
         equationCount++;
      }

      negativeValue = false;
      arrEl.push(targetValue);
      //percentage(activeDecimal);
      update();
   });
});


operatorsBtns.forEach(opeItem => {
   opeItem.addEventListener('mousedown', (opeItemEvent) => {
      const eventTarget = opeItemEvent.target;
      const targetValue = eventTarget.value;
      const arrElLength = arrEl.length
      const lastIndex = arrEl[arrElLength - 1];
      const secondLastIndex = arrEl[arrElLength - 2];

      if (negativeValue || lastIndex.match(operatorsRegex) && targetValue === '-') {
         if (negativeValue) {
            arrEl.pop();
         }

         if (lastIndex.match(operatorsRegex2) && targetValue === '-') {
            arrEl.push(targetValue);
            negativeValue = true;
            update();
            return;
         }

         arrEl.pop();
         arrEl.push(targetValue, '-');
         activeOperator = true;
         negativeValue = true;
         update();
         return;
      }

      if (negativeValue && secondLastIndex.match(operatorsRegex) || 
         isEqual || 
         equationCount < 3 && targetValue === '=') {
            return;
      }

      if (lastIndex.match(operatorsRegex) && secondLastIndex.match(numberWithDotRegex)) {
         console.log('operator');
         arrEl.pop();
         arrEl.push(targetValue);
         update();
         activeOperator = true;
         return;
      }

      if (equationCount < 2) {
         equationCount++;
      }

      if (arrEl[0] === '0' && arrElLength < 2) {
         equationCount++;
      }

      arrEl.push(targetValue);
      update();
      isPercent = false;
      activeDecimal = false;

      if (targetValue === '=' && equationCount > 2) {
         if (lastIndex.match('-') && secondLastIndex.match(operatorsRegex) || isEqual) {
            return;
         }
         resultNum.textContent += calculate(separateTypes());
         isEqual = true;
      }
   });
});

percentBtn.addEventListener('mousedown', (event) => {
   if (activeDecimal || isEqual) {
      return;
   }

   if (equationCount < 1) {
      equationCount++;
   }

   if (!arrEl.length || !stringEl[stringEl.length - 1].match(numberRegex)) {
      percentage(false);
      activeDecimal = false;
      isPercent = false;
      return;
   }

   if (!activeDecimal) {
      percentage(true);
      activeDecimal = true;
      isPercent = true;
      return;
   }
});

dotBtn.addEventListener('mousedown', (event) => {
   if (activeDecimal || isEqual) {
      return;
   }
   activeDecimal = true;
   arrEl.push('.');
   update();
});

document.addEventListener('mousedown', () => {
   resultDisplayBehavior();
   console.log(resultSize);
});
