/**
 * HUD (Heads-Up Display) for Connect 4
 * Manages all UI overlay elements
 */

export class HUD {
    constructor() {
        this.container = null;
        this.turnIndicator = null;
        this.statusMessage = null;
        this.restartButton = null;
        this.scoreDisplay = null;
        this.modeSelector = null;
        this.difficultySelector = null;
        
        this.scores = {
            player1: 0,
            player2: 0
        };
        
        this.onRestart = null;
        this.onModeChange = null;
        this.onDifficultyChange = null;
        this.onThemeChange = null;
        
        this.createElements();
    }
    
    /**
     * Create all HUD DOM elements
     */
    createElements() {
        // Main container
        this.container = document.createElement('div');
        this.container.id = 'game-hud';
        this.container.innerHTML = `
            <div class="hud-top">
                <div class="game-title">Line4UP</div>
                <div class="mode-selector">
                    <button class="mode-btn active" data-mode="pvp">👥 PvP</button>
                    <button class="mode-btn" data-mode="cpu">🤖 vs CPU</button>
                </div>
                <div class="difficulty-selector" style="display: none;">
                    <span class="difficulty-label">Difficulty:</span>
                    <button class="diff-btn" data-difficulty="easy">Easy</button>
                    <button class="diff-btn active" data-difficulty="medium">Medium</button>
                    <button class="diff-btn" data-difficulty="hard">Hard</button>
                </div>
            </div>
            
            <div class="hud-center">
                <div class="status-message"></div>
            </div>
            
            <div class="hud-bottom-left">
                <div class="turn-indicator player1-turn">
                    <div class="player-token player1"></div>
                    <span class="turn-text">Player 1's Turn</span>
                </div>
            </div>
            
            <div class="hud-bottom">
                <div class="score-display">
                    <div class="score player1-score">
                        <div class="score-token player1"></div>
                        <span class="score-label">Player 1</span>
                        <span class="score-value">0</span>
                    </div>
                    <div class="score-divider">-</div>
                    <div class="score player2-score">
                        <span class="score-value">0</span>
                        <span class="score-label">Player 2</span>
                        <div class="score-token player2"></div>
                    </div>
                </div>
                <button class="restart-btn" style="display: none;">🔄 Play Again</button>
                <button class="new-game-btn">🎮 New Game</button>
            </div>
            
            <div class="hud-bottom-right">
                <div class="theme-selector">
                    <button class="theme-btn active" data-theme="classic">🎯 Classic</button>
                    <button class="theme-btn" data-theme="dark">🌙 Dark</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Cache element references
        this.turnIndicator = this.container.querySelector('.turn-indicator');
        this.turnText = this.container.querySelector('.turn-text');
        this.turnToken = this.container.querySelector('.turn-indicator .player-token');
        this.statusMessage = this.container.querySelector('.status-message');
        this.restartButton = this.container.querySelector('.restart-btn');
        this.newGameButton = this.container.querySelector('.new-game-btn');
        this.player1Score = this.container.querySelector('.player1-score .score-value');
        this.player2Score = this.container.querySelector('.player2-score .score-value');
        this.player2Label = this.container.querySelector('.player2-score .score-label');
        this.modeButtons = this.container.querySelectorAll('.mode-btn');
        this.difficultySelector = this.container.querySelector('.difficulty-selector');
        this.difficultyButtons = this.container.querySelectorAll('.diff-btn');
        this.themeButtons = this.container.querySelectorAll('.theme-btn');
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up button click handlers
     */
    setupEventListeners() {
        this.restartButton.addEventListener('click', () => {
            if (this.onRestart) this.onRestart();
        });
        
        this.newGameButton.addEventListener('click', () => {
            if (this.onRestart) this.onRestart();
        });
        
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setActiveMode(mode);
                if (this.onModeChange) this.onModeChange(mode);
            });
        });
        
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.target.dataset.difficulty;
                this.setActiveDifficulty(difficulty);
                if (this.onDifficultyChange) this.onDifficultyChange(difficulty);
            });
        });
        
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setActiveTheme(theme);
                if (this.onThemeChange) this.onThemeChange(theme);
            });
        });
    }
    
    /**
     * Set the active game mode button
     */
    setActiveMode(mode) {
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Update player 2 label
        this.player2Label.textContent = mode === 'cpu' ? 'CPU' : 'Player 2';
        
        // Show/hide difficulty selector
        this.difficultySelector.style.display = mode === 'cpu' ? 'flex' : 'none';
    }
    
    /**
     * Set the active difficulty button
     */
    setActiveDifficulty(difficulty) {
        this.difficultyButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
    }
    
    /**
     * Set the active theme button
     */
    setActiveTheme(theme) {
        this.themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
    
    /**
     * Update the turn indicator
     * @param {number} player - Current player (1 or 2)
     * @param {string} name - Player name
     */
    setTurn(player, name) {
        this.turnToken.className = `player-token player${player}`;
        this.turnText.textContent = `${name}'s Turn`;
        this.turnIndicator.className = `turn-indicator player${player}-turn`;
        this.turnIndicator.style.display = 'flex';
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
    }
    
    /**
     * Show win message
     * @param {number} player - Winning player
     * @param {string} name - Winner name
     */
    showWin(player, name) {
        this.turnIndicator.style.display = 'none';
        this.statusMessage.textContent = `🎉 ${name} Wins! 🎉`;
        this.statusMessage.className = `status-message win player${player}-win`;
        this.restartButton.style.display = 'block';
        
        // Update score
        if (player === 1) {
            this.scores.player1++;
            this.player1Score.textContent = this.scores.player1;
        } else {
            this.scores.player2++;
            this.player2Score.textContent = this.scores.player2;
        }
    }
    
    /**
     * Show draw message
     */
    showDraw() {
        this.turnIndicator.style.display = 'none';
        this.statusMessage.textContent = "🤝 It's a Draw! 🤝";
        this.statusMessage.className = 'status-message draw';
        this.restartButton.style.display = 'block';
    }
    
    /**
     * Show thinking indicator (for CPU)
     */
    showThinking() {
        this.statusMessage.textContent = '🤔 CPU is thinking...';
        this.statusMessage.className = 'status-message thinking';
    }
    
    /**
     * Hide thinking indicator
     */
    hideThinking() {
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
    }
    
    /**
     * Reset HUD for new game
     */
    reset() {
        this.restartButton.style.display = 'none';
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
        this.turnIndicator.style.display = 'flex';
    }
    
    /**
     * Reset scores
     */
    resetScores() {
        this.scores.player1 = 0;
        this.scores.player2 = 0;
        this.player1Score.textContent = '0';
        this.player2Score.textContent = '0';
    }
    
    /**
     * Remove HUD from DOM
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export default HUD;
