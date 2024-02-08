import { type TResultElements } from "../../type";
import "./result.css";

const dialogContainer = document.createElement("div");
dialogContainer.className = "dialog-container";

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

export class Result {
  constructor() {
    dialogContainer.innerHTML += dialog;
    this.dialogComponent = dialogContainer;
  }

  private static result: Result;
  private mainComponents: HTMLElement | null = null;
  private dialogComponent: HTMLElement;
  private elements: TResultElements = {
    dialogMessage: null,
    dialogTitle: null,
    closeDialog: null,
  };

  static instance() {
    if (!Result.result) Result.result = new Result();
    return Result.result;
  }

  setupDialog(elem: HTMLElement) {
    this.mainComponents = elem;
  }

  openDialog() {
    if (!this.mainComponents) return;
    this.mainComponents.appendChild(this.dialogComponent);
    this.setupElements();
    this.setupListeners();
  }

  closeDialog() {
    if (!this.mainComponents) return;
    this.closeListeners();
    this.mainComponents.removeChild(this.dialogComponent);
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

  private closeListeners() {
    const { closeDialog } = this.elements;
    closeDialog?.removeEventListener("click", this.closeDialog.bind(this));
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
