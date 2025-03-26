const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

canvas.width = 800;
canvas.height = 600;

// Game state
let player = {
    x: canvas.width/2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 7,
    isMovingLeft: false,
    isMovingRight: false
};

let enemiesShootChance =0.003;
let enemies = [];
const enemyRows = 3;
const enemyColumns = 8;
let enemySpeed = 1;
let enemyDirection = 1;

let bullets = [];
let enemyBullets = [];
let score = 0;
let gameActive = true;

// Initialize enemies
function initEnemies() {
    enemies = [];
    for(let row = 0; row < enemyRows; row++) {
        for(let col = 0; col < enemyColumns; col++) {
            enemies.push({
                x: 100 + col * 70,
                y: 50 + row * 50,
                width: 40,
                height: 30,
                alive: true
            });
        }
    }
}

// Game loop
function gameLoop() {
    if(!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    movePlayer();
    moveEnemies();
    moveBullets();
    moveEnemyBullets();

    // Check collisions
    checkCollisions();
    checkPlayerHit();

    //shoot
    enemyShoot();
    
    // Draw elements
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawEnemyBullets();

    requestAnimationFrame(gameLoop);
}

// Player movement
function movePlayer() {
    if(player.isMovingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if(player.isMovingRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}
//enemy shoot bullets 
function enemyShoot() {
    enemies.forEach(enemy => {
        if(Math.random() < enemiesShootChance && enemy.alive) {
            enemyBullets.push({
                x: enemy.x + enemy.width/2 - 2.5,
                y: enemy.y + enemy.height,
                width: 5,
                height: 15
            });
        }
    }); 
}

// Enemy movement
function moveEnemies() {
    let edgeReached = false;
    enemies.forEach(enemy => {
        if(!enemy.alive) return;
        enemy.x += enemySpeed * enemyDirection;

        if(enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            edgeReached = true;
        }
    });

    if(edgeReached) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
            if(enemy.alive) enemy.y += 20;
        });
    }
}

// Shooting mechanics
function shoot() {
    bullets.push({
        x: player.x + player.width/2 - 2.5,
        y: player.y,
        width: 5,
        height: 15,
        speed: -8
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

// Collision detection
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if(enemy.alive && checkCollision(bullet, enemy)) {
                enemy.alive = false;
                bullets.splice(bulletIndex, 1);
                score += 100;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

// Helper functions
function moveEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.y += 3;
        if(bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}


function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if(bullet.y < 0) {
            bullets.splice(index, 1);
        }
    }); 
}

function checkPlayerHit() {
    enemyBullets.forEach((bullet, index) => {
        if(checkCollision(bullet, player)) {
            gameActive = false;
            gameOverElement.style.display = 'block';
            enemyBullets.splice(index, 1);
        }
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

function drawPlayer() {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    ctx.fillStyle = '#ffff00';
    enemies.forEach(enemy => {
        if(enemy.alive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

function drawBullets() {
    ctx.fillStyle = '#ffffff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

function drawEnemyBullets() {
    ctx.fillStyle = '#ff0000';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Check win condition
    const aliveEnemies = enemies.filter(enemy => enemy.alive).length;
    if (aliveEnemies === 0) {
        gameActive = false;
        gameOverElement.textContent = 'VICTORY! Press Enter to restart';
        gameOverElement.style.display = 'block';
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Input handling
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') player.isMovingLeft = true;
    if(e.key === 'ArrowRight') player.isMovingRight = true;
        if(e.key === ' ' && gameActive) shoot();
    if(e.key === 'Enter') {
            if(!gameActive) {
                restartGame();
            } else {
                shoot();
            }
        }
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowLeft') player.isMovingLeft = false;
    if(e.key === 'ArrowRight') player.isMovingRight = false;
});


function restartGame() {
    gameActive = true;
    gameOverElement.style.display = 'none';
    gameOverElement.textContent = 'GAME OVER'; // Reset text for next game
    player.x = canvas.width/2 - 25;
    player.y = canvas.height - 50;
    bullets = [];
    enemyBullets = [];
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    initEnemies();
    gameLoop();
}


// Start game
initEnemies();
gameLoop();


