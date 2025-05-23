// chess.js using Unicode characters for pieces
const Color = Object.freeze({ WHITE: 'WHITE', BLACK: 'BLACK' });

class Square {
  constructor(color) {
    this.color = color;
    this.piece = null;
  }
}

class Piece {
  constructor(color) {
    if (new.target === Piece) throw new TypeError('Abstract class');
    this.color = color;
  }
  static isWithinGrid(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }
  getSymbol() { return ''; }
}

class Pawn extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec, board) {
    let dir = this.color === Color.WHITE ? -1 : 1;
    if (sc === ec && board[er][ec].piece === null) {
      if (er - sr === dir) return true;
      if ((this.color === Color.WHITE && sr === 6 || this.color === Color.BLACK && sr === 1) && er - sr === 2 * dir && board[sr + dir][sc].piece === null) return true;
    }
    if (Math.abs(sc - ec) === 1 && er - sr === dir && board[er][ec].piece && board[er][ec].piece.color !== this.color) return true;
    return false;
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♙' : '♟';
  }
}

class Rook extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec, board) {
    if (sr !== er && sc !== ec) return false;
    let dr = Math.sign(er - sr), dc = Math.sign(ec - sc);
    for (let r = sr + dr, c = sc + dc; r !== er || c !== ec; r += dr, c += dc) {
      if (board[r][c].piece) return false;
    }
    return !board[er][ec].piece || board[er][ec].piece.color !== this.color;
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♖' : '♜';
  }
}

class Knight extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec) {
    let dr = Math.abs(er - sr), dc = Math.abs(ec - sc);
    return dr * dc === 2;
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♘' : '♞';
  }
}

class Bishop extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec, board) {
    if (Math.abs(sr - er) !== Math.abs(sc - ec)) return false;
    let dr = Math.sign(er - sr), dc = Math.sign(ec - sc);
    for (let r = sr + dr, c = sc + dc; r !== er; r += dr, c += dc) {
      if (board[r][c].piece) return false;
    }
    return !board[er][ec].piece || board[er][ec].piece.color !== this.color;
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♗' : '♝';
  }
}

class Queen extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec, board) {
    return new Rook(this.color).isValidMove(sr, sc, er, ec, board) || new Bishop(this.color).isValidMove(sr, sc, er, ec, board);
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♕' : '♛';
  }
}

class King extends Piece {
  constructor(color) { super(color); }
  isValidMove(sr, sc, er, ec) {
    return Math.abs(sr - er) <= 1 && Math.abs(sc - ec) <= 1;
  }
  getSymbol() {
    return this.color === Color.WHITE ? '♔' : '♚';
  }
}

const boardElement = document.getElementById('board');
let board = [], selected = null, currentColor = Color.WHITE;
const status = document.getElementById('status');

function createBoard() {
  board = [];
  boardElement.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    let row = [];
    for (let c = 0; c < 8; c++) {
      let square = new Square((r + c) % 2 === 0 ? 'white' : 'black');
      let div = document.createElement('div');
      div.className = `square ${square.color}`;
      div.dataset.row = r;
      div.dataset.col = c;
      div.addEventListener('click', onSquareClick);
      boardElement.appendChild(div);
      square.el = div;
      row.push(square);
    }
    board.push(row);
  }
  placePieces();
  drawBoard();
}

function placePieces() {
  const back = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
  for (let i = 0; i < 8; i++) {
    board[1][i].piece = new Pawn(Color.BLACK);
    board[6][i].piece = new Pawn(Color.WHITE);
    board[0][i].piece = new back[i](Color.BLACK);
    board[7][i].piece = new back[i](Color.WHITE);
  }
}

function drawBoard() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      sq.el.textContent = sq.piece ? sq.piece.getSymbol() : '';
    }
  }
}

function onSquareClick(e) {
  const r = +e.currentTarget.dataset.row;
  const c = +e.currentTarget.dataset.col;
  const sq = board[r][c];
  if (selected) {
    const [sr, sc] = selected;
    const piece = board[sr][sc].piece;
    if (piece && piece.color === currentColor && piece.isValidMove(sr, sc, r, c, board)) {
      board[r][c].piece = piece;
      board[sr][sc].piece = null;
      currentColor = currentColor === Color.WHITE ? Color.BLACK : Color.WHITE;
      status.textContent = `${currentColor === Color.WHITE ? "White" : "Black"}'s turn`;
    }
    board[sr][sc].el.classList.remove('selected');
    selected = null;
    drawBoard();
  } else if (sq.piece && sq.piece.color === currentColor) {
    selected = [r, c];
    sq.el.classList.add('selected');
  }
}

createBoard();
