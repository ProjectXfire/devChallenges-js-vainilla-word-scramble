import { Game, Logo, Result } from "./components";

export function initApp(mainElement: HTMLElement) {
  const logo = Logo.instance();
  const game = Game.instance();
  const resultDialog = Result.instance();
  logo.renderIn(mainElement);
  game.renderIn(mainElement);
  resultDialog.renderIn(mainElement);
}
