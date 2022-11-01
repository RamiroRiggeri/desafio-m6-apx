import { state } from "../../state";
import { goTo } from "../../router";
export function initGame(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  const { gameState } = state.getState();
  var count = 3;
  var manopiedra = "piedra";
  var manopapel = "papel";
  var manotijera = "tijera";

  div.innerHTML = `
          <div class="inicio">
          <div class="contenedor-counter">
          <div class="circle cuenta-atras">${count}</div>
          </div>
          <div class="contenedor-manitos">
            <my-jugada item="${manopiedra}" id="piedra"></my-jugada>
            <my-jugada item="${manotijera}" id="tijera"></my-jugada>
            <my-jugada item="${manopapel}" id="papel"></my-jugada>
          </div>
        </div>
  `;
  style.innerHTML = `
  .contenedor-counter{
    margin: 70px auto 0 auto;
    display: flex;
    justify-content: center;
  }
  .contenedor-manitos{
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    bottom: 0px;
    width: 100%;
    max-width: 800px;
    height: 40%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
  .circle{
    border: 25px solid black;
    border-radius: 50%;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 150px;
  }
  `;
  const piedraPlay = div.querySelector("#piedra");
  const tijeraPlay = div.querySelector("#tijera");
  const papelPlay = div.querySelector("#papel");

  container.appendChild(style);

  piedraPlay.addEventListener("click", () => {
    state.setGame("piedra");
    state.getMovesFromRtdb();
    (tijeraPlay as any).style.opacity = "0.5";
    (tijeraPlay as any).style.cursor = "not-allowed";
    (papelPlay as any).style.opacity = "0.5";
    (papelPlay as any).style.cursor = "not-allowed";
  });
  tijeraPlay.addEventListener("click", () => {
    state.setGame("tijera");
    state.getMovesFromRtdb();
    (piedraPlay as any).style.opacity = "0.5";
    (piedraPlay as any).style.cursor = "not-allowed";
    (papelPlay as any).style.opacity = "0.5";
    (papelPlay as any).style.cursor = "not-allowed";
  });
  papelPlay.addEventListener("click", () => {
    state.setGame("papel");
    state.getMovesFromRtdb();
    (piedraPlay as any).style.opacity = "0.5";
    (piedraPlay as any).style.cursor = "not-allowed";
    (tijeraPlay as any).style.opacity = "0.5";
    (tijeraPlay as any).style.cursor = "not-allowed";
  });

  function countDown(div, count) {
    var int = setInterval(() => {
      div.querySelector(".circle").innerHTML = count;
      count--;
      if (count < 0) {
        clearInterval(int);
        if (gameState.play === null) {
          const randomResult = Math.floor(Math.random() * 3);
          const posibleMoves = ["piedra", "papel", "tijera"];
          const randomplay = posibleMoves[randomResult];
          state.setGame(randomplay);
          state.getMovesFromRtdb();
        }
        setTimeout(() => {
          goTo("/result");
        }, 3000);
      }
    }, 1100);
  }

  container.appendChild(div);
  const contadorOn = div.querySelector(".cuenta-atras");
  console.log(contadorOn);

  if (contadorOn) {
    countDown(div, count);
  } else {
    console.log("no entró en el if de la func Game");
  }
  return div;
}
