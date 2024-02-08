import { initApp } from "./initApp";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <section id="main-container" class="container">
    <img class="cover-image" src="/images/bg-guess-the-word.png" alt="cover-image" />
  </section>`;

const mainComponent = document.getElementById("main-container")!;

initApp(mainComponent);
