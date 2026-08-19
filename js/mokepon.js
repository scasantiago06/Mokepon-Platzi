let inputHipodoge, inputCapipepo, inputRatigueya, inputLangostelvis, inputTucapalma, inputPydos // Inputs
let btnPetSelection, btnFireAttack, btnWaterAttack, btnGroundAttack, btnRestart // Buttons
let petSelection, attackSelection, myAttacksHistory, enemyAttacksHistory, restartSection, petsSelectedInfo // Sections
let pets = ["Hipodoge", "Capipepo", "Ratigueya", "Langostelvis", "Tucapalma", "Pydos"] // Pets
let attacks = ["Fuego", "Agua", "Tierra"] // Attacks
let myPetName, enemyPetName // Names
let petSelected, enemyPet // Selected pets
let playerAttack, enemyAttack // Selected attacks
let myPetLives, enemyPetLives // Lives texts
let myPetLivesCount = 3, enemyPetLivesCount = 3 // Lives counts
let gameOver = false

function DOMloaded() {

    btnPetSelection = document.getElementById("btn-pet-selection")
    btnFireAttack = document.getElementById("btn-fire-attack")
    btnWaterAttack = document.getElementById("btn-water-attack")
    btnGroundAttack = document.getElementById("btn-ground-attack")
    btnRestart = document.getElementById("btn-restart")

    inputHipodoge = document.getElementById("hipodoge")
    inputCapipepo = document.getElementById("capipepo")
    inputRatigueya = document.getElementById("ratigueya")
    inputLangostelvis = document.getElementById("langostelvis")
    inputTucapalma = document.getElementById("tucapalma")
    inputPydos = document.getElementById("pydos")

    myPetName = document.getElementById("my-pet-name")
    enemyPetName = document.getElementById("enemy-pet-name")

    myPetLives = document.getElementById("my-pet-lives")
    enemyPetLives = document.getElementById("enemy-pet-lives")
    myPetLives.innerHTML = myPetLivesCount
    enemyPetLives.innerHTML = enemyPetLivesCount

    petSelection = document.getElementById("section-pet-selection")
    attackSelection = document.getElementById("section-attack-selection")
    myAttacksHistory = document.getElementById("my-attacks-history")
    enemyAttacksHistory = document.getElementById("enemy-attacks-history")
    petsSelectedInfo = document.getElementById("pets-selected-info")
    restartSection = document.getElementById("restart")
    petsSelectedInfo.style.display = "none"
    attackSelection.style.display = "none"
    restartSection.style.visibility = "hidden"

    btnPetSelection.addEventListener("click", selectPet)
    btnFireAttack.addEventListener("click", fireAttack)
    btnWaterAttack.addEventListener("click", waterAttack)
    btnGroundAttack.addEventListener("click", groundAttack)
    btnRestart.addEventListener("click", restartGame)
}

function setupAfterSelection() {
    if (!petSelected) return

    enemyPetSelection()
    myPetName.innerHTML = petSelected
    enemyPetName.innerHTML = enemyPet

    petSelection.style.display = "none"
    attackSelection.style.display = "flex"
    petsSelectedInfo.style.display = "flex"
}

function selectPet() {

    let hipodogeStyle = document.getElementById("hipodoge-style")
    let capipepoStyle = document.getElementById("capipepo-style")
    let ratigueyaStyle = document.getElementById("ratigueya-style")

    hipodogeStyle.style.border = "2px solid black"
    capipepoStyle.style.border = "2px solid black"
    ratigueyaStyle.style.border = "2px solid black"

    switch (true) {
        case inputHipodoge.checked:
            petSelected = pets[0]
            inputHipodoge.style.border = "4px solid #F2EFE7"
            break
        case inputCapipepo.checked:
            petSelected = pets[1]
            //capipepoStyle.style.border = "4px solid #F2EFE7"
            break
        case inputRatigueya.checked:
            petSelected = pets[2]
            //ratigueyaStyle.style.border = "4px solid #F2EFE7"
            break
        case inputLangostelvis.checked:
            petSelected = pets[3]
            break
        case inputTucapalma.checked:
            petSelected = pets[4]
            break
        case inputPydos.checked:
            petSelected = pets[5]
            break
        default:
            alert("Selecciona una mascota")
            return
    }

    btnPetSelection.disabled = true
    setupAfterSelection()
}

function enemyPetSelection() {
    let tempPetsList = pets.filter(pet => pet !== petSelected) // Filter out the selected pet from the list
    let randomPet = randomNumber(0, tempPetsList.length - 1)

    enemyPet = tempPetsList[randomPet]
}

function fireAttack() {
    if (!gameOver && petSelected) {
        playerAttack = "Fuego"
        enemyAttackSelection()
    }
    else if (!petSelected) {
        alert("Selecciona una mascota antes de atacar")
    }
}

function waterAttack() {
    if (!gameOver && petSelected) {
        playerAttack = "Agua"
        enemyAttackSelection()
    }
    else if (!petSelected) {
        alert("Selecciona una mascota antes de atacar")
    }
}

function groundAttack() {
    if (!gameOver && petSelected) {
        playerAttack = "Tierra"
        enemyAttackSelection()
    }
    else if (!petSelected) {
        alert("Selecciona una mascota antes de atacar")
    }
}

function checkWinner() {
    if (playerAttack === enemyAttack) {
        return "EMPATE"
    } else if (
        (playerAttack === "Fuego" && enemyAttack === "Tierra") ||
        (playerAttack === "Agua" && enemyAttack === "Fuego") ||
        (playerAttack === "Tierra" && enemyAttack === "Agua")) {
        enemyPetLivesCount--
        enemyPetLives.innerHTML = enemyPetLivesCount
        return "GANASTE"

    } else {
        myPetLivesCount--
        myPetLives.innerHTML = myPetLivesCount
        return "PERDISTE"
    }
}

function enemyAttackSelection() {
    let randomAttack = randomNumber(0, attacks.length - 1)
    enemyAttack = attacks[randomAttack]

    setupConsole()
}

function setupConsole() {
    let myAttackMessage = document.createElement("p")
    let enemyAttackMessage = document.createElement("p")
    let finalMessage = document.getElementById("final-message")

    myAttacksHistory.prepend(myAttackMessage)
    enemyAttacksHistory.prepend(enemyAttackMessage)
    myAttackMessage.textContent = playerAttack
    enemyAttackMessage.textContent = enemyAttack

    switch (checkWinner()) {
        case "EMPATE":
            myAttackMessage.textContent = playerAttack + "😑"
            enemyAttackMessage.textContent = enemyAttack + "😑"
            break;

        case "GANASTE":
            myAttackMessage.textContent = playerAttack + "😁"
            enemyAttackMessage.textContent = enemyAttack + "😡"
            break;

        case "PERDISTE":
            myAttackMessage.textContent = playerAttack + "😡"
            enemyAttackMessage.textContent = enemyAttack + "😁"
            break;

        default:
            break;
    }

    if (myPetLivesCount === 0) {
        gameOver = true
        setTimeout(() => {
            finalMessage.textContent = "Perdiste el juego"
            restartSection.style.visibility = "visible"
        }, 100)
    }
    else if (enemyPetLivesCount === 0) {
        gameOver = true
        setTimeout(() => {
            finalMessage.textContent = "Ganaste el juego"
            restartSection.style.visibility = "visible"
        }, 100)
    }
}

function restartGame() {
    location.reload()
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

document.addEventListener("DOMContentLoaded", DOMloaded)