// Hi! I'm Carlos (inivert) and this is my Rock Paper Scissors game!

// First, I'm setting up all the things I need for my game
const choices = ['rock', 'paper', 'scissors'];
const playerChoiceElement = document.getElementById('player-choice');
const computerChoiceElement = document.getElementById('computer-choice');
const resultElement = document.getElementById('result');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const buttons = document.querySelectorAll('.buttons button');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const endResult = document.getElementById('end-result');
const playAgainButton = document.getElementById('play-again-button');

// These are the scores, I start them at zero
let playerScore = 0;
let computerScore = 0;

// This function sets up my game when it starts
function initGame() {
    // I'm telling the buttons what to do when clicked
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    buttons.forEach(button => {
        button.addEventListener('click', () => playRound(button.id));
    });
}

// This function starts a new game
function startGame() {
    // I'm hiding and showing the right screens
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    endScreen.style.display = 'none';
    // I'm resetting the scores
    playerScore = 0;
    computerScore = 0;
    updateScore();
    resultElement.textContent = 'Choose your move!';
}

// This function updates the score on the screen
function updateScore() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

// This function plays one round of the game
function playRound(playerChoice) {
    // The computer makes a new random choice each time
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    // I'm showing the choices on the screen
    playerChoiceElement.textContent = getEmoji(playerChoice);
    computerChoiceElement.textContent = getEmoji(computerChoice);
    
    // I'm adding a cool animation to the choices
    playerChoiceElement.classList.add('pulse');
    computerChoiceElement.classList.add('pulse');
    
    // I'm removing the animation after half a second
    setTimeout(() => {
        playerChoiceElement.classList.remove('pulse');
        computerChoiceElement.classList.remove('pulse');
    }, 500);

    // I'm figuring out who won and updating everything
    const result = getResult(playerChoice, computerChoice);
    updateScore();
    displayResult(result, playerChoice, computerChoice);
    
    // If someone has won 3 rounds, the game ends
    if (playerScore === 3 || computerScore === 3) {
        endGame();
    }
}

// This function turns the choice into an emoji
function getEmoji(choice) {
    switch(choice) {
        case 'rock': return '✊';
        case 'paper': return '✋';
        case 'scissors': return '✌️';
    }
}

// This function figures out who won the round
function getResult(player, computer) {
    if (player === computer) return 'tie';
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) {
        playerScore++;
        return 'win';
    }
    computerScore++;
    return 'lose';
}

// This function shows the result of the round on the screen
function displayResult(result, playerChoice, computerChoice) {
    let message;
    switch(result) {
        case 'win':
            message = `You win this round! ${playerChoice} beats ${computerChoice}`;
            break;
        case 'lose':
            message = `You lose this round! ${computerChoice} beats ${playerChoice}`;
            break;
        case 'tie':
            message = "This round is a tie!";
            break;
    }
    resultElement.textContent = message;
}

// This function ends the game and shows who won
function endGame() {
    let message;
    if (playerScore > computerScore) {
        message = "Congratulations! You won the game!";
    } else {
        message = "Game over. The computer won.";
    }
    endResult.textContent = message;
    gameScreen.style.display = 'none';
    endScreen.style.display = 'flex';
}

// I'm starting the game when the page loads
initGame();
