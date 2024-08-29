// This gets the canvas element from the HTML file
const canvas = document.getElementById('spiderWebCanvas');
const ctx = canvas.getContext('2d');

// This sets the canvas size to match the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// This creates an array to store all the dots
const dots = [];
const numDots = 200;
const dotRadius = 2;
const spiderRadius = 15;

// These variables help track the mouse position
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let moveX = 0;
let moveY = 0;

// This array stores all the water drops when clicked
const waterDrops = [];

// This creates 200 dots and gives them random positions
for (let i = 0; i < numDots; i++) {
    dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: 0,
        baseY: 0
    });
}

// This function saves the original position of each dot
function setBaseDotPositions() {
    dots.forEach(dot => {
        dot.baseX = dot.x;
        dot.baseY = dot.y;
    });
}

// This calls the function to set the initial positions
setBaseDotPositions();

// This function draws all the dots on the canvas
function drawDots() {
    ctx.fillStyle = '#00FFFF'; // This uses cyan color for the dots
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// This function draws the spider (it's just a circle for now)
function drawSpider() {
    ctx.fillStyle = '#FffF1F'; // This makes the spider white
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, spiderRadius, 0, Math.PI * 2);
    ctx.fill();

    // This draws the spider's legs
    ctx.strokeStyle = '#FffF1F';
    ctx.lineWidth = 2;
    dots.forEach(dot => {
        const distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
        if (distance < 150) { // This only draws legs to nearby dots
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            
            // This calculates a point to make the leg curved
            const midX = (mouseX + dot.x) / 2;
            const midY = (mouseY + dot.y) / 2;
            
            // This part makes the legs curve based on how fast the spider is moving
            const moveMagnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            const maxScale = 30;
            const minScale = 5;
            const scale = Math.max(minScale, Math.min(maxScale, moveMagnitude * 2));
            const normalizedMoveX = moveMagnitude > 0 ? (moveX / moveMagnitude) * scale : 0;
            const normalizedMoveY = moveMagnitude > 0 ? (moveY / moveMagnitude) * scale : 0;
            
            // This uses these points to create a curved leg
            const controlX = midX + normalizedMoveY;
            const controlY = midY - normalizedMoveX;
            
            // This draws the curved leg
            ctx.quadraticCurveTo(controlX, controlY, dot.x, dot.y);
            ctx.stroke();
        }
    });
}

// This function draws all the water drops
function drawWaterDrops() {
    waterDrops.forEach((drop, index) => {
        const numRipples = 3; // This draws 3 circles for each drop
        for (let i = 0; i < numRipples; i++) {
            const radius = drop.radius * (i + 1) / numRipples;
            const opacity = drop.opacity * (1 - i / numRipples);
            
            ctx.beginPath();
            ctx.arc(drop.x, drop.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`; // This uses cyan color again
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // This makes the drop grow and fade out over time
        drop.radius += 1;
        drop.opacity -= 0.005;
        
        // This removes the drop if it has faded out completely
        if (drop.opacity <= 0) {
            waterDrops.splice(index, 1);
        }
    });
}

// This function moves the dots when there are water drops nearby
function updateDots() {
    dots.forEach(dot => {
        let dx = 0;
        let dy = 0;
        
        waterDrops.forEach(drop => {
            const distX = dot.baseX - drop.x;
            const distY = dot.baseY - drop.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                // This calculates how much to move the dot
                const force = (1 - distance / maxDistance) * 5;
                dx += (distX / distance) * force;
                dy += (distY / distance) * force;
            }
        });
        
        // This updates the dot's position
        dot.x = dot.baseX + dx;
        dot.y = dot.baseY + dy;
    });
}

// This is the main animation loop
function animate() {
    // This clears the canvas to redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // This makes the spider move smoothly towards the mouse
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
    
    // This updates how fast the spider is moving
    moveX = targetX - mouseX;
    moveY = targetY - mouseY;
    
    // This calls all the drawing functions
    updateDots();
    drawDots();
    drawSpider();
    drawWaterDrops();

    // This asks the browser to call this function again for the next frame
    requestAnimationFrame(animate);
}

// This listens for mouse movement and updates the target position
canvas.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// This listens for clicks and creates new water drops
canvas.addEventListener('click', (e) => {
    waterDrops.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        opacity: 1
    });
});

// This makes sure the canvas stays full screen if the window size changes
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setBaseDotPositions();
});

// This starts the animation
animate();