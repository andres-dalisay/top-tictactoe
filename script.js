

const Gameboard = (function () {
    const board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    function getBoard() {
        return board;
    }

    function placePiece (piece, cellX, cellY) {
        const idxX = cellX - 1;
        const idxY = cellY - 1;

        if (isValidMove(piece, idxX, idxY)) {
            board[idxX][idxY] = piece;
        } else {
            console.log("Invalid move.");
        }
    }

    function isValidMove(piece, idxX, idxY) {

        if (piece < 0 || piece > 2) return false;

        if (board[idxX][idxY] != 0) return false;
        else if (board[idxX][idxY] == piece) return false;
        else return true; 
    }

    function horThree(posX, posY, piece) {
        for (let j = posY, acc = 0; acc < 3; j++, acc++) {
            if (board[posX][j % 3] != piece) {
                return false;
            }
        }
        return true;
    }

    function verThree(posX, posY, piece) {
        for (let i = posX, acc = 0; acc < 3; i++, acc++) {
            if (board[i % 3][posY] != piece) {
                return false;
            }
        }
        return true;
    }

    function diagThree(posX, posY, piece) {
        if (posX === 1 && posY === 1) {
            if (board[0][0] === piece && board[2][2] === piece) return true;
            else if (board[0][2] === piece && board[2][0] === piece) return true;
        }
        else if (posX === 0 && posY === 0) {
            if (board[1][1] === piece && board[2][2] === piece) return true;
        } 
        else if(posX === 0 && posY === 2) {
            if (board[1][1] === piece && board[2][0] === piece) return true;
        } 
        else if (posX === 2 && posY === 0) {
            if (board[1][1] === piece && board[0][2] === piece) return true;
        } 
        else if (posX === 2 && posY === 2) {
            if (board[1][1] === piece && board[0][0] === piece) return true;  
        }
        return false;
    }

    function gameWon(lastX, lastY) {        
        const piece = board[lastX][lastY];
        if (horThree(lastX, lastY, piece) || verThree(lastX, lastY, piece) || diagThree(lastX, lastY, piece)) {
            return true;
        }
        return false;
    }
    return {placePiece, getBoard};
})();
