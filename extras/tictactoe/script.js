/*
 * Tic-Tac-Toe Game
 * Created by: Carlos (alias: inivert)
 * 
 * This is a modern, interactive Tic-Tac-Toe game.
 * It has a nice look, keeps track of scores, and has smooth animations.
 * Two players can enjoy playing this game together!
 */

// These are the symbols for each player
const PLAYER_X_CLASS = 'x';
const PLAYER_O_CLASS = 'o';

// These are all the ways a player can win
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Getting all the important parts of the game from the HTML
const cellElements = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('gameBoard');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const startOverButton = document.getElementById('startOverButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const scorePlayer1Element = document.getElementById('scorePlayer1');
const scorePlayer2Element = document.getElementById('scorePlayer2');
const player1Element = document.querySelector('.player1');
const player2Element = document.querySelector('.player2');

// These keep track of what's happening in the game
let scores = { Player1: 0, Player2: 0 };
let isPlayer1Turn = true;
let gameStarted = false;

// These make the buttons do something when clicked
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', startGame);
startOverButton.addEventListener('click', startOver);

// This function starts a new game
function startGame() {
    gameStarted = true;
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    startOverButton.style.display = 'inline-block';
    isPlayer1Turn = true;
    
    // Clear the board and make cells clickable
    cellElements.forEach(cell => {
        cell.classList.remove(PLAYER_X_CLASS);
        cell.classList.remove(PLAYER_O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    
    setBoardHoverClass();
    winningMessageElement.style.display = 'none';
    updateCurrentPlayer();
}

// This function handles what happens when a player clicks a cell
function handleClick(e) {
    const cell = e.target;
    const currentClass = isPlayer1Turn ? PLAYER_X_CLASS : PLAYER_O_CLASS;
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        updateCurrentPlayer();
    }
}

// This function ends the game
function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'It\'s a Draw!';
    } else {
        const winner = isPlayer1Turn ? 'Player 1' : 'Player 2';
        winningMessageTextElement.innerText = `${winner} Wins!`;
        updateScore(winner);
    }
    winningMessageElement.style.display = 'flex';
}

// This function checks if the game is a draw
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(PLAYER_X_CLASS) || cell.classList.contains(PLAYER_O_CLASS);
    });
}

// This function puts an X or O in a cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

// This function switches turns between players
function swapTurns() {
    isPlayer1Turn = !isPlayer1Turn;
    updateCurrentPlayer();
}

// This function shows whose turn it is by changing the hover effect
function setBoardHoverClass() {
    gameBoard.classList.remove(PLAYER_X_CLASS);
    gameBoard.classList.remove(PLAYER_O_CLASS);
    if (isPlayer1Turn) {
        gameBoard.classList.add(PLAYER_X_CLASS);
    } else {
        gameBoard.classList.add(PLAYER_O_CLASS);
    }
}

// This function checks if a player has won
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

// This function updates the score when a player wins
function updateScore(winner) {
    if (winner === 'Player 1') {
        scores.Player1++;
        scorePlayer1Element.textContent = scores.Player1;
    } else {
        scores.Player2++;
        scorePlayer2Element.textContent = scores.Player2;
    }
}

// This function resets the game and scores
function resetGame() {
    scores.Player1 = 0;
    scores.Player2 = 0;
    scorePlayer1Element.textContent = '0';
    scorePlayer2Element.textContent = '0';
    startGame();
}

// This function starts the game over from the beginning
function startOver() {
    gameStarted = false;
    startButton.style.display = 'inline-block';
    resetButton.style.display = 'inline-block';
    startOverButton.style.display = 'none';
    resetGame();
}

// This function updates who the current player is
function updateCurrentPlayer() {
    player1Element.classList.toggle('active', isPlayer1Turn);
    player2Element.classList.toggle('active', !isPlayer1Turn);
}

// Start the game when the page loads
startGame();
updateCurrentPlayer();
