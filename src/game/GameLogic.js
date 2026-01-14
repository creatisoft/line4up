/**
 * Game logic for Connect 4
 * Handles win detection and game rules
 */

import { ROWS, COLS, EMPTY } from './Board.js';

// Directions to check for wins: [deltaRow, deltaCol]
const DIRECTIONS = [
    [0, 1],   // Horizontal (right)
    [1, 0],   // Vertical (up)
    [1, 1],   // Diagonal up-right
    [1, -1]   // Diagonal up-left
];

/**
 * Check if there's a winner after a move
 * @param {Board} board - The game board
 * @param {number} row - Row of last placed token
 * @param {number} col - Column of last placed token
 * @param {number} player - Player who placed the token
 * @returns {Object|null} Win info {player, positions} or null if no win
 */
export function checkWin(board, row, col, player) {
    for (const [dRow, dCol] of DIRECTIONS) {
        const positions = getConnectedPositions(board, row, col, dRow, dCol, player);
        
        if (positions.length >= 4) {
            return {
                player,
                positions: positions.slice(0, 4) // Return exactly 4 winning positions
            };
        }
    }
    
    return null;
}

/**
 * Get all connected positions in a direction (both ways)
 * @param {Board} board - The game board
 * @param {number} row - Starting row
 * @param {number} col - Starting column
 * @param {number} dRow - Row direction
 * @param {number} dCol - Column direction
 * @param {number} player - Player to check for
 * @returns {Array} Array of [row, col] positions
 */
function getConnectedPositions(board, row, col, dRow, dCol, player) {
    const positions = [[row, col]];
    
    // Check in positive direction
    let r = row + dRow;
    let c = col + dCol;
    while (isValidPosition(r, c) && board.getCell(r, c) === player) {
        positions.push([r, c]);
        r += dRow;
        c += dCol;
    }
    
    // Check in negative direction
    r = row - dRow;
    c = col - dCol;
    while (isValidPosition(r, c) && board.getCell(r, c) === player) {
        positions.unshift([r, c]); // Add to beginning
        r -= dRow;
        c -= dCol;
    }
    
    return positions;
}

/**
 * Check if a position is within board bounds
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if valid position
 */
function isValidPosition(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

/**
 * Count tokens in a line (used for AI evaluation)
 * @param {Board} board - The game board
 * @param {number} row - Starting row
 * @param {number} col - Starting column
 * @param {number} dRow - Row direction
 * @param {number} dCol - Column direction
 * @param {number} player - Player to count
 * @returns {number} Count of consecutive tokens
 */
export function countInDirection(board, row, col, dRow, dCol, player) {
    let count = 0;
    let r = row;
    let c = col;
    
    while (isValidPosition(r, c) && board.getCell(r, c) === player) {
        count++;
        r += dRow;
        c += dCol;
    }
    
    return count;
}

/**
 * Check if a move would result in immediate win
 * @param {Board} board - The game board
 * @param {number} col - Column to check
 * @param {number} player - Player making the move
 * @returns {boolean} True if move would win
 */
export function isWinningMove(board, col, player) {
    const row = board.findLowestRow(col);
    if (row === -1) return false;
    
    // Temporarily place token
    board.setCell(row, col, player);
    const win = checkWin(board, row, col, player);
    // Remove token
    board.setCell(row, col, EMPTY);
    
    return win !== null;
}

/**
 * Get all winning moves for a player
 * @param {Board} board - The game board
 * @param {number} player - Player to check
 * @returns {number[]} Array of winning column indices
 */
export function getWinningMoves(board, player) {
    const winningMoves = [];
    
    for (let col = 0; col < COLS; col++) {
        if (!board.isColumnFull(col) && isWinningMove(board, col, player)) {
            winningMoves.push(col);
        }
    }
    
    return winningMoves;
}

export default {
    checkWin,
    countInDirection,
    isWinningMove,
    getWinningMoves
};
