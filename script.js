const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const modeBtn = document.getElementById('mode-btn');
const playerXScoreElement = document.getElementById('player-x-score');
const playerOScoreElement = document.getElementById('player-o-score');
const drawsElement = document.getElementById('draws');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let vsComputer = false;
let playerXScore = 0;
let playerOScore = 0;
let draws = 0;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
    const cellIndex = Array.from(cells).indexOf(event.target);

    if (gameBoard[cellIndex] !== '' || !isGameActive) return;

    updateCell(cellIndex);
    checkForWinner();

    if (vsComputer && currentPlayer === 'O' && isGameActive) {
        setTimeout(computerMove, 500);
    }
}

function updateCell(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkForWinner() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        const winner = currentPlayer === 'O' ? 'X' : 'O';
        statusText.textContent = `${winner} wins!`;
        updateScore(winner);
        isGameActive = false;
    } else if (!gameBoard.includes('')) {
        statusText.textContent = `It's a draw!`;
        draws++;
        drawsElement.textContent = draws;
        isGameActive = false;
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        playerXScore++;
        playerXScoreElement.textContent = playerXScore;
    } else {
        playerOScore++;
        playerOScoreElement.textContent = playerOScore;
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';  // Computer's turn
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';  // Undo move

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    updateCell(bestMove);
    checkForWinner();
}

function minimax(board, depth, isMaximizing) {
    let scores = { O: 10, X: -10, tie: 0 };
    let result = checkWinnerForMinimax();

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerForMinimax() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    return gameBoard.includes('') ? null : 'tie';
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    statusText.textContent = '';
}

function switchMode() {
    vsComputer = !vsComputer;
    modeBtn.textContent = vsComputer ? 'Switch to Player Mode' : 'Switch to Computer Mode';
    restartGame();
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeBtn.addEventListener('click', switchMode);
