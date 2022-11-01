const imageStarURL = require("url:../../img/estrella.svg");
const imageRedStarURL = require("url:../../img/estrella-roja.svg");

export function initStar() {
  class Estrella extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const variant = this.getAttribute("variant");

      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      div.className = variant;
      if (variant == "star win") {
        div.textContent = "¡Ganaste!";
      } else if (variant == "star draw") {
        div.textContent = "Empate";
      } else if (variant == "star lose") {
        div.textContent = "Perdiste";
      } else {
        div.textContent = "Pasó algo raro";
      }

      const style = document.createElement("style");
      style.innerHTML = `
      .star{
        font-size: 38px;
        color: black;
        height: 180px;
        width: 180px;
        margin: 15px auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .lose{
        background-image: url(${imageRedStarURL});  
        background-size: cover;
        color: white;
      }
      .win{
        background-image: url(${imageStarURL});        
        background-size: contain;
        background-repeat: no-repeat;
        color: white;
      }

      @media (min-width: 769px) {
        .star {
          font-size: 40px;
          height: 200px;
          width: 200px;
        }
      }

      `;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("result-star", Estrella);
}
