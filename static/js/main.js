/**
 * COGNITO Main Application Module
 * Application initialization and error handling
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// Global error handler for debugging
window.addEventListener('error', function(event) {
    console.error('='.repeat(70));
    console.error('GLOBAL ERROR CAUGHT');
    console.error('='.repeat(70));
    console.error('Message:', event.message);
    console.error('Source:', event.filename);
    console.error('Line:', event.lineno);
    console.error('Column:', event.colno);
    console.error('Error object:', event.error);
    console.error('Stack:', (event.error && event.error.stack));
    console.error('='.repeat(70));

    // Show alert to user
    alert('JavaScript Error: ' + event.message + '\n\nCheck console (F12) for details.');

    // Prevent default error handling
    return false;
});

// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();

    // Update Step 3 UI if we loaded on Step 3
    if (currentStep === 3) {
        updateStep3UI();
    }
});
