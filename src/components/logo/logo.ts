const logoComponent = document.createElement("img");
logoComponent.src = "/images/word-scramble.svg";
logoComponent.alt = "logo";
logoComponent.className = "logo";

export class Logo {
  constructor() {}

  private static logo: Logo;

  static instance() {
    if (!Logo.logo) Logo.logo = new Logo();
    return Logo.logo;
  }

  renderIn(elem: HTMLElement) {
    elem.appendChild(logoComponent);
  }
}
