// Pets
const pets = [
  "Hipodoge",
  "Capipepo",
  "Ratigueya",
  "Langostelvis",
  "Tucapalma",
  "Pydos",
];
// Attacks
const attacks = ["Fuego", "Agua", "Tierra"]; // Attacks
// Sections
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
// Lives texts
const myPetLives = document.getElementById("my-pet-lives");
const enemyPetLives = document.getElementById("enemy-pet-lives");
// Selected pets
let petSelected;
let enemyPet;
// Selected attacks
let playerAttack;
let enemyAttack;
// Lives counts
let myPetLivesCount = 3;
let enemyPetLivesCount = 3;
// Others
let finalMessage = document.getElementById("final-message");
let gameOver = false;

function DOMloaded() {
  let btnPetSelection = document.getElementById("btn-pet-selection");
  btnPetSelection.addEventListener("click", selectPet);
  let btnFireAttack = document.getElementById("btn-fire-attack");
  btnFireAttack.addEventListener("click", fireAttack);
  let btnWaterAttack = document.getElementById("btn-water-attack");
  btnWaterAttack.addEventListener("click", waterAttack);
  let btnGroundAttack = document.getElementById("btn-ground-attack");
  btnGroundAttack.addEventListener("click", groundAttack);
  let btnRestart = document.getElementById("btn-restart");
  btnRestart.addEventListener("click", restartGame);

  myPetLives.innerHTML = myPetLivesCount;
  enemyPetLives.innerHTML = enemyPetLivesCount;

  sectionAttackSelection.style.display = "none";
  sectionPetsSelectedInfo.style.display = "none";
  sectionRestart.style.visibility = "hidden";
}

function selectPet() {
  let inputHipodoge = document.getElementById("hipodoge");
  let inputCapipepo = document.getElementById("capipepo");
  let inputRatigueya = document.getElementById("ratigueya");

  let hipodogeStyle = document.getElementById("hipodoge-style");
  let capipepoStyle = document.getElementById("capipepo-style");
  let ratigueyaStyle = document.getElementById("ratigueya-style");

  switch (true) {
    case inputHipodoge.checked:
      petSelected = pets[0];
      break;
    case inputCapipepo.checked:
      petSelected = pets[1];
      break;
    case inputRatigueya.checked:
      petSelected = pets[2];
      break;
    case inputLangostelvis.checked:
      petSelected = pets[3];
      break;
    case inputTucapalma.checked:
      petSelected = pets[4];
      break;
    case inputPydos.checked:
      petSelected = pets[5];
      break;
    default:
      alert("Selecciona una mascota");
      return;
  }

  setupAfterSelection();
}

function setupAfterSelection() {
  if (!petSelected) return;

  enemyPetSelection();

  let myPetName = document.getElementById("my-pet-name");
  myPetName.innerHTML = petSelected;
  let enemyPetName = document.getElementById("enemy-pet-name");
  enemyPetName.innerHTML = enemyPet;
  let sectionPetSelection = document.getElementById("section-pet-selection");

  sectionPetSelection.style.display = "none";
  sectionAttackSelection.style.display = "flex";
  sectionPetsSelectedInfo.style.display = "flex";
}

function enemyPetSelection() {
  let tempPetsList = pets.filter((pet) => pet !== petSelected); // Filter out the selected pet from the list
  let randomPet = randomNumber(0, tempPetsList.length - 1);

  enemyPet = tempPetsList[randomPet];
}

function fireAttack() {
  if (!gameOver && petSelected) {
    playerAttack = "Fuego";
    enemyAttackSelection();
  } else if (!petSelected) {
    alert("Selecciona una mascota antes de atacar");
  }
}

function waterAttack() {
  if (!gameOver && petSelected) {
    playerAttack = "Agua";
    enemyAttackSelection();
  } else if (!petSelected) {
    alert("Selecciona una mascota antes de atacar");
  }
}

function groundAttack() {
  if (!gameOver && petSelected) {
    playerAttack = "Tierra";
    enemyAttackSelection();
  } else if (!petSelected) {
    alert("Selecciona una mascota antes de atacar");
  }
}

function enemyAttackSelection() {
  let randomAttack = randomNumber(0, attacks.length - 1);
  enemyAttack = attacks[randomAttack];

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
    (playerAttack === "Fuego" && enemyAttack === "Tierra") ||
    (playerAttack === "Agua" && enemyAttack === "Fuego") ||
    (playerAttack === "Tierra" && enemyAttack === "Agua")
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
    gameOver = true;
    setTimeout(() => {
      finalMessage.textContent = "Perdiste el juego";
      sectionRestart.style.visibility = "visible";
    }, 100);
  } else if (enemyPetLivesCount === 0) {
    gameOver = true;
    setTimeout(() => {
      finalMessage.textContent = "Ganaste el juego";
      sectionRestart.style.visibility = "visible";
    }, 100);
  }
}

function restartGame() {
  location.reload();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

document.addEventListener("DOMContentLoaded", DOMloaded);
