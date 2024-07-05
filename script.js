const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Message text properties
const message = "Ella I Love You";
const messageX = canvas.width / 2; // Center text horizontally
const messageY = canvas.height / 2; // Center text vertically

const bubbles = [];
const numBubbles = 100;
const colors = ['#ADD8E6', '#87CEFA', '#4169E1', '#4B0082', '#9370DB']; // Romantic blue and purple colors

for (let i = 0; i < numBubbles; i++) {
    bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 30 + 10, // Increased range for bubble sizes
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

let revealTime = 10 * 1000; // 10 seconds to reveal the message
let cycleTime = 40 * 1000; // 40 seconds for one complete loop
let startTime = Date.now();
let animationStage = 'bubbles'; // Track which animation stage we're in

const hearts = [];
const numHearts = 50;

function drawBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsedTime = (Date.now() - startTime) % cycleTime;

    bubbles.forEach(bubble => {
        // Draw bubbles with gradient effect
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // Center (semi-transparent white)
        gradient.addColorStop(0.7, bubble.color); // Edge (romantic color)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Outer edge (transparent)

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        // Update bubble position
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;

        // Bounce bubbles off the canvas edges
        if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) {
            bubble.dx *= -1;
        }
        if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) {
            bubble.dy *= -1;
        }

        // Optionally change bubble color gradually
        if (Math.random() < 0.02) { // Adjust probability for color change
            bubble.color = colors[Math.floor(Math.random() * colors.length)];
        }
    });

    // Adjust text appearance
    ctx.font = '80px serif'; // Larger text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (elapsedTime < revealTime) {
        ctx.globalCompositeOperation = 'destination-out';

        // Draw text with a glowing effect
        ctx.shadowColor = 'rgba(138, 43, 226, 0.7)'; // Purple glow
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
        ctx.fillText(message, messageX, messageY);

        ctx.globalCompositeOperation = 'source-over';
    } else {
        // Draw the final text with a solid color
        ctx.shadowColor = 'rgba(138, 43, 226, 0.7)'; // Purple glow
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#9370DB'; // Purple text color
        ctx.fillText(message, messageX, messageY);
    }

    // Switch to heart animation after 30 seconds
    if (elapsedTime > 30 * 1000) {
        animationStage = 'heartAnimation';
        startTime = Date.now(); // Reset startTime for the new animation
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    }

    requestAnimationFrame(animationStage === 'bubbles' ? drawBubbles : drawHeartAnimation);
}

function drawHeartAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw falling hearts
    hearts.forEach(heart => {
        ctx.beginPath();
        ctx.arc(heart.x, heart.y, heart.size, 0, Math.PI * 2);
        ctx.fillStyle = heart.color;
        ctx.fill();
        ctx.closePath();

        heart.y += heart.dy;

        if (heart.y > canvas.height) {
            heart.y = -heart.size;
            heart.x = Math.random() * canvas.width;
        }
    });

    // Draw heart with lock and animation
    const heartX = canvas.width / 2;
    const heartY = canvas.height / 2;
    const heartSize = 150;
    const lockSize = 40;

    // Draw heart shape
    ctx.fillStyle = '#8A2BE2'; // Blue-purple heart color
    ctx.beginPath();
    ctx.moveTo(heartX, heartY);
    ctx.bezierCurveTo(heartX - heartSize, heartY - heartSize, heartX - heartSize, heartY + lockSize, heartX, heartY + heartSize);
    ctx.bezierCurveTo(heartX + heartSize, heartY + lockSize, heartX + heartSize, heartY - heartSize, heartX, heartY);
    ctx.fill();
    ctx.closePath();

    // Draw lock
    ctx.fillStyle = '#00BFFF'; // Bright blue lock color
    ctx.beginPath();
    ctx.rect(heartX - lockSize / 2, heartY + heartSize - lockSize, lockSize, lockSize);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#000'; // Lock keyhole
    ctx.beginPath();
    ctx.arc(heartX, heartY + heartSize - lockSize / 2, lockSize / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Draw the text "Ella" when the lock opens
    ctx.font = '60px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF'; // White text color
    ctx.fillText('Ella', heartX, heartY);

    // Draw falling hearts
    if (hearts.length === 0) {
        for (let i = 0; i < numHearts; i++) {
            hearts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 15 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                dy: Math.random() * 2 + 1
            });
        }
    }

    requestAnimationFrame(drawHeartAnimation);
}

drawBubbles();
