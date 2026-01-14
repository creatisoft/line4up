# Connect 4 Game - Implementation Plan

## Project Overview
A 3D remake of the classic Connect 4 game using Three.js, featuring a 6-row by 7-column grid where players take turns dropping colored tokens to form a line of four.

## Game Rules
- **Grid**: 6 rows × 7 columns vertically suspended grid
- **Players**: 2 players with distinct colored tokens
- **Gameplay**: Players alternate dropping tokens into columns
- **Physics**: Tokens fall straight down to the lowest available space
- **Win Condition**: First player to form a horizontal, vertical, or diagonal line of 4 tokens wins
- **Game Type**: m,n,k-game (7, 6, 4) with restricted piece placement

## Technical Architecture

### Core Technologies
- **Three.js**: 3D rendering engine
- **JavaScript/ES6+**: Game logic and interaction
- **HTML5/CSS3**: UI structure and styling

### Project Structure
```
line4up/
├── index.html              # Main entry point
├── package.json            # Dependencies
├── public/                 # Static assets
├── src/
│   ├── main.js            # Application entry
│   ├── game/
│   │   ├── Game.js        # Main game controller
│   │   ├── Board.js       # Board state management
│   │   ├── GameLogic.js   # Win detection & rules
│   │   └── AI.js          # CPU opponent logic
│   ├── scene/
│   │   ├── Scene.js       # Three.js scene setup
│   │   ├── Camera.js      # Camera configuration
│   │   ├── Lighting.js    # Scene lighting
│   │   └── Controls.js    # Orbit/interaction controls
│   ├── objects/
│   │   ├── BoardMesh.js   # 3D board representation
│   │   ├── Token.js       # Token mesh and animations
│   │   └── Column.js      # Column interaction zones
│   ├── ui/
│   │   ├── HUD.js         # On-screen UI overlay
│   │   └── GameStatus.js  # Turn indicator & messages
│   └── utils/
│       ├── Raycaster.js   # Mouse interaction detection
│       └── Animation.js   # Token drop animations
```

## Three.js Implementation Details

### 1. Scene Setup
- **Scene**: Dark background with ambient atmosphere
- **Camera**: PerspectiveCamera positioned at an angle to view the entire board
- **Renderer**: WebGLRenderer with antialiasing
- **Lighting**:
  - Ambient light for overall illumination
  - Directional lights for depth and shadows
  - Point lights for token highlights

### 2. Board Representation
- **Geometry**: BoxGeometry or custom geometry for the frame
- **Material**: MeshStandardMaterial with blue color (classic Connect 4 look)
- **Grid Slots**: Cylinder cutouts or transparent sections showing the 6×7 grid
- **Positioning**: Centered at origin, standing vertically

### 3. Token Design
- **Geometry**: CylinderGeometry (disc shape)
- **Materials**:
  - Player 1: Red MeshStandardMaterial with metallic properties
  - Player 2: Yellow MeshStandardMaterial with metallic properties
- **Dimensions**: Sized to fit snugly within board columns
- **Animation**: Smooth drop animation using Tween.js or custom interpolation

### 4. Interaction System
- **Raycasting**: Detect mouse hover over columns
- **Column Highlighting**: Visual feedback showing which column is selected
- **Click Detection**: Capture clicks to drop tokens
- **Invalid Move Feedback**: Visual/audio cue when column is full

## Game Logic Implementation

### 1. Board State Management
```javascript
// 2D array representing the board
board = [
  [0, 0, 0, 0, 0, 0, 0],  // Row 5 (top)
  [0, 0, 0, 0, 0, 0, 0],  // Row 4
  [0, 0, 0, 0, 0, 0, 0],  // Row 3
  [0, 0, 0, 0, 0, 0, 0],  // Row 2
  [0, 0, 0, 0, 0, 0, 0],  // Row 1
  [0, 0, 0, 0, 0, 0, 0]   // Row 0 (bottom)
]
// 0 = empty, 1 = player 1, 2 = player 2
```

### 2. Core Game Functions
- `dropToken(column, player)`: Add token to board state
- `findLowestRow(column)`: Find next available row in column
- `checkWin(row, col, player)`: Check for winning condition
- `checkDirection(row, col, dx, dy, player)`: Check line in specific direction
- `isColumnFull(column)`: Validate move legality
- `switchPlayer()`: Toggle between players
- `resetGame()`: Clear board and restart

### 3. Win Detection Algorithm
Check four directions from each placed token:
- **Horizontal**: (dx=1, dy=0)
- **Vertical**: (dx=0, dy=1)
- **Diagonal Right**: (dx=1, dy=1)
- **Diagonal Left**: (dx=1, dy=-1)

For each direction, count consecutive tokens in both directions and check if total ≥ 4.

### 4. AI Opponent System
- `evaluateBoard(board, player)`: Score the board position
- `minimax(board, depth, alpha, beta, maximizingPlayer)`: Minimax with alpha-beta pruning
- `getBestMove(board, difficulty)`: Get AI's next move based on difficulty
- `getValidMoves(board)`: Return array of non-full columns
- `simulateMove(board, column, player)`: Create board copy with simulated move
- `scorePosition(board, player)`: Evaluate board state with heuristics

## Visual Design Considerations

### Color Scheme
- **Board**: Classic blue (#0052CC or similar)
- **Player 1 Tokens**: Red (#E63946)
- **Player 2 Tokens**: Yellow (#FFD60A)
- **Background**: Dark gradient (#1a1a2e to #16213e)
- **Highlights**: Bright white or cyan for selection feedback

### Camera Position
- Position: Slightly above and in front of board (e.g., `[0, 3, 8]`)
- LookAt: Center of board `[0, 2.5, 0]`
- FOV: 60-75 degrees
- Allow orbital controls for better viewing angles

### Animations
- **Token Drop**: 
  - Duration: 0.5-0.8 seconds
  - Easing: EaseInQuad (accelerating fall)
  - Bounce effect on landing (optional)
- **Win Animation**:
  - Highlight winning tokens with glow effect
  - Pulsating animation or rotation
  - Particle effects (optional)
- **Column Hover**: Subtle scale or opacity change

## User Interaction Flow

### 1. Game Start
- Display welcome screen/overlay
- Show "Player 1's Turn" indicator
- Board is interactive

### 2. Turn Sequence
- Player hovers over columns → column highlights
- Player clicks column → token drops with animation
- Board state updates
- Check for win condition
- If no win, switch players and continue
- If win, display winner and offer restart

### 3. End Game
- Highlight winning four tokens
- Display winner message
- Show "Play Again" button
- Optional: Track score across multiple games

## Implementation Phases

### Phase 1: Basic Three.js Setup ✅ COMPLETED
- [x] Initialize Three.js scene, camera, renderer
- [x] Add basic lighting
- [x] Create board geometry and material
- [x] Set up animation loop
- [x] Add orbital controls for testing

### Phase 2: Game State & Logic ✅ COMPLETED
- [x] Implement board state array
- [x] Create token drop logic
- [x] Implement findLowestRow function
- [x] Build win detection algorithm
- [x] Add player switching mechanism

### Phase 3: 3D Objects & Visuals ✅ COMPLETED
- [x] Create token meshes
- [x] Design board with column slots
- [x] Add materials and textures
- [x] Implement token pool (pre-created objects)
- [x] Position board and tokens correctly

### Phase 4: Interaction System ✅ COMPLETED
- [x] Set up raycasting for mouse input
- [x] Detect column hover
- [x] Implement click handler
- [x] Add column highlighting
- [x] Validate moves (full column check)

### Phase 5: Animations ✅ COMPLETED
- [x] Implement token drop animation
- [x] Add easing functions
- [x] Create win animation sequence
- [x] Polish hover effects
- [x] Add transition effects

### Phase 6: UI/UX ✅ COMPLETED
- [x] Create HUD overlay
- [x] Add turn indicator
- [x] Display game status messages
- [x] Implement restart button
- [x] Add score tracking

### Phase 7: AI Opponent Implementation ✅ COMPLETED
- [x] Implement minimax algorithm
- [x] Add alpha-beta pruning optimization
- [x] Create board evaluation function
- [x] Implement difficulty levels (Easy, Medium, Hard)
- [x] Add AI move delay for natural feel
- [x] Create game mode selector (PvP vs CPU)

### Phase 8: Polish & Features ✅ COMPLETED
- [x] Tokens visible on both sides when board is rotated
- [x] Drop preview showing where token will land
- [x] Turn indicator moved to lower left corner
- [x] Color-matched turn indicator styling (red/yellow borders)
- [x] Player switching between Player 1 and Player 2
- [ ] Add sound effects (optional)
- [ ] Responsive design improvements

## Key Technical Challenges

### 1. Token Drop Animation
**Challenge**: Smooth, physics-based falling animation
**Solution**: Use requestAnimationFrame with interpolation or Tween.js library

### 2. Raycasting Precision
**Challenge**: Accurately detecting which column is being hovered/clicked
**Solution**: Create invisible BoxGeometry meshes for each column as hit targets

### 3. Win Detection Performance
**Challenge**: Efficiently checking win condition after each move
**Solution**: Only check from the last placed token, not the entire board

### 4. State Synchronization
**Challenge**: Keeping 3D visual state in sync with game logic state
**Solution**: Maintain single source of truth (board array) and update visuals from it

## Performance Considerations

- **Object Pooling**: Pre-create token meshes instead of generating on-demand
- **Geometry Reuse**: Use instanced meshes if rendering many similar objects
- **Texture Optimization**: Use compressed textures and appropriate resolutions
- **Shadow Mapping**: Limit shadow-casting objects if performance is an issue
- **Animation**: Use CSS transforms for UI elements instead of Canvas rendering

## AI Opponent Implementation

### Overview
Implement a CPU opponent with three difficulty levels using the minimax algorithm with alpha-beta pruning for optimal move selection.

### Difficulty Levels

#### Easy (Depth 1-2)
- **Strategy**: Random valid moves with occasional good moves
- **Implementation**: 70% random moves, 30% minimax depth 1
- **Behavior**: Makes obvious mistakes, suitable for beginners
- **Search Depth**: 1 ply

#### Medium (Depth 3-4)
- **Strategy**: Balanced gameplay with tactical awareness
- **Implementation**: Minimax algorithm with depth 3-4
- **Behavior**: Blocks obvious threats, sets up some wins
- **Search Depth**: 3-4 plies
- **Features**: Can see 2 moves ahead

#### Hard (Depth 5-6)
- **Strategy**: Near-optimal play with full lookahead
- **Implementation**: Minimax with alpha-beta pruning, depth 5-6
- **Behavior**: Difficult to beat, plays strategically
- **Search Depth**: 5-6 plies
- **Features**: Full board evaluation, threat detection

### Minimax Algorithm

```javascript
function minimax(board, depth, alpha, beta, maximizingPlayer, aiPlayer) {
    // Base cases
    if (depth === 0 || isTerminalNode(board)) {
        return evaluateBoard(board, aiPlayer);
    }
    
    const validMoves = getValidMoves(board);
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let col of validMoves) {
            const newBoard = simulateMove(board, col, aiPlayer);
            const eval = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const opponent = aiPlayer === 1 ? 2 : 1;
        for (let col of validMoves) {
            const newBoard = simulateMove(board, col, opponent);
            const eval = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }
        return minEval;
    }
}
```

### Board Evaluation Function

```javascript
function evaluateBoard(board, player) {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    
    // Check all possible windows of 4
    // Horizontal windows
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            const window = [board[row][col], board[row][col+1], 
                          board[row][col+2], board[row][col+3]];
            score += evaluateWindow(window, player);
        }
    }
    
    // Vertical windows
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
            const window = [board[row][col], board[row+1][col], 
                          board[row+2][col], board[row+3][col]];
            score += evaluateWindow(window, player);
        }
    }
    
    // Diagonal windows (positive slope)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const window = [board[row][col], board[row+1][col+1], 
                          board[row+2][col+2], board[row+3][col+3]];
            score += evaluateWindow(window, player);
        }
    }
    
    // Diagonal windows (negative slope)
    for (let row = 3; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            const window = [board[row][col], board[row-1][col+1], 
                          board[row-2][col+2], board[row-3][col+3]];
            score += evaluateWindow(window, player);
        }
    }
    
    // Center column preference (strategic advantage)
    const centerCol = 3;
    let centerCount = 0;
    for (let row = 0; row < 6; row++) {
        if (board[row][centerCol] === player) centerCount++;
    }
    score += centerCount * 3;
    
    return score;
}

function evaluateWindow(window, player) {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    
    const playerCount = window.filter(cell => cell === player).length;
    const opponentCount = window.filter(cell => cell === opponent).length;
    const emptyCount = window.filter(cell => cell === 0).length;
    
    // Winning position
    if (playerCount === 4) {
        score += 100;
    }
    // Three in a row with one empty (strong)
    else if (playerCount === 3 && emptyCount === 1) {
        score += 5;
    }
    // Two in a row with two empty (potential)
    else if (playerCount === 2 && emptyCount === 2) {
        score += 2;
    }
    
    // Opponent threatening positions (need to block)
    if (opponentCount === 3 && emptyCount === 1) {
        score -= 4;
    }
    
    return score;
}
```

### AI Move Selection

```javascript
function getBestMove(board, difficulty) {
    const validMoves = getValidMoves(board);
    
    if (validMoves.length === 0) return null;
    
    switch(difficulty) {
        case 'easy':
            // 70% random, 30% smart
            if (Math.random() < 0.7) {
                return validMoves[Math.floor(Math.random() * validMoves.length)];
            }
            return getBestMoveWithDepth(board, 1);
            
        case 'medium':
            return getBestMoveWithDepth(board, 3);
            
        case 'hard':
            return getBestMoveWithDepth(board, 5);
            
        default:
            return getBestMoveWithDepth(board, 3);
    }
}

function getBestMoveWithDepth(board, depth) {
    const validMoves = getValidMoves(board);
    let bestScore = -Infinity;
    let bestMove = validMoves[0];
    
    for (let col of validMoves) {
        const newBoard = simulateMove(board, col, AI_PLAYER);
        const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, AI_PLAYER);
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = col;
        }
    }
    
    return bestMove;
}
```

### Game Mode Integration

```javascript
class Game {
    constructor() {
        this.mode = 'pvp'; // 'pvp' or 'cpu'
        this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
        this.aiPlayer = 2; // AI plays as player 2
        this.isAIThinking = false;
    }
    
    async handleColumnClick(column) {
        if (this.isAIThinking) return; // Prevent moves during AI turn
        
        // Human player makes move
        this.dropToken(column, this.currentPlayer);
        
        if (this.checkWin()) {
            this.handleWin();
            return;
        }
        
        this.switchPlayer();
        
        // If CPU mode and now AI's turn
        if (this.mode === 'cpu' && this.currentPlayer === this.aiPlayer) {
            this.isAIThinking = true;
            await this.makeAIMove();
            this.isAIThinking = false;
        }
    }
    
    async makeAIMove() {
        // Add delay for natural feel (500-1500ms based on difficulty)
        const delay = this.difficulty === 'easy' ? 500 : 
                     this.difficulty === 'medium' ? 1000 : 1500;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const bestColumn = getBestMove(this.board, this.difficulty);
        
        if (bestColumn !== null) {
            this.dropToken(bestColumn, this.aiPlayer);
            
            if (this.checkWin()) {
                this.handleWin();
                return;
            }
            
            this.switchPlayer();
        }
    }
}
```

### UI Components for AI Mode

#### Game Mode Selector
```javascript
// HTML Structure
<div id="game-mode-selector">
    <button id="mode-pvp" class="mode-btn active">Player vs Player</button>
    <button id="mode-cpu" class="mode-btn">Player vs CPU</button>
</div>

<div id="difficulty-selector" style="display: none;">
    <label>Difficulty:</label>
    <button class="diff-btn" data-difficulty="easy">Easy</button>
    <button class="diff-btn active" data-difficulty="medium">Medium</button>
    <button class="diff-btn" data-difficulty="hard">Hard</button>
</div>
```

#### AI Thinking Indicator
```javascript
// Show during AI's turn
<div id="ai-thinking" style="display: none;">
    <div class="thinking-animation">🤔</div>
    <p>CPU is thinking...</p>
</div>
```

### Optimization Techniques

#### 1. Transposition Table (Optional)
```javascript
const transpositionTable = new Map();

function getBoardHash(board) {
    return board.flat().join(',');
}

function minimaxWithMemo(board, depth, alpha, beta, maximizingPlayer, aiPlayer) {
    const hash = getBoardHash(board);
    
    if (transpositionTable.has(hash)) {
        return transpositionTable.get(hash);
    }
    
    const result = minimax(board, depth, alpha, beta, maximizingPlayer, aiPlayer);
    transpositionTable.set(hash, result);
    
    return result;
}
```

#### 2. Move Ordering
```javascript
// Prioritize center columns for better pruning
function getValidMovesOrdered(board) {
    const validMoves = getValidMoves(board);
    const centerCol = 3;
    
    return validMoves.sort((a, b) => {
        return Math.abs(centerCol - a) - Math.abs(centerCol - b);
    });
}
```

#### 3. Iterative Deepening (Advanced)
```javascript
function getBestMoveIterative(board, maxDepth, timeLimit) {
    let bestMove = null;
    const startTime = Date.now();
    
    for (let depth = 1; depth <= maxDepth; depth++) {
        if (Date.now() - startTime > timeLimit) break;
        
        bestMove = getBestMoveWithDepth(board, depth);
    }
    
    return bestMove;
}
```

### Testing AI

#### Test Cases
1. **Immediate Win Detection**: AI should take winning move when available
2. **Block Opponent Win**: AI should block opponent's winning move
3. **Two-Move Setup**: AI should recognize and execute two-move win setups
4. **Center Preference**: AI should prefer center columns when equal options
5. **Trap Avoidance**: AI should avoid moves that create opponent win opportunities

#### Performance Metrics
- **Move Time**: < 2 seconds on Hard difficulty
- **Memory Usage**: < 50MB for transposition table
- **Win Rate**: Easy ~30%, Medium ~60%, Hard ~90% vs random play

### AI Behavior Refinements

- **Opening Book**: Pre-computed optimal first moves
- **Random Variation**: Add small randomness to avoid predictable play
- **Personality**: Adjust evaluation weights for aggressive/defensive styles
- **Learning**: Optional - store successful strategies (future enhancement)

## Future Enhancements

1. **Multiplayer**: WebSocket integration for online play
2. **Advanced AI**: Neural network-based opponent
3. ~~**Themes**: Different board and token styles~~ ✅ **COMPLETED** - Classic and Dark themes implemented
4. **Power-ups**: Special tokens with unique abilities (variant gameplay)
5. **Tournament Mode**: Bracket-style competitions
6. **Replay System**: Save and playback games
7. **Leaderboard**: Track wins and statistics
8. **Mobile Support**: Touch controls and responsive layout

## Development Notes

- Start with basic 2D logic before adding 3D visuals
- Test win detection thoroughly with edge cases
- Keep game logic separate from rendering code
- Use event-driven architecture for clean code
- Consider using a state machine for game flow
- Implement proper error handling and validation
- Add debug mode for development (show board state, raycasts, etc.)

## Resources & References

- Three.js Documentation: https://threejs.org/docs/
- Connect 4 Game Theory: https://en.wikipedia.org/wiki/Connect_Four
- WebGL Best Practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Minimax Algorithm: For future AI implementation

---

**Project Status**: Planning Phase  
**Next Step**: Phase 1 - Basic Three.js Setup  
**Target Platform**: Modern web browsers with WebGL support
