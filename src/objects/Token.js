import * as THREE from 'three';
import { PLAYER_1, PLAYER_2 } from '../game/Board.js';
import { CELL_SIZE, BOARD_ROWS } from './BoardMesh.js';

// Token dimensions
export const TOKEN_RADIUS = 0.38;
export const TOKEN_HEIGHT = 0.25;
export const TOKEN_SEGMENTS = 32;

// Token colors
export const TOKEN_COLORS = {
    [PLAYER_1]: 0xE63946,  // Red
    [PLAYER_2]: 0xFFD60A   // Yellow
};

/**
 * Create a token mesh for a player
 * @param {number} player - Player number (1 or 2)
 * @param {ThemeManager} themeManager - Theme manager for color updates
 * @returns {THREE.Group} Token group with front and back meshes
 */
export function createToken(player, themeManager = null) {
    const tokenGroup = new THREE.Group();
    
    const geometry = new THREE.CylinderGeometry(
        TOKEN_RADIUS,      // Top radius
        TOKEN_RADIUS,      // Bottom radius
        TOKEN_HEIGHT,      // Height
        TOKEN_SEGMENTS     // Radial segments
    );
    
    // Rotate to face forward (cylinder default is vertical)
    geometry.rotateX(Math.PI / 2);
    
    const material = new THREE.MeshStandardMaterial({
        color: TOKEN_COLORS[player] || 0xffffff,
        roughness: 0.3,
        metalness: 0.4,
        emissive: TOKEN_COLORS[player] || 0xffffff,
        emissiveIntensity: 0.1,
        side: THREE.DoubleSide
    });
    
    // Front token
    const frontToken = new THREE.Mesh(geometry, material);
    frontToken.position.z = 0.15;
    frontToken.castShadow = true;
    frontToken.receiveShadow = true;
    tokenGroup.add(frontToken);
    
    // Back token
    const backToken = new THREE.Mesh(geometry, material.clone());
    backToken.position.z = -0.15;
    backToken.castShadow = true;
    backToken.receiveShadow = true;
    tokenGroup.add(backToken);
    
    // Register with theme manager
    if (themeManager) {
        themeManager.registerTokenMaterials(player, [material, backToken.material]);
    }
    
    // Store player info and material reference
    tokenGroup.userData = {
        player,
        isToken: true,
        material: material
    };
    
    // Add helper to access material easily
    tokenGroup.material = material;
    
    return tokenGroup;
}

/**
 * Token pool for efficient object reuse
 */
export class TokenPool {
    constructor(themeManager = null) {
        this.tokens = [];
        this.activeTokens = [];
        this.themeManager = themeManager;
        
        // Pre-create tokens for the pool (max 42 tokens = 6 rows * 7 cols)
        this.initializePool();
    }
    
    /**
     * Initialize the token pool with pre-created meshes
     */
    initializePool() {
        // Create 21 tokens for each player
        for (let i = 0; i < 21; i++) {
            this.tokens.push({
                mesh: createToken(PLAYER_1, this.themeManager),
                player: PLAYER_1,
                inUse: false
            });
            this.tokens.push({
                mesh: createToken(PLAYER_2, this.themeManager),
                player: PLAYER_2,
                inUse: false
            });
        }
    }
    
    /**
     * Get a token from the pool
     * @param {number} player - Player number
     * @returns {THREE.Mesh|null} Token mesh or null if none available
     */
    getToken(player) {
        for (const tokenData of this.tokens) {
            if (!tokenData.inUse && tokenData.player === player) {
                tokenData.inUse = true;
                this.activeTokens.push(tokenData);
                return tokenData.mesh;
            }
        }
        
        // Fallback: create new token if pool exhausted
        console.warn('Token pool exhausted, creating new token');
        const newToken = {
            mesh: createToken(player),
            player,
            inUse: true
        };
        this.tokens.push(newToken);
        this.activeTokens.push(newToken);
        return newToken.mesh;
    }
    
    /**
     * Return a token to the pool
     * @param {THREE.Mesh} mesh - Token mesh to return
     */
    returnToken(mesh) {
        for (const tokenData of this.tokens) {
            if (tokenData.mesh === mesh) {
                tokenData.inUse = false;
                const index = this.activeTokens.indexOf(tokenData);
                if (index > -1) {
                    this.activeTokens.splice(index, 1);
                }
                break;
            }
        }
    }
    
    /**
     * Return all tokens to the pool
     */
    returnAllTokens() {
        for (const tokenData of this.tokens) {
            tokenData.inUse = false;
        }
        this.activeTokens = [];
    }
    
    /**
     * Get all active token meshes
     * @returns {THREE.Mesh[]} Array of active token meshes
     */
    getActiveTokens() {
        return this.activeTokens.map(t => t.mesh);
    }
}

/**
 * Calculate the 3D position for a token at given grid position
 * @param {number} row - Row index (0 = bottom)
 * @param {number} col - Column index
 * @returns {THREE.Vector3} World position
 */
export function getTokenPosition(row, col) {
    const x = (col - 3) * CELL_SIZE;  // Center: col 3 is at x=0
    const y = (row + 0.5) * CELL_SIZE + 0.2;  // +0.2 for board base offset
    const z = 0;  // Centered - token group has front/back offsets
    
    return new THREE.Vector3(x, y, z);
}

/**
 * Get the starting position for token drop animation
 * @param {number} col - Column index
 * @returns {THREE.Vector3} Start position above board
 */
export function getTokenStartPosition(col) {
    const x = (col - 3) * CELL_SIZE;
    const y = (BOARD_ROWS + 1) * CELL_SIZE + 0.2;  // Above the board
    const z = 0;  // Centered - token group has front/back offsets
    
    return new THREE.Vector3(x, y, z);
}

export default {
    createToken,
    TokenPool,
    getTokenPosition,
    getTokenStartPosition,
    TOKEN_COLORS
};
