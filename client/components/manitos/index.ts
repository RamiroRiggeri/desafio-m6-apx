import { state } from "../../state";

const imagePiedraURL = require("url:../../img/piedra.svg");
const imageTijeraURL = require("url:../../img/tijera.svg");
const imagePapelURL = require("url:../../img/papel.svg");

export function initManitos() {
  class MyJugada extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const variant = this.getAttribute("item");
      const selectedManito = this.getAttribute("selected");
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");

      div.className = variant as any;

      const style = document.createElement("style");
      style.innerHTML = `
      .piedra{
        bottom: 0px;
        left: 30px;
        background-image: url(${imagePiedraURL});
        background-size: cover;
        height: 130px;
        width: 80px;
        cursor: pointer;
      }

      .papel{
        bottom: 0px;
        right: 30px;
        background-image: url(${imagePapelURL});
        background-size: cover;
        height: 130px;
        width: 80px;
        cursor: pointer;
      }
      .tijera{
        bottom: 0px;
        left: 180px;
        background-image: url(${imageTijeraURL});
        background-size: cover;
        height: 130px;
        width: 80px;
        cursor: pointer;
      }

      @media (min-width: 769px) {
        .piedra {
          height: 170px;
          width: 100px;
        }
        .papel {
          height: 170px;
          width: 100px;
        }
        .tijera {
          height: 170px;
          width: 100px;
        }
      }

      @media (max-height: 600px) {
        .piedra {
          height: 80px;
          width: 37px;
        }
        .papel {
          height: 80px;
          width: 37px;
        }
        .tijera {
          height: 80px;
          width: 37px;
        }
      }

      .cpu-manito{
        position: absolute;
        height: 250px;
        width: 150px;
        top: 0px;
        transform: rotate(180deg);
        cursor: not-allowed;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
      }
      .player-manito{
        height: 250px;
        width: 150px;
        cursor: not-allowed;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        bottom: 0px;
      }
      @media (min-width: 769px) {
        .cpu-manito{
          height: 280px;
          width: 180px;
        }
        .player-manito{
          height: 280px;
          width: 180px;
        }
      }
      `;
      shadow.appendChild(div);
      shadow.appendChild(style);
    }
  }
  customElements.define("my-jugada", MyJugada);
}
