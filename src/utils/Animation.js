/**
 * Animation utilities for Connect 4
 * Provides easing functions and animation helpers
 */

/**
 * Easing functions for animations
 */
export const Easing = {
    // Linear - no easing
    linear: (t) => t,
    
    // Quad easing
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    // Cubic easing
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    
    // Bounce easing (for landing effect)
    easeOutBounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    },
    
    // Elastic easing (for win animation)
    easeOutElastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    
    // Back easing (overshoot)
    easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
};

/**
 * Animate a value over time
 * @param {Object} options - Animation options
 * @param {number} options.from - Start value
 * @param {number} options.to - End value
 * @param {number} options.duration - Duration in milliseconds
 * @param {Function} options.easing - Easing function
 * @param {Function} options.onUpdate - Called each frame with current value
 * @param {Function} options.onComplete - Called when animation completes
 * @returns {Object} Animation controller with stop() method
 */
export function animate({ from, to, duration, easing = Easing.linear, onUpdate, onComplete }) {
    const startTime = performance.now();
    let animationId = null;
    let stopped = false;
    
    const tick = (currentTime) => {
        if (stopped) return;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        const currentValue = from + (to - from) * easedProgress;
        
        if (onUpdate) {
            onUpdate(currentValue, progress);
        }
        
        if (progress < 1) {
            animationId = requestAnimationFrame(tick);
        } else if (onComplete) {
            onComplete();
        }
    };
    
    animationId = requestAnimationFrame(tick);
    
    return {
        stop: () => {
            stopped = true;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    };
}

/**
 * Animate a 3D object's position
 * @param {THREE.Object3D} object - Object to animate
 * @param {THREE.Vector3} targetPosition - Target position
 * @param {number} duration - Duration in milliseconds
 * @param {Function} easing - Easing function
 * @param {Function} onComplete - Callback when done
 */
export function animatePosition(object, targetPosition, duration, easing = Easing.easeOutBounce, onComplete) {
    const startPosition = object.position.clone();
    
    return animate({
        from: 0,
        to: 1,
        duration,
        easing,
        onUpdate: (value) => {
            object.position.lerpVectors(startPosition, targetPosition, value);
        },
        onComplete
    });
}

/**
 * Animate a 3D object's scale
 * @param {THREE.Object3D} object - Object to animate
 * @param {number} targetScale - Target scale (uniform)
 * @param {number} duration - Duration in milliseconds
 * @param {Function} easing - Easing function
 */
export function animateScale(object, targetScale, duration, easing = Easing.easeOutElastic) {
    const startScale = object.scale.x;
    
    return animate({
        from: startScale,
        to: targetScale,
        duration,
        easing,
        onUpdate: (value) => {
            object.scale.set(value, value, value);
        }
    });
}

/**
 * Create a pulsing animation
 * @param {THREE.Object3D} object - Object to pulse
 * @param {number} minScale - Minimum scale
 * @param {number} maxScale - Maximum scale
 * @param {number} duration - Duration of one pulse cycle
 * @returns {Object} Controller with stop() method
 */
export function pulseAnimation(object, minScale = 0.9, maxScale = 1.1, duration = 1000) {
    let stopped = false;
    const originalScale = object.scale.clone();
    
    const pulse = () => {
        if (stopped) {
            object.scale.copy(originalScale);
            return;
        }
        
        // Scale up
        animate({
            from: minScale,
            to: maxScale,
            duration: duration / 2,
            easing: Easing.easeInOutQuad,
            onUpdate: (value) => {
                if (!stopped) {
                    object.scale.set(
                        originalScale.x * value,
                        originalScale.y * value,
                        originalScale.z * value
                    );
                }
            },
            onComplete: () => {
                if (stopped) return;
                // Scale down
                animate({
                    from: maxScale,
                    to: minScale,
                    duration: duration / 2,
                    easing: Easing.easeInOutQuad,
                    onUpdate: (value) => {
                        if (!stopped) {
                            object.scale.set(
                                originalScale.x * value,
                                originalScale.y * value,
                                originalScale.z * value
                            );
                        }
                    },
                    onComplete: pulse
                });
            }
        });
    };
    
    pulse();
    
    return {
        stop: () => {
            stopped = true;
            object.scale.copy(originalScale);
        }
    };
}

/**
 * Create a glow/emissive pulse animation for materials
 * @param {THREE.Material} material - Material to animate
 * @param {number} minIntensity - Minimum emissive intensity
 * @param {number} maxIntensity - Maximum emissive intensity
 * @param {number} duration - Duration of one cycle
 */
export function glowAnimation(material, minIntensity = 0.1, maxIntensity = 0.6, duration = 800) {
    let stopped = false;
    
    const glow = () => {
        if (stopped) return;
        
        animate({
            from: minIntensity,
            to: maxIntensity,
            duration: duration / 2,
            easing: Easing.easeInOutQuad,
            onUpdate: (value) => {
                if (!stopped) material.emissiveIntensity = value;
            },
            onComplete: () => {
                if (stopped) return;
                animate({
                    from: maxIntensity,
                    to: minIntensity,
                    duration: duration / 2,
                    easing: Easing.easeInOutQuad,
                    onUpdate: (value) => {
                        if (!stopped) material.emissiveIntensity = value;
                    },
                    onComplete: glow
                });
            }
        });
    };
    
    glow();
    
    return {
        stop: () => {
            stopped = true;
            material.emissiveIntensity = minIntensity;
        }
    };
}

export default {
    Easing,
    animate,
    animatePosition,
    animateScale,
    pulseAnimation,
    glowAnimation
};
