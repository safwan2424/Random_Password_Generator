const inputSlider=document.querySelector("[data-lengthSlider]");

const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passWordDisplay=document.querySelector("[data-passwordDisplay]");

const copyBtn=document.querySelector("[data-copy]");

const copyMsg=document.querySelector("[data-copyMsg]");

const uppercaseCheck=document.querySelector("#uppercase");

const lowercaseCheck=document.querySelector("#lowercase");

const numbersCheck=document.querySelector("#numbers");

const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");

const generateBtn=document.querySelector(".generateButton");

const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password='';
let passwordLength=10;
let checkCount=0;
//set strength circle to grey
setIndicator("#ccc")

//Setting length of password slider
 handleSlider();
function handleSlider(){
inputSlider.value=passwordLength;
lengthDisplay.innerText = passwordLength;

const min=inputSlider.min;
const max=inputSlider.max;
inputSlider.style.backgroundSize =((passwordLength-min)*100/(max-min)) + "% 100%"

}

//set Indicator

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    //shadow
}

function getRandInteger(min,max){
   return  Math.floor(Math.random()*(max - min))+min // max sai min kai beech mai integer dega
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRandInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbol() {
    const randNum = getRandInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
    } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
    ) {
    setIndicator("#ff0");
    } else {
    setIndicator("#f00");
    }
}

async function copyContent(){
try{
    await navigator.clipboard.writeText(passWordDisplay.value);
    copyMsg.innerText ="copied";
}
catch(e){
    copyMsg.innerText="failed";

}
//to make copy wala span visible
copyMsg.classList.add("active");

setTimeout(()=>{
    copyMsg.classList.remove("active");
},2000);
}
function shufflePassword(array){
    //fisher yates method 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special conditions 
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change", handleCheckBoxChange)
})
inputSlider.addEventListener("input", (e)=> {
    passwordLength=e.target.value;
    handleSlider(); 
})

copyBtn.addEventListener("click",()=>{
    if(passWordDisplay.value)
        copyContent();
})
 


generateBtn.addEventListener("click", ()=>{
    //none of the check box ticked
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //lets start the password new generator

    //remove old password

    password='';
    //generate new password

    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    //compulsory addition 
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //Remaining index
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRandInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    //Show to UI
    passWordDisplay.value=password;

    //calculate strength
    calculateStrength();




})
