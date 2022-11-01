"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRouter = exports.goTo = void 0;
const index_1 = require("./pages/1-home/index");
const _4_instructions_1 = require("./pages/4-instructions");
const _6_game_1 = require("./pages/6-game");
const _7_result_1 = require("./pages/7-result");
const _8_scores_page_1 = require("./pages/8-scores-page");
const _2_get_name_new_1 = require("./pages/2-get-name-new");
const _2_get_name_join_1 = require("./pages/2-get-name-join");
const _3_join_game_1 = require("./pages/3-join-game");
const _3_share_code_1 = require("./pages/3-share-code");
const _5_wfo_1 = require("./pages/5-wfo");
const state_1 = require("./state");
function routeHandler(path, container) {
    const routes = [
        {
            path: /\/home/,
            handler: (container) => {
                (0, index_1.initHome)(container);
            },
        },
        {
            path: /\/get-name-new/,
            handler: (container) => {
                (0, _2_get_name_new_1.initGetNameNew)(container);
            },
        },
        {
            path: /\/get-name-join/,
            handler: (container) => {
                (0, _2_get_name_join_1.initGetNameJoin)(container);
            },
        },
        {
            path: /\/join-game/,
            handler: (container) => {
                (0, _3_join_game_1.initJoinGame)(container);
            },
        },
        {
            path: /\/share-code/,
            handler: (container) => {
                (0, _3_share_code_1.initShareCode)(container);
            },
        },
        {
            path: /\/instructions/,
            handler: (container) => {
                (0, _4_instructions_1.initInstructions)(container);
            },
        },
        {
            path: /\/game/,
            handler: (container) => {
                (0, _6_game_1.initGame)(container);
            },
        },
        {
            path: /\/scores-page/,
            handler: (container) => {
                (0, _8_scores_page_1.initScoresPage)(container);
            },
        },
        {
            path: /\/result/,
            handler: (container) => {
                (0, _7_result_1.initResult)(container);
            },
        },
        {
            path: /\/wfo/,
            handler: (container) => {
                (0, _5_wfo_1.initWaitForOpp)(container);
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
async function goTo(path) {
    const root = document.querySelector(".root");
    history.pushState({}, "", path);
    routeHandler(path, root);
    const data = state_1.state.getState();
    data.gameState.currentPage = path;
    localStorage.setItem("localState", JSON.stringify(data));
}
exports.goTo = goTo;
async function initRouter() {
    const { gameState } = await state_1.state.getState();
    goTo("/home");
    // if (gameState.currentPage == null) {
    //
    // } else {
    //   console.log(`currentPage was NOT null: currPage = ${gameState.currentPage}`);
    //   goTo(gameState.currentPage);
    // }
}
exports.initRouter = initRouter;
