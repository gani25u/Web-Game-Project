document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    
    // Score elements
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    
    // Modal elements
    const gameOverModal = document.getElementById('gameOverModal');
    const modalMessage = document.getElementById('modalMessage');
    const continueBtn = document.getElementById('continueBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    // Game state
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = {
        X: 0,
        O: 0
    };
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        checkResult();
    }
    
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                highlightWinningCells([a, b, c]);
                updateScore(currentPlayer);
                break;
            }
        }
        
        if (roundWon) {
            endGame(`Player ${currentPlayer} wins!`);
            return;
        }
        
        if (!gameState.includes('')) {
            endGame("Game ended in a draw!");
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    function highlightWinningCells(cellsToHighlight) {
        cellsToHighlight.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
    
    function updateScore(winner) {
        scores[winner]++;
        if (winner === 'X') {
            playerXScoreElement.textContent = scores.X;
        } else {
            playerOScoreElement.textContent = scores.O;
        }
    }
    
    function endGame(message) {
        status.textContent = message;
        modalMessage.textContent = message;
        gameActive = false;
        gameOverModal.style.display = 'flex';
    }
    
    function resetBoard() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        gameOverModal.style.display = 'none';
    }
    
    function resetScores() {
        scores = { X: 0, O: 0 };
        playerXScoreElement.textContent = '0';
        playerOScoreElement.textContent = '0';
    }
    
    function continueGame() {
        resetBoard();
        // Scores remain unchanged
    }
    
    function newGame() {
        resetBoard();
        resetScores();
    }
    
    function exitGame() {
        const confirmation = confirm(`Thanks for playing!\n\nFinal scores:\nPlayer X: ${scores.X}\nPlayer O: ${scores.O}\n\nAre you sure you want to exit?`);
        if (confirmation) {
            // In a real app, you might close the window or redirect
            // window.close(); // Only works for windows opened by script
            newGame(); // Reset for next time
        }
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', newGame);
    continueBtn.addEventListener('click', continueGame);
    newGameBtn.addEventListener('click', newGame);
    exitBtn.addEventListener('click', exitGame);
});