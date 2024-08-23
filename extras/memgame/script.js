// Hi! I'm Carlos, and this is my Emoji Memory Challenge game.

// First, let's grab all the elements we need from our HTML
const gameGrid = document.getElementById('game-grid');
const startButton = document.getElementById('start-button');
const timerElement = document.getElementById('time');
const mistakeCountElement = document.getElementById('mistake-count');
const currentLevelElement = document.getElementById('current-level');
const gameInfo = document.getElementById('game-info');
const startScreen = document.getElementById('start-screen');
const messageArea = document.getElementById('message-area');

// Here's our list of emojis we'll use in the game
const emojis = ['😀', '😎', '🥳', '🤔', '😴', '🤯', '🥶', '🤠', '👽', '🤖', '👻', '🎃', '🦄', '🐶', '🐱', '🐼'];

// These variables will help us keep track of the game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let lives = 5;
let timer;
let timeLeft;
let currentLevel = 1;
let gameStarted = false;

// When the start button is clicked, we'll begin the game
startButton.addEventListener('click', startGame);

// This function sets up everything for a new game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    lives = 5;
    matchedPairs = 0;
    updateLivesCount();
    shuffleCards();
    renderCards();
    startButton.disabled = true;
    startButton.textContent = 'Start Game';
    startScreen.style.display = 'none';
    document.getElementById('game-content').style.display = 'flex';
    messageArea.textContent = '';
    document.documentElement.style.setProperty('--current-level', currentLevel);
    showAllCards();
}

// This function mixes up our cards
function shuffleCards() {
    const levelEmojis = emojis.slice(0, 4 + currentLevel);
    cards = [...levelEmojis, ...levelEmojis].sort(() => Math.random() - 0.5);
}

// This function creates our card elements on the page
function renderCards() {
    gameGrid.innerHTML = '';
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Card ' + (index + 1));
        card.addEventListener('click', () => flipCard(card, emoji));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                flipCard(card, emoji);
            }
        });
        gameGrid.appendChild(card);
    });
}

// This function shows all cards briefly at the start of each level
function showAllCards() {
    const viewTime = 5 + (currentLevel - 1) * 3;
    flipAllCards(true);
    startTimer(viewTime, () => {
        flipAllCards(false);
        startTimer(30, endGame);
    });
}

// This function handles what happens when a card is clicked
function flipCard(card, emoji) {
    if (!gameStarted || card.classList.contains('flipped') || flippedCards.length === 2) return;

    card.textContent = emoji;
    card.classList.add('flipped');
    card.setAttribute('aria-label', 'Card ' + (parseInt(card.dataset.index) + 1) + ' flipped, showing ' + emoji);
    flippedCards.push(card);

    // Add a flip animation
    card.style.animation = 'flip 0.3s ease-out';

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// This function checks if the two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.textContent === card2.textContent) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === cards.length / 2) {
            levelUp();
        }
    } else {
        card1.textContent = '';
        card2.textContent = '';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        lives--;
        updateLivesCount();
        if (lives === 0) {
            endGame();
        }
    }
    flippedCards = [];
}

// This function flips all cards face up or face down
function flipAllCards(show) {
    document.querySelectorAll('.card').forEach((card, index) => {
        if (show) {
            card.textContent = cards[index];
            card.classList.add('flipped');
        } else {
            card.textContent = '';
            card.classList.remove('flipped');
        }
        // Add a flip animation
        card.style.animation = 'flip 0.3s ease-out';
    });
}

// This function starts our timer
function startTimer(seconds, callback) {
    timeLeft = seconds;
    updateTimer();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(timer);
            callback();
        }
    }, 1000);
}

// This function updates the timer display
function updateTimer() {
    timerElement.textContent = timeLeft;
}

// This function updates the lives count display
function updateLivesCount() {
    mistakeCountElement.textContent = lives;
}

// This function handles moving to the next level
function levelUp() {
    clearInterval(timer);
    gameStarted = false;
    currentLevel++;
    currentLevelElement.textContent = currentLevel;
    document.documentElement.style.setProperty('--current-level', currentLevel);
    showLevelCompleteMessage();
}

// This function shows the level complete message and next level button
function showLevelCompleteMessage() {
    clearInterval(timer);
    gameStarted = false;
    flipAllCards(true);
    startButton.disabled = false;
    
    // Create a new div for the congratulations message
    const congratsDiv = document.createElement('div');
    congratsDiv.id = 'congrats-message';
    congratsDiv.style.position = 'fixed';
    congratsDiv.style.top = '50%';
    congratsDiv.style.left = '50%';
    congratsDiv.style.transform = 'translate(-50%, -50%)';
    congratsDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    congratsDiv.style.padding = '20px';
    congratsDiv.style.borderRadius = '10px';
    congratsDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    congratsDiv.style.zIndex = '1000';
    congratsDiv.style.textAlign = 'center';

    // Update and display the message
    congratsDiv.innerHTML = `
        <h2>Congratulations!</h2>
        <p>You've completed level ${currentLevel - 1}!</p>
        <button id="next-level-button">Next Level</button>
    `;
    
    document.body.appendChild(congratsDiv);

    // Add event listener to the Next Level button
    document.getElementById('next-level-button').addEventListener('click', () => {
        document.body.removeChild(congratsDiv);
        startGame();
    });

    startButton.textContent = 'Next Level';
    
    // Add a celebratory animation
    congratsDiv.style.animation = 'celebrate 0.5s ease-in-out';
}

// This function ends the game (game over)
function endGame() {
    clearInterval(timer);
    gameStarted = false;
    flipAllCards(true);
    startButton.disabled = false;
    startScreen.style.display = 'flex';
    startScreen.style.justifyContent = 'center';
    startScreen.style.alignItems = 'center';
    document.getElementById('game-content').style.display = 'none';
    messageArea.textContent = `Game Over! You reached level ${currentLevel}. Click 'Start Game' to play again.`;
    startButton.textContent = 'Start Game';
    currentLevel = 1;
    currentLevelElement.textContent = currentLevel;
    // Add a celebratory animation
    messageArea.style.animation = 'celebrate 0.5s ease-in-out';
}
