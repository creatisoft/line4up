import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Creates and configures orbital controls for camera manipulation
 * @param {THREE.Camera} camera - The camera to control
 * @param {HTMLElement} domElement - The renderer's DOM element
 * @returns {OrbitControls} The configured controls
 */
export function createControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    
    // Enable damping for smooth camera movement
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Limit vertical rotation to prevent flipping
    controls.minPolarAngle = Math.PI / 6;  // 30 degrees from top
    controls.maxPolarAngle = Math.PI / 2;  // 90 degrees (horizontal)
    
    // Limit zoom
    controls.minDistance = 5;
    controls.maxDistance = 20;
    
    // Set orbit target to center of board
    controls.target.set(0, 2.5, 0);
    
    // Disable panning (optional - can enable if desired)
    controls.enablePan = false;
    
    controls.update();
    
    return controls;
}

export default createControls;
