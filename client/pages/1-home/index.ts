import { state } from "../../state";
import { goTo } from "../../router";

export function initHome(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");

  div.innerHTML = `
        <div class="inicio">
          <h1 class="titulo">Piedra Papel ó Alfajor</h1>
          <div class="btn-new-game">
              <button-ppt>Nuevo Juego</button-ppt>
          </div>
          <div class="btn-join-game">
              <button-ppt>Ingresar a una sala</button-ppt>
          </div>
          <div class="contenedor-manitos">
              <my-jugada item="piedra"></my-jugada>
              <my-jugada item="tijera"></my-jugada>
              <my-jugada item="papel"></my-jugada>
          </div>
        </div>
  `;
  const style = document.createElement("style");
  style.setAttribute("class", "style");

  style.innerHTML = `
  .titulo{
    color: var(--titulo-home);
    font-size: 70px ;
    font-weight: 800;
    width: 250px;
    margin: 20px auto 20px auto;
    text-align: center;
    height: 100%;
  }
  @media (min-width: 769px) {
    .titulo {
      font-size: 5em;
    }
  }
  @media (max-height: 700px){
    .titulo {
      font-size: 3em;
    }
  }


  .btn-new-game, .btn-join-game{
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
    height: 25%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
  `;
  style.setAttribute("class", "style");
  div.appendChild(style);
  container.appendChild(div);

  const btnNewGame = div.querySelector(".btn-new-game");
  const btnJoinGame = div.querySelector(".btn-join-game");

  (btnNewGame as any).addEventListener("click", () => {
    goTo("/get-name-new");
  });
  (btnJoinGame as any).addEventListener("click", () => {
    goTo("/get-name-join");
  });

  return div;
}
