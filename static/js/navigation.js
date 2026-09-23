/**
 * COGNITO Navigation Module
 * Sidebar, step navigation, and header management
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const toggleIcon = document.getElementById('toggle-icon');

    sidebar.classList.toggle('collapsed');
    toggleBtn.classList.toggle('collapsed');

    // Update icon direction
    if (sidebar.classList.contains('collapsed')) {
        // Show right arrow when collapsed (to expand)
        toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>';
    } else {
        // Show left arrow when expanded (to collapse)
        toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>';
    }
}

// Toggle Phase Details
function togglePhaseDetails(phase) {
    const phase1Details = document.getElementById('phase1-details');
    const phase2Details = document.getElementById('phase2-details');

    if (phase === 'phase1') {
        phase1Details.classList.toggle('expanded');
        // Optionally collapse the other phase when opening one
        // phase2Details.classList.remove('expanded');
    } else if (phase === 'phase2') {
        phase2Details.classList.toggle('expanded');
        // Optionally collapse the other phase when opening one
        // phase1Details.classList.remove('expanded');
    }
}

// Toggle What You'll Get section
function toggleWhatYoullGet() {
    const content = document.getElementById('what-youll-get-content');
    const chevron = document.getElementById('chevron-icon');
    const hint = document.getElementById('expand-hint');

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        chevron.classList.remove('rotated');
        hint.textContent = 'Click to expand';
    } else {
        content.classList.add('expanded');
        chevron.classList.add('rotated');
        hint.textContent = 'Click to collapse';
    }
}
// Navigation Functions
function navigateToStep(stepNumber) {
    // Hide summary page if visible
    (function(){ var _el = document.getElementById('summary-page'); if(_el) _el.classList.add('hidden'); })();

    // Show sidebar and toggle button when leaving summary page
    document.getElementById('sidebar').style.display = 'flex';
    document.getElementById('sidebar-toggle').style.display = 'block';

    // Hide all steps
    for (let i = 0; i <= totalSteps; i++) {
        document.getElementById(`step-${i}`).classList.add('hidden');
        (function(_id){ var _el = document.getElementById(_id); if(_el) _el.classList.remove('step-active'); })(`nav-step-${i}`);
    }

    // Show selected step
    currentStep = stepNumber;
    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
    (function(_id){ var _el = document.getElementById(_id); if(_el) _el.classList.add('step-active'); })(`nav-step-${stepNumber}`);

    // Special handling for Step 1
    if (stepNumber === 1) {
        // If there are saved capabilities, restore and show assessment forms
        if (appState.step1.capabilities && Object.keys(appState.step1.capabilities).length > 0) {
            restoreStep1Data();
        } else {
            // Show capability selection
            document.getElementById('capability-selection').style.display = 'block';
            document.getElementById('assessment-forms').classList.add('hidden');
            document.getElementById('complete-step1-btn').classList.add('hidden');
        }
    }

    // Special handling for Step 2
    if (stepNumber === 2) {
        initializeStep2();
    }

    // Special handling for Step 3
    if (stepNumber === 3) {
        updateStep3UI();
    }

    // Special handling for Step 4
    if (stepNumber === 4) {
        showStep4();
    }

    // Special handling for Step 5
    if (stepNumber === 5) {
        showStep5();
    }

    // Scroll to top of page after DOM updates
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Also scroll the main content container
        const mainContent = document.getElementById('main-content-area');
        if (mainContent) mainContent.scrollTop = 0;
    }, 50);

    // Update header
    updateHeader();

    // Update button states
    updateNavigationButtons();

    // Auto-save when navigating
    saveProgress();
}

function nextStep() {
    if (currentStep < totalSteps) {
        navigateToStep(currentStep + 1);
    }
}

function previousStep() {
    // Special handling for Step 1
    if (currentStep === 1) {
        const assessmentForms = document.getElementById('assessment-forms');
        const capabilitySelection = document.getElementById('capability-selection');

        // If we're viewing assessment forms, go back to capability selection
        if (!assessmentForms.classList.contains('hidden')) {
            backToCapabilitySelection();
            return;
        }
        // If we're in capability selection, go to welcome
        else if (capabilitySelection.style.display !== 'none') {
            navigateToStep(0);
            return;
        }
    }

    if (currentStep > 0) {
        navigateToStep(currentStep - 1);
    }
}

function updateNavigationButtons() {
    // Footer navigation buttons have been removed - this function is kept for compatibility
    // Navigation is now handled via the sidebar only
}

function updateHeader() {
    const titles = [
        { title: 'Welcome to COGNITO', subtitle: 'AI Readiness Assessment Tool' },
        { title: 'Step 1: Identify Business Context', subtitle: 'Assess your current capabilities and identify opportunities' },
        { title: 'Step 2: Align AI Use Cases', subtitle: 'Match AI opportunities to appropriate use cases' },
        { title: 'Step 3: Analyze AI Principles', subtitle: 'Explore readiness through structured AI Readiness Principles' },
        { title: 'Step 4: Implementation Planning & Readiness Validation', subtitle: 'Define your AI solution and implementation approach' },
        { title: 'Step 5: Evaluate Engineering Controls & Mitigations', subtitle: 'Identify appropriate safeguards and controls' }
    ];

    document.getElementById('current-step-title').textContent = titles[currentStep].title;
    document.getElementById('current-step-subtitle').textContent = titles[currentStep].subtitle;
}

// Step Status Tracking
function updateStepStatus(stepNumber, status) {
    appState.stepStatus[stepNumber] = status;

    const statusElement = document.getElementById(`status-${stepNumber}`);
    const iconElement = document.getElementById(`nav-icon-${stepNumber}`);
    const navStep = document.getElementById(`nav-step-${stepNumber}`);

    if (status === 'complete') {
        if (statusElement) {
            statusElement.textContent = 'Complete';
            statusElement.className = 'text-xs text-green-300 mt-1';
        }
        if (iconElement) iconElement.innerHTML = '✓';
        if (navStep) navStep.classList.add('step-complete');
    } else if (status === 'in-progress') {
        if (statusElement) {
            statusElement.textContent = 'In progress';
            statusElement.className = 'text-xs text-yellow-300 mt-1';
        }
        if (iconElement) iconElement.innerHTML = stepNumber;
        if (navStep) navStep.classList.remove('step-complete');
    } else {
        // not-started or any other status
        if (statusElement) {
            statusElement.textContent = 'Not started';
            statusElement.className = 'text-xs text-blue-300 mt-1';
        }
        if (iconElement) iconElement.innerHTML = stepNumber;
        if (navStep) navStep.classList.remove('step-complete');
    }
}

// Save/Load Functions
