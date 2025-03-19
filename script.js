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
    let name = `Player ${playerNum}`;

    function setName(string) {
        if (string != null) {
            name = string;
        }
    }

    function getName() {
        return name;
    }

    return {playerNum, setName, getName, piece};
}

const GameController = (function () {
    let currentPlayer = null;

    let playerOne = Player(1);
    let playerTwo = Player(2);

    function placePiece (player, idxX, idxY) {
        Gameboard.getBoard()[idxX][idxY] = player.playerNum;
        DisplayController.placePieceUI(player, idxX, idxY);
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
        if (!isValidMove(currentPlayer.playerNum, posX, posY)) {
            DisplayController.setGameText("Invalid move!");
        } else {
            placePiece(currentPlayer, posX, posY);

            if (gameWon(posX, posY)) {
                DisplayController.setGameText(`${currentPlayer.getName()} wins!`);
                DisplayController.switchToGameOverState();
            } else if (boardFull()) {
                DisplayController.setGameText("It's a stalemate!");
                DisplayController.switchToGameOverState();
            } else {
                if (currentPlayer === playerTwo || currentPlayer === null) currentPlayer = playerOne;
                else currentPlayer = playerTwo;
    
                DisplayController.setGameText(`${currentPlayer.getName()}'s turn`)
            }
        }
    }

    function setupGame(nameOne, nameTwo) {
        console.log(nameOne);
        playerOne.setName(nameOne);
        playerTwo.setName(nameTwo);
        Gameboard.resetBoard();
        currentPlayer = playerOne;
        DisplayController.setGameText(`${currentPlayer.getName()}'s turn`)
    }

    return {setupGame, playTurn};
})();

const DisplayController = (function() {
    const gameArea = document.querySelector(".game-area");
    const container = document.querySelector(".grid-container");
    const gameText = document.querySelector(".game-text");
    const subGameText = document.querySelector(".sub-game-text");
    const startGameBtn = document.querySelector(".start-game-btn");
    const restartBtn = document.querySelector(".restart-btn");

    function renderGrid() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell.setAttribute("data-x-pos", i);
                cell.setAttribute("data-y-pos", j);
                cell.addEventListener("click", () => {
                    GameController.playTurn(i, j);
                })
                cell.append(document.createElement("span"));
                container.append(cell);
            }
        }
    }

    function setupButtons() {
        startGameBtn.addEventListener("click", function(e) {
            e.preventDefault();
            const nameOne = document.querySelector("#player-one-name").value || null;
            const nameTwo = document.querySelector("#player-two-name").value || null;
            gameArea.classList.remove("hide");
            renderGrid();
            GameController.setupGame(nameOne, nameTwo);
            document.querySelector(".start-menu").classList.add("hide");
        });

        restartBtn.addEventListener("click", () => {
            document.querySelector(".start-menu").classList.remove("hide");
            clearGameText();
            clearSubGameText();
            container.textContent = "";
            setupMenu();
        })
    }

    function setupMenu() {
        gameArea.classList.add("hide");
        restartBtn.classList.add("hide");
    }

    function placePieceUI(player, idxX, idxY) {
        document.querySelector(`.cell[data-x-pos="${idxX}"][data-y-pos="${idxY}"] span`).textContent = player.piece;
    }

    function switchToGameOverState() {
        restartBtn.classList.remove("hide");
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.classList.add("disabled");
        })
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

    return {setupMenu, setupButtons, switchToGameOverState, renderGrid, placePieceUI, setGameText, setSubGameText, clearSubGameText, clearGameText}
})();

DisplayController.setupButtons();
DisplayController.setupMenu();