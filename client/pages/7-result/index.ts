import { state } from "../../state";
import { goTo } from "../../router";

export function initResult(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  const { gameState } = state.getState();

  const jugadaPlayer = gameState.play;
  const jugadaCpu = gameState.opponentPlay;

  div.innerHTML = `
          <div class="inicio">
          <my-jugada item="${jugadaCpu} cpu-manito"></my-jugada>
          <my-jugada item="${jugadaPlayer} player-manito"></my-jugada>
        </div>
  `;
  style.innerHTML = `
  .titulo{
    color: var(--titulo-instrucciones);
    font-size: 2.5em;
    font-weight: 800;
    text-align: center;
    position: absolute;
    top: 40%;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
  `;
  container.appendChild(style);
  container.appendChild(div);

  if (gameState.owner == true) {
    state.whoWins(gameState.play, gameState.opponentPlay);
  } else if (gameState.owner == false) {
    state.whoWins(gameState.opponentPlay, gameState.play);
  }

  setTimeout(() => {
    goTo("/scores-page");
  }, 4000);

  return div;
}
