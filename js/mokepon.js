//#region Mokepones

class Mokepon {
  constructor(nombre, foto, vida, mapImage, x = 10, y = 10) {
    this.name = nombre;
    this.picture = foto;
    this.lives = vida;
    this.attacks = [];
    this.xPos = x;
    this.yPos = y;
    this.width = 60;
    this.height = 60;
    this.canvasImage = new Image();
    this.canvasImage.src = mapImage;
    this.xVelocity = 0;
    this.yVelocity = 0;
  }

  drawMokepon() {
    mapContext.drawImage(
      this.canvasImage,
      this.xPos,
      this.yPos,
      this.width,
      this.height,
    );
  }
}

let hipodoge = new Mokepon(
  "Hipodoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  5,
  "./assets/hipodoge.png",
);

let capipepo = new Mokepon(
  "Capipepo",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  5,
  "./assets/capipepo.png",
);

let ratigueya = new Mokepon(
  "Ratigueya",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  5,
  "./assets/ratigueya.png",
);

//#endregion

//#region variables

// Pets
const pets = [];
// Attacks
const attacks = ["Fuego", "Agua", "Tierra"];
// Sections
const sectionPetSelection = document.getElementById("section-pet-selection");
const sectionAttackSelection = document.getElementById(
  "section-attack-selection",
);
const sectionMyAttacksHistory = document.getElementById(
  "section-my-attacks-history",
);
const sectionEnemyAttacksHistory = document.getElementById(
  "section-enemy-attacks-history",
);
const sectionPetsSelectedInfo = document.getElementById(
  "section-pets-selected-info",
);
const sectionRestart = document.getElementById("section-restart");
const sectionMap = document.getElementById("section-map");
// Lives texts
const myPetLives = document.getElementById("my-pet-lives");
const enemyPetLives = document.getElementById("enemy-pet-lives");
// Selected pets
let petSelected;
let enemyPet;
let enemyPets;
// Selected attacks
let playerAttack;
let enemyAttack;
// Lives counts
let myPetLivesCount = 3;
let enemyPetLivesCount = 3;
// Canvas
let map = document.getElementById("map");
let mapContext = map.getContext("2d");
let mapBackground = new Image();
let mapWidth;
let mapHeight;
// Others
let finalMessage = document.getElementById("final-message");
let blockAttacks = false;
let interval;
let btnFinishFight = document.getElementById("btn-finish-fight");

//#endregion

function DOMloaded() {
  let btnPetSelection = document.getElementById("btn-pet-selection");
  btnPetSelection.addEventListener("click", selectPet);

  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", stopMoving);
  sectionAttackSelection.style.display = "none";
  sectionPetsSelectedInfo.style.display = "none";
  sectionRestart.style.visibility = "hidden";
  sectionMap.style.display = "none";

  pets.push(hipodoge, capipepo, ratigueya);

  setupPetCards(pets);
  setupAttacks();
}

function setupPetCards(pets) {
  let divPetCards = document.getElementById("div-pet-cards");

  pets.forEach((element) => {
    let inputId = element.name.charAt(0).toLowerCase() + element.name.slice(1);

    petCard = `
    <input type="radio" name="pet" id=${inputId} class="pet-input">
            <label for="${inputId}" class="pet-labels" id="${inputId}-style">
                <p>${element.name}</p>
                <img src=${element.picture} alt=${element.name}>
            </label>
    `;

    divPetCards.innerHTML += petCard;
  });
}

function setupAttackButtons(attacks) {
  let divAttackButtons = document.getElementById("div-attack-buttons");

  attacks.forEach((element) => {
    attackButton = `
    <button class=attack-button id="${element.id}">${element.name}</button>
    `;

    divAttackButtons.innerHTML += attackButton;
  });

  let attackButtons = document.querySelectorAll(".attack-button");

  attackButtons.forEach((element) => {
    element.addEventListener("click", attack);
  });
}

function attack(event) {
  if (!blockAttacks && petSelected) {
    playerAttack = event.target.textContent;
    enemyAttackSelection();
  } else if (!petSelected) {
    alert("Selecciona una mascota antes de atacar");
  }
}

function setupAttacks() {
  hipodoge.attacks.push(
    { name: "💧", id: "btn-water-attack" },
    { name: "💧", id: "btn-water-attack" },
    { name: "💧", id: "btn-water-attack" },
    { name: "🔥", id: "btn-fire-attack" },
    { name: "🌱", id: "btn-ground-attack" },
  );

  capipepo.attacks.push(
    { name: "🌱", id: "btn-ground-attack" },
    { name: "🌱", id: "btn-ground-attack" },
    { name: "🌱", id: "btn-ground-attack" },
    { name: "💧", id: "btn-water-attack" },
    { name: "🔥", id: "btn-fire-attack" },
  );

  ratigueya.attacks.push(
    { name: "🔥", id: "btn-fire-attack" },
    { name: "🔥", id: "btn-fire-attack" },
    { name: "🔥", id: "btn-fire-attack" },
    { name: "💧", id: "btn-water-attack" },
    { name: "🌱", id: "btn-ground-attack" },
  );
}

function selectPet() {
  for (let index = 0; index < pets.length; index++) {
    const element = pets[index];

    const inputId =
      element.name.charAt(0).toLowerCase() + element.name.slice(1);
    const input = document.getElementById(inputId);

    if (input.checked) {
      petSelected = pets[index];
      break;
    }
  }

  if (!petSelected) {
    alert("Selecciona una mascota");
    return;
  }

  setupAfterSelection();
}

function setupAfterSelection() {
  if (!petSelected) return;

  setupAttackButtons(petSelected.attacks);
  sectionPetSelection.style.display = "none";

  setupCanvas();
  updateCanvas();
}

function setupFightSection(enemyCollisioned) {
  clearInterval(interval);
  blockAttacks = false;
  enemyPet = enemyCollisioned;

  sectionMap.style.display = "none";
  sectionAttackSelection.style.display = "flex";
  sectionRestart.style.visibility = "hidden";
  sectionPetsSelectedInfo.style.display = "flex";

  myPetLivesCount = petSelected.lives;
  enemyPetLivesCount = enemyPet.lives;
  myPetLives.innerHTML = myPetLivesCount;
  enemyPetLives.innerHTML = enemyPetLivesCount;
  let myPetName = document.getElementById("my-pet-name");
  myPetName.innerHTML = petSelected.name;
  let enemyPetName = document.getElementById("enemy-pet-name");
  enemyPetName.innerHTML = enemyPet.name;
}

function keyPressed(event) {
  switch (event.key) {
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    default:
      break;
  }
}

function setupCanvas() {
  sectionMap.style.display = "flex";
  mapWidth = (window.innerWidth > 500 ? 500 : window.innerWidth) - 20;
  mapHeight = (mapWidth * 600) / 800;
  map.width = mapWidth;
  map.height = mapHeight;
  interval = setInterval(updateCanvas, 50);
  mapBackground.src = "./assets/mokemap.png";

  petSelected.xPos = 10;
  petSelected.yPos = 10;

  if (!enemyPets) enemyPets = pets.filter((pet) => pet !== petSelected);

  enemyPets.forEach((pet) => {
    pet.xPos = randomNumber(10, map.width - pet.width);
    pet.yPos = randomNumber(10, map.height - pet.height);
  });
}

function updateCanvas() {
  mapContext.clearRect(0, 0, map.width, map.height);

  petSelected.xPos += petSelected.xVelocity;
  petSelected.yPos += petSelected.yVelocity;

  petSelected.xPos = Math.max(
    0,
    Math.min(petSelected.xPos, map.width - petSelected.width),
  );
  petSelected.yPos = Math.max(
    0,
    Math.min(petSelected.yPos, map.height - petSelected.height),
  );
  mapContext.drawImage(mapBackground, 0, 0, map.width, map.height);
  petSelected.drawMokepon();
  enemyPets.forEach((pet) => {
    pet.drawMokepon();
    if (petSelected.xVelocity !== 0 || petSelected.yVelocity !== 0)
      detectCollision(pet);
  });
}

function moveRight() {
  petSelected.xVelocity = 5;
}

function moveLeft() {
  petSelected.xVelocity = -5;
}

function moveUp() {
  petSelected.yVelocity = -5;
}

function moveDown() {
  petSelected.yVelocity = 5;
}

function stopMoving() {
  if (petSelected) {
    petSelected.xVelocity = 0;
    petSelected.yVelocity = 0;
  }
}

function detectCollision(enemy) {
  const topsideEnemy = enemy.yPos;
  const undersideEnemy = enemy.yPos + enemy.height;
  const leftsideEnemy = enemy.xPos;
  const rightsideEnemy = enemy.xPos + enemy.width;

  const topsidePlayer = petSelected.yPos;
  const undersidePlayer = petSelected.yPos + petSelected.height;
  const leftsidePlayer = petSelected.xPos;
  const rightsidePlayer = petSelected.xPos + petSelected.width;

  if (
    undersidePlayer < topsideEnemy ||
    topsidePlayer > undersideEnemy ||
    rightsidePlayer < leftsideEnemy ||
    leftsidePlayer > rightsideEnemy
  ) {
    return;
  }

  stopMoving();
  setupFightSection(enemy);
}

function enemyAttackSelection() {
  let randomAttack = randomNumber(0, enemyPet.attacks.length - 1);
  enemyAttack = enemyPet.attacks[randomAttack].name;

  setupConsole();
}

function setupConsole() {
  let myAttackMessage = document.createElement("p");
  let enemyAttackMessage = document.createElement("p");
  sectionMyAttacksHistory.prepend(myAttackMessage);
  sectionEnemyAttacksHistory.prepend(enemyAttackMessage);

  myAttackMessage.textContent = playerAttack;
  enemyAttackMessage.textContent = enemyAttack;

  switch (checkRoundWinner()) {
    case "EMPATE":
      myAttackMessage.textContent = playerAttack + "😑";
      enemyAttackMessage.textContent = enemyAttack + "😑";
      break;
    case "GANASTE":
      myAttackMessage.textContent = playerAttack + "😁";
      enemyAttackMessage.textContent = enemyAttack + "😡";
      break;
    case "PERDISTE":
      myAttackMessage.textContent = playerAttack + "😡";
      enemyAttackMessage.textContent = enemyAttack + "😁";
      break;
    default:
      break;
  }

  checkGameWinner();
}

function checkRoundWinner() {
  if (playerAttack === enemyAttack) {
    return "EMPATE";
  } else if (
    (playerAttack === "🔥" && enemyAttack === "🌱") ||
    (playerAttack === "💧" && enemyAttack === "🔥") ||
    (playerAttack === "🌱" && enemyAttack === "💧")
  ) {
    enemyPetLivesCount--;
    enemyPetLives.innerHTML = enemyPetLivesCount;
    return "GANASTE";
  } else {
    myPetLivesCount--;
    myPetLives.innerHTML = myPetLivesCount;
    return "PERDISTE";
  }
}

function checkGameWinner() {
  if (myPetLivesCount === 0) {
    blockAttacks = true;
    setTimeout(() => {
      btnFinishFight.onclick = null;
      btnFinishFight.addEventListener("click", restartGame);
      btnFinishFight.textContent = "Reinciar juego";
      finalMessage.textContent = "Perdiste el juego";
      sectionRestart.style.visibility = "visible";
    }, 100);
  } else if (enemyPetLivesCount === 0) {
    blockAttacks = true;
    setTimeout(() => {
      let tempList = enemyPets.filter((enemy) => enemy !== enemyPet);
      enemyPets = tempList;

      btnFinishFight.onclick = null;

      if (enemyPets.length === 0) {
        btnFinishFight.addEventListener("click", restartGame);
        btnFinishFight.textContent = "Reinciar juego";
        finalMessage.textContent = "Ganaste el juego";
      } else {
        btnFinishFight.addEventListener("click", continueGame);
        btnFinishFight.textContent = "Continuar";
        finalMessage.textContent = "Ganaste la pelea";
      }

      sectionRestart.style.visibility = "visible";
    }, 100);
  }
}

function restartGame() {
  location.reload();
}

function continueGame() {
  sectionMyAttacksHistory.replaceChildren();
  sectionEnemyAttacksHistory.replaceChildren();
  sectionMap.style.display = "flex";
  sectionAttackSelection.style.display = "none";
  sectionRestart.style.visibility = "hidden";
  sectionPetsSelectedInfo.style.display = "none";
  setupCanvas();
  updateCanvas();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

document.addEventListener("DOMContentLoaded", DOMloaded);
