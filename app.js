/*
 ** Gameboard factory function
 */
function GameBoard() {
  const grid = 3;
  const board = [];

  //Fill board with initial values
  for (let i = 0; i < grid; i++) {
    board[i] = [];
    for (let j = 0; j < grid; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  //Method for placing a mark on the board, return value equates
  //to if the placement was successful.
  const placeMark = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addMark(player);
      return true;
    } else {
      return false;
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => (cell.getValue() === 0 ? "" : cell.getValue()))
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, placeMark, printBoard };
}

function Cell() {
  let value = 0;

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue,
  };
}

function Player(name, value) {
  const getName = () => name;
  const getValue = () => value;

  return { getName, getValue };
}

const GameController = (function () {
  const board = GameBoard();

  const players = [Player("Player One", 1), Player("Player Two", 2)];

  let activePlayer = players[0];

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
  const printRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };
  const playRound = (row, column) => {
    if (board.placeMark(row, column, getActivePlayer().getValue())) {
      switchTurns();
      printRound();
    } else {
      console.log("A mark is already there, try a different place!");
    }
  };

  printRound();

  return {
    playRound,
    getActivePlayer,
  };
})();
