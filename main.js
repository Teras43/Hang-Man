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
const gameImage = $("#game_background");

// New game logic
const newGameButton = $("#game_button");

function NewGameClickHandler() {
  if (gameStarted === false) {
    gameStarted = true;
    newGameButton.hide();
    gameImage.attr("src", gameImages.defaultBackground);
  }
}
newGameButton.click(NewGameClickHandler);
