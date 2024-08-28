const player = document.createElement("img");
const coin = document.createElement("img");

const hearts = document.querySelector(".hearts");
const score = document.querySelector(".score");
const gameboard = document.getElementById("gameboard");
const start = document.getElementById("start");
const rules = document.getElementById("rules");
const section = document.querySelector("section");
const rulesText = document.getElementById("rulesText");

let intervalOfMonsters;
let container = document.createElement("div");

container.style.display = "none";
let gameOver, startAgain, back, buttons, endParagraph, currentLife;

gameOver = document.createElement("h1");
gameOver.innerText = `You lost!`;
startAgain = document.createElement("button");
startAgain.innerText = "Play again";
back = document.createElement("button");
back.innerText = "Back to main menu";
buttons = document.createElement("div");
buttons.append(startAgain, back);
endParagraph = document.createElement("h3");

container.classList.add("container")
back.id = "backToMainMenu";
startAgain.id = "startAgain";

container.append(gameOver, endParagraph, buttons);

const coinSound = new Audio("/assets/coin.mp3");
const hurt = new Audio("/assets/hurt.mp3");


let isRunning = false;
let lives = 3;

player.src = "/assets/player.png"
coin.src = "/assets/coin.gif"

player.classList.add("player");
coin.classList.add("coin");

gameboard.style.height = `${window.screen.height}px`;
gameboard.style.width = `${window.screen.width}px`;

const spawnMonster = function() {
    let monster = document.createElement("img");
    monster.src = "/assets/monster.png";
    monster.classList.add("monster");

    let {x, y} = generateRandomPosition();

    monster.style.top = y;
    monster.style.left = x;

    gameboard.append(monster);
}

const endGame = function() {
    player.style.display = "none";
    coin.style.display = "none";

    container.style.display = "";
    endParagraph.innerText = `Score achieved: ${score.innerText}`;

    gameboard.append(container);
}

const directMonsters = function() {
    let monsters = document.querySelectorAll(".monster");

    intervalOfMonsters = setInterval(function() {
        for(let monster of monsters)
        {
            if (monster.x < player.x) {
                monster.style.left = `${parseFloat(monster.style.left) + 1}%`
            }
            else if (monster.x > player.x) {
                monster.style.left = `${parseFloat(monster.style.left) - 1}%`
            }
            if (monster.y > player.y) {
                monster.style.top = `${parseFloat(monster.style.top) - 1}%`
            }
            else if (monster.y < player.y) {
                monster.style.top = `${parseFloat(monster.style.top) + 1}%`
            }
            if (monsterReachedPlayer(monster)) {
                console.log("monster reached")
                lives--;
                score.innerText--;
                hurt.play();
                isRunning = false;
                if (lives === 0) {
                    console.log("DEAD FOREVER")
                    currentLife = document.querySelector(`.hearts img`);
                    currentLife.src = "/assets/empty_heart.png"; 
                    clearInterval(intervalOfMonsters);
                    for(let monster of monsters) {
                        monster.remove();
                    }
                    endGame();
                }
                else if (lives > 0){
                    currentLife = document.querySelector(`.hearts img:nth-of-type(${lives + 1})`);
                    currentLife.src = "/assets/empty_heart.png"; 
                    player.style.opacity = "0";
                    coin.style.opacity = "0";    
                    showScore();
                }
            }
        }
    }, 500)

    
}
 
const generateRandomPosition = function() {
    let x = Math.random() * 97;
    let y = Math.random() * 97;
    
    return {'x':`${x}%`,'y':`${y}%`};
}

const startGame = function() {
    let {x: xCoin, y: yCoin} = generateRandomPosition();
    let {x: xPlayer, y: yPlayer} = generateRandomPosition();

    coin.style.top = yCoin;
    coin.style.left = xCoin;

    player.style.top = yPlayer;
    player.style.left = xPlayer;

    setTimeout(() => {
        section.style.display = "none";    
        rulesText.style.display = "none";
        
        isRunning = true;
        hearts.style.opacity = "1";
        player.style.opacity = "1";
        coin.style.opacity = "1";    
        spawnMonster();

        gameboard.append(player,coin);
        directMonsters();
    },100);

}

const playerAchievedCoin = function() {
    return player.x <= coin.x + 45 && player.x >= coin.x - 45
     && player.y >= coin.y - 45 && player.y <= coin.y + 45;
}

const monsterReachedPlayer = function(monster) {
    return player.x <= monster.x + 45 && player.x >= monster.x - 45
     && player.y >= monster.y - 45 && player.y <= monster.y + 45;
}
    

const showScore = function() {
    score.style.display = "block";
    clearInterval(intervalOfMonsters);

    setTimeout(() => {
        score.style.display = "none";

        startGame();
    }, 1000)
}

start.addEventListener("click", function(e) {
    section.classList.add("move");
    
    startGame(score);
}) 

window.addEventListener('keydown', function(e) {
    console.log(e.key)
    if (isRunning) {
        switch (e.key) {
            case ("ArrowUp" || "w" || "W"):
                if(parseFloat(player.style.top) > 0) {
                    player.style.top = `${parseFloat(player.style.top) - 1}%`
                }
                break;
            case "ArrowDown" || "s" || "S":
                if(parseFloat(player.style.top) < 100) {
                    player.style.top = `${parseFloat(player.style.top) + 1}%`
                }
                break;
            case "ArrowLeft" || "a" || "A":
                if(parseFloat(player.style.left) > 0) {
                    player.style.left = `${parseFloat(player.style.left) - 1}%`
                }
                player.classList.add("turn-left");
                break;
            case "ArrowRight" || "d" || "D":
                if(parseFloat(player.style.left) < 100) {
                    player.style.left = `${parseFloat(player.style.left) + 1}%`
                }
                player.classList.remove("turn-left");
                break;
        }

        if (playerAchievedCoin()) {
            isRunning = false;
            score.innerText++;
            player.style.opacity = "0";
            coin.style.opacity = "0";
            coinSound.play();
            showScore();
        }    
    }

   
})

rules.addEventListener("click", function() {
    if (rulesText.style.opacity == "0" || rulesText.style.opacity == "") {
        rulesText.style.opacity = 1;
        start.setAttribute("disabled", true);
    }
    else {
        rulesText.style.opacity = 0;
        start.removeAttribute("disabled");
    }
});

container.addEventListener("click", (e) => {
    console.log(e.target.id);
    if (e.target.id == "backToMainMenu") {
        document.location.reload();
    } else {
        lives = 3;
        container.style.display = "none";
        player.style.display = "";
        coin.style.display = "";

        score.innerText = "0";

        gameboard.removeChild(container);

        let restartHearts = document.querySelectorAll(`.hearts img`);
        for(let heart of restartHearts) {
            heart.src = "/assets/heart.png"
        }
        startGame();

        
    }
})


// back.addEventListener('click', () => {
//     document.location.reload();
// })

// startAgain.addEventListener('click', () => {
//     document.location.reload();
    
//     start.click();
// });    
