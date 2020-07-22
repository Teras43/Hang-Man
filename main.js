//API
const randomWordAPI = "https://random-word-api.herokuapp.com/word?number=1&swear=0"
const definitionAPIBaseURL = "https://od-api.oxforddictionaries.com/api/v2/lemmas/en-gb/"
const appID = "1906d77a"
const appKey = "ec9ee4ac0d6277aa1f4a2c907df8aebe"

// General Variables
let gameStarted = false;
const gameImages = {
  defaultBackground: "./Assets/game_background.png",
  strike1: "./Assets/game_background1.png",
  strike2: "./Assets/game_background2.png",
  strike3: "./Assets/game_background3.png",
  strike4: "./Assets/game_background4.png",
  strike5: "./Assets/game_background5.png",
  strike6: "./Assets/game_background6.png",
};
const gameImage = $("#game_background")
const letterBox = $("#letter_box")
const guessInput = $("#guess_input")
const getHint = $("#get_hint")
let chosenWord
let wordDisplay
let incorrectGuesses = 0
const restartGame = $("#restart_game")
const hintDisplay = $("#hint_display")
const guessBox = $("#guessBox")
const infoText = $("#info_text")

// General Functions
function getRandomInt(num1, num2) {
  const initialWithDecimals = Math.random() * (num2 - num1 + 1)
  return Math.floor(initialWithDecimals) + num1
}

function wordToUnderscores(word) {
  const wordLength = word.length
  let underscoredWord = ""
  for (let current = 0; current < wordLength; current++) {
    if (word[current] === " ") {
      underscoredWord = underscoredWord + " "
    } else {
      underscoredWord += "_"
    }
  }
  return underscoredWord
}

// New game logic
const newGameButton = $("#game_button");

gameImage.hide()
guessBox.hide()
restartGame.hide()
getHint.hide()

function startNewGame() {
  // const words = Object.keys(testWords);
  // chosenWord = words[getRandomInt(0, words.length - 1)];

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", randomWordAPI);
  xhttp.send();
  xhttp.onreadystatechange = (serverResponse) => {
    data = serverResponse.target;
    if (data.readyState === 4 && data.status === 200) {
      const responseAsJSON = JSON.parse(data.response)
      chosenWord = responseAsJSON[0]

      const hiddenWord = wordToUnderscores(chosenWord);

      wordDisplay = $(`<div class="underscore"></div>`);
      wordDisplay.text(hiddenWord);

      letterBox.append(wordDisplay);
    }
  };
}

function newGameClickHandler() {
  if (gameStarted === false) {
    gameStarted = true;
    newGameButton.hide();
    gameImage.attr("src", gameImages.defaultBackground);
    gameImage.show()
    guessBox.show()
    getHint.show()
    startNewGame()
  }
}

// Game Logic
function findLetterInString(word, letter) {
  const foundLetterIndexes = []
  let index = 0
  let loopBreak = false

  while (loopBreak === false) {
    const wordSearch = word.indexOf(letter, index)
    if (wordSearch !== -1) {
      foundLetterIndexes.push(wordSearch)
      index = wordSearch + 1
    } else {
      loopBreak = true
    }
  }

  if (foundLetterIndexes.length > 0) {
    return foundLetterIndexes
  }

  return null
}

function checkIfGameWon() {
  const foundUnderscores = wordDisplay.text().match(/[_]/)
  if (!foundUnderscores) {
    // Game Won
    guessBox.hide()
    getHint.hide()
    restartGame.show()
    setTimeout(() => {
      wordDisplay.text("You Won!")
    }, 1500)
  }
}

function letterDisplay(foundPositions, letter) {
  let newString = wordDisplay.text()
  foundPositions.forEach(pos => {
    const firstPart = newString.substr(0, pos)
    const lastPart = newString.substr(pos + 1)

    newString = firstPart + letter + lastPart
  })
  wordDisplay.text(newString)
}

function guessLetter(input) {
  // Guess is A-Z
  if (input.match(/[a-z]/i)) {
    const foundPosition = findLetterInString(
      chosenWord.toUpperCase(),
      input.toUpperCase()
    )
    if (foundPosition !== null) {
      letterDisplay(foundPosition, input)
      // Did they win?
      checkIfGameWon()
    } else {
      // Didn't find a letter
      incorrectGuesses = incorrectGuesses + 1
      if (incorrectGuesses > 5) {
        // Game Over
        wordDisplay.text("Game Over")
        guessBox.hide()
        getHint.hide()
        restartGame.show()
      }
      gameImage.attr("src", gameImages[`strike${incorrectGuesses}`]);
    }

  } else {
    // Didn't input A-Z
    infoText.text("Must be a letter")
    setTimeout(() => {
      infoText.text("Guess A Letter!")
    }, 1500)
  }

}

function handleKeyDown(event) {
  const letter = event.key
  guessLetter(letter)
  guessInput.val("")
}

function restartTheGame() {
  window.location.reload()
}

function displayHints() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://cors-anywhere.herokuapp.com/" + 
  definitionAPIBaseURL + 
  chosenWord.toLowerCase());
  xhttp.setRequestHeader("app_id", appID)
  xhttp.setRequestHeader("app_key", appKey)
  xhttp.send();
  xhttp.onreadystatechange = (serverResponse) => {
    console.log(serverResponse)
    // data = serverResponse.target;
    // if (data.readyState === 4 && data.status === 200) {
    //   const responseAsJSON = JSON.parse(data.response)
    //   chosenWord = responseAsJSON[0]

    //   const hiddenWord = wordToUnderscores(chosenWord);

    //   wordDisplay = $(`<div class="underscore"></div>`);
    //   wordDisplay.text(hiddenWord);

    //   letterBox.append(wordDisplay);
    // }
  };
}

// Events
newGameButton.click(newGameClickHandler);

guessInput.keydown(handleKeyDown)

getHint.click(displayHints)

restartGame.click(restartTheGame)