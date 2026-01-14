/**
 * CSS Styles for Connect 4 HUD
 * Inject these styles into the document
 */

export const hudStyles = `
/* CSS Custom Properties for Theming */
:root {
    --theme-primary: #E63946;
    --theme-secondary: #FFD60A;
    --theme-background: rgba(0, 0, 0, 0.4);
    --theme-text: #ffffff;
    --theme-accent: #4fc3f7;
}

/* HUD Container */
#game-hud {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 100;
}

#game-hud > * {
    pointer-events: auto;
}

/* Top Section */
.hud-top {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
}

.game-title {
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
}

.game-title::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #E63946, #FFD60A);
    border-radius: 50%;
    margin-left: 8px;
    vertical-align: middle;
}

/* Mode Selector */
.mode-selector {
    display: flex;
    gap: 10px;
}

.mode-btn {
    padding: 10px 20px;
    font-size: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    background: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.mode-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
}

.mode-btn.active {
    background: rgba(79, 195, 247, 0.4);
    border-color: #4fc3f7;
    box-shadow: 0 0 15px rgba(79, 195, 247, 0.4);
}

/* Difficulty Selector */
.difficulty-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 20px;
}

.difficulty-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-right: 5px;
}

.diff-btn {
    padding: 8px 16px;
    font-size: 0.9rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
}

.diff-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
}

.diff-btn.active {
    background: rgba(255, 152, 0, 0.4);
    border-color: #ff9800;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);
}

.diff-btn[data-difficulty="easy"].active {
    background: rgba(76, 175, 80, 0.4);
    border-color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}

.diff-btn[data-difficulty="hard"].active {
    background: rgba(244, 67, 54, 0.4);
    border-color: #f44336;
    box-shadow: 0 0 10px rgba(244, 67, 54, 0.4);
}

/* Center Section */
.hud-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
}

/* Bottom Left Section - Turn Indicator */
.hud-bottom-left {
    position: absolute;
    bottom: 20px;
    left: 20px;
}

/* Turn Indicator */
.turn-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 24px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50px;
    backdrop-filter: blur(10px);
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

.turn-indicator.player1-turn {
    border-color: var(--theme-primary);
    box-shadow: 0 0 20px rgba(230, 57, 70, 0.4);
}

.turn-indicator.player2-turn {
    border-color: var(--theme-secondary);
    box-shadow: 0 0 20px rgba(255, 214, 10, 0.4);
}

.player-token {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.player-token.player1 {
    background: radial-gradient(circle at 30% 30%, var(--theme-primary), var(--theme-primary));
}

.player-token.player2 {
    background: radial-gradient(circle at 30% 30%, var(--theme-secondary), var(--theme-secondary));
}

.turn-text {
    font-size: 1.1rem;
    color: var(--theme-text);
    font-weight: 600;
}

.player1-turn .turn-text {
    color: var(--theme-primary);
}

.player2-turn .turn-text {
    color: var(--theme-secondary);
}

/* Status Message */
.status-message {
    font-size: 1.5rem;
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    padding: 15px 30px;
    border-radius: 15px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-message.win {
    background: rgba(0, 0, 0, 0.7);
    animation: winPulse 1s ease-in-out infinite;
}

.status-message.player1-win {
    border: 2px solid #E63946;
    box-shadow: 0 0 30px rgba(230, 57, 70, 0.5);
}

.status-message.player2-win {
    border: 2px solid #FFD60A;
    box-shadow: 0 0 30px rgba(255, 214, 10, 0.5);
}

.status-message.draw {
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid #4fc3f7;
    box-shadow: 0 0 20px rgba(79, 195, 247, 0.4);
}

.status-message.thinking {
    background: rgba(0, 0, 0, 0.5);
    font-size: 1rem;
    animation: thinking 1.5s ease-in-out infinite;
}

@keyframes winPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes thinking {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
}

/* Bottom Section */
.hud-bottom {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 0 30px;
}

/* Bottom Right Section */
.hud-bottom-right {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

/* Theme Selector */
.theme-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.theme-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    background: var(--theme-background);
    color: var(--theme-text);
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    min-width: 100px;
    text-align: left;
}

.theme-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
}

.theme-btn.active {
    background: var(--theme-accent);
    border-color: var(--theme-accent);
    box-shadow: 0 0 15px rgba(79, 195, 247, 0.4);
}

/* Score Display */
.score-display {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 15px 30px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50px;
    backdrop-filter: blur(10px);
}

.score {
    display: flex;
    align-items: center;
    gap: 10px;
}

.score-token {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.score-token.player1 {
    background: radial-gradient(circle at 30% 30%, var(--theme-primary), var(--theme-primary));
}

.score-token.player2 {
    background: radial-gradient(circle at 30% 30%, var(--theme-secondary), var(--theme-secondary));
}

.score-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.score-value {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
}

.score-divider {
    color: rgba(255, 255, 255, 0.3);
    font-size: 1.5rem;
}

/* Buttons */
.restart-btn, .new-game-btn {
    padding: 12px 30px;
    font-size: 1.1rem;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.restart-btn {
    background: linear-gradient(135deg, #4fc3f7, #0288d1);
    color: white;
    box-shadow: 0 4px 15px rgba(79, 195, 247, 0.4);
}

.restart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 195, 247, 0.6);
}

.new-game-btn {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.new-game-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

/* Responsive */
@media (max-width: 600px) {
    .game-title {
        font-size: 1.5rem;
    }
    
    .mode-btn {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
    
    .turn-indicator {
        padding: 10px 20px;
    }
    
    .turn-text {
        font-size: 1rem;
    }
    
    .status-message {
        font-size: 1.2rem;
        padding: 10px 20px;
    }
    
    .score-display {
        padding: 10px 20px;
    }
    
    .score-value {
        font-size: 1.2rem;
    }
    
    .theme-selector {
        gap: 6px;
    }
    
    .theme-btn {
        padding: 8px 12px;
        font-size: 0.8rem;
        min-width: 80px;
    }
}
`;

/**
 * Inject HUD styles into the document
 */
export function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'hud-styles';
    styleElement.textContent = hudStyles;
    document.head.appendChild(styleElement);
}

export default injectStyles;
