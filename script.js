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
    let currentPlayer;

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
            console.log("Invalid input. Try Again.");
            return false;
        }
        if (player < 0 || player > 2) {
            console.log("Invalid player.");
            return false;
        }
        const board = Gameboard.getBoard();
        
        if (board[idxX][idxY] != 0) {
            console.log("Spot taken.");
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
        if (lastX === -1 && lastY === -1) return false;     
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

    function getPos() {
        const posX = parseInt(prompt("Enter Row: "));
        const posY = parseInt(prompt("Enter Column: "));

        return [posX, posY];
    }

    function startGame() {
        Gameboard.resetBoard();
        let posX = -1;
        let posY = -1;
        while (!gameWon(posX, posY) && !boardFull()) {
            if (currentPlayer === playerTwo || undefined) currentPlayer = playerOne;
            else currentPlayer = playerTwo;

            posX = -1;
            posY = -1;

            while (!isValidMove(currentPlayer.playerNum, posX, posY)) {
                [posX, posY] = getPos();
            }

            if (isValidMove(currentPlayer.playerNum, posX, posY)) {
                placePiece(currentPlayer.playerNum, posX, posY);
            } else {
                console.log("Invalid");
            }
            console.log(Gameboard.displayBoard());

        }
    }

    return {startGame};
})();

GameController.startGame();