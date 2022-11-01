import { state } from "../../state";
import { goTo } from "../../router";

export function initWaitForOpp(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = `
  .titulo{
    color: var(--titulo-instrucciones);
    font-size: 4em;
    font-weight: 800;
    width: 300px;
    margin: 25% auto 20px auto;
    text-align: center;
    height: 100%;
  }
  @media (min-width: 769px) {
    .titulo {
      font-size: 3em;
      width: 500px;
      margin: 50px auto 50px auto;
    }
  }
  @media (max-height: 700px){
    .titulo {
      font-size: 2.5em;
    }
  }
  .boton{
    width: 100%;
    height: 85px;
    display: flex;
    justify-content: center;
    margin-top: 30px;
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
    height: 30%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
  .boton-ppt{
    font-size: 3em;
    color: white;
    background-color: #006CFC;
    border: 10px solid #001997;
    border-radius: 8px;
    padding: 10px;
    width: 30vw;
    min-width: 300px;
    height: 90px;
    font-family: "Odibee Sans", cursive;
    cursor: pointer;
  }
  `;
  const { gameState } = state.getState();
  div.innerHTML = `
          <div class="inicio">
          <h1 class="titulo">Esperando que ${gameState.opponentName} presione Jugar!</h1>
          <div class="contenedor-manitos">  
          <my-jugada item="piedra"></my-jugada>
            <my-jugada item="tijera"></my-jugada>
            <my-jugada item="papel"></my-jugada>
            </div>
        </div>
  `;
  container.appendChild(div);
  container.appendChild(style);

  state.checkIfBothAreReady();
  return div;
}
