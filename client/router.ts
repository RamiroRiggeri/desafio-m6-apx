import { initHome } from "./pages/1-home/index";
import { initInstructions } from "./pages/4-instructions";
import { initGame } from "./pages/6-game";
import { initResult } from "./pages/7-result";
import { initScoresPage } from "./pages/8-scores-page";
import { initGetNameNew } from "./pages/2-get-name-new";
import { initGetNameJoin } from "./pages/2-get-name-join";
import { initJoinGame } from "./pages/3-join-game";
import { initShareCode } from "./pages/3-share-code";
import { initWaitForOpp } from "./pages/5-wfo";
import { state } from "./state";

function routeHandler(path: string, container: Element) {
  const routes = [
    {
      path: /\/home/,
      handler: (container) => {
        initHome(container);
      },
    },
    {
      path: /\/get-name-new/,
      handler: (container) => {
        initGetNameNew(container);
      },
    },
    {
      path: /\/get-name-join/,
      handler: (container) => {
        initGetNameJoin(container);
      },
    },
    {
      path: /\/join-game/,
      handler: (container) => {
        initJoinGame(container);
      },
    },
    {
      path: /\/share-code/,
      handler: (container) => {
        initShareCode(container);
      },
    },
    {
      path: /\/instructions/,
      handler: (container) => {
        initInstructions(container);
      },
    },
    {
      path: /\/game/,
      handler: (container) => {
        initGame(container);
      },
    },
    {
      path: /\/scores-page/,
      handler: (container) => {
        initScoresPage(container);
      },
    },
    {
      path: /\/result/,
      handler: (container) => {
        initResult(container);
      },
    },
    {
      path: /\/wfo/,
      handler: (container) => {
        initWaitForOpp(container);
      },
    },
  ];
  const contenedor = container.querySelectorAll(".container");
  const estilos = container.querySelectorAll(".style");
  if (contenedor.length > 0) {
    contenedor[0].remove();
    estilos[0].remove();
  }

  for (const r of routes) {
    if (r.path.test(path)) {
      r.handler(container);
    }
  }
}

export async function goTo(path: string) {
  const root = document.querySelector(".root");
  history.pushState({}, "", path);
  routeHandler(path, root as any);
  const data = state.getState();
  data.gameState.currentPage = path;

  localStorage.setItem("localState", JSON.stringify(data));
}

export async function initRouter() {
  const { gameState } = await state.getState();
  goTo("/home");
  // if (gameState.currentPage == null) {
  //
  // } else {
  //   console.log(`currentPage was NOT null: currPage = ${gameState.currentPage}`);
  //   goTo(gameState.currentPage);
  // }
}
