/**
 * Main Entry Point
 * Imports and initializes all modules.
 */

import { initNavigation } from './navigation.js';
import { initAccordion } from './accordion.js';
import { initSlider } from './slider.js';
import { initVideoHandler } from './video-handler.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavigation();
  initAccordion();
  initSlider();
  initVideoHandler();
  initAnimations();

  console.log('Looks Salon scripts initialized successfully.');
});
