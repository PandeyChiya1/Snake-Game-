const board = document.querySelector('.board');
const blockSize = 50;

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

const blocks = [];
let snake = [{ x: 5, y: 5 }];
let direction = "right";
let score = 0;

// Load saved high score
let highScore = localStorage.getItem("snakeHighScore")
    ? Number(localStorage.getItem("snakeHighScore"))
    : 0;

document.getElementById("high-score").innerText = highScore;

let intervalId;
let food;
let time = 0;
let timeInterval;

// Build grid
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${r},${c}`] = block;
    }
}

function drawSnake() {
    snake.forEach(seg => {
        blocks[`${seg.x},${seg.y}`].classList.add("fill");
    });
}

function clearSnake() {
    snake.forEach(seg => {
        blocks[`${seg.x},${seg.y}`].classList.remove("fill");
    });
}

function generateFood() {
    if (food) {
        blocks[`${food.x},${food.y}`].classList.remove("food");
    }

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    blocks[`${food.x},${food.y}`].classList.add("food");
}

function startTimer() {
    time = 0;

    clearInterval(timeInterval);

    timeInterval = setInterval(() => {
        time++;
        let mins = String(Math.floor(time / 60)).padStart(2, "0");
        let secs = String(time % 60).padStart(2, "0");

        document.getElementById("time").innerText = `${mins}-${secs}`;
    }, 1000);
}

// Start Game
document.getElementById("start-btn").addEventListener("click", () => {
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    score = 0;

    document.getElementById("score").innerText = score;

    clearSnake();
    drawSnake();

    generateFood();
    startTimer();

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(gameLoop, 200);
});

function gameLoop() {
    let head = { ...snake[0] };

    if (direction === "left") head.y--;
    else if (direction === "right") head.y++;
    else if (direction === "up") head.x--;
    else if (direction === "down") head.x++;

    // Game Over check
    if (
        head.x < 0 || head.x >= rows ||
        head.y < 0 || head.y >= cols ||
        snake.some(s => s.x === head.x && s.y === head.y)
    ) {
        clearInterval(intervalId);
        clearInterval(timeInterval);
        alert("Game Over!");
        return;
    }

    // Food eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;

        // HIGH SCORE UPDATE 🔥
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            document.getElementById("high-score").innerText = highScore;
        }

        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    clearSnake();
    drawSnake();
}

// Controls
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});
