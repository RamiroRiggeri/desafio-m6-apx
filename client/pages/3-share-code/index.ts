import { state } from "../../state";
import { goTo } from "../../router";

export function initShareCode(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");

  const { gameState } = state.getState();
  const { roomPublicId } = gameState;
  const { name } = gameState;

  //debería hacer un listener para actualizar cuando ingrese el opp
  div.innerHTML = `
        <div class="inicio">
        <header class="header">
          <div class="players">
            <p>P1: ${name}</p>
            <p>P2: Esperando Oponente</p>
          </div>
          <div class="room">
            <p>ID de la sala:</p>
            <p>${roomPublicId}</p>
          </div>
        </header>
        
        <div class="code-content">
          <h2>¡Compartí el código <br> con tu contrincante!</h2>
          <h2><bold>${roomPublicId}</bold></h2>
        </div>

          <div class="contenedor-manitos">
              <my-jugada item="piedra"></my-jugada>
              <my-jugada item="tijera"></my-jugada>
              <my-jugada item="papel"></my-jugada>
          </div>
        </div>
  `;
  style.innerHTML = `
  .header{
    height: 20vh;
    display: flex;
    justify-content: space-between;
    margin: 1% 5% 0 5%;
    flex-direction: row;
    font-size: 2em;
  }
  .room > p{
    text-align: right;
  }
  .code-content{
    display:flex;
    flex-direction: column;
    align-items: center;
    font-size: 2.5em;
    margin: 0 auto 0 auto;
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
    height: 15%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
  `;
  container.appendChild(div);
  container.appendChild(style);

  state.setOwnerReady();
  state.checkForOpponent();

  return div;
}
