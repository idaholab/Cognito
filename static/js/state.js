/**
 * COGNITO Application State
 * Global state management for the assessment tool
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

let currentStep = 0;
const totalSteps = 5;

let appState = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    stepStatus: {
        1: 'not-started',
        2: 'not-started',
        3: 'not-started',
        4: 'not-started',
        5: 'not-started'
    },
    lastModified: null
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();

    // Update Step 3 UI if we loaded on Step 3
    if (currentStep === 3) {
        updateStep3UI();
    }
});

// Sidebar Toggle Function

// Risk Wizard State (used in Step 3)
let riskWizardState = {
    currentStep: 0,
    selectedUseCaseId: null,
    consequenceScores: {},
    systemBoundaries: {},
    failureModes: {},
    securityChecks: [],
    mitigations: {},
    threatMitigations: {},
    statusQuo: {}
};

// Data Wizard State (used in Step 3)
let dataWizardState = {
    currentStep: 0,
    selectedUseCaseId: null,
    dataElements: [],
    sourceMappings: {},
    gapAnalysis: {},
    integrationAssessments: {},
    governance: {},
    decision: null,
    justification: ''
};
