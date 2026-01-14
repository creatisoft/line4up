import * as THREE from 'three';
import { BOARD_COLS, BOARD_ROWS, CELL_SIZE } from './BoardMesh.js';

/**
 * Creates invisible column hit zones for interaction detection
 * @returns {THREE.Group} Group containing all column meshes
 */
export function createColumnZones() {
    const columnsGroup = new THREE.Group();
    
    const columnHeight = BOARD_ROWS * CELL_SIZE + 0.4;
    const columnWidth = CELL_SIZE * 0.95;
    const columnDepth = 1.0;
    
    // Create invisible box for each column
    const geometry = new THREE.BoxGeometry(columnWidth, columnHeight, columnDepth);
    
    for (let col = 0; col < BOARD_COLS; col++) {
        // Invisible material (for raycasting)
        const material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        const columnMesh = new THREE.Mesh(geometry, material);
        
        // Position column
        const x = (col - (BOARD_COLS - 1) / 2) * CELL_SIZE;
        const y = columnHeight / 2 + 0.2;
        
        columnMesh.position.set(x, y, 0);
        
        // Store column index
        columnMesh.userData = {
            isColumn: true,
            columnIndex: col
        };
        
        columnsGroup.add(columnMesh);
    }
    
    columnsGroup.userData = {
        isColumnGroup: true
    };
    
    return columnsGroup;
}

/**
 * Creates a visual column highlight indicator (visible on both sides)
 * @param {ThemeManager} themeManager - Theme manager for color updates
 * @returns {THREE.Group} Highlight group with front and back
 */
export function createColumnHighlight(themeManager = null) {
    const highlightGroup = new THREE.Group();
    
    const columnHeight = BOARD_ROWS * CELL_SIZE;
    const columnWidth = CELL_SIZE * 0.9;
    
    const geometry = new THREE.BoxGeometry(columnWidth, columnHeight, 0.1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x4fc3f7,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    
    // Front highlight
    const frontHighlight = new THREE.Mesh(geometry, material);
    frontHighlight.position.z = 0.3;
    highlightGroup.add(frontHighlight);
    
    // Back highlight
    const backHighlight = new THREE.Mesh(geometry, material.clone());
    backHighlight.position.z = -0.3;
    highlightGroup.add(backHighlight);
    
    // Register with theme manager
    if (themeManager) {
        themeManager.registerColumnHighlightMaterials([material, backHighlight.material]);
    }
    
    highlightGroup.visible = false;
    
    highlightGroup.userData = {
        isHighlight: true
    };
    
    return highlightGroup;
}

/**
 * Creates a preview token that shows where the next token will drop
 * @param {number} player - Current player (1 or 2)
 * @param {ThemeManager} themeManager - Theme manager for color updates
 * @returns {THREE.Group} Preview token group with front and back
 */
export function createPreviewToken(player, themeManager = null) {
    const previewGroup = new THREE.Group();
    
    const geometry = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 32);
    geometry.rotateX(Math.PI / 2);
    
    const colors = {
        1: 0xE63946,  // Red
        2: 0xFFD60A   // Yellow
    };
    
    const material = new THREE.MeshStandardMaterial({
        color: colors[player] || 0xffffff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.3,
        metalness: 0.4,
        side: THREE.DoubleSide
    });
    
    // Front preview
    const frontPreview = new THREE.Mesh(geometry, material);
    frontPreview.position.z = 0.15;
    previewGroup.add(frontPreview);
    
    // Back preview
    const backPreview = new THREE.Mesh(geometry, material.clone());
    backPreview.position.z = -0.15;
    previewGroup.add(backPreview);
    
    // Register with theme manager
    if (themeManager) {
        themeManager.registerPreviewMaterials(player, [material, backPreview.material]);
    }
    
    previewGroup.visible = false;
    
    previewGroup.userData = {
        isPreview: true,
        player
    };
    
    return previewGroup;
}

/**
 * Update column highlight position
 * @param {THREE.Group} highlight - Highlight group
 * @param {number} col - Column index to highlight
 */
export function setColumnHighlight(highlight, col) {
    if (col < 0 || col >= BOARD_COLS) {
        highlight.visible = false;
        return;
    }
    
    const x = (col - (BOARD_COLS - 1) / 2) * CELL_SIZE;
    const y = (BOARD_ROWS * CELL_SIZE) / 2 + 0.2;
    
    highlight.position.x = x;
    highlight.position.y = y;
    highlight.position.z = 0;  // Centered - group has front/back offsets
    highlight.visible = true;
}

/**
 * Update preview token position
 * @param {THREE.Group} preview - Preview token group
 * @param {number} col - Column index
 * @param {number} row - Target row (lowest available)
 */
export function setPreviewPosition(preview, col, row) {
    if (col < 0 || row < 0) {
        preview.visible = false;
        return;
    }
    
    const x = (col - (BOARD_COLS - 1) / 2) * CELL_SIZE;
    const y = (row + 0.5) * CELL_SIZE + 0.2;
    
    preview.position.set(x, y, 0);  // Centered - group has front/back offsets
    preview.visible = true;
}

export default {
    createColumnZones,
    createColumnHighlight,
    createPreviewToken,
    setColumnHighlight,
    setPreviewPosition
};
