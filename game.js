document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    const ROWS = 6;
    const COLS = 10;
    const BUBBLE_RADIUS = 20;
    const SHOOTER_Y = canvas.height - 50;

    const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF33A1", "#A133FF", "#FF8C33"];
    
    let bubbles = [];
    let shooterBubble = createBubble(canvas.width / 2, SHOOTER_Y, getRandomColor());
    let nextBubbleColor = getRandomColor();
    let score = 0;

    const shootSound = document.getElementById("shootSound");
    const popSound = document.getElementById("popSound");

    function getRandomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    function createBubble(x, y, color) {
        return { x, y, color };
    }

    function initializeBubbles() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                let x = col * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS;
                let y = row * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS;
                bubbles.push(createBubble(x, y, getRandomColor()));
            }
        }
    }

    function drawBubbles() {
        bubbles.forEach(bubble => {
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = bubble.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    function drawShooter() {
        ctx.beginPath();
        ctx.arc(shooterBubble.x, shooterBubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = shooterBubble.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawNextBubble() {
        ctx.beginPath();
        ctx.arc(canvas.width - 50, canvas.height - 50, BUBBLE_RADIUS / 1.5, 0, Math.PI * 2);
        ctx.fillStyle = nextBubbleColor;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 20, 30);
    }

    function checkCollision() {
        let popped = false;
        bubbles = bubbles.filter(bubble => {
            let dx = bubble.x - shooterBubble.x;
            let dy = bubble.y - shooterBubble.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < BUBBLE_RADIUS * 2 && bubble.color === shooterBubble.color) {
                score += 10;
                popSound.play();
                popped = true;
                return false;
            }
            return true;
        });

        return popped;
    }

    function shootBubble(targetX, targetY) {
        let dx = targetX - shooterBubble.x;
        let dy = targetY - shooterBubble.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let speed = 5;
        let velocityX = (dx / distance) * speed;
        let velocityY = (dy / distance) * speed;

        let interval = setInterval(() => {
            shooterBubble.x += velocityX;
            shooterBubble.y += velocityY;

            if (shooterBubble.y <= BUBBLE_RADIUS || checkCollision()) {
                clearInterval(interval);
                shooterBubble = createBubble(canvas.width / 2, SHOOTER_Y, nextBubbleColor);
                nextBubbleColor = getRandomColor();
            }

            render();
        }, 20);

        shootSound.play();
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBubbles();
        drawShooter();
        drawNextBubble();
        drawScore();
    }

    canvas.addEventListener("click", (event) => {
        let rect = canvas.getBoundingClientRect();
        let targetX = event.clientX - rect.left;
        let targetY = event.clientY - rect.top;
        shootBubble(targetX, targetY);
    });

    initializeBubbles();
    render();
});
