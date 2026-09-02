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
  }

  setMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  updatePosition(x, y) {
    this.mokepon.xPos = x;
    this.mokepon.yPos = y;
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
  const playerId = req.params.playerId || "";
  const mokeponData = req.body?.mokepon || null;
  const playerIndex = players.findIndex((player) => player.id === playerId);

  if (!mokeponData || !mokeponData.name || !mokeponData.mapImage) {
    return res.status(400).send({ error: "Invalid mokepon data" });
  }

  const mokeponId = `${Math.random()}`;
  const mokepon = new Mokepon(mokeponData, mokeponId);

  if (playerIndex >= 0) {
    players[playerIndex].setMokepon(mokepon);
  }

  //console.log(players);
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

//#endregion

app.listen(port, () => {
  console.log("Servidor funcionando");
});
