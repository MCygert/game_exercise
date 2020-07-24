const config = {
    width: 5,
    height: 5,
    loopingDelay: 100,
    colorValues: ['red', 'orange', 'green']
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
    game = null;
    cells = [];
    currentTime = 0;
    points = 0;

    static time = null;

    constructor() {
        this.initGame();
    }

    initGame() {
        if (document.body) {
            this.instatiate();
        } else {
            document.addEventListener("DOMContentLoaded", () => {
                console.log("Test");
                this.instatiate();
            })
        }

        setInterval(this.update.bind(this), config.loopingDelay);
    }

    instatiate() {
        this.game = document.getElementById("game");

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
    }
}

class Cell {
    parentNode = null;
    color = this.getColor();
    minTime = 3;
    maxTime = 5;
    actualTime = 0;

    constructor(parentNode) {
        this.parentNode = parentNode;
        this.dom = document.createElement("span");
        this.dom.className = 'cell'
        this.dom.id = this.color;
        this.parentNode.appendChild(this.dom);

        this.dom.addEventListener("click", this.click.bind(this));
    }

    click() {
        console.log(Game.time.deltaTime);
        console.log(this.color);
        console.log(this.actualTime);
    }
    getColor () {
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