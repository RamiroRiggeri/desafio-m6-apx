import { API_BASE_URL, getDatabase, ref, onValue, app, rtdb, rtdbApp } from "./db";
import { goTo } from "./router";

type Play = "stone" | "papper" | "sissors" | string;

const state = {
  data: {
    gameState: {
      currentPage: null,
      name: "mock",
      play: null,
      userId: "",
      online: false,
      ready: false,
      owner: true,
      roomPublicId: "",
      roomPrivateId: "",
      opponentName: "",
      opponentPlay: null,
      lastGameOwnerResult: null,
      lastGameGuestResult: null,
    },
    gameReady: false,
    playersReady: false,
    scoreboard: {
      owner: 0,
      guest: 0,
      draw: 0,
    },
  },
  listeners: [],
  getState() {
    return this.data;
  },

  init() {
    if (API_BASE_URL == "") {
      localStorage.removeItem("localState");
    } else {
      const localState = localStorage.getItem("localState");
      if (localState != null) {
        this.data = JSON.parse(localState);
        goTo(this.data.gameState.currentPage);
      } else if (localState == null) {
        localStorage.setItem("localState", JSON.stringify(this.data));
        goTo(this.data.gameState.currentPage);
      }
    }
  },

  // FUNCIONES COMUNES A AMBOS JUGADORES
  async setName(name: string) {
    //setea el nombre dentro del objeto gameState del state
    const { gameState } = await this.getState();
    gameState.name = name;
  },
  async signIn() {
    // crea un usuario en fireStore
    const data = await this.getState();
    data.gameReady = false;
    await this.setSessionStatus(true);

    const rawUser = await fetch(`${API_BASE_URL}/auth`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //hace un fetch mandando la info del usuario

    const usuarioId = await rawUser.json();

    const userId = await usuarioId.usrId;
    await this.setUserId(userId);
    //extrae y guarda la info
  },

  // FUNCION PARA EL QUE INICIA EL JUEGO
  async askNewRoom() {
    const { gameState } = await this.getState();
    //obtiene el currState
    const rawPublicRoomId = await fetch(`${API_BASE_URL}/rooms`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });

    const pId = await rawPublicRoomId.json();

    const { roomId, privateRoomId } = await pId;
    //extrae el roomId y el privateRoomId de la respuesta

    await this.setPublicId(roomId);
    await this.setPrivateId(privateRoomId);
  },

  // FUNCION PARA EL QUE SE UNE A UNA SALA EXISTENTE
  async getExistingRoomId(roomId: string) {
    // El usuario debe ingresar como dato el roomId
    const { gameState } = await this.getState();
    await this.setPublicId(roomId);
    //esto se hace con la info que pasa el usuario

    const rawPrivateRoomId = await fetch(`${API_BASE_URL}/room/${roomId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });
    //pide la privateRoomId haciendo un post que manda la publicRoomId
    const privateRoomIdParse = await rawPrivateRoomId.json();
    const privateId = await privateRoomIdParse.privateId;
    await this.setPrivateId(privateId);
    //en la respuesta del servidor está la privateRoomId
  },

  //crea la data del guest en la rtdb
  async joinRoom() {
    await this.setOwnerAndReadyAsGuest();
    const { gameState } = await this.getState();

    fetch(`${API_BASE_URL}/room/${gameState.roomPublicId}/join`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });

    await this.checkForOpponent();
  },

  // chechea que los 2 usuarios esten online y listos para pasar
  // a las instrucciones && obtengo el nombre del oponente
  // desde el cliente del OWNER
  async checkForOpponent() {
    const { gameState } = await this.getState();
    const db = getDatabase(app);

    const roomRef = ref(db, `rooms/${await gameState.roomPrivateId}`);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (Object.keys(data).length === 2) {
        this.setGameReadyStatus(true);

        if (gameState.name === data.owner.name) {
          gameState.opponentName = data.guest.name;
        }
        if (gameState.name === data.guest.name) {
          gameState.opponentName = data.owner.name;
        }

        //checkea que haya 2 usuarios conectados a la room y setea
        //el owner y el guest
      }
    });
  },
  async setGameReadyStatus(online: boolean) {
    let data = await this.getState();
    if (online === true) {
      data.gameReady = online;
      if (location.pathname === "/share-code") {
        goTo("/instructions");
      } else if (location.pathname === "/join-game") {
        goTo("/instructions");
      } else {
        console.log("location.pathname", location.pathname);
      }
    }
    if (online === false) return (data.gameReady = online);
  },

  // FUNCIONES UTILITARIAS

  async setUserId(userId: string) {
    //guarda en el state el userId
    const { gameState } = await this.getState();
    gameState.userId = userId;
  },
  async setSessionStatus(online: boolean) {
    // da la señal de login cuando se conecta un usuario
    const { gameState } = await this.getState();
    if (online === true) return (gameState.online = online);
    if (online === false) return (gameState.online = online);
  },
  async setPublicId(publicId: string) {
    //una vez que el usuario hizo el signIn/logIn guarda los ID de la room
    const { gameState } = await this.getState();
    gameState.roomPublicId = publicId;
  },
  async setPrivateId(privateId: string) {
    //una vez que el usuario hizo el signIn/logIn guarda los ID de la room
    const { gameState } = await this.getState();
    gameState.roomPrivateId = privateId;
  },
  async setOwnerAndReadyAsGuest() {
    const data = await this.getState();
    data.gameState.owner = false;
  },
  async setOwnerReady() {
    const data = await this.getState();
    data.gameState.owner = true;
  },

  // setea el estado de "ready" cuando los users presionan play
  async setPlayerReadyStatus(status: boolean) {
    const { gameState } = await this.getState();
    gameState.ready = status;
    fetch(`${API_BASE_URL}/room/${gameState.roomPublicId}/play`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });
  },

  // checkea que los 2 usuarios tengan el estado de "ready" para pasar a
  // la pantalla de seleccion && setea el nombre del oponente desde el
  // cliente del GUEST
  async checkIfBothAreReady() {
    const { gameState } = await this.getState();
    const db = getDatabase(app);

    const roomRef = ref(db, `rooms/${await gameState.roomPrivateId}`);

    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (data.owner.ready == false && data.guest.ready == false) {
        return;
      }

      if (data.owner.ready == false && data.guest.ready == true) {
        return this.waitingForOpponent(data.owner.name, false);
      }
      if (data.owner.ready == true && data.guest.ready == false) {
        return this.waitingForOpponent(data.guest.name, false);
      }
      if (data.owner.ready == true && data.guest.ready == true) {
        return this.waitingForOpponent("ready", true);
      }
    });
  },

  async waitingForOpponent(name: string, bothReady: boolean) {
    let startGame = await this.getState();
    if (bothReady === true) {
      startGame.playersReady = bothReady;

      if (location.pathname !== "/wfo") return;
      if (location.pathname === "/wfo") {
        goTo("/game");
      }
    } else if (bothReady === false) {
      startGame.gameState.opponentName = name;
    }
  },

  // Guardo la jugada del jugador y la manda a la rtdb
  async setGame(playerPlay: Play) {
    const { gameState } = await this.getState();
    gameState.play = playerPlay;

    fetch(`${API_BASE_URL}/room/${gameState.roomPublicId}/play`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ gameState }),
    });
  },

  // obtiene los movimientos de la rtdb
  async getMovesFromRtdb() {
    const { gameState } = await this.getState();

    const db = getDatabase(app);
    const roomRef = ref(db, `rooms/${await gameState.roomPrivateId}`);

    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data.owner.play != null && data.guest.play != null) {
        return this.setMoves(data.owner.play, data.guest.play);
      }
    });
  },

  // setea los moves del OWNER y GUEST en los respectivos states de los clientes
  async setMoves(ownerPlay: string, guestPlay: string) {
    const { gameState } = await this.getState();
    if (gameState.owner) {
      console.log("gameState.owner fue true");

      return (gameState.opponentPlay = guestPlay);
    }
    if (gameState.owner == false) {
      console.log("gameState.owner fue false");
      return (gameState.opponentPlay = ownerPlay);
    }
    console.log("gameState en setMoves", gameState);
  },

  // declara la logica para determinar quien gano desde la
  // perspectiva del OWNER y retorna ese resultado asi puede ser
  // mostrado en el component
  whoWins(ownerPlay: string, guestPlay: string) {
    const ownerWinningOutcomes = [
      { ownerPlay: "piedra", guestPlay: "tijera" },
      { ownerPlay: "tijera", guestPlay: "papel" },
      { ownerPlay: "papel", guestPlay: "piedra" },
    ];

    let ownerResult = "perdiste";
    for (const o of ownerWinningOutcomes) {
      if (o.ownerPlay == ownerPlay && o.guestPlay == guestPlay) {
        ownerResult = "ganaste";
      } else if (ownerPlay == guestPlay) {
        ownerResult = "empate";
      }
    }

    let guestResult = "";
    if (ownerResult == "perdiste") {
      guestResult = "ganaste";
    } else if (ownerResult == "ganaste") {
      guestResult = "perdiste";
    } else if (ownerResult == "empate") {
      guestResult = "empate";
    }

    this.setWinner(ownerResult, guestResult);
  },

  // setea en el state quien gano desde la perspectiva del OWNER
  setWinner(resultOfOwner: string, resultOfGuest: string): void {
    const data = this.getState();
    if (resultOfOwner == "empate") {
      data.scoreboard.draw++;
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      console.log("empate");

      return;
    }
    if (resultOfOwner == "ganaste") {
      data.scoreboard.owner++;
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      console.log("ganó owner -- finalizó");
      return this.saveHistory(data.scoreboard);
    }
    if (resultOfOwner == "perdiste") {
      data.scoreboard.guest++;
      data.gameState.lastGameOwnerResult = resultOfOwner;
      data.gameState.lastGameGuestResult = resultOfGuest;
      console.log("ganó guest -- finalizó");

      return this.saveHistory(data.scoreboard);
    }
  },

  // setea los resultados en el state, localStorage y FireStore
  saveHistory(history) {
    const data = this.getState();
    data.scoreboard = history;
    localStorage.setItem("localState", JSON.stringify(data));
    fetch(`${API_BASE_URL}/history/save/${data.gameState.roomPublicId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data.scoreboard),
    });
    console.log("scoreboard: ", data.scoreboard);

    //hace un post con la historia de los scores
  },

  // inicializo el scoreboard y checkeo si ya hay data previa
  async saveScoreboard() {
    const data = await this.getState();
    const rawHistoryData = await fetch(`${API_BASE_URL}/history/${data.gameState.roomPublicId}`);
    //hace un get del scoreboard
    console.log("última data en el state: ", data);
  },
};
export { state };
