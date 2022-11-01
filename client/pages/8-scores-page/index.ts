import { state } from "../../state";
import { goTo } from "../../router";
export async function initScoresPage(container: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = `
  .inicio{
   width: 100%;
   height: 100vh;
  }
  .win{
    background-color: rgba(136, 170, 73, 0.6);
  }
  .lose{
    background-color: rgba(170, 73, 73, 0.6);
  } 
  .draw{
    background-color: rgba(208, 197, 48, 0.6);
  } 
  .contenedor-contenido{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .boton{
    width: 100%;
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  `;

  await state.setPlayerReadyStatus(false);
  //seteo el status en false así pueden re-empezar el juego
  const { gameState } = state.getState();
  const { scoreboard } = state.getState();

  console.log("gameState en Scores-page: ", gameState);
  console.log("scoreboard: ", scoreboard);

  // const ganador = state.whoWins(currState.currentGame.playerPlay, currState.currentGame.cpuPlay);
  let result = "";

  if (gameState.owner === true && gameState.lastGameOwnerResult === "ganaste") {
    result = "win";
  } else if (gameState.owner === true && gameState.lastGameOwnerResult === "perdiste") {
    result = "lose";
  } else if (gameState.owner === false && gameState.lastGameGuestResult === "ganaste") {
    result = "win";
  } else if (gameState.owner === false && gameState.lastGameGuestResult === "perdiste") {
    result = "lose";
  } else {
    result = "draw";
  }

  let localGameStateName = "mock owner";
  let localGameStateOppName = "mock guest";
  if (gameState.owner === true) {
    localGameStateName = gameState.name;
    localGameStateOppName = gameState.opponentName;
  } else if (gameState.owner === false) {
    localGameStateName = gameState.opponentName;
    localGameStateOppName = gameState.name;
  } else {
    console.log("no debería entrar en el else lpm");
  }

  div.innerHTML = `
      <div class="inicio ${result}">
        <div class="contenedor-contenido">
            <result-star variant="star ${result}"></result-star>
            <my-scoreboard ownerpoints="${scoreboard.owner}" guestpoints="${scoreboard.guest}"
            dp="${scoreboard.draw}" ownername="${localGameStateName}" guestname="${localGameStateOppName}"></my-scoreboard>
        </div>
        <div class="boton">
            <button-ppt>Volver a jugar</button-ppt>
        </div>
      </div>
  `;

  container.appendChild(style);
  container.appendChild(div);

  const button = div.querySelector(".boton");
  button.addEventListener("click", () => {
    goTo("/instructions");
  });

  return div;
}
