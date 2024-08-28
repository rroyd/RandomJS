const buttons = document.querySelectorAll("button");
const playingTo = document.querySelector("select");
const scoreboard = document.querySelectorAll("#scoreboard span");
const spanInsideButtons = document.querySelectorAll("button span");

let previousPlayingTo = playingTo.value;
let gameEnded = false;

const score1 = document.getElementById("playerOneScore")
const score2 = document.getElementById("playerTwoScore")


const addToPlayer = function(player) {
    player.innerText++;

    if (player.innerText === playingTo.value) {
        endGame(player);
    }
}

const endGame = function(player) {
    gameEnded = true;
    buttons[0].setAttribute("disabled", true);
    buttons[1].setAttribute("disabled", true);
    playingTo.setAttribute("disabled", true);

    if (player.id === "playerOneScore") {
        score1.classList.add("winner");
        score2.classList.add("loser");
    }
    else {
        score2.classList.add("winner");
        score1.classList.add("loser");
    }
    
    for(let span of spanInsideButtons) {
        gameEnded && span.classList.add("disabled");
    }

}

const resetGame = function() {
    buttons[0].removeAttribute("disabled");
    buttons[1].removeAttribute("disabled");
    playingTo.removeAttribute("disabled");

    score1.innerText = "0";
    score2.innerText = "0";

    score1.classList.remove("winner");
    score1.classList.remove("loser");
    score2.classList.remove("winner");
    score2.classList.remove("loser");

    
    for(let span of spanInsideButtons) {
        span.classList.remove("disabled");
    }
}


buttons[0].addEventListener("click", function() {
    addToPlayer(score1);
})

buttons[1].addEventListener("click", function() {
    addToPlayer(score2);
})

playingTo.addEventListener("input", function(e) {
    if(parseInt(this.value) <= parseInt(score1.innerText) || 
    parseInt(this.value) <= parseInt(score2.innerText)) {
        playingTo.value = previousPlayingTo;
    } 
    else {
        previousPlayingTo = playingTo.value;
    }
})

buttons[2].addEventListener("click", function() {
    resetGame();
});