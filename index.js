const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

const players = [];

class Player {
  constructor(id) {
    this.id = id;
  }

  setMokepon(mokepon) {
    this.mokepon = mokepon;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
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

app.use(cors());
app.use(express.json());

app.get("/join", (req, res) => {
  const id = `${Math.random()}`;
  const player = new Player(id);
  players.push(player);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

app.post("/mokepon/:playerId", (req, res) => {
  const playerId = req.params.playerId || "";
  const mokeponName = req.body.mokepon || "";
  const mokeponId = `${Math.random()}`;
  const mokepon = new Mokepon(mokeponName, mokeponId);
  const playerIndex = players.findIndex((player) => player.id === playerId);

  if (playerIndex >= 0) {
    players[playerIndex].setMokepon(mokepon);
  }

  res.send(mokeponId);
});

app.post("/mokepon/:playerId/position", (req, res) => {
  const playerId = req.params.playerId || "";
  const playerIndex = players.findIndex((player) => player.id === playerId);
  const { x, y } = req.body || {};

  if (playerIndex >= 0) {
    players[playerIndex].updatePosition(x, y);
  }

  const enemies = players.filter((player) => player.id !== playerId);
  //console.log({enemies});
  res.send({ enemies });
});

app.listen(port, () => {
  console.log("Servidor funcionando");
});
