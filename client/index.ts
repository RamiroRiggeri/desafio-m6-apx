import { initRouter } from "./router";
import { initManitos } from "./components/manitos/index";
import "./components/button/index";
import { initStar } from "./components/star";
import "./components/scoreboard";
import { state } from "./state";

(function () {
  state.init();
  initManitos();
  initStar();
  initRouter();
})();
