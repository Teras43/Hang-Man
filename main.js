const randomWord = require("random-words");

// API
const definitionAPIBaseURL =
  "https://od-api.oxforddictionaries.com/api/v2/lemmas/en-gb/";
const appID = "1906d77a";
const appKey = "ec9ee4ac0d6277aa1f4a2c907df8aebe";

// General Variables
let gameStarted = false;
let chosenWord;
let wordDisplay;
let incorrectGuesses = 0;
const gameImages = {
  defaultBackground: "./Assets/game_background.png",
  strike1: "./Assets/game_background1.png",
  strike2: "./Assets/game_background2.png",
  strike3: "./Assets/game_background3.png",
  strike4: "./Assets/game_background4.png",
  strike5: "./Assets/game_background5.png",
  strike6: "./Assets/game_background6.png",
};
const gameImage = $("#game_background");
const letterBox = $("#letter_box");
const guessInput = $("#guess_input");
const restartGame = $("#restart_game");
const getHint = $("#get_hint");
const hintDisplay = $("#hint_display");
const guessBox = $("#guess_box");
const infoText = $("#info_text");

// General Functions
function getRandomInt(num1, num2) {
  const initalWithDecimals = Math.random() * (num2 - num1 + 1);
  return Math.floor(initalWithDecimals) + num1;
}

function wordToUnderscores(word) {
  const wordLength = word.length;
  let underScoredWord = "";
  for (let current = 0; current < wordLength; current++) {
    if (word[current] === " ") {
      underScoredWord = underScoredWord + " ";
    } else {
      underScoredWord = underScoredWord + "_";
    }
  }
  return underScoredWord;
}

// New game logic
const newGameButton = $("#game_button");

gameImage.hide();
guessBox.hide();
restartGame.hide();
getHint.hide();

function startNewGame() {
  chosenWord = randomWord(1)[0];

  const hiddenWord = wordToUnderscores(chosenWord);

  wordDisplay = $(`<div class="underscores"></div>`);
  wordDisplay.text(hiddenWord);

  letterBox.append(wordDisplay);
}

function newGameClickHandler() {
  if (gameStarted === false) {
    gameStarted = true;
    newGameButton.hide();
    gameImage.attr("src", gameImages.defaultBackground);
    gameImage.show();
    guessBox.show();
    getHint.show();
    startNewGame();
  }
}

// Game Logic
function findLetterInString(word, letter) {
  const foundLetterIndexes = [];
  let index = 0;
  let loopBreak = false;

  while (loopBreak === false) {
    const wordSearch = word.indexOf(letter, index);
    if (wordSearch !== -1) {
      foundLetterIndexes.push(wordSearch);
      index = wordSearch + 1;
    } else {
      loopBreak = true;
    }
  }

  if (foundLetterIndexes.length > 0) {
    return foundLetterIndexes;
  }

  return null;
}

function checkIfGameWon() {
  const foundUnderscores = wordDisplay.text().match(/[_]/);
  if (!foundUnderscores) {
    guessBox.hide();
    getHint.hide();
    restartGame.show();
    setTimeout(() => {
      wordDisplay.text("You won!");
    }, 1500);
  }
}

function letterDisplay(foundPositions, letter) {
  let newString = wordDisplay.text();
  foundPositions.forEach((pos) => {
    const firstPart = newString.substr(0, pos);
    const lastPart = newString.substr(pos + 1);

    newString = firstPart + letter + lastPart;
  });
  wordDisplay.text(newString);
}

function guessLetter(input) {
  // Guess is a-z
  if (input.match(/[a-z]/i)) {
    const foundPosition = findLetterInString(
      chosenWord.toUpperCase(),
      input.toUpperCase()
    );
    if (foundPosition !== null) {
      letterDisplay(foundPosition, input);
      checkIfGameWon();
    } else {
      incorrectGuesses = incorrectGuesses + 1;
      if (incorrectGuesses > 5) {
        wordDisplay.text("Game Over");
        guessBox.hide();
        getHint.hide();
        restartGame.show();
      }
      gameImage.attr("src", gameImages[`strike${incorrectGuesses}`]);
    }
  } else {
    infoText.text("Must be a letter!");
    setTimeout(() => {
      infoText.text("Guess a letter!");
    }, 1500);
  }
}

function handleKeyDown(event) {
  const letter = event.key;
  guessLetter(letter);
  guessInput.val("");
}

function restartTheGame() {
  window.location.reload();
}

function displayHint() {
  // Hit the dictionary API with the chosen word to get definition
  const xhttp = new XMLHttpRequest();
  const url =
    "https://cors-anywhere.herokuapp.com/" +
    definitionAPIBaseURL +
    chosenWord.toLowerCase();
  console.log(url);
  xhttp.open("GET", url);
  xhttp.setRequestHeader("app_id", appID);
  xhttp.setRequestHeader("app_key", appKey);
  xhttp.send();
  xhttp.onreadystatechange = (serverResponse) => {
    console.log(serverResponse.target.response);
  };
}

// Events
newGameButton.click(newGameClickHandler);
guessInput.keydown(handleKeyDown);
getHint.click(displayHint);
restartGame.click(restartTheGame);
