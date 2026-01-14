import * as THREE from 'three';

/**
 * Creates and configures scene lighting
 * @param {THREE.Scene} scene - The scene to add lights to
 * @returns {Object} Object containing all light references
 */
export function createLighting(scene) {
    const lights = {};
    
    // Ambient light for overall illumination
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(lights.ambient);
    
    // Main directional light (sun-like)
    lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
    lights.directional.position.set(5, 10, 7);
    lights.directional.castShadow = true;
    
    // Shadow settings
    lights.directional.shadow.mapSize.width = 2048;
    lights.directional.shadow.mapSize.height = 2048;
    lights.directional.shadow.camera.near = 0.5;
    lights.directional.shadow.camera.far = 50;
    lights.directional.shadow.camera.left = -10;
    lights.directional.shadow.camera.right = 10;
    lights.directional.shadow.camera.top = 10;
    lights.directional.shadow.camera.bottom = -10;
    
    scene.add(lights.directional);
    
    // Fill light from the opposite side
    lights.fill = new THREE.DirectionalLight(0xffffff, 0.3);
    lights.fill.position.set(-5, 5, -5);
    scene.add(lights.fill);
    
    // Point light for token highlights
    lights.point = new THREE.PointLight(0x4fc3f7, 0.5, 20);
    lights.point.position.set(0, 5, 5);
    scene.add(lights.point);
    
    return lights;
}

export default createLighting;
