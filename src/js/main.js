const config = {
    width: 5,
    height: 5,
    loopingDelay: 100,
    colorValues: ['red', 'orange', 'green'],
    gameTime: 20,
    maxNumberOfLives: 3,
    lives: 3
}

class Tick {
    last = new Date();
    deltaTime = 0;

    constructor() {
        setInterval(this.update.bind(this), config.loopingDelay);
    }

    update() {
        const now = new Date();
        this.deltaTime = (now - this.last) / 1000;
        this.last = now;
    }
}

class Game {
    restart = null;
    game = null;
    cells = [];
    currentTime = 0;
    static points = 0;

    static time = null;

    constructor() {
        this.initGame();
    }

    initGame() {
        if (document.body) {
            this.instantiate();
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                console.log("Test");
                this.instantiate();
            })
        }

        setInterval(this.update.bind(this), config.loopingDelay);
    }

    clearGame() {
        this.game.innerHTML = "";
        this.restart = document.getElementById("restart")
        let buttonToRestart = document.createElement("button");
        buttonToRestart.addEventListener("click", this.instantiate)
        buttonToRestart.innerHTML = "restart";
        let finalPoints = document.createElement("h3")
        finalPoints.innerHTML = "Your final points = " + Game.points.toString();
        this.restart.appendChild(buttonToRestart);
        this.restart.appendChild(finalPoints);
        // temporary hack
        config.lives = 1;
    }

    instantiate() {
        config.lives = config.maxNumberOfLives;
        this.game = document.getElementById("game");
        this.restart = document.getElementById("restart")
        this.restart.innerHTML = "";

        for (let i = 0; i < config.height; i++) {
            const row = document.createElement("div");
            this.game.appendChild(row);
            for (let j = 0; j < config.width; j++) {
                this.cells.push(new Cell(row));
            }
        }

        Game.time = new Tick();
    }

    update() {
        this.currentTime += Game.time.deltaTime;
        this.cells.forEach(c => c.update());
        this.stopGameWhenLostLost();
    }
    stopGameWhenLostLost() {
        if (config.lives <= 0) {
            this.clearGame();
        }
    }
}

class Cell {
    parentNode = null;
    minTime = 3;
    maxTime = 5;
    actualTime = 0;

    constructor(parentNode) {
        this.parentNode = parentNode;
        this.dom = document.createElement("span");
        this.dom.className = 'cell'
        this.dom.id = this.getColor();
        this.parentNode.appendChild(this.dom);

        this.dom.addEventListener("click", this.click.bind(this));
    }

    click() {
        if (this.dom.id === 'green') {
            Game.points++;
            this.dom.id = this.getColor();
        } else if (this.dom.id === 'red') {
            config.lives--;
            this.dom.id = this.getColor();
        }
        console.log(Game.points);
    }

    getColor() {
        return config.colorValues[Math.floor(Math.random() * config.colorValues.length)];
    }

    update() {
        this.actualTime += Game.time.deltaTime;
        if (this.actualTime > this.maxTime) {
            this.dom.id = this.getColor();
            this.actualTime = 0;
        }
    }
}

new Game();