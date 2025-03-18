const Gameboard = (function () {
    let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    function getBoard() {
        return board;
    }

    function resetBoard() {
        board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    function displayBoard() {
        board.forEach((row) => {
            let string = ""
            for (let i = 0; i < row.length; i++) {
                string += row[i] + " ";
            }
            console.log(string);
        });
    }

    return {getBoard, displayBoard, resetBoard};
})();

const Player = function (playerNum) {
    const piece = (playerNum === 1) ? "O" : "X";
    return {playerNum, piece};
}

const GameController = (function () {
    let currentPlayer = null;

    const playerOne = Player(1);
    const playerTwo = Player(2);

    function placePiece (player, cellX, cellY) {
        const idxX = cellX;
        const idxY = cellY;

        Gameboard.getBoard()[idxX][idxY] = player;
    }

    function isValidMove(player, idxX, idxY) {
        if (idxX === null || idxY === null) return false; // for pre-input
        if (idxX < 0 || idxX > 2 || idxY < 0 || idxY > 2) {
            DisplayController.setSubGameText("Invalid input. Try Again.");
            return false;
        }
        if (player < 0 || player > 2) {
            DisplayController.setSubGameText("Invalid player.");
            return false;
        }
        const board = Gameboard.getBoard();
        
        if (board[idxX][idxY] != 0) {
            DisplayController.setSubGameText("Spot already taken.");
            return false;
        }
        else return true; 
    }

    function horThree(posX, posY, player) {
        const board = Gameboard.getBoard();
        for (let j = posY, acc = 0; acc < 3; j++, acc++) {
            if (board[posX][j % 3] != player) {
                return false;
            }
        }
        return true;
    }

    function verThree(posX, posY, player) {
        const board = Gameboard.getBoard();
        for (let i = posX, acc = 0; acc < 3; i++, acc++) {
            if (board[i % 3][posY] != player) {
                return false;
            }
        }
        return true;
    }

    function diagThree(posX, posY, player) {
        const board = Gameboard.getBoard();
        if (posX === 1 && posY === 1) {
            if (board[0][0] === player && board[2][2] === player) return true;
            else if (board[0][2] === player && board[2][0] === player) return true;
        }
        else if (posX === 0 && posY === 0) {
            if (board[1][1] === player && board[2][2] === player) return true;
        } 
        else if(posX === 0 && posY === 2) {
            if (board[1][1] === player && board[2][0] === player) return true;
        } 
        else if (posX === 2 && posY === 0) {
            if (board[1][1] === player && board[0][2] === player) return true;
        } 
        else if (posX === 2 && posY === 2) {
            if (board[1][1] === player && board[0][0] === player) return true;  
        }
        return false;
    }

    function gameWon(lastX, lastY) {   
        if (lastX === null && lastY === null) return false;     
        const piece = Gameboard.getBoard()[lastX][lastY];
        if (horThree(lastX, lastY, piece) || verThree(lastX, lastY, piece) || diagThree(lastX, lastY, piece)) {
            return true;
        }
        return false;
    }

    function boardFull() {
        const board = Gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === 0) return false;
            }
        }
        return true;
    }

    function playTurn(posX, posY) {
        DisplayController.clearSubGameText();
        
        if (currentPlayer === playerTwo || currentPlayer === null) currentPlayer = playerOne;
        else currentPlayer = playerTwo;

        DisplayController.setGameText(`Player ${currentPlayer.playerNum}'s turn`)

        if (isValidMove(currentPlayer.playerNum, posX, posY)) {
            placePiece(currentPlayer.playerNum, posX, posY);
        } else {
            DisplayController.setGameText("Invalid move!");
        }
        console.log(Gameboard.displayBoard());

        if (gameWon(posX, posY)) {
            DisplayController.setGameText(`Player ${currentPlayer.playerNum} wins!`);
        } else if (boardFull()) {
            DisplayController.setGameText("It's a stalemate!");
        }
    }

    function setupGame() {
        Gameboard.resetBoard();
    }

    return {setupGame, playTurn};
})();

const DisplayController = (function() {
    const container = document.querySelector(".grid-container");
    const gameText = document.querySelector(".game-text");
    const subGameText = document.querySelector(".sub-game-text");

    function renderGrid() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell.addEventListener("click", () => {
                    GameController.playTurn(i, j);
                })
                container.append(cell);
            }
        }
    }

    function setGameText(string) {
        gameText.textContent = string;
    }

    function setSubGameText(string) {
        subGameText.textContent = string;
    }

    function clearGameText() {
        gameText.textContent = "";
    }

    function clearSubGameText() {
        subGameText.textContent = "";
    }

    return {renderGrid, setGameText, setSubGameText, clearSubGameText, clearGameText}
})();

DisplayController.renderGrid();
GameController.setupGame();