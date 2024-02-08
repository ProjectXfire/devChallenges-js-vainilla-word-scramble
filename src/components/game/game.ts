import { Result } from "..";
import { data } from "../../data";
import { type TGameElements } from "../../type";

import "./game.css";

const wordToGuess = `
  <div class="word-guess">
    <p id="word-to-guess" class="word-guess__text"></p>
    <div class="word-guess__shadow"></div>
  </div>
`;

const gameStatus = `
  <div id="game-status" class="game-status">
    <div class="tries">
      <p>Tries <span id="tries-text">(0/5)</span>:</p>
      <ul class="tries__status">
        <li class="tries__status-circle"></li>
        <li class="tries__status-circle"></li>
        <li class="tries__status-circle"></li>
        <li class="tries__status-circle"></li>
        <li class="tries__status-circle"></li>
      </ul>
    </div>
    <div class="mistakes">
      <p>Mistakes:</p>
      <span id="mistakes-text" class="mistakes__text"></span>
    </div>
  </div>
`;

const gameTable = `
  <div id="game-table" class="game-table"></div>
`;

const actions = `
  <div class="actions">
    <div class="actions__button">
      <button id="random" type="button">Random</button>
      <div class="button-extend"></div>
    </div>
    <div class="actions__button">
      <button id="reset" type="button">Reset</button>
      <div class="button-extend"></div>
    </div>
  </div>
`;

export class Game {
  constructor() {}

  private static game: Game;
  private elements: TGameElements = {
    wordToGuess: null,
    triesCircle: [],
    triesText: null,
    mistakesText: null,
    gameTable: null,
    blocksLetters: [],
    random: null,
    reset: null,
  };
  private currentPos: number = 0;
  private tries: number = 5;
  private correctLetters: string[] = [];
  private wrongLetters: string[] = [];
  private wordSelected: string[] = [];

  static instance(): Game {
    if (!Game.game) Game.game = new Game();
    return Game.game;
  }

  renderIn(elem: HTMLElement): void {
    elem.innerHTML += wordToGuess;
    elem.innerHTML += gameStatus;
    elem.innerHTML += gameTable;
    elem.innerHTML += actions;
    this.setupElements();
    this.setupListeners();
    this.startGame();
  }

  private setupElements(): void {
    const wordToGuess = document.getElementById("word-to-guess");
    const triesText = document.getElementById("tries-text");
    const triesCircle = document.getElementsByClassName("tries__status-circle");
    const mistakesText = document.getElementById("mistakes-text");
    const arrayTriesCircle = Array.from(triesCircle);
    const gameTable = document.getElementById("game-table");
    const random = document.getElementById("random") as HTMLButtonElement;
    const reset = document.getElementById("reset") as HTMLButtonElement;
    this.elements.wordToGuess = wordToGuess;
    this.elements.triesText = triesText;
    this.elements.triesCircle = arrayTriesCircle;
    this.elements.mistakesText = mistakesText;
    this.elements.gameTable = gameTable;
    this.elements.random = random;
    this.elements.reset = reset;
  }

  private setupListeners() {
    const { random, reset } = this.elements;
    random?.addEventListener("click", this.startNewGame.bind(this));
    reset?.addEventListener("click", this.resetGame.bind(this));
  }

  startGame() {
    const { word, disorderedWord } = this.getRandomWord();
    this.setWordToGuest(disorderedWord);
    this.wordSelected = word.split("");
    this.buildGameBoard(word.length);
  }

  resetGame() {
    this.resetBackgroundColorInCirclesAndTries();
    this.setMistakes([]);
    this.setNumberOfTries(0);
    this.wrongLetters = [];
    this.correctLetters = [];
    this.currentPos = 0;
    this.buildGameBoard(this.wordSelected.length);
  }

  startNewGame() {
    const { word, disorderedWord } = this.getRandomWord();
    this.setWordToGuest(disorderedWord);
    this.wordSelected = word.split("");
    this.resetGame();
  }

  getRandomWord(): { word: string; disorderedWord: string } {
    const wordsCollection = data.words;
    const randomNumber = Math.floor(Math.random() * data.length);
    const wordSeleted = wordsCollection[randomNumber];
    const disorderedWord = this.getDisorderedWord(wordSeleted);
    console.log({ i: randomNumber, word: wordSeleted });
    return {
      word: wordSeleted,
      disorderedWord,
    };
  }

  getDisorderedWord(word: string): string {
    const wordArray = word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    const disorderedWord = wordArray.join("");
    return disorderedWord;
  }

  setWordToGuest(word: string): void {
    const { wordToGuess } = this.elements;
    if (wordToGuess) wordToGuess.innerText = word;
  }

  setNumberOfTries(tries: number): void {
    if (tries > this.tries) return;
    if (tries < 0) return;
    const { triesText } = this.elements;
    if (tries === 0) {
      if (triesText) triesText.innerText = `(${0}/${this.tries})`;

      return;
    }
    if (triesText) triesText.innerText = `(${tries}/${this.tries})`;
  }

  setBackgroundColorInCircles(tries: number): void {
    if (tries > this.tries) return;
    if (tries < 0) return;
    this.elements.triesCircle.forEach((circle) => {
      circle.classList.remove("active-circle");
    });
    for (let i = 0; i < tries; i++) {
      this.elements.triesCircle[i].classList.add("active-circle");
    }
  }

  resetBackgroundColorInCirclesAndTries(): void {
    for (let i = 0; i < this.tries; i++) {
      this.elements.triesCircle[i].classList.remove("active-circle");
    }
  }

  setMistakes(mistakes: string[]): void {
    if (this.wrongLetters.length > this.tries) return;
    const mistakesString = mistakes.join(", ");
    const { mistakesText } = this.elements;
    this.setBackgroundColorInCircles(mistakes.length);
    this.setNumberOfTries(mistakes.length);
    if (mistakesText) mistakesText.innerText = mistakesString;
  }

  buildGameBoard(sizeWord: number): void {
    const { gameTable } = this.elements;
    if (!gameTable) return;
    gameTable.innerHTML = "";
    this.elements.blocksLetters = [];
    for (let i = 0; i < sizeWord; i++) {
      const letterContainer = document.createElement("div");
      const letterLine = document.createElement("div");
      letterLine.className = "game-table__line";
      letterContainer.className = "game-table__letter-container";
      const letter = document.createElement("input");
      letter.id = `letter-${i}`;
      letter.className = "game-table__letter";
      letter.type = "text";
      letter.maxLength = 1;
      letter.disabled = i !== 0 && true;
      letter.addEventListener("input", this.handleInputValue.bind(this));
      letterContainer.appendChild(letter);
      letterContainer.appendChild(letterLine);
      this.elements.blocksLetters.push(letter);
      gameTable.appendChild(letterContainer);
    }
    this.setInitFocus();
  }

  setInitFocus(): void {
    const { blocksLetters } = this.elements;
    blocksLetters[0].focus();
  }

  canStillPlaying(mistakes: string[]): boolean {
    return mistakes.length >= this.tries;
  }

  moveTotheNextBlockLetter() {
    const newPos = this.currentPos + 1;
    this.currentPos = newPos;
    if (newPos > this.wordSelected.length - 1) return;
    const { blocksLetters } = this.elements;
    blocksLetters[newPos - 1].disabled = true;
    blocksLetters[newPos].disabled = false;
    blocksLetters[newPos].focus();
  }

  validateIfWin(correctLetters: string[], selectedWord: string[]): boolean {
    return correctLetters.join("") === selectedWord.join("");
  }

  handleInputValue(e: Event) {
    const { value } = e.target as HTMLInputElement;
    if (value.length !== 1) return;
    const correctLetter = this.wordSelected[this.currentPos];
    // Evaluate if the letter is correct or not
    if (correctLetter === value) {
      this.correctLetters.push(value);
      this.moveTotheNextBlockLetter();
    } else {
      this.wrongLetters.push(value);
      this.setMistakes(this.wrongLetters);
    }
    // Validate if we spent all our tries
    if (this.canStillPlaying(this.wrongLetters)) {
      const result = Result.instance();
      result.openDialog();
      result.setLoseMessage();
      this.resetGame();
      return;
    }
    // Validate if we guess the word
    if (this.validateIfWin(this.correctLetters, this.wordSelected)) {
      const result = Result.instance();
      result.openDialog();
      result.setWinMessage(this.wordSelected.join(""));
      this.startNewGame();
    }
  }
}
