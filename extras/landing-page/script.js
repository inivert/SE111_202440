const projects = [
    {
        name: "Calculator",
        description: "A sleek and functional calculator application",
        image: "images/calculator.png",
        link: "../calculator/index.html"
    },
    {
        name: "Gravity Simulator",
        description: "An immersive gravity simulation experience",
        image: "images/gravity.png",
        link: "../gravity/index.html"
    },
    {
        name: "Memory Game",
        description: "Challenge your memory with this addictive game",
        image: "images/memgame.png",
        link: "../memgame/index.html"
    },
    {
        name: "Password Generator",
        description: "Create unbreakable passwords with ease",
        image: "images/passwordgen.png",
        link: "../passgen/index.html"
    },
    {
        name: "Rock Paper Scissors",
        description: "A modern take on the classic game",
        image: "images/rpsgame.png",
        link: "../rpsgame/index.html"
    },
    {
        name: "Spider Web",
        description: "Mesmerizing spider web animation",
        image: "images/spider.png",
        link: "../spider_web/index.html"
    },
    {
        name: "Tic Tac Toe",
        description: "Strategic fun for two players",
        image: "images/tictactoe.png",
        link: "../tictactoe/index.html"
    }
];

function createProjectCard(project, index) {
    return `
        <div class="property-card" data-index="${index}">
            <a href="${project.link}">
                <div class="property-image" style="background-image:url('${project.image}');">
                    <div class="property-image-title">
                        <!-- <h5>${project.name}</h5> -->
                    </div>
                </div>
            </a>
            <div class="property-description">
                <h5>${project.name}</h5>
                <p>${project.description}</p>
            </div>
            <a href="https://github.com/inivert" target="_blank">
                <div class="property-social-icons">
                    <i class="fab fa-github"></i>
                </div>
            </a>
        </div>
    `;
}

function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = projects.map(createProjectCard).join('');
}

function animateBackground() {
    const background = document.querySelector('.background');
    let hue = 0;

    setInterval(() => {
        hue = (hue + 1) % 360;
        background.style.background = `linear-gradient(120deg, hsl(${hue}, 100%, 70%) 0%, hsl(${(hue + 60) % 360}, 100%, 70%) 100%)`;
    }, 100);
}

function animateCards() {
    const cards = document.querySelectorAll('.property-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        observer.observe(card);
    });
}

function handleScroll() {
    const projectsGrid = document.getElementById('projects-grid');
    const lastCard = document.querySelector('.property-card:last-child');
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Center of the viewport
    const lastCardCenter = lastCard.offsetTop + lastCard.offsetHeight / 2;

    if (scrollPosition > lastCardCenter) {
        // Calculate blur amount based on how far we've scrolled past the last card's center
        const blurAmount = Math.min((scrollPosition - lastCardCenter) / 200, 5);
        
        // Apply blur to all cards
        const cards = document.querySelectorAll('.property-card');
        cards.forEach(card => {
            card.style.filter = `blur(${blurAmount}px)`;
        });
    } else {
        // Remove blur when scrolling back up
        const cards = document.querySelectorAll('.property-card');
        cards.forEach(card => {
            card.style.filter = 'blur(0px)';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    animateBackground();
    animateCards();
    window.addEventListener('scroll', handleScroll);
});