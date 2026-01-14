/**
 * AI Opponent for Connect 4
 * Implements minimax algorithm with alpha-beta pruning
 */

import { ROWS, COLS, EMPTY, PLAYER_1, PLAYER_2 } from './Board.js';

// AI Configuration
export const AI_PLAYER = PLAYER_2;
export const HUMAN_PLAYER = PLAYER_1;

export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Depth settings for each difficulty
const DEPTH_CONFIG = {
    [DIFFICULTY.EASY]: 2,
    [DIFFICULTY.MEDIUM]: 4,
    [DIFFICULTY.HARD]: 6
};

// Scoring constants
const SCORE = {
    WIN: 100000,
    THREE_IN_ROW: 100,
    TWO_IN_ROW: 10,
    CENTER_BONUS: 3,
    BLOCK_THREE: 80,
    BLOCK_TWO: 8
};

/**
 * AI class for Connect 4
 */
export class AI {
    constructor(difficulty = DIFFICULTY.MEDIUM) {
        this.difficulty = difficulty;
        this.aiPlayer = AI_PLAYER;
        this.humanPlayer = HUMAN_PLAYER;
    }
    
    /**
     * Set the difficulty level
     * @param {string} difficulty - Difficulty level
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }
    
    /**
     * Get the best move for the AI
     * @param {Board} board - Current board state
     * @returns {number} Best column to play
     */
    getBestMove(board) {
        const validMoves = this.getValidMoves(board);
        
        if (validMoves.length === 0) return -1;
        if (validMoves.length === 1) return validMoves[0];
        
        // Easy mode: mix of random and smart moves
        if (this.difficulty === DIFFICULTY.EASY) {
            // 60% random, 40% smart
            if (Math.random() < 0.6) {
                return validMoves[Math.floor(Math.random() * validMoves.length)];
            }
        }
        
        const depth = DEPTH_CONFIG[this.difficulty] || 4;
        
        let bestScore = -Infinity;
        let bestMove = validMoves[0];
        
        // Order moves to check center columns first (better pruning)
        const orderedMoves = this.orderMoves(validMoves);
        
        for (const col of orderedMoves) {
            const boardCopy = board.clone();
            boardCopy.dropToken(col, this.aiPlayer);
            
            const score = this.minimax(
                boardCopy,
                depth - 1,
                -Infinity,
                Infinity,
                false
            );
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = col;
            }
        }
        
        return bestMove;
    }
    
    /**
     * Minimax algorithm with alpha-beta pruning
     * @param {Board} board - Current board state
     * @param {number} depth - Remaining search depth
     * @param {number} alpha - Alpha value for pruning
     * @param {number} beta - Beta value for pruning
     * @param {boolean} isMaximizing - Whether maximizing player
     * @returns {number} Best score
     */
    minimax(board, depth, alpha, beta, isMaximizing) {
        // Check terminal states
        const winner = this.checkWinner(board);
        if (winner === this.aiPlayer) return SCORE.WIN + depth;
        if (winner === this.humanPlayer) return -SCORE.WIN - depth;
        if (this.isBoardFull(board)) return 0;
        if (depth === 0) return this.evaluateBoard(board);
        
        const validMoves = this.getValidMoves(board);
        const orderedMoves = this.orderMoves(validMoves);
        
        if (isMaximizing) {
            let maxScore = -Infinity;
            
            for (const col of orderedMoves) {
                const boardCopy = board.clone();
                boardCopy.dropToken(col, this.aiPlayer);
                
                const score = this.minimax(boardCopy, depth - 1, alpha, beta, false);
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                
                if (beta <= alpha) break; // Beta cutoff
            }
            
            return maxScore;
        } else {
            let minScore = Infinity;
            
            for (const col of orderedMoves) {
                const boardCopy = board.clone();
                boardCopy.dropToken(col, this.humanPlayer);
                
                const score = this.minimax(boardCopy, depth - 1, alpha, beta, true);
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                
                if (beta <= alpha) break; // Alpha cutoff
            }
            
            return minScore;
        }
    }
    
    /**
     * Evaluate the board position
     * @param {Board} board - Board to evaluate
     * @returns {number} Score for the position
     */
    evaluateBoard(board) {
        let score = 0;
        
        // Center column preference
        const centerCol = Math.floor(COLS / 2);
        for (let row = 0; row < ROWS; row++) {
            if (board.getCell(row, centerCol) === this.aiPlayer) {
                score += SCORE.CENTER_BONUS;
            } else if (board.getCell(row, centerCol) === this.humanPlayer) {
                score -= SCORE.CENTER_BONUS;
            }
        }
        
        // Evaluate all windows of 4
        score += this.evaluateAllWindows(board);
        
        return score;
    }
    
    /**
     * Evaluate all possible windows of 4 on the board
     * @param {Board} board - Board to evaluate
     * @returns {number} Total score from all windows
     */
    evaluateAllWindows(board) {
        let score = 0;
        
        // Horizontal windows
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const window = [
                    board.getCell(row, col),
                    board.getCell(row, col + 1),
                    board.getCell(row, col + 2),
                    board.getCell(row, col + 3)
                ];
                score += this.evaluateWindow(window);
            }
        }
        
        // Vertical windows
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                const window = [
                    board.getCell(row, col),
                    board.getCell(row + 1, col),
                    board.getCell(row + 2, col),
                    board.getCell(row + 3, col)
                ];
                score += this.evaluateWindow(window);
            }
        }
        
        // Diagonal (positive slope) windows
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const window = [
                    board.getCell(row, col),
                    board.getCell(row + 1, col + 1),
                    board.getCell(row + 2, col + 2),
                    board.getCell(row + 3, col + 3)
                ];
                score += this.evaluateWindow(window);
            }
        }
        
        // Diagonal (negative slope) windows
        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const window = [
                    board.getCell(row, col),
                    board.getCell(row - 1, col + 1),
                    board.getCell(row - 2, col + 2),
                    board.getCell(row - 3, col + 3)
                ];
                score += this.evaluateWindow(window);
            }
        }
        
        return score;
    }
    
    /**
     * Evaluate a window of 4 cells
     * @param {number[]} window - Array of 4 cell values
     * @returns {number} Score for this window
     */
    evaluateWindow(window) {
        let score = 0;
        
        const aiCount = window.filter(cell => cell === this.aiPlayer).length;
        const humanCount = window.filter(cell => cell === this.humanPlayer).length;
        const emptyCount = window.filter(cell => cell === EMPTY).length;
        
        // AI scoring
        if (aiCount === 4) {
            score += SCORE.WIN;
        } else if (aiCount === 3 && emptyCount === 1) {
            score += SCORE.THREE_IN_ROW;
        } else if (aiCount === 2 && emptyCount === 2) {
            score += SCORE.TWO_IN_ROW;
        }
        
        // Human blocking (penalize positions that help human)
        if (humanCount === 4) {
            score -= SCORE.WIN;
        } else if (humanCount === 3 && emptyCount === 1) {
            score -= SCORE.BLOCK_THREE;
        } else if (humanCount === 2 && emptyCount === 2) {
            score -= SCORE.BLOCK_TWO;
        }
        
        return score;
    }
    
    /**
     * Order moves for better alpha-beta pruning (center first)
     * @param {number[]} moves - Array of valid column indices
     * @returns {number[]} Ordered moves
     */
    orderMoves(moves) {
        const center = Math.floor(COLS / 2);
        return [...moves].sort((a, b) => {
            return Math.abs(center - a) - Math.abs(center - b);
        });
    }
    
    /**
     * Get all valid moves (non-full columns)
     * @param {Board} board - Current board
     * @returns {number[]} Array of valid column indices
     */
    getValidMoves(board) {
        const moves = [];
        for (let col = 0; col < COLS; col++) {
            if (!board.isColumnFull(col)) {
                moves.push(col);
            }
        }
        return moves;
    }
    
    /**
     * Check if there's a winner
     * @param {Board} board - Board to check
     * @returns {number|null} Winner player number or null
     */
    checkWinner(board) {
        // Check horizontal
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const cell = board.getCell(row, col);
                if (cell !== EMPTY &&
                    cell === board.getCell(row, col + 1) &&
                    cell === board.getCell(row, col + 2) &&
                    cell === board.getCell(row, col + 3)) {
                    return cell;
                }
            }
        }
        
        // Check vertical
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                const cell = board.getCell(row, col);
                if (cell !== EMPTY &&
                    cell === board.getCell(row + 1, col) &&
                    cell === board.getCell(row + 2, col) &&
                    cell === board.getCell(row + 3, col)) {
                    return cell;
                }
            }
        }
        
        // Check diagonal (positive slope)
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const cell = board.getCell(row, col);
                if (cell !== EMPTY &&
                    cell === board.getCell(row + 1, col + 1) &&
                    cell === board.getCell(row + 2, col + 2) &&
                    cell === board.getCell(row + 3, col + 3)) {
                    return cell;
                }
            }
        }
        
        // Check diagonal (negative slope)
        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const cell = board.getCell(row, col);
                if (cell !== EMPTY &&
                    cell === board.getCell(row - 1, col + 1) &&
                    cell === board.getCell(row - 2, col + 2) &&
                    cell === board.getCell(row - 3, col + 3)) {
                    return cell;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Check if board is full
     * @param {Board} board - Board to check
     * @returns {boolean} True if full
     */
    isBoardFull(board) {
        for (let col = 0; col < COLS; col++) {
            if (!board.isColumnFull(col)) {
                return false;
            }
        }
        return true;
    }
}

export default AI;
