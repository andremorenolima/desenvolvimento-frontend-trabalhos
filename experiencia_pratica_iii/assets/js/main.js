import { setupRouting } from './spa.js';
import { applyMasks, setupFormValidation } from './forms.js';

window.applyMasks = applyMasks;
window.setupFormValidation = setupFormValidation;

document.addEventListener('DOMContentLoaded', () => {
    setupRouting();
    applyMasks();
    setupFormValidation();
});