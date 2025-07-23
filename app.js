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

  const players = [Player("Player One", "X"), Player("Player Two", "O")];

  let activePlayer = players[0];

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printRound = (winState) => {
    board.printBoard();
    if (winState === "none") {
      console.log(`${getActivePlayer().getName()}'s turn.`);
    } else if (winState === "win") {
      console.log(`${getActivePlayer().getName()} has won!`);
    } else {
      console.log("It's a tie! No more spaces left!");
    }
  };
  const playRound = (row, column) => {
    if (board.placeMark(row, column, getActivePlayer().getValue())) {
      const winCheck = checkWin(getActivePlayer());
      if (winCheck === 1) {
        printRound("win");
      } else if (winCheck === 0) {
        printRound("tie");
      } else {
        switchTurns();
        printRound("none");
      }
    } else {
      console.log("A mark is already there, try a different place!");
    }
  };

  const checkWin = (player) => {
    const gameBoard = board.getBoard();
    //Rows and Columns
    for (let i = 0; i < 3; i++) {
      if (
        gameBoard[i].every((cell) => cell.getValue === player.getValue()) ||
        [gameBoard[0][i], gameBoard[1][i], gameBoard[2][i]].every(
          (cell) => cell.getValue() === player.getValue()
        )
      ) {
        return 1;
      }
    }

    //Diagonals
    if (
      [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]].every(
        (cell) => cell.getValue() === player.getValue()
      ) ||
      [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]].every(
        (cell) => cell.getValue() === player.getValue()
      )
    ) {
      return 1;
    }

    //Tie Check
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameBoard[i][j].getValue() === 0) {
          return -1;
        }
      }
    }
    return 0;
  };

  printRound("none");

  return {
    playRound,
    getActivePlayer,
  };
})();
