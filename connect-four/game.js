const ROWS = 6;
const COLS = 7;
const CONNECT_N = 4;

let currentPlayer = 1; // 1 = Yellow, 2 = Red
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

// Build UI cells
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = r;
    cell.dataset.col = c;
    cell.addEventListener('click', () => handleClick(c));
    boardEl.appendChild(cell);
  }
}

function handleClick(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col)) {
        statusEl.textContent = `Player ${currentPlayer} wins!`;
        boardEl.style.pointerEvents = 'none';
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        statusEl.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Yellow' : 'Red'})`;
      }
      return;
    }
  }
}

function updateBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const index = r * COLS + c;
      const cell = boardEl.children[index];
      cell.classList.remove('yellow', 'red');
      if (board[r][c] === 1) cell.classList.add('yellow');
      if (board[r][c] === 2) cell.classList.add('red');
    }
  }
}

function checkWin(row, col) {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    for (let k = 1; k < CONNECT_N; k++) {
      const r = row + dr * k, c = col + dc * k;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
      count++;
    }

    for (let k = 1; k < CONNECT_N; k++) {
      const r = row - dr * k, c = col - dc * k;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) break;
      count++;
    }

    if (count >= CONNECT_N) return true;
  }

  return false;
}
