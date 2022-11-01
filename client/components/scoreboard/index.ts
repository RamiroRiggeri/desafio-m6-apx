customElements.define(
  "my-scoreboard",
  class extends HTMLElement {
    shadow: ShadowRoot;
    playerPoints: string;
    cpuPoints: string;
    drawPoints: string;
    ownerName: string;
    guestName: string;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.playerPoints = this.getAttribute("ownerpoints");
      this.cpuPoints = this.getAttribute("guestpoints");
      this.drawPoints = this.getAttribute("dp");
      this.ownerName = this.getAttribute("ownername");
      this.guestName = this.getAttribute("guestname");

      const style = document.createElement("style");
      style.innerHTML = `
      .contenedor{
        background-color: white;
        height: 250px;
        width: 300px;
        margin: 0 auto;
        border: solid 10px black;
        border-radius: 10px;
        max-width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
      .score{
        margin: 0;
        font-size: 60px;
      }
      .puntajes{
        font-size: 35px;
        text-align: right;
      }
      .puntos{
        margin: 10px auto;
      }
      `;

      this.shadow.appendChild(style);
      this.render();
    }

    render() {
      const div = document.createElement("div");
      div.innerHTML = `
      <div class="contenedor">
      <h2 class="score">Score</h2>
      <div class="puntajes">
        <p class="puntos">${this.ownerName}: ${this.playerPoints}</p>
        <p class="puntos">${this.guestName}: ${this.cpuPoints}</p>
        <p class="puntos">Empate: ${this.drawPoints}</p>
      </div>
      </div>
      `;
      this.shadow.appendChild(div);
    }
  }
);
