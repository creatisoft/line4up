/**
 * Theme Manager for Connect 4
 * Handles theme switching for both 3D objects and UI elements
 */

import * as THREE from 'three';

export const THEMES = {
    CLASSIC: 'classic',
    DARK: 'dark'
};

export const THEME_CONFIGS = {
    [THEMES.CLASSIC]: {
        name: 'Classic',
        icon: '🎯',
        board: {
            color: 0x0052CC,
            emissive: 0x001a44,
            emissiveIntensity: 0.1
        },
        tokens: {
            player1: {
                color: 0xE63946,
                emissive: 0xE63946,
                emissiveIntensity: 0.1
            },
            player2: {
                color: 0xFFD60A,
                emissive: 0xFFD60A,
                emissiveIntensity: 0.1
            }
        },
        ui: {
            primaryColor: '#E63946',
            secondaryColor: '#FFD60A',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            textColor: '#ffffff',
            accentColor: '#4fc3f7'
        },
        columnHighlight: 0x4fc3f7
    },
    [THEMES.DARK]: {
        name: 'Dark',
        icon: '🌙',
        board: {
            color: 0x1a1a1a,
            emissive: 0x0a0a0a,
            emissiveIntensity: 0.2
        },
        tokens: {
            player1: {
                color: 0x00ff88,
                emissive: 0x00ff88,
                emissiveIntensity: 0.3
            },
            player2: {
                color: 0xbb00ff,
                emissive: 0xbb00ff,
                emissiveIntensity: 0.3
            }
        },
        ui: {
            primaryColor: '#00ff88',
            secondaryColor: '#bb00ff',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            textColor: '#ffffff',
            accentColor: '#00ffff'
        },
        columnHighlight: 0x00ffff
    }
};

export class ThemeManager {
    constructor() {
        this.currentTheme = THEMES.CLASSIC;
        this.boardMaterial = null;
        this.tokenMaterials = new Map();
        this.columnHighlightMaterials = [];
        this.previewMaterials = new Map();
        this.onThemeChange = null;
    }

    /**
     * Set the current theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        if (!THEME_CONFIGS[theme]) return;
        
        this.currentTheme = theme;
        this.updateMaterials();
        this.updateUI();
        
        if (this.onThemeChange) {
            this.onThemeChange(theme);
        }
    }

    /**
     * Get current theme config
     * @returns {Object} Current theme configuration
     */
    getCurrentTheme() {
        return THEME_CONFIGS[this.currentTheme];
    }

    /**
     * Register board material for theme updates
     * @param {THREE.Material} material - Board material
     */
    registerBoardMaterial(material) {
        this.boardMaterial = material;
        this.updateBoardMaterial();
    }

    /**
     * Register token materials for theme updates
     * @param {number} player - Player number
     * @param {THREE.Material[]} materials - Array of token materials for this player
     */
    registerTokenMaterials(player, materials) {
        if (!this.tokenMaterials.has(player)) {
            this.tokenMaterials.set(player, []);
        }
        this.tokenMaterials.get(player).push(...materials);
        this.updateTokenMaterials(player);
    }

    /**
     * Register column highlight materials
     * @param {THREE.Material[]} materials - Column highlight materials
     */
    registerColumnHighlightMaterials(materials) {
        this.columnHighlightMaterials.push(...materials);
        this.updateColumnHighlightMaterials();
    }

    /**
     * Register preview token materials
     * @param {number} player - Player number
     * @param {THREE.Material[]} materials - Preview materials for this player
     */
    registerPreviewMaterials(player, materials) {
        if (!this.previewMaterials.has(player)) {
            this.previewMaterials.set(player, []);
        }
        this.previewMaterials.get(player).push(...materials);
        this.updatePreviewMaterials(player);
    }

    /**
     * Update all materials to current theme
     */
    updateMaterials() {
        this.updateBoardMaterial();
        
        for (const [player] of this.tokenMaterials) {
            this.updateTokenMaterials(player);
        }
        
        for (const [player] of this.previewMaterials) {
            this.updatePreviewMaterials(player);
        }
        
        this.updateColumnHighlightMaterials();
    }

    /**
     * Update board material
     */
    updateBoardMaterial() {
        if (!this.boardMaterial) return;
        
        const config = this.getCurrentTheme().board;
        this.boardMaterial.color.setHex(config.color);
        this.boardMaterial.emissive.setHex(config.emissive);
        this.boardMaterial.emissiveIntensity = config.emissiveIntensity;
    }

    /**
     * Update token materials for a player
     * @param {number} player - Player number
     */
    updateTokenMaterials(player) {
        const materials = this.tokenMaterials.get(player);
        if (!materials) return;
        
        const config = this.getCurrentTheme().tokens[`player${player}`];
        if (!config) return;
        
        materials.forEach(material => {
            material.color.setHex(config.color);
            material.emissive.setHex(config.emissive);
            material.emissiveIntensity = config.emissiveIntensity;
        });
    }

    /**
     * Update preview materials for a player
     * @param {number} player - Player number
     */
    updatePreviewMaterials(player) {
        const materials = this.previewMaterials.get(player);
        if (!materials) return;
        
        const config = this.getCurrentTheme().tokens[`player${player}`];
        if (!config) return;
        
        materials.forEach(material => {
            material.color.setHex(config.color);
            material.emissive.setHex(config.emissive);
            material.emissiveIntensity = config.emissiveIntensity * 0.5; // Dimmer for preview
        });
    }

    /**
     * Update column highlight materials
     */
    updateColumnHighlightMaterials() {
        const config = this.getCurrentTheme();
        
        this.columnHighlightMaterials.forEach(material => {
            material.color.setHex(config.columnHighlight);
        });
    }

    /**
     * Update UI colors via CSS custom properties
     */
    updateUI() {
        const config = this.getCurrentTheme();
        const root = document.documentElement;
        
        root.style.setProperty('--theme-primary', config.ui.primaryColor);
        root.style.setProperty('--theme-secondary', config.ui.secondaryColor);
        root.style.setProperty('--theme-background', config.ui.backgroundColor);
        root.style.setProperty('--theme-text', config.ui.textColor);
        root.style.setProperty('--theme-accent', config.ui.accentColor);
        
        // Trigger a re-render by adding/removing a class
        document.body.classList.remove('theme-' + Object.values(THEMES).join(', theme-'));
        document.body.classList.add('theme-' + this.currentTheme);
    }
}