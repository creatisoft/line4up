import * as THREE from 'three';

/**
 * Creates and configures the perspective camera
 * @param {number} aspect - Aspect ratio (width/height)
 * @returns {THREE.PerspectiveCamera} The configured camera
 */
export function createCamera(aspect) {
    const camera = new THREE.PerspectiveCamera(
        60,         // FOV (Field of View)
        aspect,     // Aspect ratio
        0.1,        // Near clipping plane
        1000        // Far clipping plane
    );
    
    // Position camera slightly above and in front of the board
    camera.position.set(0, 3, 10);
    
    // Look at the center of the board
    camera.lookAt(0, 2.5, 0);
    
    return camera;
}

export default createCamera;
