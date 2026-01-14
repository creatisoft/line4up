import * as THREE from 'three';
import { createScene } from './scene/Scene.js';
import { createCamera } from './scene/Camera.js';
import { createLighting } from './scene/Lighting.js';
import { createControls } from './scene/Controls.js';
import { createBoardMesh } from './objects/BoardMesh.js';
import { TokenPool, getTokenPosition, getTokenStartPosition } from './objects/Token.js';
import { createColumnZones, createColumnHighlight, createPreviewToken, setColumnHighlight, setPreviewPosition } from './objects/Column.js';
import { Game, GAME_STATE, GAME_MODE } from './game/Game.js';
import { PLAYER_1, PLAYER_2 } from './game/Board.js';
import { Easing, animatePosition, pulseAnimation, glowAnimation } from './utils/Animation.js';
import { HUD } from './ui/HUD.js';
import { injectStyles } from './ui/GameStatus.js';
import { AI, DIFFICULTY } from './game/AI.js';
import { ThemeManager, THEMES } from './utils/ThemeManager.js';

/**
 * Main application class for Connect 4 game
 */
class Connect4App {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.lights = null;
        this.board = null;
        
        // Game components
        this.game = null;
        this.tokenPool = null;
        this.columnZones = null;
        this.columnHighlight = null;
        this.previewToken = null;
        this.placedTokens = [];
        
        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredColumn = -1;
        
        // Animation
        this.animatingTokens = [];
        this.winAnimations = [];
        
        // AI
        this.ai = null;
        this.aiMoveDelay = 800; // ms delay before AI makes move
        this.aiDifficulty = DIFFICULTY.MEDIUM;
        this.aiThinking = false; // Flag to prevent multiple AI moves
        
        // UI
        this.hud = null;
        
        // Theme
        this.themeManager = null;
        
        this.init();
    }
    
    /**
     * Initialize the Three.js application
     */
    init() {
        // Inject CSS styles for HUD
        injectStyles();
        
        // Get the container element
        const container = document.getElementById('app');
        
        // Create scene
        this.scene = createScene();
        
        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = createCamera(aspect);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // Create lighting
        this.lights = createLighting(this.scene);
        
        // Create orbital controls
        this.controls = createControls(this.camera, this.renderer.domElement);
        
        // Initialize game logic
        this.game = new Game();
        this.game.onStateChange = (state) => this.onGameStateChange(state);
        this.game.onTokenPlaced = (move) => this.onTokenPlaced(move);
        
        // Create theme manager
        this.themeManager = new ThemeManager();
        
        // Create AI opponent
        this.ai = new AI(this.aiDifficulty);
        
        // Create token pool (after theme manager)
        this.tokenPool = new TokenPool(this.themeManager);
        
        // Create the game board (after theme manager)
        this.board = createBoardMesh(this.themeManager);
        this.scene.add(this.board);
        
        // Create column interaction zones
        this.columnZones = createColumnZones();
        this.scene.add(this.columnZones);
        
        // Create column highlight (after theme manager)
        this.columnHighlight = createColumnHighlight(this.themeManager);
        this.scene.add(this.columnHighlight);
        
        // Create preview tokens for both players (after theme manager)
        this.previewTokens = {
            [PLAYER_1]: createPreviewToken(PLAYER_1, this.themeManager),
            [PLAYER_2]: createPreviewToken(PLAYER_2, this.themeManager)
        };
        this.scene.add(this.previewTokens[PLAYER_1]);
        this.scene.add(this.previewTokens[PLAYER_2]);
        
        // Create HUD
        this.hud = new HUD();
        this.hud.onRestart = () => this.restartGame();
        this.hud.onModeChange = (mode) => this.changeGameMode(mode);
        this.hud.onDifficultyChange = (difficulty) => this.changeDifficulty(difficulty);
        this.hud.onThemeChange = (theme) => this.changeTheme(theme);
        
        // Add a ground plane for reference
        this.addGroundPlane();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
        
        // Start the game
        this.game.startGame(GAME_MODE.PVP);
        
        console.log('Line4UP initialized!');
    }
    
    /**
     * Add a ground plane for visual reference
     */
    addGroundPlane() {
        const groundGeometry = new THREE.PlaneGeometry(30, 30);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x16213e,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;  // Rotate to be horizontal
        ground.position.y = 0;
        ground.receiveShadow = true;
        
        this.scene.add(ground);
    }
    
    /**
     * Set up mouse/touch event listeners
     */
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Mouse move for hover detection
        canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Click for token placement
        canvas.addEventListener('click', (event) => this.onMouseClick(event));
        
        // Touch support
        canvas.addEventListener('touchstart', (event) => this.onTouchStart(event));
    }
    
    /**
     * Handle mouse movement for column hover
     */
    onMouseMove(event) {
        // Calculate normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersection with column zones
        const intersects = this.raycaster.intersectObjects(this.columnZones.children);
        
        if (intersects.length > 0) {
            const col = intersects[0].object.userData.columnIndex;
            this.setHoveredColumn(col);
        } else {
            this.setHoveredColumn(-1);
        }
    }
    
    /**
     * Handle mouse click for token placement
     */
    onMouseClick(event) {
        if (this.hoveredColumn >= 0 && this.game.isValidMove(this.hoveredColumn)) {
            this.game.makeMove(this.hoveredColumn);
        }
    }
    
    /**
     * Handle touch events
     */
    onTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            
            const touch = event.touches[0];
            this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.columnZones.children);
            
            if (intersects.length > 0) {
                const col = intersects[0].object.userData.columnIndex;
                if (this.game.isValidMove(col)) {
                    this.game.makeMove(col);
                }
            }
        }
    }
    
    /**
     * Set the currently hovered column
     */
    setHoveredColumn(col) {
        this.hoveredColumn = col;
        
        // Don't show highlight during CPU turn
        if (this.game.isCPUTurn()) {
            this.columnHighlight.visible = false;
            this.previewTokens[PLAYER_1].visible = false;
            this.previewTokens[PLAYER_2].visible = false;
            return;
        }
        
        // Update highlight visibility
        if (col >= 0 && this.game.isValidMove(col)) {
            setColumnHighlight(this.columnHighlight, col);
            
            // Show preview token at target position
            const targetRow = this.game.board.findLowestRow(col);
            const currentPlayer = this.game.getCurrentPlayer();
            
            // Hide all preview tokens first
            this.previewTokens[PLAYER_1].visible = false;
            this.previewTokens[PLAYER_2].visible = false;
            
            // Show current player's preview
            setPreviewPosition(this.previewTokens[currentPlayer], col, targetRow);
        } else {
            this.columnHighlight.visible = false;
            this.previewTokens[PLAYER_1].visible = false;
            this.previewTokens[PLAYER_2].visible = false;
        }
    }
    
    /**
     * Handle game state changes
     */
    onGameStateChange(state) {
        console.log('Game state changed:', state);
        
        if (state.state === GAME_STATE.WIN) {
            this.hud.showWin(state.winner, state.winnerName);
            this.highlightWinningTokens(state.winningPositions);
        } else if (state.state === GAME_STATE.DRAW) {
            this.hud.showDraw();
        } else if (state.state === GAME_STATE.PLAYING) {
            this.hud.setTurn(state.currentPlayer, state.currentPlayerName);
            
            // Trigger AI move if it's CPU's turn
            if (this.game.isCPUTurn()) {
                this.makeAIMove();
            }
        }
    }
    
    /**
     * Make an AI move
     */
    makeAIMove() {
        // Prevent multiple AI moves being triggered simultaneously
        if (this.aiThinking) {
            return;
        }
        
        this.aiThinking = true;
        
        // Show thinking indicator
        this.hud.showThinking();
        
        // Disable hover/click during AI turn
        this.columnHighlight.visible = false;
        this.previewTokens[PLAYER_1].visible = false;
        this.previewTokens[PLAYER_2].visible = false;
        
        // Add delay before AI makes its move (more human-like)
        setTimeout(() => {
            try {
                // Get AI's best move
                const col = this.ai.getBestMove(this.game.board);
                
                // Hide thinking indicator
                this.hud.hideThinking();
                
                // Make the move
                if (col >= 0 && this.game.isValidMove(col)) {
                    this.game.makeMove(col);
                }
            } catch (error) {
                console.error('AI move error:', error);
                this.hud.hideThinking();
            } finally {
                this.aiThinking = false;
            }
        }, this.aiMoveDelay);
    }
    
    /**
     * Change AI difficulty
     * @param {string} difficulty - Difficulty level
     */
    changeDifficulty(difficulty) {
        this.aiDifficulty = difficulty;
        this.ai.setDifficulty(difficulty);
        console.log('AI difficulty set to:', difficulty);
    }
    
    /**
     * Change theme
     * @param {string} theme - Theme name
     */
    changeTheme(theme) {
        this.themeManager.setTheme(theme);
        console.log('Theme changed to:', theme);
    }
    
    /**
     * Handle token placement
     */
    onTokenPlaced(move) {
        const { row, col, player } = move;
        
        // Get a token from the pool
        const token = this.tokenPool.getToken(player);
        
        // Set start position (above board)
        const startPos = getTokenStartPosition(col);
        token.position.copy(startPos);
        
        // Add to scene
        this.scene.add(token);
        this.placedTokens.push({ mesh: token, row, col, player });
        
        // Animate to final position with bounce effect
        const endPos = getTokenPosition(row, col);
        animatePosition(token, endPos, 600, Easing.easeOutBounce);
    }
    
    /**
     * Highlight winning tokens
     */
    highlightWinningTokens(positions) {
        if (!positions) return;
        
        // Stop any existing win animations
        this.stopWinAnimations();
        
        for (const [row, col] of positions) {
            // Find the token at this position
            const tokenData = this.placedTokens.find(t => t.row === row && t.col === col);
            
            if (tokenData) {
                // Add pulse animation
                const pulseAnim = pulseAnimation(tokenData.mesh, 0.95, 1.15, 800);
                this.winAnimations.push(pulseAnim);
                
                // Add glow animation
                const glowAnim = glowAnimation(tokenData.mesh.material, 0.1, 0.6, 800);
                this.winAnimations.push(glowAnim);
            }
        }
    }
    
    /**
     * Stop all win animations
     */
    stopWinAnimations() {
        for (const anim of this.winAnimations) {
            if (anim && anim.stop) {
                anim.stop();
            }
        }
        this.winAnimations = [];
        
        // Reset all token materials
        for (const tokenData of this.placedTokens) {
            tokenData.mesh.material.emissiveIntensity = 0.1;
            tokenData.mesh.scale.set(1, 1, 1);
        }
    }
    
    /**
     * Restart the game
     */
    restartGame() {
        // Stop win animations
        this.stopWinAnimations();
        
        // Reset AI state
        this.aiThinking = false;
        this.hud.hideThinking();
        
        // Reset visual board
        this.resetBoard();
        
        // Reset HUD
        this.hud.reset();
        
        // Reset scores
        this.hud.resetScores();
        
        // Start new game with current mode
        this.game.startGame(this.game.gameMode);
    }
    
    /**
     * Change game mode
     */
    changeGameMode(mode) {
        const gameMode = mode === 'cpu' ? GAME_MODE.CPU : GAME_MODE.PVP;
        
        // Restart with new mode
        this.stopWinAnimations();
        
        // Reset AI state
        this.aiThinking = false;
        this.hud.hideThinking();
        
        this.resetBoard();
        this.hud.reset();
        
        // Reset scores when changing game mode
        this.hud.resetScores();
        
        this.game.startGame(gameMode);
    }
    
    /**
     * Reset the visual board
     */
    resetBoard() {
        // Remove all placed tokens from scene
        for (const tokenData of this.placedTokens) {
            this.scene.remove(tokenData.mesh);
        }
        this.placedTokens = [];
        
        // Return all tokens to pool
        this.tokenPool.returnAllTokens();
        
        // Reset highlights
        this.columnHighlight.visible = false;
        this.previewTokens[PLAYER_1].visible = false;
        this.previewTokens[PLAYER_2].visible = false;
    }
    
    /**
     * Handle window resize events
     */
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls (required for damping)
        this.controls.update();
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize application once when DOM is ready
let appInitialized = false;

function initApp() {
    if (!appInitialized) {
        appInitialized = true;
        new Connect4App();
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
