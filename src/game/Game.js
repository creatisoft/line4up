/**
 * Main game controller for Connect 4
 * Manages game state, turns, and coordinates between logic and visuals
 */

import { Board, PLAYER_1, PLAYER_2, EMPTY } from './Board.js';
import { checkWin } from './GameLogic.js';

export const GAME_STATE = {
    WAITING: 'waiting',      // Waiting to start
    PLAYING: 'playing',      // Game in progress
    WIN: 'win',              // Game won
    DRAW: 'draw',            // Game is a draw
    ANIMATING: 'animating'   // Token animation in progress
};

export const GAME_MODE = {
    PVP: 'pvp',      // Player vs Player
    CPU: 'cpu'       // Player vs CPU
};

export class Game {
    constructor() {
        this.board = new Board();
        this.currentPlayer = PLAYER_1;
        this.gameState = GAME_STATE.WAITING;
        this.gameMode = GAME_MODE.PVP;
        this.winner = null;
        this.winningPositions = null;
        this.moveHistory = [];
        this.onStateChange = null; // Callback for state changes
        this.onTokenPlaced = null; // Callback when token is placed
    }
    
    /**
     * Start a new game
     * @param {string} mode - Game mode ('pvp' or 'cpu')
     */
    startGame(mode = GAME_MODE.PVP) {
        this.board.reset();
        this.currentPlayer = PLAYER_1;
        this.gameState = GAME_STATE.PLAYING;
        this.gameMode = mode;
        this.winner = null;
        this.winningPositions = null;
        this.moveHistory = [];
        
        this.notifyStateChange();
    }
    
    /**
     * Reset the game to initial state
     */
    reset() {
        this.board.reset();
        this.currentPlayer = PLAYER_1;
        this.gameState = GAME_STATE.WAITING;
        this.winner = null;
        this.winningPositions = null;
        this.moveHistory = [];
        
        this.notifyStateChange();
    }
    
    /**
     * Attempt to make a move in a column
     * @param {number} col - Column index
     * @returns {Object|null} Move result {row, col, player} or null if invalid
     */
    makeMove(col) {
        // Check if move is valid
        if (this.gameState !== GAME_STATE.PLAYING) {
            console.log('Game is not in playing state');
            return null;
        }
        
        if (this.board.isColumnFull(col)) {
            console.log(`Column ${col} is full`);
            return null;
        }
        
        // Make the move
        const row = this.board.dropToken(col, this.currentPlayer);
        
        if (row === -1) {
            return null;
        }
        
        // Record move
        const move = {
            row,
            col,
            player: this.currentPlayer
        };
        this.moveHistory.push(move);
        
        // Notify that token was placed
        if (this.onTokenPlaced) {
            this.onTokenPlaced(move);
        }
        
        // Check for win
        const winResult = checkWin(this.board, row, col, this.currentPlayer);
        
        if (winResult) {
            this.gameState = GAME_STATE.WIN;
            this.winner = this.currentPlayer;
            this.winningPositions = winResult.positions;
            this.notifyStateChange();
            return move;
        }
        
        // Check for draw
        if (this.board.isFull()) {
            this.gameState = GAME_STATE.DRAW;
            this.notifyStateChange();
            return move;
        }
        
        // Switch players
        this.switchPlayer();
        this.notifyStateChange();
        
        return move;
    }
    
    /**
     * Switch to the other player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    }
    
    /**
     * Get the current player
     * @returns {number} Current player (1 or 2)
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    
    /**
     * Get player name/label
     * @param {number} player - Player number
     * @returns {string} Player name
     */
    getPlayerName(player) {
        if (player === PLAYER_1) {
            return 'Player 1 (Red)';
        } else if (player === PLAYER_2) {
            return this.gameMode === GAME_MODE.CPU ? 'CPU (Yellow)' : 'Player 2 (Yellow)';
        }
        return 'Unknown';
    }
    
    /**
     * Check if it's the CPU's turn
     * @returns {boolean} True if CPU should move
     */
    isCPUTurn() {
        return this.gameMode === GAME_MODE.CPU && 
               this.currentPlayer === PLAYER_2 && 
               this.gameState === GAME_STATE.PLAYING;
    }
    
    /**
     * Get valid moves (non-full columns)
     * @returns {number[]} Array of valid column indices
     */
    getValidMoves() {
        return this.board.getValidMoves();
    }
    
    /**
     * Check if a column is a valid move
     * @param {number} col - Column index
     * @returns {boolean} True if column is valid
     */
    isValidMove(col) {
        return this.gameState === GAME_STATE.PLAYING && !this.board.isColumnFull(col);
    }
    
    /**
     * Get the current game state info
     * @returns {Object} Game state information
     */
    getStateInfo() {
        return {
            state: this.gameState,
            currentPlayer: this.currentPlayer,
            currentPlayerName: this.getPlayerName(this.currentPlayer),
            winner: this.winner,
            winnerName: this.winner ? this.getPlayerName(this.winner) : null,
            winningPositions: this.winningPositions,
            moveCount: this.moveHistory.length,
            gameMode: this.gameMode
        };
    }
    
    /**
     * Notify listeners of state change
     */
    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange(this.getStateInfo());
        }
    }
    
    /**
     * Set animation state (prevents moves during animation)
     * @param {boolean} animating - Whether animation is in progress
     */
    setAnimating(animating) {
        if (animating && this.gameState === GAME_STATE.PLAYING) {
            this.gameState = GAME_STATE.ANIMATING;
        } else if (!animating && this.gameState === GAME_STATE.ANIMATING) {
            this.gameState = GAME_STATE.PLAYING;
        }
    }
}

export default Game;
