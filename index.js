//#region Imports

const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

//#endregion

//#region Objects

const players = [];

class Player {
  constructor(id) {
    this.id = id;
    this.canRestart = false;
  }

  setMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  updatePosition(x, y) {
    this.mokepon.xPos = x;
    this.mokepon.yPos = y;
  }

  setEnemy(enemyMokepon) {
    this.enemyMokepon = enemyMokepon;
  }
}

class Mokepon {
  constructor(mokepon, id) {
    this.id = id;
    this.name = mokepon.name;
    this.picture = mokepon.picture;
    this.lives = mokepon.lives;
    this.attacks = mokepon.attacks;
    this.xPos = mokepon.xPos;
    this.yPos = mokepon.yPos;
    this.width = mokepon.width;
    this.height = mokepon.height;
    this.mapImage = mokepon.mapImage;
    this.attack = null;
    this.roundSolved = false;
  }
}

//#endregion

app.use(cors());
app.use(express.json());

//#region Endpoints

app.get("/join", (req, res) => {
  const id = `${Math.random()}`;
  const player = new Player(id);
  players.push(player);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

app.post("/mokepon/:playerId", (req, res) => {
  const player = findPlayerById(req);
  const mokeponData = req.body?.mokepon || null;

  if (!mokeponData || !mokeponData.name || !mokeponData.mapImage) {
    return res.status(400).send({ error: "Invalid mokepon data" });
  }

  const mokeponId = `${Math.random()}`;
  const mokepon = new Mokepon(mokeponData, mokeponId);

  if (player) player.setMokepon(mokepon);

  res.send(mokeponId);
});

app.post("/mokepon/:playerId/position", (req, res) => {
  const playerId = req.params.playerId || "";
  const playerIndex = players.findIndex((player) => player.id === playerId);
  const { x, y } = req.body || {};

  if (playerIndex >= 0) {
    players[playerIndex].updatePosition(x, y);
  }

  const enemies = players.filter(
    (player) => player.id !== playerId && player.mokepon,
  );

  res.send({ enemies });
});

app.post("/mokepon/:playerId/enemy", (req, res) => {
  const player = findPlayerById(req);
  const { enemyMokepon } = req.body || {};

  if (player) player.setEnemy(enemyMokepon);
  res.send({ playerInfo: player });
});

app.post("/mokepon/:playerId/fight", (req, res) => {
  const player = findPlayerById(req);
  const { playerAttack } = req.body || {};

  if (player) player.mokepon.attack = playerAttack;
  player.mokepon.roundSolved = false;

  const enemyMokepon = player.enemyMokepon;
  const enemyPlayer = players.find(
    (player) => player.mokepon.id === enemyMokepon.id,
  );
  const enemyAttack = enemyPlayer.mokepon.attack;
  console.log(
    enemyAttack,
    player.mokepon.roundSolved,
    enemyPlayer.mokepon.roundSolved,
  );
  if (
    enemyAttack &&
    ((player.mokepon.roundSolved === false &&
      enemyPlayer.mokepon.roundSolved === false) ||
      (player.mokepon.roundSolved === true &&
        enemyPlayer.mokepon.roundSolved === false) ||
      (player.mokepon.roundSolved === false &&
        enemyPlayer.mokepon.roundSolved === true))
  ) {
    const result = resolveFight(player.mokepon.attack, enemyAttack);

    console.log(`Player: ${player.id} solved`)

    switch (result) {
      case "GANASTE":
        break;
      case "PERDISTE":
        player.mokepon.lives--;
        break;
      default:
        break;
    }

    player.mokepon.roundSolved = true;

    res.json({
      enemyAttack,
      result,
      playerLives: player.mokepon.lives,
      enemyLives: enemyPlayer.mokepon.lives,
    });
  } else {
    res.json({ enemyAttack: null });
  }
});

app.post("/mokepon/:playerId/fightSolved", (req, res) => {
  const player = findPlayerById(req);
  const { enemyMokeponId } = req.body || {};
  const enemyPlayer = players.find(
    (player) => player.mokepon.id === enemyMokeponId,
  );

  console.log("Round solved for both players", player.mokepon.roundSolved , enemyPlayer.mokepon.roundSolved);
  if (player.mokepon.roundSolved && enemyPlayer.mokepon.roundSolved) {
    res.json({ solved: true });
  }else{
    res.json({ solved: false });
  }
});

app.post("/mokepon/:playerId/restartRound", (req, res) => {
  const player = findPlayerById(req);
  const { enemyMokeponId, canRestart } = req.body || {};
  player.canRestart = canRestart;
  const enemyPlayer = players.find(
    (player) => player.mokepon.id === enemyMokeponId,
  );

  if (player.canRestart && enemyPlayer.canRestart) {
    player.mokepon.roundSolved = false;
    enemyPlayer.mokepon.roundSolved = false;

    player.mokepon.attack = null;
    enemyPlayer.mokepon.attack = null;

    player.canRestart = false;
    enemyPlayer.canRestart = false;
  }
  
  res.end()
});

//#endregion

app.listen(port, () => {
  console.log("Servidor funcionando");
});

function findPlayerById(req) {
  const playerId = req.params.playerId || "";
  return players.find((player) => player.id === playerId);
}

function resolveFight(playerAttack, enemyAttack) {
  if (playerAttack === enemyAttack) {
    return "EMPATE";
  } else if (
    (playerAttack === "🔥" && enemyAttack === "🌱") ||
    (playerAttack === "💧" && enemyAttack === "🔥") ||
    (playerAttack === "🌱" && enemyAttack === "💧")
  ) {
    return "GANASTE";
  } else {
    return "PERDISTE";
  }
}
