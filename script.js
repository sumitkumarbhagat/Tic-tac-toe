const cells = document.querySelectorAll('.cell');
const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const chooseXButton = document.getElementById('choose-x');
const chooseOButton = document.getElementById('choose-o');
const selectionScreen = document.getElementById('selection-screen');

let currentPlayer = '';
let playerSymbol = '';
let computerSymbol = '';
let gameActive = false;
const boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] !== '' || !gameActive || currentPlayer !== playerSymbol) return;

    boardState[index] = playerSymbol;
    cell.textContent = playerSymbol;

    checkWinner();

    if (gameActive) {
        currentPlayer = computerSymbol; 
        setTimeout(computerMove, 500); 
    }
}

function computerMove() {
    const bestMove = minimax(boardState, computerSymbol);
    boardState[bestMove.index] = computerSymbol;
    cells[bestMove.index].textContent = computerSymbol;

    checkWinner();

    if (gameActive) {
        currentPlayer = playerSymbol; 
    }
}

function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            alert(`${boardState[a]} wins!`);
            gameActive = false;
            return;
        }
    }

    if (!boardState.includes('')) {
        alert('Draw!');
        gameActive = false;
    }
}

function restartGame() {
    boardState.fill('');
    gameActive = true;
    currentPlayer = playerSymbol;
    cells.forEach(cell => cell.textContent = '');
    board.style.display = 'none';
    restartButton.style.display = 'none';
    selectionScreen.style.display = 'flex';
}

function startGame(playerChoice) {
    playerSymbol = playerChoice;
    computerSymbol = playerChoice === 'X' ? 'O' : 'X';
    currentPlayer = playerSymbol;
    gameActive = true;
    
    selectionScreen.style.display = 'none';
    board.style.display = 'grid';
    restartButton.style.display = 'block';
}

chooseXButton.addEventListener('click', () => startGame('X'));
chooseOButton.addEventListener('click', () => startGame('O'));
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

function minimax(newBoard, player) {
    const availableCells = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (checkWinnerForMinimax(newBoard, playerSymbol)) return { score: -10 };
    if (checkWinnerForMinimax(newBoard, computerSymbol)) return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availableCells.length; i++) {
        const move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = player;

        if (player === computerSymbol) {
            const result = minimax(newBoard, playerSymbol);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, computerSymbol);
            move.score = result.score;
        }

        newBoard[availableCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === computerSymbol) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinnerForMinimax(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] !== '' || !gameActive || currentPlayer !== playerSymbol) return;

    boardState[index] = playerSymbol;
    cell.textContent = playerSymbol;
    cell.classList.add('animate'); 

    checkWinner();

    if (gameActive) {
        currentPlayer = computerSymbol; 
        setTimeout(computerMove, 500); 
    }
}

function computerMove() {
    const bestMove = minimax(boardState, computerSymbol);
    const cell = cells[bestMove.index];
    boardState[bestMove.index] = computerSymbol;
    cell.textContent = computerSymbol;
    cell.classList.add('animate'); 

    checkWinner();

    if (gameActive) {
        currentPlayer = playerSymbol; 
    }
}

