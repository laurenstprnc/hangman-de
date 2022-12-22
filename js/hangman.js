let animals = ["HUND","KATZE","MAUS","PFERD","FISCH","VOGEL","SCHMETTERLING","HAMSTER","HASE","TAUBE","IGEL","FUCHS","BIBER","WOLFF"];
let answer = '';
let mistakes = 0;
let guessed = [];
let wordStatus = null;
let totalStats = {wins: 0, loses: 0}
const figureParts = document.querySelectorAll(".figure-part");

document.addEventListener('DOMContentLoaded', onLoad, false);

function onLoad() {
  let newStats = localStorage.getItem("totalStats")
  let totalStats_deserialized = JSON.parse(localStorage.getItem("totalStats"));
  totalStats = totalStats_deserialized;
  document.getElementById('labelWins').innerHTML = totalStats_deserialized.wins
  document.getElementById('labelLoses').innerHTML = totalStats_deserialized.loses
}

function randomWord() {
  answer = animals[Math.floor(Math.random() * animals.length)];
}

function generateButtons() {
  let buttonsHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter =>
    `
      <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
      id='` + letter + `'
      onClick="handleGuess('` + letter + `')"
      >
      ` + letter + `
      </button>
    `).join('');
  document.getElementById('keyboard').innerHTML = buttonsHTML;
}

function handleGuess(chosenLetter) {
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute('disabled', true);
  if (answer.indexOf(chosenLetter) >= 0) {
    guessedWord();
    checkIfGameWon();
  } else {
    mistakes++;
    updateMistakes();
    figureParts.forEach((part, index) => {
      const errors = mistakes;
      if (index < errors) {
        part.style.display = 'block'
      } else {
        part.style.display = 'none';
      }
    });
    checkIfGameLost();
  }
}

function checkIfGameWon() {
  if (wordStatus === answer) {
    confetti();
    document.getElementById('keyboard').innerHTML = "<span class='text-green-600 text-3xl'>Du hast gewonnen!</span>";
    totalStats.wins++;
    let totalStats_serialized = JSON.stringify(totalStats);
    localStorage.setItem("totalStats", totalStats_serialized);
    let totalStats_deserialized = JSON.parse(localStorage.getItem("totalStats"));
    document.getElementById('labelWins').innerHTML = totalStats_deserialized.wins;
  }
}

function checkIfGameLost() {
  if (mistakes === 6) {
    document.getElementById('keyboard').innerHTML = "<span class='text-red-600 text-3xl'>Du hast verloren!</span>";
    document.getElementById('resetButton').innerHTML = "Erneut Spielen";
    totalStats.loses++;
    let totalStats_serialized = JSON.stringify(totalStats);
    localStorage.setItem("totalStats", totalStats_serialized);
    let totalStats_deserialized = JSON.parse(localStorage.getItem("totalStats"));
    document.getElementById('labelLoses').innerHTML = totalStats_deserialized.loses;
  }
}

function guessedWord() {
  wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');
  document.getElementById('wordSpotlight').innerHTML = wordStatus;
}

function updateMistakes() {
  document.getElementById('mistakes').innerHTML = mistakes;
}

function reset() {
  mistakes = 0;
  guessed = [];
  figureParts.forEach((part, index) => {
    part.style.display = 'none';
  });
  document.getElementById('resetButton').innerHTML = "Zurücksetzen";
  randomWord();
  guessedWord();
  updateMistakes();
  generateButtons();
}

randomWord();
generateButtons();
guessedWord();
