const testWords = {
  Test: { hint: "A type of evaluation or assessment." },
  Hanged: { hint: "Attached and swinging from the neck." },
  Man: { hint: "A brother, husband, son, or guy." },
  Hanging: { hint: "Suspended by arms or other means by something." },
  Desk: {
    hint: "A table-like object you can place items on, usually a computer.",
  },
  Monitor: { hint: "A display that is plugged into a computer." },
  Computer: { hint: "What you're playing this on right now." },
  Keyboard: { hint: "The object used to type." },
  Mouse: { hint: "Controller of the pointer on the monitor." },
  RGB: {
    hint: "Color code, usually gives strength and power to your computer.",
  },
  Headset: {
    hint: "Object that sound comes out of, usually plugged into a computer.",
  },
  Headphones: {
    hint: "Object that sound comes out of, usually plugged into a phone.",
  },
  Vape: { hint: "Replacement of ciggarettes in the recent years, big clouds." },
  "Video Games": {
    hint: "A game you play in a visual way, usually on a TV or monitor.",
  },
  Phone: { hint: "Pocket computer." },
};

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
const guessSubmit = $("#guess_submit")
let chosenWord
let wordDisplay
let incorrectGuesses = 0
const restartGame = $("#restart_game")

// General Functions
function getRandomInt(num1, num2) {
    const initialWithDecimals = Math.random() * (num2 - num1 + 1)
    return Math.floor(initialWithDecimals) + num1
}

function wordToUnderscores(word) {
    const wordLength = word.length
    let underscoredWord = ""
    for(let current = 0; current < wordLength; current++) {
        underscoredWord += "_"
    }
    return underscoredWord
}

// New game logic
const newGameButton = $("#game_button");

gameImage.hide()
guessInput.hide()
guessSubmit.hide()
restartGame.hide()

function startNewGame() {
    const words = Object.keys(testWords)
    chosenWord = words[getRandomInt(0, words.length - 1)]
    console.log(chosenWord)

    const hiddenWord = wordToUnderscores(chosenWord)

    wordDisplay = $(`<div class="underscore"></div>`)
    wordDisplay.text(hiddenWord)

    letterBox.append(wordDisplay)
}

function newGameClickHandler() {
  if (gameStarted === false) {
    gameStarted = true;
    newGameButton.hide();
    gameImage.attr("src", gameImages.defaultBackground);
    gameImage.show()
    guessInput.show()
    guessSubmit.show()
    startNewGame()
  }
}

// Game Logic
function findLetterInString(word, letter) {
  const foundLetterIndexes = []
  let index = 0
  let loopBreak = false

  while(loopBreak === false) {
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
  }
}

function letterDisplay(foundPositions, letter) {
  let newString = wordDisplay.text()
  console.log(newString)
  foundPositions.forEach(pos => {
    const firstPart = newString.substr(0, pos)
    const lastPart = newString.substr(pos + 1)

    newString = firstPart + letter + lastPart
  })
  console.log(newString)
  wordDisplay.text(newString)
}

function guessLetter() {
  const userGuess = guessInput.val().replace(/\s/g, "")
    // Guess is 1 character
  if (userGuess.length === 1) {
    // Guess is A-Z
    if (userGuess.match(/[a-z]/i)) {
      const foundPosition = findLetterInString(
      chosenWord.toUpperCase(),
      userGuess.toUpperCase()
      )
        if (foundPosition !== null) {
          letterDisplay(foundPosition, userGuess)
          // Did they win?

        } else {
          // Didn't find a letter
          incorrectGuesses = incorrectGuesses + 1
          if (incorrectGuesses > 5) {
            // Game Over
            wordDisplay.text("Game Over")
            guessInput.hide()
            guessSubmit.hide()
            restartGame.show()
          }
          gameImage.attr("src", gameImages[`strike${incorrectGuesses}`]);
        }

    } else {
      // Didn't input A-Z
      console.log("Didn't find A-Z")
    }
  } else {
    // Input more than 1 letter
    console.log("Input more than 1 letter")
  }
}

function restartTheGame() {
  window.location.reload()
}

// Events
newGameButton.click(newGameClickHandler);

guessSubmit.click(guessLetter)

restartGame.click(restartTheGame)
