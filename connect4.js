class Game {
	constructor(height, width, p1count, p2count, color1, color2) {
		this.width = width;
		this.height = height;
		this.player1 = new Player(1, color1);
		this.player2 = new Player(2, color2);
		this.currPlayer = this.player1;
		this.gameover = false;
		this.makeBoard();
		this.makeHtmlBoard();
		this.p1count = p1count;
		this.p2count = p2count;
		document.querySelector('#p1count').innerText = `Player 1 wins: ${this.p1count}`;
		document.querySelector('#p2count').innerText = `Player 2 wins: ${this.p2count}`;
		document.querySelector('#p1count').style.color = this.player1.color;
		document.querySelector('#p2count').style.color = this.player2.color;
		this.resetbtn = this.boardReset.bind(this);
		document.querySelector('#restart').addEventListener('click', this.resetbtn);
		document.querySelector('#currentp').innerText = `Player ${this.currPlayer.playerNum}'s turn`;
		document.querySelector('#currentp').style.color = this.currPlayer.color;
	}

	makeBoard() {
		this.board = [];
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById('board');

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');

		this.newclick = this.handleClick.bind(this);

		top.addEventListener('click', this.newclick);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				///this.board[y][x] = cell;
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.style.backgroundColor = this.currPlayer.color;
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
		let mover = -((y + 1) * (50 + this.height));
		piece.style.transform = `translateY(${mover}px)`;
		return piece;
	}

	/** endGame: announce game end */

	endGame(msg) {
		setTimeout(() => {
			alert(msg);
			this.boardReset();
		}, 300);
	}

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		if (this.gameover === true) {
			return;
		}
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer.playerNum;
		this.newpiece = this.placeInTable(y, x);

		setTimeout(() => {
			this.newpiece.style.transform = 'none';
		}, 100);

		// check for win
		if (this.checkForWin()) {
			this.gameover = true;
			this.currPlayer.playerNum === 1 ? this.p1count++ : this.p2count++;
			return this.endGame(`Player ${this.currPlayer.playerNum} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			this.gameover = true;
			return endGame('Tie!');
		}

		// switch players
		this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;

		document.querySelector('#currentp').innerText = `Player ${this.currPlayer.playerNum}'s turn`;
		document.querySelector('#currentp').style.color = this.currPlayer.color;
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		const _win = (cells) =>
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			cells.every(
				([ y, x ]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer.playerNum
			);

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}

	boardReset() {
		document.getElementById('board').innerHTML = '';
		let mygame = new Game(6, 7, this.p1count, this.p2count, this.player1.color, this.player2.color);
	}
}

class Player {
	constructor(playerNum, color) {
		this.playerNum = playerNum;
		this.color = color;
	}
}

let mygame;

const p1input = document.querySelector('#p1color');
const p2input = document.querySelector('#p2color');
p1input.value = 'firebrick';
p2input.value = '#1f5386';

document.getElementById('start').addEventListener('click', function(e) {
	e.preventDefault();

	if (document.querySelector('#p1color').value === '' || document.querySelector('#p2color').value === '') {
		alert('Colors needed');
		return;
	}

	mygame = new Game(6, 7, 0, 0, p1input.value, p2input.value);

	document.getElementById('restart').style.visibility = 'visible';
	let h2s = document.querySelectorAll('h2');
	for (let h2 of h2s) {
		h2.style.visibility = 'visible';
	}
	document.getElementById('colorform').style.visibility = 'hidden';
});
