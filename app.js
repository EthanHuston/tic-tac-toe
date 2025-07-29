/*
 ** Gameboard factory function
 */
function GameBoard() {
  const grid = 3;
  let board = [];

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
  const resetBoard = () => {
    board = [];
    for (let i = 0; i < grid; i++) {
      board[i] = [];
      for (let j = 0; j < grid; j++) {
        board[i].push(Cell());
      }
    }
  };

  return { getBoard, placeMark, printBoard, resetBoard };
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

const GameController = function () {
  const board = GameBoard();

  let players = [Player("Player One", "X"), Player("Player Two", "O")];

  let activePlayer = players[0];

  let winner = null;

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const reset = () => {
    activePlayer = players[0];
    winner = null;
    board.resetBoard();
  };
  const setPlayers = (newPlayers) => {
    players = newPlayers;
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
    let winCheck = null;
    if (board.placeMark(row, column, getActivePlayer().getValue())) {
      winCheck = checkWin(getActivePlayer());
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

    return winCheck;
  };

  const checkRows = (board, player) => {
    for (let i = 0; i < 3; i++) {
      if (
        [board[i][0], board[i][1], board[i][2]].every(
          (cell) => cell.getValue() === player.getValue()
        )
      ) {
        return true;
      }
    }
    return false;
  };
  const checkCols = (board, player) => {
    for (let i = 0; i < 3; i++) {
      if (
        [board[0][i], board[1][i], board[2][i]].every(
          (cell) => cell.getValue() === player.getValue()
        )
      ) {
        return true;
      }
    }
    return false;
  };
  const checkDiag = (board, player) => {
    if (
      [board[0][0], board[1][1], board[2][2]].every(
        (cell) => cell.getValue() === player.getValue()
      ) ||
      [board[0][2], board[1][1], board[2][0]].every(
        (cell) => cell.getValue() === player.getValue()
      )
    ) {
      return true;
    }
    return false;
  };
  const checkWin = (player) => {
    const gameBoard = board.getBoard();
    if (
      checkCols(gameBoard, player) ||
      checkRows(gameBoard, player) ||
      checkDiag(gameBoard, player)
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
    getBoard: board.getBoard,
    reset,
    setPlayers,
  };
};

const ScreenController = () => {
  const gameController = GameController();
  const infoDiv = document.querySelector(".info");
  const boardDiv = document.querySelector(".board");
  const startButton = document.querySelector(".start");
  const playerOneInput = document.querySelector(".playerOne");
  const playerTwoInput = document.querySelector(".playerTwo");

  const updateScreen = (gameState) => {
    boardDiv.textContent = "";

    const board = gameController.getBoard();
    const activePlayer = gameController.getActivePlayer();

    if (gameState === "win") {
      infoDiv.textContent = `${activePlayer.getName()} is the winner!`;
      boardDiv.removeEventListener("click", boardClickHandler);
    } else if (gameState === "tie") {
      infoDiv.textContent = `It's a tie! No more moves available.`;
      boardDiv.removeEventListener("click", boardClickHandler);
    } else {
      infoDiv.textContent = `${activePlayer.getName()}'s turn...`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = colIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  const boardClickHandler = (e) => {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn && !selectedRow) return;

    let result = gameController.playRound(selectedRow, selectedColumn);
    if (result === 1) {
      updateScreen("win");
    } else if (result === 0) {
      updateScreen("tie");
    } else {
      updateScreen("continue");
    }
  };
  const startNewGame = () => {
    gameController.setPlayers([
      Player(
        playerOneInput.value === "" ? "Player One" : playerOneInput.value,
        "X"
      ),
      Player(
        playerTwoInput.value === "" ? "Player Two" : playerTwoInput.value,
        "O"
      ),
    ]);
    gameController.reset();

    playerOneInput.value = "";
    playerTwoInput.value = "";
    updateScreen();
    if (startButton.textContent === "Start") {
      startButton.textContent = "Reset";
    }
    boardDiv.removeEventListener("click", boardClickHandler);
    boardDiv.addEventListener("click", boardClickHandler);
  };

  boardDiv.addEventListener("click", boardClickHandler);
  startButton.addEventListener("click", startNewGame);
};

ScreenController();
