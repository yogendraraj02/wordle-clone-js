// const keyPress = document.querySelector("html");
const sections = document.querySelectorAll("section");
const boxes = document.querySelectorAll("section div");

const WORD_URL = 'https://words.dev-apis.com/word-of-the-day';
const VALID_WORD_URL = ' https://words.dev-apis.com/validate-word';
let row = 0;
let col = -1;
let enterRequired = false;
let wordStatus = 1; // for a valid word

async function gettodaysWord(){
    const getPromise = await fetch(WORD_URL);
    const processedResponse = await getPromise.json();
    const word = await processedResponse.word;
    return word;
}
let TODAYS_WORD = "";
gettodaysWord().then( (data)=>{
    TODAYS_WORD = data;
});

document.addEventListener("keydown",function(event){
    let key = event.key;
    console.log(key);
    // get only a-z A-z avoid numbers and symbols
    if(isLetter(key)){
        fillBoxes(key);
    } else {
        //enter
        if(key =="Enter" && col == 4){
            enterRequired = false;
            extractWord(row);
        }
        //backspace
        if(key == 'Backspace'){
            //the backspace should not
            if(col <= 4 && col >= 0){
                boxes[col + row * 5].innerText = "";
                col--;
            }
                
        }
    }
})
// console.log(`section length ${sections.length}`);
// console.log(`bx length ${boxes.length}`);
function addClass(cName){
    for(let i=0; i < 5 ; i++){
        boxes[row * 5 + i].classList.add(cName);
    }
}
function fillBoxes(input){
    if(row == 6){
        alert("Oh Lost all the chances!");
        row--;
        // addClass("lost");
        gameExit();
        return;
    }
    if(col == 4){
        enterRequired = true;
    } else{
        enterRequired = false;
    }    
    
    if(enterRequired == true){
        return;
    }
    col = ++col % 5;
    const box = boxes[col + row*5];
    box.innerText = input.toUpperCase();    
    console.log("After-->"+"r:"+row +" col:"+col);
    
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }


function extractWord(row){
    let word = "";
    for(let i = 0; i < 5 ; i++){
        word += boxes[row * 5 + i].innerText.toLowerCase();
    }

    console.log(word);
    validateWord(word);
        
}
async function validateWord(word){

    const postPormise = await fetch(VALID_WORD_URL,{
        method:"POST",
        body : JSON.stringify({
            "word" : word
        })
    })
    const validWordResponse = await postPormise.json();
    console.log(validWordResponse);
    console.log(TODAYS_WORD);
    wordStatus = 1;  
    if(!validWordResponse.validWord){
        // alert("insert a valid word");
        console.log("insert a valid word");
        wordStatus = -1;
    } else {

        if(word.localeCompare(TODAYS_WORD) == 0){
            alert("You nailed it! Correct Word");
            wordStatus = 0;
        }
        
    }
    //+"val:"+val
    console.log("enter pressed"+enterRequired +"r:"+row+"c:"+col+"wS:"+wordStatus);  
    if(wordStatus == 1){
        //to get on next line and row increase means 1 chance is exhausted
        col =-1;
        row++;
    }else if(wordStatus == 0){     
        addClass("win");
    } 
    //for invalid word nothing needs to be done ....chance remain
    //val == -1


}
function gameExit(){
    row = 0;
    col = 0;
    clearAllBoxes();    
}
function clearAllBoxes(){
    for(let i =0; i < 30;i++){
        boxes[i].innerText = "";
    }
}
