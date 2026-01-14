# Line4UP - 3D Connect 4 Game

A modern 3D remake of the classic Connect 4 game built with **Three.js**. Play against an intelligent AI opponent in a beautiful 3D environment with interactive gameplay and smooth animations.

## 🎮 Features

- **3D Graphics**: Immersive 3D board and token animations powered by Three.js
- **AI Opponent**: Intelligent CPU opponent with adjustable difficulty levels
- **Interactive Gameplay**: Click columns to drop tokens with physics-based animations
- **Win Detection**: Automatic detection of horizontal, vertical, and diagonal wins
- **Theme Support**: Multiple visual themes for customization
- **Responsive UI**: Real-time game status updates and turn indicators
- **Smooth Animations**: Fluid token drop and fall animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/line4up.git
cd line4up
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173` (or the port shown in your terminal).

## 🏗️ Build

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
line4up/
├── index.html              # Main entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── public/                 # Static assets
└── src/
    ├── main.js            # Application entry and main game loop
    ├── game/              # Game logic and AI
    │   ├── Game.js        # Main game controller
    │   ├── Board.js       # Board state management
    │   ├── GameLogic.js   # Win condition detection
    │   └── AI.js          # CPU opponent with difficulty levels
    ├── scene/             # Three.js scene setup
    │   ├── Scene.js       # Scene initialization
    │   ├── Camera.js      # Camera configuration
    │   ├── Lighting.js    # Dynamic lighting setup
    │   └── Controls.js    # Orbit and interaction controls
    ├── objects/           # 3D object definitions
    │   ├── BoardMesh.js   # 3D board geometry and rendering
    │   ├── Token.js       # Token mesh and physics
    │   └── Column.js      # Interactive column zones
    ├── ui/                # User interface
    │   ├── HUD.js         # On-screen overlay UI
    │   └── GameStatus.js  # Game status display
    └── utils/             # Utility functions
        ├── Animation.js   # Easing and animation helpers
        └── ThemeManager.js # Theme management system
```

## 🎯 Game Rules

- **Grid**: 6 rows × 7 columns
- **Players**: 2 players (you vs AI)
- **Objective**: Drop colored tokens into columns to form a line of 4
- **Win Condition**: First player to align 4 tokens (horizontally, vertically, or diagonally) wins
- **Mechanics**: Tokens fall straight down to the lowest available position

## 🕹️ Controls

- **Mouse Movement**: Hover over columns to see a preview of your token placement
- **Left Click**: Drop your token into a column
- **Orbit Controls**: Right-click and drag to rotate the board view (if enabled)

## 🛠️ Technologies

- **Three.js** (v0.182.0) - 3D graphics rendering
- **Vite** (v7.2.4) - Build tool and dev server
- **JavaScript ES6+** - Modern JavaScript

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with hot module reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally

### Key Classes

- **Game.js**: Main game controller handling game states and turns
- **Board.js**: Manages the internal board state (6×7 grid)
- **GameLogic.js**: Detects win conditions and validates moves
- **AI.js**: Implements game-playing algorithm for CPU opponent
- **Scene.js**: Initializes and manages the Three.js scene
- **Token.js**: Handles token rendering and animation
- **HUD.js**: Displays game interface and user feedback

## 🤖 AI Opponent

The AI uses strategic decision-making to:
- Block opponent's winning moves
- Set up winning opportunities
- Make intelligent placement decisions
- Adjustable difficulty levels for varied gameplay

## 🎨 Customization

The project includes a theme system for customizing colors and appearance. Modify `utils/ThemeManager.js` to add new themes.

## 🐛 Known Issues & Future Enhancements

- [ ] Undo move functionality
- [ ] Game replay system
- [ ] Multiplayer support
- [ ] Difficulty settings UI
- [ ] Sound effects and background music
- [ ] Mobile touch controls

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

[Christopher M.]

## 🙏 Acknowledgments

- Three.js community for the excellent 3D graphics library
- Classic Connect 4 game for the inspiration

---

**Happy gaming! 🎉**
