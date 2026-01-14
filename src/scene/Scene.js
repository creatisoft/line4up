import * as THREE from 'three';

/**
 * Creates and configures the Three.js scene
 * @returns {THREE.Scene} The configured scene
 */
export function createScene() {
    const scene = new THREE.Scene();
    
    // Dark gradient background
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Optional: Add fog for depth effect
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    
    return scene;
}

export default createScene;
