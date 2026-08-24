class Mokepon {
  constructor(nombre, foto, vida) {
    this.name = nombre;
    this.picture = foto;
    this.lives = vida;
    this.attacks = [];
  }
}

let hipodoge = new Mokepon(
  "Hipodoge",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  5,
);

let capipepo = new Mokepon(
  "Capipepo",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  5,
);

let ratigueya = new Mokepon(
  "Ratigueya",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  5,
);

// Pets
const pets = [];
// Attacks
const attacks = ["Fuego", "Agua", "Tierra"];
// Sections
const sectionAttackSelection = document.getElementById("section-attack-selection",);
const sectionMyAttacksHistory = document.getElementById("section-my-attacks-history",);
const sectionEnemyAttacksHistory = document.getElementById("section-enemy-attacks-history",);
const sectionPetsSelectedInfo = document.getElementById("section-pets-selected-info",);
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
  if (!gameOver && petSelected) {
    playerAttack = event.target.textContent;
    enemyAttackSelection();
  } else if (!petSelected) {
    alert("Selecciona una mascota antes de atacar");
  }
}

function DOMloaded() {
  let btnPetSelection = document.getElementById("btn-pet-selection");
  btnPetSelection.addEventListener("click", selectPet);
  let btnRestart = document.getElementById("btn-restart");
  btnRestart.addEventListener("click", restartGame);

  sectionAttackSelection.style.display = "none";
  sectionPetsSelectedInfo.style.display = "none";
  sectionRestart.style.visibility = "hidden";

  pets.push(hipodoge, capipepo, ratigueya);

  setupPetCards(pets);
  setupAttacks();
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

  enemyPetSelection();

  myPetLivesCount = petSelected.lives;
  enemyPetLivesCount = enemyPet.lives;
  myPetLives.innerHTML = myPetLivesCount;
  enemyPetLives.innerHTML = enemyPetLivesCount;

  let myPetName = document.getElementById("my-pet-name");
  myPetName.innerHTML = petSelected.name;
  let enemyPetName = document.getElementById("enemy-pet-name");
  enemyPetName.innerHTML = enemyPet.name;
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
