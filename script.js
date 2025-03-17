

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

    return {placePiece, getBoard};
})();
