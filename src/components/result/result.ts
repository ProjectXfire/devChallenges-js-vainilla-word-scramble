import { Game } from "..";
import { type TResultElements } from "../../type";
import "./result.css";

const dialogContainer = document.createElement("div");
dialogContainer.className = "dialog-container hide";

const dialog = `
  <article class="dialog">
    <p id="dialog-title" class="dialog__title"></p>
    <p class="dialog__message" id="dialog-message"></p>
    <div class="dialog__actions">
      <button id="close-dialog" type="button">Accept</button>
      <div class="button-extend"></div>
    </div>
  </article>
`;

dialogContainer.innerHTML += dialog;

export class Result {
  constructor() {}

  private static result: Result;
  private dialogComponent: HTMLElement | null = null;
  private elements: TResultElements = {
    dialogMessage: null,
    dialogTitle: null,
    closeDialog: null,
  };

  static instance() {
    if (!Result.result) Result.result = new Result();
    return Result.result;
  }

  renderIn(elem: HTMLElement) {
    elem.append(dialogContainer);
    this.dialogComponent = dialogContainer;
    this.setupElements();
    this.setupListeners();
  }

  openDialog() {
    if (!this.dialogComponent) return;
    this.dialogComponent.classList.remove("hide");
  }

  closeDialog() {
    if (!this.dialogComponent) return;
    this.dialogComponent.classList.add("hide");
    const game = Game.instance();
    game.setInitFocus();
  }

  private setupElements() {
    const dialogTitle = document.getElementById("dialog-title");
    const dialogMessage = document.getElementById("dialog-message");
    const closeDialog = document.getElementById(
      "close-dialog"
    ) as HTMLButtonElement;
    this.elements.dialogTitle = dialogTitle;
    this.elements.dialogMessage = dialogMessage;
    this.elements.closeDialog = closeDialog;
  }

  private setupListeners() {
    const { closeDialog } = this.elements;
    closeDialog?.addEventListener("click", this.closeDialog.bind(this));
  }

  setWinMessage(word: string) {
    const { dialogMessage, dialogTitle } = this.elements;
    if (dialogMessage && dialogTitle) {
      dialogTitle.innerText = "Congratulation!";
      const wordSpan = document.createElement("span");
      wordSpan.innerText = `'${word}'`;
      wordSpan.className = "dialog-word";
      dialogMessage.innerText = `You guest the word `;
      dialogMessage.appendChild(wordSpan);
    }
  }

  setLoseMessage() {
    const { dialogMessage, dialogTitle } = this.elements;
    if (dialogMessage && dialogTitle) {
      dialogTitle.innerText = "Sorry 😔";
      dialogMessage.innerText = `You do not guess the word, try again`;
    }
  }
}
