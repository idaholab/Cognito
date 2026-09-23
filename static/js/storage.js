/**
 * COGNITO Storage Module
 * Save, load, export, import, and reset functionality
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

function saveProgress() {
    try {
        console.log('[saveProgress] Saving...');
        appState.lastModified = new Date().toISOString();
        const dataString = JSON.stringify(appState);
        console.log('[saveProgress] Data size:', dataString.length, 'bytes');
        localStorage.setItem('cognitoAssessment', dataString);
        console.log('[saveProgress] Saved to localStorage');
        showNotification('Progress saved successfully!');
        console.log('[saveProgress] Complete');
    } catch (error) {
        console.error('[saveProgress] Error:', error);
        console.error('[saveProgress] Stack:', error.stack);
        alert('Error saving progress: ' + error.message);
    }
}

/**
 * Cascading Cleanup Function
 * Removes orphaned data from Steps 2-5 when capabilities/opportunities are removed in Step 1
 * Should be called after capability changes in Step 1
 */
function cleanupOrphanedData() {
    console.log('[cleanupOrphanedData] Starting cascading cleanup...');

    // Step 1: Get all valid opportunity IDs from current Step 1 capabilities
    const validOpportunityIds = new Set();
    if (appState.step1 && appState.step1.capabilities) {
        Object.keys(appState.step1.capabilities).forEach(capId => {
            const capability = appState.step1.capabilities[capId];
            if (capability.opportunities && capability.opportunities.length > 0) {
                capability.opportunities.forEach(opp => {
                    const oppId = `${capId}-${opp.id}`;
                    validOpportunityIds.add(oppId);
                });
            }
        });
    }
    console.log('[cleanupOrphanedData] Valid opportunity IDs:', Array.from(validOpportunityIds));

    // Step 2: Clean up opportunityMappings - remove mappings for deleted opportunities
    let removedMappings = 0;
    if (appState.step2 && appState.step2.opportunityMappings) {
        const mappingsToRemove = [];
        Object.keys(appState.step2.opportunityMappings).forEach(oppId => {
            if (!validOpportunityIds.has(oppId)) {
                mappingsToRemove.push(oppId);
            }
        });
        mappingsToRemove.forEach(oppId => {
            console.log('[cleanupOrphanedData] Removing orphaned mapping for opportunity:', oppId);
            delete appState.step2.opportunityMappings[oppId];
            removedMappings++;
        });
    }
    console.log('[cleanupOrphanedData] Removed', removedMappings, 'orphaned opportunity mappings');

    // Step 3: Get all valid use case IDs from remaining opportunity mappings
    const validUseCaseIds = new Set();
    if (appState.step2 && appState.step2.opportunityMappings) {
        Object.values(appState.step2.opportunityMappings).forEach(mapping => {
            if (mapping && mapping.useCaseId) {
                validUseCaseIds.add(mapping.useCaseId);
            }
        });
    }
    console.log('[cleanupOrphanedData] Valid use case IDs:', Array.from(validUseCaseIds));

    // Step 4: Clean up Step 3 riskAnalyses - remove analyses for deleted use cases
    let removedRiskAnalyses = 0;
    if (appState.step3 && appState.step3.riskAnalyses) {
        const analysesToRemove = [];
        Object.keys(appState.step3.riskAnalyses).forEach(useCaseId => {
            if (!validUseCaseIds.has(useCaseId)) {
                analysesToRemove.push(useCaseId);
            }
        });
        analysesToRemove.forEach(useCaseId => {
            console.log('[cleanupOrphanedData] Removing orphaned risk analysis for use case:', useCaseId);
            delete appState.step3.riskAnalyses[useCaseId];
            removedRiskAnalyses++;
        });
    }
    console.log('[cleanupOrphanedData] Removed', removedRiskAnalyses, 'orphaned risk analyses');

    // Step 5: Clean up Step 3 dataAssessments - remove assessments for deleted use cases
    let removedDataAssessments = 0;
    if (appState.step3 && appState.step3.dataAssessments) {
        const assessmentsToRemove = [];
        Object.keys(appState.step3.dataAssessments).forEach(useCaseId => {
            if (!validUseCaseIds.has(useCaseId)) {
                assessmentsToRemove.push(useCaseId);
            }
        });
        assessmentsToRemove.forEach(useCaseId => {
            console.log('[cleanupOrphanedData] Removing orphaned data assessment for use case:', useCaseId);
            delete appState.step3.dataAssessments[useCaseId];
            removedDataAssessments++;
        });
    }
    console.log('[cleanupOrphanedData] Removed', removedDataAssessments, 'orphaned data assessments');

    // Step 6: Clean up Step 4 selectedUseCases - remove deleted use cases from selection
    let removedStep4Selections = 0;
    if (appState.step4 && appState.step4.selectedUseCases && Array.isArray(appState.step4.selectedUseCases)) {
        const originalLength = appState.step4.selectedUseCases.length;
        appState.step4.selectedUseCases = appState.step4.selectedUseCases.filter(useCaseId => {
            if (!validUseCaseIds.has(useCaseId)) {
                console.log('[cleanupOrphanedData] Removing orphaned Step 4 selection:', useCaseId);
                return false;
            }
            return true;
        });
        removedStep4Selections = originalLength - appState.step4.selectedUseCases.length;
    }
    console.log('[cleanupOrphanedData] Removed', removedStep4Selections, 'orphaned Step 4 selections');

    // Step 7: Clean up Step 4 worksheets - remove worksheets for deleted use cases
    let removedWorksheets = 0;
    if (appState.step4 && appState.step4.worksheets) {
        const worksheetsToRemove = [];
        Object.keys(appState.step4.worksheets).forEach(useCaseId => {
            if (!validUseCaseIds.has(useCaseId)) {
                worksheetsToRemove.push(useCaseId);
            }
        });
        worksheetsToRemove.forEach(useCaseId => {
            console.log('[cleanupOrphanedData] Removing orphaned worksheet for use case:', useCaseId);
            delete appState.step4.worksheets[useCaseId];
            removedWorksheets++;
        });
    }
    console.log('[cleanupOrphanedData] Removed', removedWorksheets, 'orphaned worksheets');

    // Summary
    const totalRemoved = removedMappings + removedRiskAnalyses + removedDataAssessments + removedStep4Selections + removedWorksheets;
    console.log('[cleanupOrphanedData] Cleanup complete. Total orphaned items removed:', totalRemoved);

    // Save progress after cleanup
    if (totalRemoved > 0) {
        console.log('[cleanupOrphanedData] Saving cleaned state...');
        // Don't call saveProgress() directly to avoid notification spam, just save silently
        try {
            appState.lastModified = new Date().toISOString();
            localStorage.setItem('cognitoAssessment', JSON.stringify(appState));
        } catch (error) {
            console.error('[cleanupOrphanedData] Error saving:', error);
        }
    }

    return totalRemoved;
}

// Export progress to downloadable JSON file
function exportProgress() {
    try {
        // Save current state first
        appState.lastModified = new Date().toISOString();
        appState.exportedAt = new Date().toISOString();

        const dataString = JSON.stringify(appState, null, 2);
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `COGNITO_Progress_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Progress exported successfully! File downloaded.');
        console.log('[exportProgress] Exported data size:', dataString.length, 'bytes');
    } catch (error) {
        console.error('[exportProgress] Error:', error);
        alert('Error exporting progress: ' + error.message);
    }
}

// Import progress from uploaded JSON file
function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
        alert('Please select a valid JSON file (.json)');
        event.target.value = ''; // Reset input
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate the imported data has expected structure
            if (!importedData || typeof importedData !== 'object') {
                throw new Error('Invalid file format');
            }

            // Check for essential properties to validate it's a COGNITO save file
            if (!importedData.stepStatus && !importedData.step1 && !importedData.step2) {
                throw new Error('This does not appear to be a valid COGNITO progress file');
            }

            // Confirm import with user
            const confirmImport = confirm(
                'Import this progress file?\n\n' +
                'This will replace your current progress with the imported data.\n\n' +
                (importedData.lastModified ? 'Last saved: ' + new Date(importedData.lastModified).toLocaleString() : '') +
                '\n\nClick OK to proceed or Cancel to abort.'
            );

            if (!confirmImport) {
                event.target.value = ''; // Reset input
                return;
            }

            // Import the data
            appState = importedData;

            // Validate and fix Step 4 structure if it exists
            if (appState.step4) {
                if (!Array.isArray(appState.step4.selectedUseCases)) {
                    appState.step4.selectedUseCases = [];
                }
                if (!appState.step4.worksheets || typeof appState.step4.worksheets !== 'object') {
                    appState.step4.worksheets = {};
                }
            }

            // Ensure step2 structure exists
            if (!appState.step2 || !appState.step2.selectedUseCases) {
                appState.step2 = { selectedUseCases: {} };
            }

            // Ensure step3 structure exists
            if (!appState.step3) {
                appState.step3 = { principlesData: {} };
            }

            // Ensure step5 structure exists
            if (!appState.step5) {
                appState.step5 = { controls: {} };
            }

            // Save to localStorage
            localStorage.setItem('cognitoAssessment', JSON.stringify(appState));

            // Update UI - step statuses
            for (let i = 1; i <= totalSteps; i++) {
                if (appState.stepStatus && appState.stepStatus[i]) {
                    updateStepStatus(i, appState.stepStatus[i]);
                }
            }

            // Restore Step 1 data if it exists
            if (appState.step1 && appState.step1.pathway) {
                restoreStep1Data();
            }

            showNotification('Progress imported successfully! Refreshing page...');

            // Reload the page to fully restore all state
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            console.log('[importProgress] Successfully imported data');

        } catch (error) {
            console.error('[importProgress] Error:', error);
            alert('Error importing progress file: ' + error.message + '\n\nPlease ensure you selected a valid COGNITO progress file.');
        }

        event.target.value = ''; // Reset input for future imports
    };

    reader.onerror = function() {
        console.error('[importProgress] File read error');
        alert('Error reading the file. Please try again.');
        event.target.value = ''; // Reset input
    };

    reader.readAsText(file);
}

function loadProgress() {
    const saved = localStorage.getItem('cognitoAssessment');
    if (saved) {
        try {
            appState = JSON.parse(saved);

            // Validate and fix Step 4 structure if it exists
            if (appState.step4) {
                // Ensure selectedUseCases is an array
                if (!Array.isArray(appState.step4.selectedUseCases)) {
                    appState.step4.selectedUseCases = [];
                }
                // Ensure worksheets is an object
                if (!appState.step4.worksheets || typeof appState.step4.worksheets !== 'object') {
                    appState.step4.worksheets = {};
                }
            }

            // Update step statuses
            for (let i = 1; i <= totalSteps; i++) {
                if (appState.stepStatus[i]) {
                    updateStepStatus(i, appState.stepStatus[i]);
                }
            }

            // Restore Step 1 if it exists
            if (appState.step1 && appState.step1.pathway) {
                restoreStep1Data();
            }

            showNotification('Previous session restored');
        } catch (e) {
            console.error('Error loading saved progress:', e);
        }
    }
}

function restoreStep1Data() {
    // If capabilities exist, recreate the assessment forms
    if (appState.step1.capabilities && Object.keys(appState.step1.capabilities).length > 0) {
        // First, sync checkboxes with saved state
        // Uncheck all first
        document.querySelectorAll('.capability-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('custom-capability-checkbox').checked = false;
        document.getElementById('custom-capability-fields').classList.add('hidden');

        // Restore checkboxes based on saved capabilities
        for (const capId in appState.step1.capabilities) {
            const capability = appState.step1.capabilities[capId];

            // Check if it's a custom capability
            if (capId.startsWith('custom-')) {
                // It's a custom capability - check the custom checkbox and fill fields
                document.getElementById('custom-capability-checkbox').checked = true;
                document.getElementById('custom-capability-fields').classList.remove('hidden');
                document.getElementById('custom-capability-name').value = capability.name;
                document.getElementById('custom-capability-description').value = capability.description;
            } else {
                // It's a standard capability - check the appropriate checkbox
                const checkbox = document.querySelector(`.capability-checkbox[value="${capId}"]`);
                if (checkbox) checkbox.checked = true;
            }
        }

        // Update button state
        updateCapabilitySelection();

        // Hide capability selection
        document.getElementById('capability-selection').style.display = 'none';

        // Show assessment forms
        document.getElementById('assessment-forms').classList.remove('hidden');
        document.getElementById('complete-step1-btn').classList.remove('hidden');

        // Clear any existing capability cards
        const capabilityCards = document.getElementById('assessment-forms').querySelectorAll('[id^="capability-"]');
        capabilityCards.forEach(card => card.remove());

        // Create assessment forms for each capability
        for (const capId in appState.step1.capabilities) {
            const capability = appState.step1.capabilities[capId];

            // Create the assessment form
            createCapabilityAssessment(capId);

            // Restore maturity level
            if (capability.maturityLevel) {
                setTimeout(() => selectMaturityLevel(capId, capability.maturityLevel), 100);
            }

            // Restore evidence
            if (capability.evidence) {
                setTimeout(() => {
                    const evidenceField = document.getElementById(`evidence-${capId}`);
                    if (evidenceField) {
                        evidenceField.value = capability.evidence;
                    }
                }, 100);
            }

            // Restore opportunities
            if (capability.opportunities && capability.opportunities.length > 0) {
                setTimeout(() => {
                    // Remove the default empty opportunity
                    const container = document.getElementById(`opportunities-${capId}`);
                    if (container) {
                        container.innerHTML = '';

                        // Add each saved opportunity
                        capability.opportunities.forEach((opp, index) => {
                            // Use createOpportunityDOM instead of addOpportunity to avoid duplicating in state
                            createOpportunityDOM(capId, opp.id);

                            // Restore opportunity data
                            setTimeout(() => {
                                const problemField = document.getElementById(`problem-${capId}-${opp.id}`);
                                if (problemField) problemField.value = opp.problem || '';

                                // Restore business impact checkboxes
                                if (opp.impacts && opp.impacts.length > 0) {
                                    const oppCard = document.getElementById(`opportunity-${capId}-${opp.id}`);
                                    if (oppCard) {
                                        opp.impacts.forEach(impact => {
                                            const checkbox = oppCard.querySelector(`.business-impact-checkbox[value="${impact}"]`);
                                            if (checkbox) checkbox.checked = true;
                                        });
                                    }
                                }

                                // Restore other impact text if exists
                                if (opp.otherImpact) {
                                    const otherCheckbox = document.getElementById(`other-impact-${capId}-${opp.id}`);
                                    const otherTextarea = document.getElementById(`other-impact-text-${capId}-${opp.id}`);
                                    if (otherCheckbox && otherTextarea) {
                                        otherCheckbox.checked = true;
                                        otherTextarea.classList.remove('hidden');
                                        otherTextarea.value = opp.otherImpact;
                                    }
                                }

                                // Restore domains
                                if (opp.domains && opp.domains.length > 0) {
                                    const oppCard = document.getElementById(`opportunity-${capId}-${opp.id}`);
                                    if (oppCard) {
                                        opp.domains.forEach(domain => {
                                            const checkbox = oppCard.querySelector(`input[value="${domain}"]:not(.business-impact-checkbox)`);
                                            if (checkbox) checkbox.checked = true;
                                        });
                                    }
                                }

                                // Restore priority
                                if (opp.priority) {
                                    const priorityRadio = document.querySelector(`input[name="priority-${capId}-${opp.id}"][value="${opp.priority}"]`);
                                    if (priorityRadio) priorityRadio.checked = true;
                                }
                            }, 150);
                        });
                    }
                }, 100);
            }
        }
    }
}

function confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This will clear all your inputs and return to the welcome screen. This cannot be undone.')) {
        resetAssessment();
    }
}

function resetAssessment() {
    console.log('[resetAssessment] Starting complete reset...');

    // 1. Clear localStorage FIRST
    localStorage.removeItem('cognitoAssessment');
    console.log('[resetAssessment] localStorage cleared');

    // 2. Reset main application state
    appState = {
        step1: {
            capabilities: {}
        },
        step2: {
            selectedUseCases: {},
            opportunities: [],
            opportunityMappings: {},
            activeOpportunityId: '',
            filters: {
                consequence: [],
                domain: []
            }
        },
        step3: {
            riskAssessments: {},
            dataAssessments: {},
            principleResponses: {}
        },
        step4: {
            selectedUseCases: [],
            worksheets: {}
        },
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
    console.log('[resetAssessment] appState reset');

    // 3. Reset risk wizard state
    riskWizardState = {
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
    console.log('[resetAssessment] riskWizardState reset');

    // 4. Reset data wizard state
    if (typeof dataWizardState !== 'undefined') {
        dataWizardState = {
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
    }

    // 5. Reset current step tracker
    currentStep = 0;

    // 6. Reset ALL navigation elements - icons, status text, and classes
    for (let i = 1; i <= 5; i++) {
        // Reset nav card classes
        const navStep = document.getElementById(`nav-step-${i}`);
        if (navStep) {
            navStep.classList.remove('step-complete', 'step-active');
        }

        // Reset icon back to step number (remove checkmark)
        const iconElement = document.getElementById(`nav-icon-${i}`);
        if (iconElement) {
            iconElement.textContent = String(i);
        }

        // Reset status text
        const statusElement = document.getElementById(`status-${i}`);
        if (statusElement) {
            statusElement.textContent = 'Not started';
            statusElement.className = 'text-xs text-blue-300 mt-1';
        }
    }
    console.log('[resetAssessment] Navigation icons and status reset');

    // 7. Set Welcome (step 0) as active
    for (let i = 0; i <= 5; i++) {
        const navStep = document.getElementById(`nav-step-${i}`);
        if (navStep) {
            navStep.classList.remove('step-active');
        }
    }
    (function(){ var _el = document.getElementById('nav-step-0'); if(_el) _el.classList.add('step-active'); })();

    // 8. Reset Step 1 UI
    document.querySelectorAll('.capability-checkbox').forEach(cb => cb.checked = false);
    const customCapCheckbox = document.getElementById('custom-capability-checkbox');
    if (customCapCheckbox) customCapCheckbox.checked = false;

    const customCapName = document.getElementById('custom-capability-name');
    const customCapDesc = document.getElementById('custom-capability-description');
    const customCapFields = document.getElementById('custom-capability-fields');
    if (customCapName) customCapName.value = '';
    if (customCapDesc) customCapDesc.value = '';
    if (customCapFields) customCapFields.classList.add('hidden');

    const capSelection = document.getElementById('capability-selection');
    const assessmentForms = document.getElementById('assessment-forms');
    const completeStep1Btn = document.getElementById('complete-step1-btn');
    if (capSelection) capSelection.style.display = 'block';
    if (assessmentForms) {
        assessmentForms.classList.add('hidden');
        // Only remove capability cards, not the entire innerHTML (preserves the "Change Selections" button)
        const capabilityCards = assessmentForms.querySelectorAll('[id^="capability-"]');
        capabilityCards.forEach(card => card.remove());
    }
    if (completeStep1Btn) completeStep1Btn.classList.add('hidden');
    console.log('[resetAssessment] Step 1 UI reset');

    // 9. Reset Step 2 UI
    document.querySelectorAll('.consequence-filter, .domain-filter').forEach(cb => cb.checked = false);

    const worksheetsContainer = document.getElementById('selected-use-cases-worksheets');
    if (worksheetsContainer) worksheetsContainer.innerHTML = '';

    const selectedSection = document.getElementById('selected-use-cases-section');
    if (selectedSection) selectedSection.classList.add('hidden');

    const step1SummaryContent = document.getElementById('step1-summary-content');
    if (step1SummaryContent) {
        step1SummaryContent.innerHTML = '<p class="text-gray-500 italic">No opportunities selected yet. Complete Step 1 first.</p>';
    }

    const opportunitiesSummary = document.getElementById('opportunities-summary');
    if (opportunitiesSummary) opportunitiesSummary.innerHTML = '';

    const opportunityAlignmentTable = document.getElementById('opportunity-alignment-table');
    if (opportunityAlignmentTable) opportunityAlignmentTable.innerHTML = '';
    console.log('[resetAssessment] Step 2 UI reset');

    // 10. Reset Step 3 UI
    const riskManagementContent = document.getElementById('risk-management-content');
    if (riskManagementContent) riskManagementContent.classList.add('hidden');

    const phaseBreakSection = document.getElementById('phase-break-section');
    if (phaseBreakSection) phaseBreakSection.classList.add('hidden');

    const riskAnalysisStatusSection = document.getElementById('risk-analysis-status-section');
    if (riskAnalysisStatusSection) riskAnalysisStatusSection.classList.add('hidden');

    const riskManagementStatus = document.getElementById('risk-management-status');
    if (riskManagementStatus) {
        riskManagementStatus.innerHTML = '<span class="text-sm text-gray-400">Not started</span>';
    }

    const phase2LockBadge = document.getElementById('phase2-lock-badge');
    if (phase2LockBadge) {
        phase2LockBadge.textContent = '🔒 Complete Risk Management to unlock';
        phase2LockBadge.classList.remove('hidden');
    }

    // Reset Phase 2 principle cards to locked state
    const phase2Principles = ['data-infrastructure', 'investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
    phase2Principles.forEach(principle => {
        const card = document.getElementById(`${principle}-card`);
        if (card) {
            card.classList.add('principle-card-locked', 'cursor-not-allowed', 'opacity-60');
            card.classList.remove('cursor-pointer', 'hover:border-blue-400');
            card.onclick = null;
        }
        const status = document.getElementById(`${principle}-status`);
        if (status) {
            status.innerHTML = '<span class="text-xs text-gray-400">🔒</span>';
        }
        const content = document.getElementById(`${principle}-content`);
        if (content) content.classList.add('hidden');
    });
    console.log('[resetAssessment] Step 3 UI reset');

    // 10b. Reset Step 5 UI - Clear all control textareas
    const step5Textareas = document.querySelectorAll('textarea[id^="control-"]');
    step5Textareas.forEach(textarea => {
        textarea.value = '';
    });
    // Reset the progress counter
    const step5Progress = document.querySelector('#step-5 .text-gray-600');
    if (step5Progress && step5Progress.textContent.includes('documented responses')) {
        step5Progress.textContent = 'You have documented responses for 0 of 13 control questions.';
    }
    console.log('[resetAssessment] Step 5 UI reset');

    // 11. Close any open modals
    const modals = ['risk-wizard-modal', 'data-wizard-modal', 'use-case-catalog-modal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    });

    // 12. Hide summary page
    const summaryPage = document.getElementById('summary-page');
    if (summaryPage) summaryPage.classList.add('hidden');

    // 13. Show sidebar
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebar) sidebar.style.display = 'flex';
    if (sidebarToggle) sidebarToggle.style.display = 'block';

    // 14. Hide all step content, show only step 0
    for (let i = 0; i <= 5; i++) {
        const stepContent = document.getElementById(`step-${i}`);
        if (stepContent) {
            if (i === 0) {
                stepContent.classList.remove('hidden');
            } else {
                stepContent.classList.add('hidden');
            }
        }
    }

    // 15. Update header for welcome screen
    const currentStepTitle = document.getElementById('current-step-title');
    const currentStepSubtitle = document.getElementById('current-step-subtitle');
    const currentStepNumber = document.getElementById('current-step-number');
    if (currentStepTitle) currentStepTitle.textContent = 'Welcome';
    if (currentStepSubtitle) currentStepSubtitle.textContent = 'COGNITO AI Readiness Framework';
    if (currentStepNumber) currentStepNumber.textContent = '0';

    // 16. Re-render Step 2 catalog to clear any selection states
    if (typeof renderUseCaseCatalog === 'function') {
        renderUseCaseCatalog();
    }

    // 17. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('[resetAssessment] Complete reset finished');

    // Show notification (don't use showNotification as it might trigger save)
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    if (notification && notificationText) {
        notificationText.textContent = 'Assessment reset successfully. Starting fresh!';
        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.add('hidden'), 3000);
    }
}

// UI Helpers
