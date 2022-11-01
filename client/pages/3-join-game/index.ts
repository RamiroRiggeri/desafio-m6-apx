import { state } from "../../state";
import { goTo } from "../../router";

export function initJoinGame(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
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
  .form{
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  .input{
    width: 30vw;
    min-width: 300px;
    height: 90px;
    border: 10px solid #001997;
    border-radius: 8px;
    padding: 10px;
    font-size: 2em;
  }
  .label{
    font-size: 3em;
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
  div.innerHTML = `
        <div class="inicio">
        <h1 class="titulo">Piedra Papel o Tijera</h1>
          <form class="form" for="formulario">
            <label for="room" class="label">Ingresá el ID de la sala</label>
            <input type="text" name="room" class="input" placeholder="Código de sala">
            <button class="boton-ppt">Ingresar</button>
          </form>
          <div class="contenedor-manitos">
              <my-jugada item="piedra"></my-jugada>
              <my-jugada item="tijera"></my-jugada>
              <my-jugada item="papel"></my-jugada>
          </div>
        </div>
  `;

  container.appendChild(div);
  const form = document.querySelector("form");

  form.addEventListener("submit", async function action(e) {
    e.preventDefault();
    const data: HTMLInputElement = document.querySelector(".input");

    if (data.value == "") {
      return window.alert("No ingresaste un código");
    }

    const btn = document.querySelector(".boton-ppt");
    (btn as any).style.display = "none";
    const divsito = document.createElement("div");
    divsito.textContent = "Ingresando...";
    (divsito as any).style.fontSize = "3em";
    form.appendChild(divsito);

    const localPublicRoomId = data.value.toString();

    await state.getExistingRoomId(localPublicRoomId);
    await state.joinRoom();
  });

  container.appendChild(style);

  return div;
}
