/**
 * Board state management for Connect 4
 * Handles the logical representation of the game board
 */

export const ROWS = 6;
export const COLS = 7;
export const EMPTY = 0;
export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

export class Board {
    constructor() {
        this.grid = [];
        this.reset();
    }
    
    /**
     * Reset the board to initial empty state
     */
    reset() {
        this.grid = [];
        for (let row = 0; row < ROWS; row++) {
            this.grid.push(new Array(COLS).fill(EMPTY));
        }
    }
    
    /**
     * Get the value at a specific cell
     * @param {number} row - Row index (0 = bottom)
     * @param {number} col - Column index
     * @returns {number} Cell value (0=empty, 1=player1, 2=player2)
     */
    getCell(row, col) {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            return null;
        }
        return this.grid[row][col];
    }
    
    /**
     * Set the value at a specific cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {number} value - Player value
     */
    setCell(row, col, value) {
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            this.grid[row][col] = value;
        }
    }
    
    /**
     * Find the lowest available row in a column
     * @param {number} col - Column index
     * @returns {number} Row index, or -1 if column is full
     */
    findLowestRow(col) {
        if (col < 0 || col >= COLS) {
            return -1;
        }
        
        for (let row = 0; row < ROWS; row++) {
            if (this.grid[row][col] === EMPTY) {
                return row;
            }
        }
        
        return -1; // Column is full
    }
    
    /**
     * Check if a column is full
     * @param {number} col - Column index
     * @returns {boolean} True if column is full
     */
    isColumnFull(col) {
        return this.findLowestRow(col) === -1;
    }
    
    /**
     * Drop a token into a column
     * @param {number} col - Column index
     * @param {number} player - Player value (1 or 2)
     * @returns {number} Row where token landed, or -1 if invalid
     */
    dropToken(col, player) {
        const row = this.findLowestRow(col);
        
        if (row === -1) {
            return -1; // Column is full
        }
        
        this.grid[row][col] = player;
        return row;
    }
    
    /**
     * Check if the board is completely full (draw condition)
     * @returns {boolean} True if board is full
     */
    isFull() {
        for (let col = 0; col < COLS; col++) {
            if (!this.isColumnFull(col)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Get all valid (non-full) columns
     * @returns {number[]} Array of valid column indices
     */
    getValidMoves() {
        const validMoves = [];
        for (let col = 0; col < COLS; col++) {
            if (!this.isColumnFull(col)) {
                validMoves.push(col);
            }
        }
        return validMoves;
    }
    
    /**
     * Create a deep copy of the board
     * @returns {Board} New board instance with copied state
     */
    clone() {
        const newBoard = new Board();
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                newBoard.grid[row][col] = this.grid[row][col];
            }
        }
        return newBoard;
    }
    
    /**
     * Print board to console (for debugging)
     */
    print() {
        console.log('\n--- Board State ---');
        for (let row = ROWS - 1; row >= 0; row--) {
            let rowStr = `${row}: `;
            for (let col = 0; col < COLS; col++) {
                const cell = this.grid[row][col];
                rowStr += cell === EMPTY ? '.' : cell === PLAYER_1 ? 'R' : 'Y';
                rowStr += ' ';
            }
            console.log(rowStr);
        }
        console.log('   0 1 2 3 4 5 6');
        console.log('-------------------\n');
    }
}

export default Board;
