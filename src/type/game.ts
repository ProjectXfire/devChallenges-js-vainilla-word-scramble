export type TGameElements = {
  wordToGuess: HTMLElement | null;
  triesCircle: Element[];
  triesText: HTMLElement | null;
  mistakesText: HTMLElement | null;
  gameTable: HTMLElement | null;
  blocksLetters: HTMLInputElement[];
  random: HTMLButtonElement | null;
  reset: HTMLButtonElement | null;
};
