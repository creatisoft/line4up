import * as THREE from 'three';

// Board constants
export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;
export const CELL_SIZE = 1.0;
export const BOARD_DEPTH = 0.5;
export const HOLE_RADIUS = 0.4;

/**
 * Creates the 3D board mesh for Connect 4
 * @param {ThemeManager} themeManager - Theme manager for color updates
 * @returns {THREE.Group} The board group containing all board meshes
 */
export function createBoardMesh(themeManager = null) {
    const boardGroup = new THREE.Group();
    
    // Board dimensions
    const boardWidth = BOARD_COLS * CELL_SIZE;
    const boardHeight = BOARD_ROWS * CELL_SIZE;
    
    // Create the main board frame
    const frameGeometry = new THREE.BoxGeometry(
        boardWidth + 0.4,   // Width with padding
        boardHeight + 0.4,  // Height with padding
        BOARD_DEPTH
    );
    
    // Classic Connect 4 blue color
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x0052CC,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x001a44,
        emissiveIntensity: 0.1
    });
    
    // Register with theme manager
    if (themeManager) {
        themeManager.registerBoardMaterial(frameMaterial);
    }
    
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, boardHeight / 2 + 0.2, 0);
    frame.castShadow = true;
    frame.receiveShadow = true;
    boardGroup.add(frame);
    
    // Create circular holes for each cell
    const holeGeometry = new THREE.CircleGeometry(HOLE_RADIUS, 32);
    const holeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,  // Match background color
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    
    // Position holes in grid pattern
    for (let row = 0; row < BOARD_ROWS; row++) {
        for (let col = 0; col < BOARD_COLS; col++) {
            const hole = new THREE.Mesh(holeGeometry, holeMaterial);
            
            // Calculate position (centered grid)
            const x = (col - (BOARD_COLS - 1) / 2) * CELL_SIZE;
            const y = (row + 0.5) * CELL_SIZE + 0.2;
            const z = BOARD_DEPTH / 2 + 0.01;  // Slightly in front of board
            
            hole.position.set(x, y, z);
            boardGroup.add(hole);
            
            // Add hole on back side too
            const holeBack = hole.clone();
            holeBack.position.z = -BOARD_DEPTH / 2 - 0.01;
            boardGroup.add(holeBack);
        }
    }
    
    // Create the base/stand for the board
    const baseGeometry = new THREE.BoxGeometry(boardWidth + 1, 0.3, 1.5);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x0041a3,
        roughness: 0.4,
        metalness: 0.1
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0.15, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    boardGroup.add(base);
    
    // Store references for later use
    boardGroup.userData = {
        frame,
        base,
        rows: BOARD_ROWS,
        cols: BOARD_COLS,
        cellSize: CELL_SIZE
    };
    
    return boardGroup;
}

/**
 * Converts grid position to 3D world coordinates
 * @param {number} row - Row index (0 = bottom)
 * @param {number} col - Column index (0 = left)
 * @returns {THREE.Vector3} World position
 */
export function gridToWorldPosition(row, col) {
    const x = (col - (BOARD_COLS - 1) / 2) * CELL_SIZE;
    const y = (row + 0.5) * CELL_SIZE + 0.2;
    const z = 0;
    
    return new THREE.Vector3(x, y, z);
}

export default createBoardMesh;
