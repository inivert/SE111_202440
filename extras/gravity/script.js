// This sets up the basics for our cool particle simulation.
const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

// This makes the canvas fill the whole screen.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// These are some important settings for our simulation.
const BACKGROUND_COLOR = 'rgba(20, 20, 40, 1)'; // This sets a dark blue-purple color for the background
let PARTICLE_COUNT = 750; // This is our default particle count
let TARGET_PARTICLE_COUNT = 750;
const MAX_PARTICLE_COUNT = 850; // Maximum allowed particle count
const TRAIL_LENGTH = 5; // This shortens the trail to reduce lag
const MAX_VELOCITY = 2; // This slows down the particles a bit
const PARTICLES_PER_FRAME = 10; // This adds fewer particles per frame
const GRAVITY_UPDATE_INTERVAL = 2; // This updates gravity less frequently to save processing power

// These arrays will hold our particles and gravity points
let particles = [];
let gravityPoints = [];
let particleCountSlider;

// This variable will let us turn animations on and off
let animationsEnabled = true;

// Here's a message from Carlos (inivert)!
console.log("Hey everyone! Carlos (inivert) here. Hope you enjoy this particle simulation. Remember, coding is all about experimenting and having fun!");

// This project was inspired by https://codepen.io/akm2/pen/AGgarW

// Invisible boundaries
const BOUNDARY_PADDING = 50;
const leftBoundary = -BOUNDARY_PADDING;
const rightBoundary = canvas.width + BOUNDARY_PADDING;
const topBoundary = -BOUNDARY_PADDING;
const bottomBoundary = canvas.height + BOUNDARY_PADDING;

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype = {
    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },
    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },
    mult: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },
    div: function(s) {
        this.x /= s;
        this.y /= s;
        return this;
    },
    mag: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function() {
        let m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }
};

function Particle(x, y) {
    this.pos = new Vector(x, y);
    this.originalPos = new Vector(x, y);
    this.vel = new Vector(
        (Math.random() - 0.5) * 0.5,  // Random x velocity between -0.25 and 0.25
        (Math.random() - 0.5) * 0.5   // Random y velocity between -0.25 and 0.25
    );
    this.radius = Math.random() * 2 + 1;
    this.color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.random() * 0.5 + 0.5})`;
    this.isStatic = false;
    this.trail = [];
    this.isResetting = false;
}

Particle.prototype.draw = function(ctx) {
    // Draw trail
    ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5; // Slightly reduced line width for the trail
    ctx.stroke();

    // Draw particle
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius * 1.2, 0, Math.PI * 2); // Slightly smaller particle size (20% increase instead of 50%)
    ctx.fillStyle = this.color;
    ctx.fill();
};

Particle.prototype.update = function() {
    if (this.isResetting) {
        const dx = this.originalPos.x - this.pos.x;
        const dy = this.originalPos.y - this.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
            this.vel.set(dx * 0.1, dy * 0.1);
            this.pos.add(this.vel);
        } else {
            this.pos.set(this.originalPos.x, this.originalPos.y);
            this.vel.set(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            this.isResetting = false;
        }
    } else {
        this.pos.add(this.vel);
        this.vel.mult(0.99); // Reduced friction to maintain slight movement

        // Add a tiny random acceleration
        this.vel.add(new Vector((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02));

        // Limit velocity
        if (this.vel.mag() > MAX_VELOCITY) {
            this.vel.normalize().mult(MAX_VELOCITY);
        }

        // Ensure minimum velocity
        const minVelocity = 0.1;
        if (this.vel.mag() < minVelocity) {
            this.vel.normalize().mult(minVelocity);
        }
    }

    // Update trail
    this.trail.unshift({ x: this.pos.x, y: this.pos.y });
    if (this.trail.length > TRAIL_LENGTH) {
        this.trail.pop();
    }

    // Boundary check with smooth transition
    if (this.pos.x < leftBoundary) {
        this.pos.x = rightBoundary;
        this.trail = []; // Clear trail when wrapping
    }
    if (this.pos.x > rightBoundary) {
        this.pos.x = leftBoundary;
        this.trail = []; // Clear trail when wrapping
    }
    if (this.pos.y < topBoundary) {
        this.pos.y = bottomBoundary;
        this.trail = []; // Clear trail when wrapping
    }
    if (this.pos.y > bottomBoundary) {
        this.pos.y = topBoundary;
        this.trail = []; // Clear trail when wrapping
    }
};

function GravityPoint(x, y, radius) {
    this.pos = new Vector(x, y);
    this.radius = radius;
    this.currentRadius = radius * 0.5;
    this.mass = radius * 10;
    this.creationTime = Date.now();
    this.lifespan = 7000; // 7 seconds in milliseconds
    this.isExploding = false;
    this.explosionDuration = 500; // 0.5 seconds
    this.explosionStartTime = 0;
}

GravityPoint.explosionForce = 2; // Static property for consistent explosion force

GravityPoint.prototype.draw = function(ctx) {
    const remainingTime = this.lifespan - (Date.now() - this.creationTime);
    let alpha = Math.max(remainingTime / this.lifespan, 0);

    if (this.isExploding) {
        const explosionProgress = (Date.now() - this.explosionStartTime) / this.explosionDuration;
        this.currentRadius = this.radius * (1 + explosionProgress * 2);
        alpha = 1 - explosionProgress;
    }

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
    ctx.stroke();
};

GravityPoint.prototype.isExpired = function() {
    if (this.isExploding) {
        return Date.now() - this.explosionStartTime > this.explosionDuration;
    }
    return Date.now() - this.creationTime > this.lifespan;
};

GravityPoint.prototype.explode = function() {
    this.isExploding = true;
    this.explosionStartTime = Date.now();
};

// Functions related to planets and sun have been removed

function initializeParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
    }
}

function animate() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    gravityPoints = gravityPoints.filter(gp => !gp.isExpired());
    gravityPoints.forEach(gp => gp.draw(ctx));
    
    // Gradually change particle count
    if (particles.length < TARGET_PARTICLE_COUNT) {
        for (let i = 0; i < Math.min(PARTICLES_PER_FRAME, TARGET_PARTICLE_COUNT - particles.length); i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    } else if (particles.length > TARGET_PARTICLE_COUNT) {
        particles.splice(TARGET_PARTICLE_COUNT, Math.min(PARTICLES_PER_FRAME, particles.length - TARGET_PARTICLE_COUNT));
    }
    
    particles.forEach(particle => {
        particle.draw(ctx);
        particle.update();
    });
    updateParticles();
    requestAnimationFrame(animate);
}

function updateParticles() {
    const now = Date.now();
    particles.forEach(particle => {
        if (!particle.isStatic) {
            gravityPoints.forEach(gp => {
                let dx = gp.pos.x - particle.pos.x;
                let dy = gp.pos.y - particle.pos.y;
                let distSq = dx * dx + dy * dy;
                if (distSq > (gp.currentRadius + particle.radius) ** 2) {
                    let force;
                    if (gp.isExploding) {
                        // Push effect during explosion
                        let explosionProgress = (now - gp.explosionStartTime) / gp.explosionDuration;
                        force = GravityPoint.explosionForce * (1 - explosionProgress) / distSq;
                        particle.vel.sub(new Vector(dx * force, dy * force));
                    } else {
                        // Normal gravity pull
                        force = (gp.mass / distSq) * 0.1;
                        particle.vel.add(new Vector(dx * force, dy * force));
                    }
                }
            });
        }
    });

    // Check for gravity points that need to start exploding
    gravityPoints.forEach(gp => {
        if (!gp.isExploding && now - gp.creationTime > gp.lifespan) {
            gp.explode();
        }
    });
}

canvas.addEventListener('click', (event) => {
    let newGravityPoint = new GravityPoint(event.clientX, event.clientY, 10);
    gravityPoints.push(newGravityPoint);
    particles.forEach(particle => {
        particle.isStatic = false;
        particle.isResetting = false;
    });
});

resetButton.addEventListener('click', () => {
    gravityPoints = [];
    TARGET_PARTICLE_COUNT = PARTICLE_COUNT;
    particleCountSlider.value = PARTICLE_COUNT;
    particleCountValue.textContent = PARTICLE_COUNT;
    
    particles.forEach(particle => {
        particle.isResetting = true;
        particle.trail = [];
    });
});

particleCountSlider = document.getElementById('particleCountSlider');
const particleCountValue = document.getElementById('particleCountValue');

particleCountSlider.addEventListener('input', () => {
    TARGET_PARTICLE_COUNT = parseInt(particleCountSlider.value);
    PARTICLE_COUNT = TARGET_PARTICLE_COUNT;
    particleCountValue.textContent = TARGET_PARTICLE_COUNT;
});

initializeParticles();
animate();

// Update particle count display on load
particleCountValue.textContent = PARTICLE_COUNT;

// Optimize performance by using requestAnimationFrame
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// This is the main animation function. It runs many times per second to update and draw everything.
function animateOptimized(currentTime) {
    // This asks the browser to call this function again for the next frame
    requestAnimationFrame(animateOptimized);

    // This checks if it's time for a new frame based on our target FPS
    const deltaTime = currentTime - lastTime;
    if (deltaTime < frameInterval) return;

    lastTime = currentTime - (deltaTime % frameInterval);

    // This clears the canvas with our background color
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // This removes any expired gravity points
    gravityPoints = gravityPoints.filter(gp => !gp.isExpired());
    
    // This draws all the gravity points
    gravityPoints.forEach(gp => gp.draw(ctx));
    
    // This adjusts the number of particles gradually
    if (particles.length < TARGET_PARTICLE_COUNT) {
        for (let i = 0; i < Math.min(PARTICLES_PER_FRAME, TARGET_PARTICLE_COUNT - particles.length); i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    } else if (particles.length > TARGET_PARTICLE_COUNT) {
        particles.splice(TARGET_PARTICLE_COUNT, Math.min(PARTICLES_PER_FRAME, particles.length - TARGET_PARTICLE_COUNT));
    }
    
    // This draws and updates all the particles
    particles.forEach(particle => {
        particle.draw(ctx);
        if (animationsEnabled) {
            particle.update();
        }
    });

    // This updates particle positions based on gravity, but only if animations are enabled
    if (animationsEnabled) {
        updateParticles();
    }
}

// This starts the animation loop
animateOptimized();

// This adds a keyboard shortcut to toggle animations
document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'A') {
        animationsEnabled = !animationsEnabled;
        console.log(animationsEnabled ? "Animations enabled" : "Animations disabled");
    }
});
