/**
 * COGNITO Step 3 Module
 * Risk Analysis, Data Assessment, and AI Principles Evaluation
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// STEP 3 FUNCTIONS
// ============================================

const consequenceCategories = [
    { id: 'service-loss', icon: '⚡', name: 'Service Loss Extent', description: 'Geographic scope and number of customers affected by service interruption',
      labels: ['No customers affected', 'Individual customer or premise', 'Small group (< 100 customers)', 'Neighborhood/feeder (100-1000 customers)', 'Large area/substation (1000+ customers)', 'Transmission-level impact (regional)'] },
    { id: 'outage-duration', icon: '⏱️', name: 'Outage Duration', description: 'Length of time service or functionality remains unavailable',
      labels: ['No outage', 'Momentary (< 15 min)', 'Brief (15-60 min)', 'Extended (1-4 hours)', 'Prolonged (4-24 hours)', 'Multi-day (> 24 hours)'] },
    { id: 'safety-impact', icon: '🛡️', name: 'Safety Impact', description: 'Potential for physical harm to personnel, customers, or public',
      labels: ['No safety risk', 'Minor concern (awareness needed)', 'Potential for minor injury', 'Serious injury likely', 'Multiple serious injuries possible', 'Life-threatening or fatal'] },
    { id: 'asset-integrity', icon: '🏗️', name: 'Asset Integrity', description: 'Extent of physical damage to equipment, infrastructure, or facilities',
      labels: ['No damage', 'Cosmetic (cleaning/repainting)', 'Minor repair (quick fix, low cost)', 'Significant repair (parts, downtime)', 'Major repair (weeks, substantial cost)', 'Total loss (replacement required)'] },
    { id: 'privacy-security', icon: '🔒', name: 'Privacy/Data Security', description: 'Exposure of personal, sensitive, or confidential information',
      labels: ['No data exposed', 'Limited internal data only', 'Customer names/addresses', 'Account/payment details', 'Protected/regulated data (CEII, CIP)', 'Mass PII breach (legal exposure)'] },
    { id: 'data-loss', icon: '💾', name: 'Data Loss', description: 'Permanent or temporary loss of critical operational or business data',
      labels: ['No data lost', 'Fully recoverable (backups exist)', 'Partial loss (some gaps acceptable)', 'Significant loss (impacts operations)', 'Major loss (business disruption)', 'Complete/permanent loss'] },
    { id: 'economic-cost', icon: '💰', name: 'Direct Economic Cost', description: 'Quantifiable financial impact including repairs, penalties, and lost revenue',
      labels: ['Negligible (< $10k)', 'Minor (< $50k)', 'Moderate ($50k-$100k)', 'Significant ($100k-$500k)', 'Major ($500k-$2M)', 'Severe (> $2M)'] },
    { id: 'reliability-metrics', icon: '📊', name: 'Reliability Metrics', description: 'Impact on regulatory reliability indices (SAIDI, SAIFI, CAIDI)',
      labels: ['No measurable impact', 'Minimal (barely detectable)', 'Noticeable (internal tracking)', 'Moderate (potential regulatory notice)', 'Significant (affects benchmarks)', 'Severe (regulatory action likely)'] },
    { id: 'reputation', icon: '📰', name: 'Reputation Impact', description: 'Public perception, media coverage, and stakeholder confidence',
      labels: ['No public awareness', 'Minimal (internal only)', 'Local attention (community level)', 'Regional coverage (state/area news)', 'Widespread (national attention)', 'Crisis (major brand impact)'] }
];

// Risk wizard state

// NOTE: riskWizardState is defined in state.js
// NOTE: rebuildLegacySelectedUseCasesFromOpportunityMappings is defined in utils.js

function initializeStep3() {
    console.log('Initializing Step 3...');
    // Derive selected use cases from Step 2 opportunity mappings
    rebuildLegacySelectedUseCasesFromOpportunityMappings();

    // Initialize step 3 state if not exists
    if (!appState.step3) {
        appState.step3 = {
            riskAnalyses: {},
            dataAssessments: {},
            selectedPrinciple: null,
            riskManagementComplete: false,
            dataAssessmentComplete: false
        };
    }

    // Ensure dataAssessments exists even if step3 was initialized earlier
    if (!appState.step3.dataAssessments) {
        appState.step3.dataAssessments = {};
    }

    updateStep3UI();
}

function updateStep3UI() {
    // Clean up orphaned data first to ensure UI shows only valid use cases
    cleanupOrphanedData();

    // Update principles progress
    let completedCount = 0;
    if (appState.step3.riskManagementComplete) completedCount++;
    if (appState.step3.dataAssessmentComplete) completedCount++;

    // Check Phase 2 principles
    const phase2Principles = ['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
    phase2Principles.forEach(pid => {
        if (appState.step3.principles && appState.step3.principles[pid] && appState.step3.principles[pid].assessed) {
            completedCount++;
        }
    });

    document.getElementById('principles-progress-text').textContent = `${completedCount} / 6 Principles with Responses`;
    document.getElementById('principles-progress-bar').style.width = `${(completedCount / 6) * 100}%`;

    // Update Risk Management card status
    const riskMgmtStatus = document.getElementById('risk-management-status');
    const riskMgmtCard = document.getElementById('risk-management-card');

    if (appState.step3.riskManagementComplete) {
        riskMgmtStatus.innerHTML = '<span class="text-green-600 font-medium">✓ Complete</span>';
        riskMgmtCard.classList.remove('border-gray-200');
        riskMgmtCard.classList.add('border-green-400', 'bg-green-50');

        // Hide the START HERE badge
        const startHereBadge = document.getElementById('risk-start-here-badge');
        if (startHereBadge) {
            startHereBadge.classList.add('hidden');
        }

        // Show phase break section
        document.getElementById('phase-break-section').classList.remove('hidden');

        // Unlock Phase 2 principles
        unlockPhase2Principles();

        // Show complete button (but may be disabled)
        document.getElementById('complete-step3-btn').classList.remove('hidden');

        // Check if all Phase 2 assessments are complete
        updateCompleteButtonState();
    } else {
        // Show the START HERE badge when not complete
        const startHereBadge = document.getElementById('risk-start-here-badge');
        if (startHereBadge) {
            startHereBadge.classList.remove('hidden');
        }
    }

    // Update Data Infrastructure card status
    const dataInfraStatus = document.getElementById('data-infrastructure-status');
    const dataInfraCard = document.getElementById('data-infrastructure-card');

    if (dataInfraStatus && dataInfraCard && appState.step3.dataAssessmentComplete) {
        dataInfraStatus.innerHTML = '<span class="text-green-600 font-medium">✓ Complete</span>';
        dataInfraCard.classList.remove('border-gray-200');
        dataInfraCard.classList.add('border-green-400', 'bg-green-50');
    }

    // Update risk analysis status section
    updateRiskAnalysisStatus();

    // Update data assessment status section
    updateDataAssessmentStatus();
}

function updateCompleteButtonState() {
    const completeBtn = document.getElementById('complete-step3-btn');
    const warningDiv = document.getElementById('incomplete-phase2-warning');
    const incompleteList = document.getElementById('incomplete-assessments-list');

    if (!completeBtn || !warningDiv || !incompleteList) return;

    // Check all Phase 2 assessments
    const incomplete = [];

    // 1. Data & Infrastructure
    if (!appState.step3.dataAssessmentComplete) {
        incomplete.push('Data & Infrastructure Assessment');
    }

    // 2. Investment Capacity
    if (!(appState.step3.principles && appState.step3.principles['investment-capacity'] && appState.step3.principles['investment-capacity'].assessed)) {
        incomplete.push('Investment Capacity');
    }

    // 3. Skilled Personnel
    if (!(appState.step3.principles && appState.step3.principles['skilled-personnel'] && appState.step3.principles['skilled-personnel'].assessed)) {
        incomplete.push('Skilled Personnel');
    }

    // 4. Governance and Compliance
    if (!(appState.step3.principles && appState.step3.principles['regulatory-compliance'] && appState.step3.principles['regulatory-compliance'].assessed)) {
        incomplete.push('Governance and Compliance');
    }

    // 5. Clear Objectives
    if (!(appState.step3.principles && appState.step3.principles['clear-objectives'] && appState.step3.principles['clear-objectives'].assessed)) {
        incomplete.push('Clear Objectives');
    }

    if (incomplete.length > 0) {
        // Disable button and show warning
        completeBtn.disabled = true;
        completeBtn.classList.add('opacity-50', 'cursor-not-allowed');
        warningDiv.classList.remove('hidden');

        // Build incomplete list
        incompleteList.innerHTML = '<ul class="list-disc list-inside space-y-1">' +
            incomplete.map(item => `<li>${item}</li>`).join('') +
            '</ul>';
    } else {
        // Enable button and hide warning
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        warningDiv.classList.add('hidden');
    }
}

function updateRiskAnalysisStatus() {
    const statusSection = document.getElementById('risk-analysis-status-section');
    const completedList = document.getElementById('risk-analysis-completed-list');
    const summaryDiv = document.getElementById('risk-analysis-summary');

    // If status section doesn't exist (simplified UI), skip this update
    if (!statusSection || !completedList || !summaryDiv) {
        return;
    }

    if (!appState.step3.riskAnalyses || Object.keys(appState.step3.riskAnalyses || {}).length === 0) {
        statusSection.classList.add('hidden');
        return;
    }

    statusSection.classList.remove('hidden');
    completedList.innerHTML = '';

    const analyses = appState.step3.riskAnalyses;
    const totalUseCases = getAllUseCaseIdsFromStep2().length;
    let completedCount = 0;

    Object.keys(analyses).forEach(useCaseId => {
        const analysis = analyses[useCaseId];
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCase) return;

        completedCount++;

        const riskColor = getRiskLevelColor(analysis.riskLevel);

        // Check if Phase 2 was done
        const hasPhase2 = ((analysis.systemBoundaries && analysis.systemBoundaries.aiDecisions)) ||
                          ((analysis.failureModes && analysis.failureModes.availability && analysis.failureModes.availability.enabled)) ||
                          ((analysis.failureModes && analysis.failureModes.accuracy && analysis.failureModes.accuracy.enabled)) ||
                          ((analysis.failureModes && analysis.failureModes.latency && analysis.failureModes.latency.enabled)) ||
                          (analysis.securityChecks && analysis.securityChecks.length > 0) ||
                          ((analysis.mitigations && analysis.mitigations.engineering)) ||
                          ((analysis.statusQuo && analysis.statusQuo.currentRisks));
        const phase2Badge = hasPhase2
            ? '<span class="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">Phase 2</span>'
            : '<span class="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">Phase 1</span>';

        const itemHTML = `
            <div class="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span class="font-medium">${useCase.name}</span>
                </div>
                <div class="flex items-center space-x-3">
                    ${phase2Badge}
                    <span class="px-2 py-1 rounded text-xs font-medium ${riskColor}">${analysis.riskLevel}</span>
                    <span class="text-sm text-gray-500">${analysis.totalScore}/45</span>
                    <button onclick="editRiskAnalysis('${useCaseId}')" class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition">
                        Edit →
                    </button>
                </div>
            </div>
        `;
        completedList.innerHTML += itemHTML;
    });

    summaryDiv.textContent = `${completedCount} of ${totalUseCases} use cases assessed`;
}

function editRiskAnalysis(useCaseId) {
    // Open wizard and pre-select this use case.
    // openRiskAnalysisWizard() resets riskWizardState to a clean slate, which ensures no
    // leftover working data from a previously viewed use case carries over. We then select
    // this use case; onUseCaseSelected() detects existing saved data and offers resume,
    // and resumeExistingAnalysis() rehydrates every field from THIS use case's data.
    openRiskAnalysisWizard();

    // Wait for wizard to initialize, then select the use case
    setTimeout(() => {
        const select = document.getElementById('wizard-use-case-select');
        if (select) {
            select.value = useCaseId;
            onUseCaseSelected();
        }
    }, 100);
}

function getRiskLevelColor(level) {
    switch(level) {
        case 'Minimal': return 'bg-green-100 text-green-800 border-green-300';
        case 'Low': return 'bg-green-100 text-green-800 border-green-300';
        case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
}

function selectPrinciple(principleId) {
    // Hide all principle content
    document.querySelectorAll('#principle-content-area > div').forEach(div => {
        div.classList.add('hidden');
    });

    // Show selected principle content
    const contentDiv = document.getElementById(`${principleId}-content`);
    if (contentDiv) {
        contentDiv.classList.remove('hidden');
    }

    // Update card visual state - remove highlight from all cards
    document.querySelectorAll('[id$="-card"]').forEach(card => {
        const cardId = card.id.replace('-card', '');

        // Remove all highlight classes (blue and green)
        card.classList.remove('border-blue-600', 'bg-blue-100', 'border-blue-500', 'bg-blue-50', 'border-green-400', 'bg-green-50');

        // Clear any inline border styles
        card.style.borderColor = '';
        card.style.borderWidth = '';
        card.style.animation = '';

        // Check if this card is complete and not the selected one
        let isComplete = false;
        if (cardId === 'data-infrastructure' && appState.step3.dataAssessmentComplete) {
            isComplete = true;
        } else if (cardId === 'risk-management' && appState.step3.riskManagementComplete) {
            isComplete = true;
        } else if (appState.step3.principles && appState.step3.principles[cardId] && appState.step3.principles[cardId].assessed) {
            isComplete = true;
        }

        // If complete but not selected, show green. Otherwise show white/gray
        if (isComplete && cardId !== principleId) {
            card.classList.add('bg-green-50', 'border-green-400');
        } else if (cardId !== principleId) {
            card.classList.add('bg-white', 'border-gray-200');
        }
    });

    const selectedCard = document.getElementById(`${principleId}-card`);
    if (selectedCard && !selectedCard.classList.contains('principle-card-locked')) {
        // Remove default and green classes
        selectedCard.classList.remove('bg-white', 'border-gray-200', 'bg-green-50', 'border-green-400');
        // Add stronger blue highlight classes for selected card
        selectedCard.classList.add('border-blue-600', 'bg-blue-100');
        // Make border thicker for more prominence
        selectedCard.style.borderWidth = '3px';
    }

    appState.step3.selectedPrinciple = principleId;

    // Populate investment intensity section if Investment Capacity is selected
    if (principleId === 'investment-capacity') {
        populateInvestmentIntensity();
    }
}

function populateInvestmentIntensity() {
    const container = document.getElementById('investment-intensity-use-cases');
    if (!container) return;

    // Get selected use cases from Step 2
    const selectedUseCases = [];

    // Check opportunityMappings for selected use cases (it's an object, not array)
    if (appState.step2 && appState.step2.opportunityMappings) {
        Object.values(appState.step2.opportunityMappings || {}).forEach(mapping => {
            if (mapping.useCaseId) {
                const useCase = useCaseCatalog.find(uc => uc.id === mapping.useCaseId);
                if (useCase && !selectedUseCases.find(uc => uc.id === useCase.id)) {
                    selectedUseCases.push(useCase);
                }
            }
        });
    }

    if (selectedUseCases.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">No use cases selected in Step 2. Please complete Step 2 first.</p>';
        return;
    }

    // Build HTML for each selected use case
    let html = '';
    selectedUseCases.forEach((useCase, index) => {
        const intensityData = investmentIntensityData[useCase.name];

        if (!intensityData) {
            // If no intensity data, show placeholder
            html += `
                <div class="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex-1">
                            <h5 class="font-bold text-gray-900">${useCase.name}</h5>
                        </div>
                        <div class="flex items-center">
                            <span class="text-gray-500 font-bold text-xl">N/A</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 italic">Investment intensity data not available for this use case</p>
                </div>
            `;
            return;
        }

        // Determine color based on intensity
        let intensityColor = 'green';
        let dollarColor = 'text-green-600';
        if (intensityData.intensity === '$$') {
            intensityColor = 'yellow';
            dollarColor = 'text-yellow-600';
        } else if (intensityData.intensity === '$$$') {
            intensityColor = 'orange';
            dollarColor = 'text-orange-600';
        } else if (intensityData.intensity === '$$$$') {
            intensityColor = 'red';
            dollarColor = 'text-red-600';
        }

        // Create expandable card
        html += `
            <div class="bg-white border-2 border-${intensityColor}-200 rounded-lg overflow-hidden">
                <div class="p-5">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex-1">
                            <h5 class="font-bold text-gray-900">${useCase.name}</h5>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="text-right">
                                <div class="${dollarColor} font-bold text-2xl">${intensityData.intensity}</div>
                                <div class="text-xs text-gray-600">${intensityData.level}</div>
                            </div>
                            <button
                                onclick="toggleInvestmentDetail(${index})"
                                class="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>

                    <div id="investment-detail-${index}" class="hidden mt-4 pt-4 border-t border-${intensityColor}-200">
                        <h6 class="font-semibold text-gray-800 mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                            Implementation Complexity Rationale
                        </h6>
                        <ul class="space-y-2 text-sm text-gray-700">
                            ${intensityData.rationale.map(point => `
                                <li class="flex items-start">
                                    <span class="text-${intensityColor}-500 mr-2 mt-1">•</span>
                                    <span>${point}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleInvestmentDetail(index) {
    const detailDiv = document.getElementById(`investment-detail-${index}`);
    if (detailDiv) {
        detailDiv.classList.toggle('hidden');
    }
}

function unlockPhase2Principles() {
    document.getElementById('phase2-lock-badge').classList.add('hidden');

    const phase2Cards = ['data-infrastructure', 'investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];

    phase2Cards.forEach((cardId, index) => {
        const card = document.getElementById(`${cardId}-card`);
        if (card) {
            // Stagger the unlock animation
            setTimeout(() => {
                card.classList.remove('principle-card-locked', 'cursor-not-allowed', 'opacity-60', 'bg-gray-50');
                card.classList.add('cursor-pointer', 'hover:border-blue-400', 'bg-white', 'hover:shadow-lg', 'transition-all');
                card.onclick = () => selectPrinciple(cardId);
                card.title = 'Click to complete this principle';

                // Add pulsing border animation for first card
                if (index === 0) {
                    card.style.animation = 'pulse-border 2s ease-in-out 3';
                    card.style.borderColor = '#3B82F6';
                    card.style.borderWidth = '3px';
                }

                // Update status element
                const statusEl = document.getElementById(`${cardId}-status`);
                if (statusEl && statusEl.textContent === '🔒') {
                    statusEl.innerHTML = '<span class="text-blue-600 font-medium text-xs">Click to start →</span>';
                    statusEl.classList.remove('text-gray-400');
                }
            }, index * 100); // Stagger by 100ms each
        }
    });
}

function scrollToPhase2() {
    const phase2Section = document.getElementById('phase2-section');

    // Scroll to Phase 2
    phase2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Add temporary highlight effect
    phase2Section.style.transition = 'all 0.3s ease';
    phase2Section.style.backgroundColor = '#EFF6FF'; // Light blue highlight
    phase2Section.style.padding = '1.5rem';
    phase2Section.style.borderRadius = '0.75rem';
    phase2Section.style.border = '3px solid #3B82F6';

    // Remove highlight after 2 seconds
    setTimeout(() => {
        phase2Section.style.backgroundColor = '';
        phase2Section.style.border = '';
        phase2Section.style.padding = '';
    }, 2000);

    // Show helpful tooltip after a moment
    setTimeout(() => {
        showPhase2Tooltip();
    }, 500);

    // Auto-open Data & Infrastructure after scroll completes
    setTimeout(() => {
        const dataCard = document.getElementById('data-infrastructure-card');
        if (dataCard && !dataCard.classList.contains('principle-card-locked')) {
            // Click the Data & Infrastructure card to open it
            dataCard.click();
        }
    }, 800);
}

function showPhase2Tooltip() {
    // Check if tooltip already shown this session
    if (sessionStorage.getItem('phase2TooltipShown')) return;

    const dataCard = document.getElementById('data-infrastructure-card');
    if (!dataCard) return;

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'phase2-tooltip';
    tooltip.className = 'fixed z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-2xl max-w-sm animate-bounce';
    tooltip.innerHTML = `
        <div class="flex items-start space-x-3">
            <span class="text-2xl">👇</span>
            <div>
                <p class="font-semibold mb-1">Start Phase 2 Here!</p>
                <p class="text-sm">Click on <strong>Data & Infrastructure</strong> or any other principle card below to begin your deep readiness assessment.</p>
            </div>
            <button onclick="closePhase2Tooltip()" class="text-white hover:text-blue-200 ml-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(tooltip);

    // Position tooltip above the Data & Infrastructure card
    const rect = dataCard.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

    // Auto-hide after 8 seconds
    setTimeout(() => {
        closePhase2Tooltip();
    }, 8000);

    // Mark as shown
    sessionStorage.setItem('phase2TooltipShown', 'true');
}

function closePhase2Tooltip() {
    const tooltip = document.getElementById('phase2-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
    }
}

// ============================================
// RISK ANALYSIS WIZARD
// ============================================

function openRiskAnalysisWizard(autoSelectNext = false) {
    // Reset wizard state
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

    // Populate use case dropdown
    populateUseCaseDropdown();

    // Show previous assessments if any
    updateWizardPreviousAssessments();

    // Auto-select first unassessed use case if requested
    if (autoSelectNext) {
        const unassessed = getUnassessedUseCaseIds();
        if (unassessed.length > 0) {
            const select = document.getElementById('wizard-use-case-select');
            select.value = unassessed[0];
            onUseCaseSelected();
        }
    }

    // Show wizard modal
    document.getElementById('risk-wizard-modal').classList.remove('hidden');

    // Show step 0
    showWizardStep(0);
}

function closeRiskWizard() {
    document.getElementById('risk-wizard-modal').classList.add('hidden');
}

function populateUseCaseDropdown() {
    const select = document.getElementById('wizard-use-case-select');
    select.innerHTML = '<option value="">-- Select a use case --</option>';

    // Use the helper function to get all use case IDs
    const allUseCaseIds = getAllUseCaseIdsFromStep2();

    allUseCaseIds.forEach(useCaseId => {
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCase) return;

        const isCompleted = appState.step3.riskAnalyses && appState.step3.riskAnalyses[useCaseId];
        const completedMark = isCompleted ? '✓ ' : '';
        const consequenceLabel = `(${capitalizeFirst(useCase.consequence)} consequence)`;

        const option = document.createElement('option');
        option.value = useCaseId;
        option.textContent = `${completedMark}${useCase.name} ${consequenceLabel}`;
        select.appendChild(option);
    });
}

function updateWizardPreviousAssessments() {
    const container = document.getElementById('wizard-previous-assessments');
    const list = document.getElementById('wizard-completed-list');
    const summary = document.getElementById('wizard-completion-summary');

    if (!appState.step3.riskAnalyses || Object.keys(appState.step3.riskAnalyses || {}).length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    list.innerHTML = '';

    const allUseCaseIds = getAllUseCaseIdsFromStep2();
    const totalUseCases = allUseCaseIds.length;
    let completedCount = 0;

    Object.keys(appState.step3.riskAnalyses || {}).forEach(useCaseId => {
        const analysis = appState.step3.riskAnalyses[useCaseId];
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCase) return;

        completedCount++;
        const riskColor = getRiskLevelColor(analysis.riskLevel);

        list.innerHTML += `
            <div class="flex items-center justify-between bg-white rounded-lg p-2 border border-green-200">
                <span class="font-medium text-sm">${useCase.name}</span>
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-0.5 rounded text-xs font-medium ${riskColor}">${analysis.riskLevel}</span>
                    <span class="text-xs text-gray-500">${analysis.totalScore}/45</span>
                </div>
            </div>
        `;
    });

    summary.textContent = `${completedCount} of ${totalUseCases} use cases assessed`;
}

function onUseCaseSelected() {
    const select = document.getElementById('wizard-use-case-select');
    const confirmation = document.getElementById('wizard-selected-confirmation');
    const existingAnalysis = document.getElementById('wizard-existing-analysis');
    const nameSpan = document.getElementById('wizard-selected-name');
    const nextBtn = document.getElementById('wizard-next-btn');

    // Hide both sections initially
    confirmation.classList.add('hidden');
    existingAnalysis.classList.add('hidden');

    if (select.value) {
        riskWizardState.selectedUseCaseId = select.value;
        const useCase = useCaseCatalog.find(uc => uc.id === select.value);
        const useCaseName = useCase ? useCase.name : select.value;

        // Find linked opportunities for this use case
        const linkedOpportunities = getLinkedOpportunitiesForUseCase(select.value);
        const opportunitiesHtml = formatOpportunityList(linkedOpportunities);

        // Check if there's an existing analysis for this use case
        const existingData = (appState.step3 && appState.step3.riskAnalyses ? appState.step3.riskAnalyses[select.value] : undefined);

        if (existingData) {
            // Show existing analysis options
            document.getElementById('existing-analysis-name').textContent = useCaseName;
            document.getElementById('existing-risk-level').textContent = existingData.riskLevel;
            document.getElementById('existing-risk-score').textContent = `${existingData.totalScore}/45`;
            document.getElementById('existing-completed-at').textContent = new Date(existingData.completedAt).toLocaleDateString();

            // Display linked opportunities in existing analysis section
            document.getElementById('wizard-existing-opportunity-list').innerHTML = opportunitiesHtml;

            // Check if Phase 2 was completed
            const hasPhase2 = ((existingData.systemBoundaries && existingData.systemBoundaries.aiDecisions)) ||
                              ((existingData.failureModes && existingData.failureModes.availability && existingData.failureModes.availability.enabled)) ||
                              ((existingData.failureModes && existingData.failureModes.accuracy && existingData.failureModes.accuracy.enabled)) ||
                              ((existingData.failureModes && existingData.failureModes.latency && existingData.failureModes.latency.enabled)) ||
                              (existingData.securityChecks && existingData.securityChecks.length > 0) ||
                              ((existingData.mitigations && existingData.mitigations.engineering)) ||
                              ((existingData.statusQuo && existingData.statusQuo.currentRisks));
            document.getElementById('existing-phase2-status').textContent = hasPhase2 ? 'Completed' : 'Not started';

            existingAnalysis.classList.remove('hidden');

            // Hide the next button - user must choose resume or start fresh
            nextBtn.classList.add('hidden');
        } else {
            // No existing analysis - show standard confirmation
            nameSpan.textContent = useCaseName;

            // Display linked opportunities in new confirmation section
            document.getElementById('wizard-opportunity-list').innerHTML = opportunitiesHtml;

            confirmation.classList.remove('hidden');
            nextBtn.disabled = false;
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'hidden');

            // Clear comprehensive analysis fields since this is a new use case
            clearAllComprehensiveAnalysisFields();
        }
    } else {
        riskWizardState.selectedUseCaseId = null;
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.classList.remove('hidden');
    }
}

function getLinkedOpportunitiesForUseCase(useCaseId) {
    const opportunities = [];
    const mappings = appState.step2.opportunityMappings || {};
    const opportunitiesList = appState.step2.opportunities || [];

    Object.entries(mappings).forEach(([oppId, mapping]) => {
        if (mapping && mapping.useCaseId === useCaseId) {
            const opp = opportunitiesList.find(o => o.id === oppId);
            if (opp) {
                opportunities.push(opp);
            }
        }
    });

    return opportunities;
}

function formatOpportunityList(opportunities) {
    if (opportunities.length === 0) {
        return '<span class="text-gray-500 italic">No opportunities linked</span>';
    }

    return opportunities.map((opp, index) => {
        const capabilityName = opp.capability || 'Unknown Capability';
        const oppText = opp.problem || 'No description';
        return `<div class="flex items-start mb-1">
            <span class="text-blue-600 mr-2">•</span>
            <span><strong>${oppText}</strong> (${capabilityName})</span>
        </div>`;
    }).join('');
}

function resumeExistingAnalysis() {
    const useCaseId = riskWizardState.selectedUseCaseId;
    const existingData = (appState.step3 && appState.step3.riskAnalyses ? appState.step3.riskAnalyses[useCaseId] : undefined);

    if (!existingData) {
        alert('Error: Could not find existing analysis data.');
        return;
    }

    // Load existing data into wizard state
    riskWizardState.totalScore = existingData.totalScore;
    riskWizardState.riskLevel = existingData.riskLevel;
    riskWizardState.consequenceScores = { ...existingData.consequenceScores };
    riskWizardState.systemBoundaries = { ...(existingData.systemBoundaries || {}) };
    riskWizardState.failureModes = { ...(existingData.failureModes || {}) };
    riskWizardState.securityChecks = [...(existingData.securityChecks || [])];
    riskWizardState.mitigations = { ...(existingData.mitigations || {}) };
    riskWizardState.threatMitigations = { ...(existingData.threatMitigations || {}) };
    riskWizardState.statusQuo = { ...(existingData.statusQuo || {}) };

    // Determine which step to resume at - check for actual Phase 2 content
    const hasPhase2Data = ((existingData.systemBoundaries && existingData.systemBoundaries.aiDecisions)) ||
                          ((existingData.failureModes && existingData.failureModes.availability && existingData.failureModes.availability.enabled)) ||
                          ((existingData.failureModes && existingData.failureModes.accuracy && existingData.failureModes.accuracy.enabled)) ||
                          ((existingData.failureModes && existingData.failureModes.latency && existingData.failureModes.latency.enabled)) ||
                          (existingData.securityChecks && existingData.securityChecks.length > 0) ||
                          ((existingData.mitigations && existingData.mitigations.engineering)) ||
                          ((existingData.statusQuo && existingData.statusQuo.currentRisks));

    // IMPORTANT (bug fix): proactively rehydrate EVERY field from the selected use case's
    // saved data before navigating. The wizard's form fields (consequence notes and the
    // static Phase 2 textareas/checkboxes) are shared DOM elements that persist between
    // use cases. If we don't refresh them here, they keep showing the PREVIOUS use case's
    // text, and the saveCurrentStepData() that runs on the next navigation would copy that
    // stale text into this use case's working state. Refresh step 1 and all Phase 2 steps now.
    renderConsequenceScoringCards();
    ['systemBoundaries', 'failureModes', 'securityChecks', 'mitigations', 'statusQuo']
        .forEach(stepType => populatePhase2StepData(stepType));

    // Set the step explicitly so any later save uses the correct context, then navigate to
    // the decision point. Pass skipSave=true so the freshly rehydrated fields are not
    // immediately overwritten by a pre-switch save against the (now correct) DOM.
    riskWizardState.currentStep = 2;
    showWizardStep(2, true);
}

function startFreshAnalysis() {
    // Confirm before clearing
    if (!confirm('This will clear your previous analysis. Are you sure you want to start fresh?')) {
        return;
    }

    // Clear wizard state for fresh start
    riskWizardState.consequenceScores = {};
    riskWizardState.systemBoundaries = {};
    riskWizardState.failureModes = {};
    riskWizardState.securityChecks = [];
    riskWizardState.mitigations = {};
    riskWizardState.threatMitigations = {};
    riskWizardState.statusQuo = {};
    riskWizardState.totalScore = 0;
    riskWizardState.riskLevel = null;

    // Clear all comprehensive analysis form fields
    clearAllComprehensiveAnalysisFields();

    // Proceed to step 1 (consequence scoring)
    showWizardStep(1);
}

function showWizardStep(stepNum, skipSave = false) {
    // Save current step data before switching.
    // skipSave is used by the resume path, which has just rehydrated all fields from the
    // selected use case's saved data; saving here would immediately overwrite that with
    // whatever happens to be in the (possibly mid-transition) DOM.
    if (!skipSave) {
        saveCurrentStepData();
    }

    // Hide all wizard steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.add('hidden');
    });

    // Show current step
    document.getElementById(`wizard-step-${stepNum}`).classList.remove('hidden');

    riskWizardState.currentStep = stepNum;

    // Update progress bar
    updateWizardProgress();

    // Update buttons
    updateWizardButtons();

    // Step-specific initialization
    if (stepNum === 1) {
        renderConsequenceScoringCards();
    } else if (stepNum === 2) {
        renderRiskCharacterization();
    } else if (stepNum === 3) {
        // Populate system boundaries if resuming
        populatePhase2StepData('systemBoundaries');
    } else if (stepNum === 4) {
        // Populate failure modes if resuming
        populatePhase2StepData('failureModes');
    } else if (stepNum === 5) {
        // Populate security checks if resuming
        populatePhase2StepData('securityChecks');
    } else if (stepNum === 6) {
        populateIdentifiedThreats();
        // Populate mitigations if resuming
        populatePhase2StepData('mitigations');
    } else if (stepNum === 7) {
        // Populate status quo if resuming
        populatePhase2StepData('statusQuo');
    }
}

function clearAllComprehensiveAnalysisFields() {
    // Clear System Boundaries fields
    const systemBoundariesFields = [
        'system-boundaries-ai-decisions',
        'system-boundaries-human-decisions',
        'system-boundaries-alert-conditions',
        'system-boundaries-worst-case'
    ];
    systemBoundariesFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });

    // Clear Failure Modes fields and checkboxes
    ['availability', 'accuracy', 'latency'].forEach(mode => {
        const checkbox = document.getElementById(`failure-${mode}-check`);
        if (checkbox) {
            checkbox.checked = false;
            toggleFailureMode(mode); // This will hide the fields
        }
        const howField = document.getElementById(`failure-${mode}-how`);
        const impactField = document.getElementById(`failure-${mode}-impact`);
        const detectField = document.getElementById(`failure-${mode}-detect`);
        if (howField) howField.value = '';
        if (impactField) impactField.value = '';
        if (detectField) detectField.value = '';
    });

    // Clear Security Checks
    document.querySelectorAll('.security-check').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear threat-specific mitigations (all textareas that start with threat-mitigation-)
    document.querySelectorAll('[id^="threat-mitigation-"]').forEach(textarea => {
        textarea.value = '';
    });

    // Clear Status Quo fields
    const statusQuoFields = [
        'status-quo-current-risks',
        'status-quo-missed-opportunities',
        'status-quo-competitive',
        'status-quo-inefficiencies'
    ];
    statusQuoFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
}

function populatePhase2StepData(stepType) {
    const useCaseId = riskWizardState.selectedUseCaseId;
    const existingData = (appState.step3 && appState.step3.riskAnalyses ? appState.step3.riskAnalyses[useCaseId] : undefined);

    // If no existing data, clear the fields for this step type
    if (!existingData) {
        if (stepType === 'systemBoundaries') {
            ['system-boundaries-ai-decisions', 'system-boundaries-human-decisions',
             'system-boundaries-alert-conditions', 'system-boundaries-worst-case'].forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = '';
            });
        } else if (stepType === 'failureModes') {
            ['availability', 'accuracy', 'latency'].forEach(mode => {
                const checkbox = document.getElementById(`failure-${mode}-check`);
                if (checkbox) checkbox.checked = false;
                ['how', 'impact', 'detect'].forEach(suffix => {
                    const field = document.getElementById(`failure-${mode}-${suffix}`);
                    if (field) field.value = '';
                });
            });
        } else if (stepType === 'securityChecks') {
            document.querySelectorAll('.security-check').forEach(cb => cb.checked = false);
        } else if (stepType === 'mitigations') {
            // Clear threat-specific mitigations
            document.querySelectorAll('[id^="threat-mitigation-"]').forEach(textarea => {
                textarea.value = '';
            });
        } else if (stepType === 'statusQuo') {
            ['status-quo-current-risks', 'status-quo-missed-opportunities',
             'status-quo-competitive', 'status-quo-inefficiencies'].forEach(id => {
                const field = document.getElementById(id);
                if (field) field.value = '';
            });
        }
        return;
    }

    if (stepType === 'systemBoundaries' && existingData.systemBoundaries) {
        const sb = existingData.systemBoundaries;
        const aiField = document.getElementById('system-boundaries-ai-decisions');
        const humanField = document.getElementById('system-boundaries-human-decisions');
        const alertField = document.getElementById('system-boundaries-alert-conditions');
        const worstField = document.getElementById('system-boundaries-worst-case');

        if (aiField) aiField.value = sb.aiDecisions || '';
        if (humanField) humanField.value = sb.humanDecisions || '';
        if (alertField) alertField.value = sb.alertConditions || '';
        if (worstField) worstField.value = sb.worstCase || '';
    }

    if (stepType === 'failureModes' && existingData.failureModes) {
        const fm = existingData.failureModes;
        ['availability', 'accuracy', 'latency'].forEach(mode => {
            const checkbox = document.getElementById(`failure-${mode}-check`);
            const howField = document.getElementById(`failure-${mode}-how`);
            const impactField = document.getElementById(`failure-${mode}-impact`);
            const detectField = document.getElementById(`failure-${mode}-detect`);

            if (fm[mode] && fm[mode].enabled) {
                if (checkbox) {
                    checkbox.checked = true;
                    toggleFailureMode(mode);
                }
                if (howField) howField.value = fm[mode].how || '';
                if (impactField) impactField.value = fm[mode].impact || '';
                if (detectField) detectField.value = fm[mode].detect || '';
            } else {
                // Clear if not enabled for this use case
                if (checkbox) checkbox.checked = false;
                if (howField) howField.value = '';
                if (impactField) impactField.value = '';
                if (detectField) detectField.value = '';
            }
        });
    }

    if (stepType === 'securityChecks') {
        // First uncheck all
        document.querySelectorAll('.security-check').forEach(cb => cb.checked = false);
        // Then check the ones from saved data
        if (existingData.securityChecks) {
            existingData.securityChecks.forEach(check => {
                const checkbox = document.querySelector(`.security-check[value="${check.value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    if (stepType === 'mitigations') {
        // Populate threat-specific mitigations after a short delay (after populateIdentifiedThreats runs)
        if (existingData.threatMitigations) {
            setTimeout(() => {
                Object.entries(existingData.threatMitigations).forEach(([threatId, data]) => {
                    const textarea = document.getElementById(`threat-mitigation-${threatId}`);
                    if (textarea) {
                        textarea.value = data.mitigation || '';
                    }
                });
            }, 150);
        }
    }

    if (stepType === 'statusQuo' && existingData.statusQuo) {
        const sq = existingData.statusQuo;
        const riskField = document.getElementById('status-quo-current-risks');
        const missedField = document.getElementById('status-quo-missed-opportunities');
        const compField = document.getElementById('status-quo-competitive');
        const ineffField = document.getElementById('status-quo-inefficiencies');

        if (riskField) riskField.value = sq.currentRisks || '';
        if (missedField) missedField.value = sq.missedOpportunities || '';
        if (compField) compField.value = sq.competitive || '';
        if (ineffField) ineffField.value = sq.inefficiencies || '';
    }
}

function updateWizardProgress() {
    const step = riskWizardState.currentStep;
    const label = document.getElementById('wizard-phase-label');
    const bar = document.getElementById('wizard-progress-bar');

    if (step <= 2) {
        label.textContent = `Phase 1: Step ${step} of 2`;
        bar.style.width = `${(step / 2) * 100}%`;
    } else {
        const phase2Step = step - 2;
        label.textContent = `Comprehensive: Step ${phase2Step} of 5 (Optional)`;
        bar.style.width = `${((phase2Step / 5) * 100)}%`;
        bar.classList.remove('bg-blue-600');
        bar.classList.add('bg-purple-600');
    }
}

function updateWizardButtons() {
    const step = riskWizardState.currentStep;
    const backBtn = document.getElementById('wizard-back-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const exitBtn = document.getElementById('wizard-exit-btn');

    // Back button
    if (step === 0) {
        backBtn.textContent = 'Cancel';
        backBtn.onclick = closeRiskWizard;
    } else {
        backBtn.innerHTML = `<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>Back`;
        backBtn.onclick = wizardBack;
    }

    // Next button
    if (step === 0) {
        nextBtn.innerHTML = `<span>Begin Risk Assessment</span><svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
        nextBtn.classList.remove('hidden');
        exitBtn.classList.add('hidden');
    } else if (step === 1) {
        nextBtn.innerHTML = `<span>Next: View Risk Level</span><svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
        nextBtn.classList.remove('hidden');
        exitBtn.classList.add('hidden');
    } else if (step === 2) {
        // Decision point - buttons handled in the step content
        nextBtn.classList.add('hidden');
        exitBtn.classList.add('hidden');
    } else if (step >= 3 && step <= 6) {
        nextBtn.innerHTML = `<span>Next</span><svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
        nextBtn.classList.remove('hidden');
        exitBtn.classList.remove('hidden');
    } else if (step === 7) {
        nextBtn.classList.add('hidden');
        exitBtn.classList.remove('hidden');
        exitBtn.innerHTML = '<span>Complete & Exit</span><span class="ml-1">✓</span>';
    }
}

function wizardBack() {
    if (riskWizardState.currentStep > 0) {
        showWizardStep(riskWizardState.currentStep - 1);
    }
}

function wizardNext() {
    const step = riskWizardState.currentStep;

    if (step === 0) {
        if (!riskWizardState.selectedUseCaseId) {
            alert('Please select a use case first.');
            return;
        }
        showWizardStep(1);
    } else if (step === 1) {
        showWizardStep(2);
    } else if (step >= 3 && step < 7) {
        saveCurrentStepData();
        showWizardStep(step + 1);
    }
}

function continueToPhase2() {
    showWizardStep(3);
}

function renderConsequenceScoringCards() {
    const container = document.getElementById('consequence-scoring-cards');
    container.innerHTML = '';

    consequenceCategories.forEach(category => {
        const currentScore = riskWizardState.consequenceScores[category.id] || 0;

        const cardHTML = `
            <div class="bg-white border border-gray-200 rounded-xl p-4">
                <div class="flex items-start mb-3">
                    <span class="text-2xl mr-3">${category.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${category.name}</h4>
                        <p class="text-sm text-gray-500">${category.description}</p>
                    </div>
                </div>
                <div class="flex space-x-2 mb-2">
                    ${[0, 1, 2, 3, 4, 5].map(score => {
                        const colors = ['bg-gray-200 text-gray-700', 'bg-green-200 text-green-800', 'bg-blue-200 text-blue-800', 'bg-yellow-200 text-yellow-800', 'bg-orange-200 text-orange-800', 'bg-red-200 text-red-800'];
                        const isSelected = currentScore === score;
                        const selectedClass = isSelected ? `${colors[score]} ring-2 ring-offset-2 ring-blue-500` : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                        return `<button onclick="setConsequenceScore('${category.id}', ${score})" class="w-10 h-10 rounded-lg font-bold transition ${selectedClass}">${score}</button>`;
                    }).join('')}
                </div>
                <div class="text-sm text-gray-500 mb-2" id="score-label-${category.id}">${category.labels[currentScore]}</div>
                <div>
                    <label class="text-xs text-gray-400">Notes: Why this score? What's the specific scenario?</label>
                    <textarea id="notes-${category.id}" onchange="saveConsequenceNote('${category.id}')" oninput="saveConsequenceNote('${category.id}')" rows="2" class="w-full p-2 mt-1 border border-gray-200 rounded-lg text-sm" placeholder="Optional notes...">${riskWizardState.consequenceScores[`${category.id}-notes`] || ''}</textarea>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    updateTotalConsequenceScore();
}

function setConsequenceScore(categoryId, score) {
    // Save all current notes before re-rendering
    consequenceCategories.forEach(category => {
        const notesTextarea = document.getElementById(`notes-${category.id}`);
        if (notesTextarea) {
            riskWizardState.consequenceScores[`${category.id}-notes`] = notesTextarea.value;
        }
    });

    riskWizardState.consequenceScores[categoryId] = score;

    // Update label
    const category = consequenceCategories.find(c => c.id === categoryId);
    document.getElementById(`score-label-${categoryId}`).textContent = category.labels[score];

    // Update button visuals
    renderConsequenceScoringCards();

    updateTotalConsequenceScore();
}

function saveConsequenceNote(categoryId) {
    const notesTextarea = document.getElementById(`notes-${categoryId}`);
    if (notesTextarea) {
        riskWizardState.consequenceScores[`${categoryId}-notes`] = notesTextarea.value;
    }
}

function updateTotalConsequenceScore() {
    let total = 0;
    consequenceCategories.forEach(category => {
        total += riskWizardState.consequenceScores[category.id] || 0;
    });

    document.getElementById('total-consequence-score').textContent = total;
}

function renderRiskCharacterization() {
    let totalScore = 0;
    consequenceCategories.forEach(category => {
        totalScore += riskWizardState.consequenceScores[category.id] || 0;
    });

    let riskLevel, riskColor, riskBg;
    if (totalScore <= 9) {
        riskLevel = 'Minimal';
        riskColor = 'text-green-800';
        riskBg = 'bg-green-100';
    } else if (totalScore <= 18) {
        riskLevel = 'Low';
        riskColor = 'text-green-800';
        riskBg = 'bg-green-100';
    } else if (totalScore <= 30) {
        riskLevel = 'Moderate';
        riskColor = 'text-yellow-800';
        riskBg = 'bg-yellow-100';
    } else {
        riskLevel = 'Critical';
        riskColor = 'text-red-800';
        riskBg = 'bg-red-100';
    }

    const resultDiv = document.getElementById('risk-level-result');
    resultDiv.className = `text-center p-8 rounded-xl mb-6 ${riskBg}`;
    resultDiv.innerHTML = `
        <div class="text-5xl font-bold ${riskColor} mb-2">${riskLevel}</div>
        <div class="text-lg ${riskColor}">Total Score: ${totalScore} / 45</div>
    `;

    document.getElementById('risk-level-summary').textContent = riskLevel;

    // Store for later
    riskWizardState.totalScore = totalScore;
    riskWizardState.riskLevel = riskLevel;

    // Show Phase 2 quick nav if resuming an existing analysis with Phase 2 data
    const phase2Nav = document.getElementById('phase2-quick-nav');
    const existingData = (appState.step3 && appState.step3.riskAnalyses ? appState.step3.riskAnalyses[riskWizardState.selectedUseCaseId] : undefined);
    if (existingData) {
        const hasPhase2 = ((existingData.systemBoundaries && existingData.systemBoundaries.aiDecisions)) ||
                          ((existingData.failureModes && existingData.failureModes.availability && existingData.failureModes.availability.enabled)) ||
                          ((existingData.failureModes && existingData.failureModes.accuracy && existingData.failureModes.accuracy.enabled)) ||
                          ((existingData.failureModes && existingData.failureModes.latency && existingData.failureModes.latency.enabled)) ||
                          (existingData.securityChecks && existingData.securityChecks.length > 0) ||
                          ((existingData.mitigations && existingData.mitigations.engineering)) ||
                          ((existingData.statusQuo && existingData.statusQuo.currentRisks));
        if (hasPhase2) {
            phase2Nav.classList.remove('hidden');
        } else {
            phase2Nav.classList.add('hidden');
        }
    } else {
        phase2Nav.classList.add('hidden');
    }
}

function getAllUseCaseIdsFromStep2() {
    // Get all unique use case IDs from Step 2 opportunity mappings
    console.log('[getAllUseCaseIdsFromStep2] Checking for use cases...');
    console.log('[getAllUseCaseIdsFromStep2] appState.step2:', appState.step2);

    const useCaseIds = new Set();
    if ((appState.step2 && appState.step2.opportunityMappings)) {
        console.log('[getAllUseCaseIdsFromStep2] opportunityMappings:', appState.step2.opportunityMappings);
        Object.values(appState.step2.opportunityMappings || {}).forEach(mapping => {
            if (mapping && mapping.useCaseId) {
                console.log('[getAllUseCaseIdsFromStep2] Found use case:', mapping.useCaseId);
                useCaseIds.add(mapping.useCaseId);
            }
        });
    } else {
        console.warn('[getAllUseCaseIdsFromStep2] No opportunityMappings found');
    }

    // Sort use cases by their order in the catalog to maintain consistency
    const result = Array.from(useCaseIds).sort((a, b) => {
        const indexA = useCaseCatalog.findIndex(uc => uc.id === a);
        const indexB = useCaseCatalog.findIndex(uc => uc.id === b);
        return indexA - indexB;
    });

    console.log('[getAllUseCaseIdsFromStep2] Returning (sorted by catalog order):', result);
    return result;
}

function getUnassessedUseCaseIds() {
    const allUseCaseIds = getAllUseCaseIdsFromStep2();
    const assessedIds = Object.keys((appState.step3 && appState.step3.riskAnalyses) || {});
    return allUseCaseIds.filter(id => !assessedIds.includes(id));
}

function checkAndPromptForNextUseCase() {
    const unassessed = getUnassessedUseCaseIds();

    if (unassessed.length > 0) {
        const plural = unassessed.length > 1 ? 's' : '';
        const message = `Risk Analysis Complete!\n\nOrganizational Risk Level: ${riskWizardState.riskLevel}\nTotal Score: ${riskWizardState.totalScore}/45\n\nYou have ${unassessed.length} more use case${plural} to assess. Would you like to continue with the next one?`;

        if (confirm(message)) {
            setTimeout(() => openRiskAnalysisWizard(true), 100);
        }
    } else {
        alert(`Risk Analysis Complete!\n\nOrganizational Risk Level: ${riskWizardState.riskLevel}\nTotal Score: ${riskWizardState.totalScore}/45\n\nAll use cases have been assessed.`);
    }
}

function completeRiskAnalysis() {
    saveRiskAnalysis();
    closeRiskWizard();

    checkAndPromptForNextUseCase();

    updateStep3UI();
}

function completeAndExitWizard() {
    saveCurrentStepData();
    saveRiskAnalysis();
    closeRiskWizard();

    checkAndPromptForNextUseCase();

    updateStep3UI();
}

function saveCurrentStepData() {
    // Defensive guard: never persist DOM field values unless a use case is actually
    // selected. Without this, a stray navigation before a use case is chosen (or during a
    // resume transition) could copy stale field text into the wrong use case's state.
    if (!riskWizardState || !riskWizardState.selectedUseCaseId) {
        return;
    }

    const step = riskWizardState.currentStep;

    // Save notes from consequence scoring
    if (step >= 1) {
        consequenceCategories.forEach(category => {
            const notesEl = document.getElementById(`notes-${category.id}`);
            if (notesEl) {
                riskWizardState.consequenceScores[`${category.id}-notes`] = notesEl.value;
            }
        });
    }

    // Save system boundaries
    if (step >= 3) {
        riskWizardState.systemBoundaries = {
            aiDecisions: (document.getElementById('system-boundaries-ai-decisions') ? document.getElementById('system-boundaries-ai-decisions').value : '') || '',
            humanDecisions: (document.getElementById('system-boundaries-human-decisions') ? document.getElementById('system-boundaries-human-decisions').value : '') || '',
            alertConditions: (document.getElementById('system-boundaries-alert-conditions') ? document.getElementById('system-boundaries-alert-conditions').value : '') || '',
            worstCase: (document.getElementById('system-boundaries-worst-case') ? document.getElementById('system-boundaries-worst-case').value : '') || ''
        };
    }

    // Save failure modes
    if (step >= 4) {
        riskWizardState.failureModes = {
            availability: {
                enabled: (document.getElementById('failure-availability-check') ? document.getElementById('failure-availability-check').checked : false) || false,
                how: (document.getElementById('failure-availability-how') ? document.getElementById('failure-availability-how').value : '') || '',
                impact: (document.getElementById('failure-availability-impact') ? document.getElementById('failure-availability-impact').value : '') || '',
                detect: (document.getElementById('failure-availability-detect') ? document.getElementById('failure-availability-detect').value : '') || ''
            },
            accuracy: {
                enabled: (document.getElementById('failure-accuracy-check') ? document.getElementById('failure-accuracy-check').checked : false) || false,
                how: (document.getElementById('failure-accuracy-how') ? document.getElementById('failure-accuracy-how').value : '') || '',
                impact: (document.getElementById('failure-accuracy-impact') ? document.getElementById('failure-accuracy-impact').value : '') || '',
                detect: (document.getElementById('failure-accuracy-detect') ? document.getElementById('failure-accuracy-detect').value : '') || ''
            },
            latency: {
                enabled: (document.getElementById('failure-latency-check') ? document.getElementById('failure-latency-check').checked : false) || false,
                how: (document.getElementById('failure-latency-how') ? document.getElementById('failure-latency-how').value : '') || '',
                impact: (document.getElementById('failure-latency-impact') ? document.getElementById('failure-latency-impact').value : '') || '',
                detect: (document.getElementById('failure-latency-detect') ? document.getElementById('failure-latency-detect').value : '') || ''
            }
        };
    }

    // Save security checks
    if (step >= 5) {
        riskWizardState.securityChecks = [];
        document.querySelectorAll('.security-check:checked').forEach(check => {
            riskWizardState.securityChecks.push({
                category: check.dataset.category,
                value: check.value
            });
        });
    }

    // Save threat-specific mitigations
    if (step >= 6) {
        riskWizardState.threatMitigations = {};
        riskWizardState.securityChecks.forEach(check => {
            const textarea = document.getElementById(`threat-mitigation-${check.value}`);
            if (textarea && textarea.value) {
                riskWizardState.threatMitigations[check.value] = {
                    threat: (threatDescriptions[check.value] ? threatDescriptions[check.value].name : undefined) || check.value,
                    category: (threatDescriptions[check.value] ? threatDescriptions[check.value].category : undefined) || 'Unknown',
                    mitigation: textarea.value
                };
            }
        });
    }

    // Save status quo
    if (step >= 7) {
        riskWizardState.statusQuo = {
            currentRisks: (document.getElementById('status-quo-current-risks') ? document.getElementById('status-quo-current-risks').value : '') || '',
            missedOpportunities: (document.getElementById('status-quo-missed-opportunities') ? document.getElementById('status-quo-missed-opportunities').value : '') || '',
            competitive: (document.getElementById('status-quo-competitive') ? document.getElementById('status-quo-competitive').value : '') || '',
            inefficiencies: (document.getElementById('status-quo-inefficiencies') ? document.getElementById('status-quo-inefficiencies').value : '') || ''
        };
    }
}

function saveRiskAnalysis() {
    if (!appState.step3.riskAnalyses) {
        appState.step3.riskAnalyses = {};
    }

    appState.step3.riskAnalyses[riskWizardState.selectedUseCaseId] = {
        totalScore: riskWizardState.totalScore,
        riskLevel: riskWizardState.riskLevel,
        consequenceScores: { ...riskWizardState.consequenceScores },
        systemBoundaries: { ...riskWizardState.systemBoundaries },
        failureModes: { ...riskWizardState.failureModes },
        securityChecks: [...riskWizardState.securityChecks],
        mitigations: { ...riskWizardState.mitigations },
        threatMitigations: { ...(riskWizardState.threatMitigations || {}) },
        statusQuo: { ...riskWizardState.statusQuo },
        completedAt: new Date().toISOString()
    };

    // Mark risk management as complete if at least one analysis is done
    appState.step3.riskManagementComplete = true;

    saveProgress();
}

function toggleFailureMode(mode) {
    const checkbox = document.getElementById(`failure-${mode}-check`);
    const details = document.getElementById(`failure-${mode}-details`);

    if (checkbox.checked) {
        details.classList.remove('hidden');
    } else {
        details.classList.add('hidden');
    }
}

// Threat descriptions for mitigation step
const threatDescriptions = {
    // Input Manipulation
    'adversarial': { name: 'Adversarial Examples', category: 'Input Manipulation', color: 'red' },
    'poisoning': { name: 'Data Poisoning', category: 'Input Manipulation', color: 'red' },
    'injection': { name: 'Input Injection', category: 'Input Manipulation', color: 'red' },
    'inversion': { name: 'Model Inversion', category: 'Input Manipulation', color: 'red' },
    // Model Vulnerabilities
    'theft': { name: 'Model Theft', category: 'Model Vulnerabilities', color: 'green' },
    'backdoors': { name: 'Model Backdoors', category: 'Model Vulnerabilities', color: 'green' },
    'overfitting': { name: 'Overfitting & Generalization Failure', category: 'Model Vulnerabilities', color: 'green' },
    'explainability': { name: 'Lack of Explainability', category: 'Model Vulnerabilities', color: 'green' },
    // Supply Chain
    'pretrained': { name: 'Compromised Pre-trained Models', category: 'Supply Chain', color: 'yellow' },
    'dependencies': { name: 'Vulnerable Dependencies', category: 'Supply Chain', color: 'yellow' },
    'deployment': { name: 'Insecure Deployment', category: 'Supply Chain', color: 'yellow' },
    'vendor': { name: 'Cloud/Vendor Dependencies', category: 'Supply Chain', color: 'yellow' },
    // Operational Security
    'logging': { name: 'Insufficient Logging/Monitoring', category: 'Operational Security', color: 'blue' },
    'access': { name: 'Weak Access Controls', category: 'Operational Security', color: 'blue' },
    'output': { name: 'Insecure Output Handling', category: 'Operational Security', color: 'blue' },
    'leakage': { name: 'Data Leakage', category: 'Operational Security', color: 'blue' },
    // Human Factors
    'overreliance': { name: 'Over-reliance/Automation Bias', category: 'Human Factors', color: 'purple' },
    'training': { name: 'Insufficient Training', category: 'Human Factors', color: 'purple' },
    'insider': { name: 'Insider Threats', category: 'Human Factors', color: 'purple' },
    'social': { name: 'Social Engineering', category: 'Human Factors', color: 'purple' }
};

function populateIdentifiedThreats() {
    // Get all checked security threats from step 5
    const checkedThreats = document.querySelectorAll('.security-check:checked');
    const threatsList = document.getElementById('identified-threats-list');
    const mitigationsSection = document.getElementById('threat-mitigations-section');
    const mitigationInputs = document.getElementById('threat-mitigation-inputs');

    if (checkedThreats.length === 0) {
        threatsList.innerHTML = '<p class="text-sm text-gray-500 italic">No security threats were selected in the previous step. You may want to go back and identify relevant threats.</p>';
        mitigationsSection.classList.add('hidden');
        return;
    }

    // Group threats by category
    const threatsByCategory = {};
    checkedThreats.forEach(checkbox => {
        const value = checkbox.value;
        const threat = threatDescriptions[value];
        if (threat) {
            if (!threatsByCategory[threat.category]) {
                threatsByCategory[threat.category] = [];
            }
            threatsByCategory[threat.category].push({ value, ...threat });
        }
    });

    // Build threat summary list
    let summaryHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-2">';
    Object.entries(threatsByCategory).forEach(([category, threats]) => {
        threats.forEach(threat => {
            const colorClass = {
                'red': 'bg-red-100 text-red-800 border-red-200',
                'green': 'bg-green-100 text-green-800 border-green-200',
                'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                'blue': 'bg-blue-100 text-blue-800 border-blue-200',
                'purple': 'bg-purple-100 text-purple-800 border-purple-200'
            }[threat.color];

            summaryHtml += `
                <div class="flex items-center p-2 rounded-lg border ${colorClass}">
                    <span class="text-sm font-medium">${threat.name}</span>
                    <span class="text-xs ml-2 opacity-75">(${threat.category})</span>
                </div>
            `;
        });
    });
    summaryHtml += '</div>';
    threatsList.innerHTML = summaryHtml;

    // Build mitigation input fields for each threat
    mitigationsSection.classList.remove('hidden');
    let mitigationHtml = '';

    Object.entries(threatsByCategory).forEach(([category, threats]) => {
        const categoryColor = threats[0].color;
        const borderClass = {
            'red': 'border-red-300',
            'green': 'border-green-300',
            'yellow': 'border-yellow-300',
            'blue': 'border-blue-300',
            'purple': 'border-purple-300'
        }[categoryColor];

        const bgClass = {
            'red': 'bg-red-50',
            'green': 'bg-green-50',
            'yellow': 'bg-yellow-50',
            'blue': 'bg-blue-50',
            'purple': 'bg-purple-50'
        }[categoryColor];

        threats.forEach(threat => {
            mitigationHtml += `
                <div class="border-l-4 ${borderClass} ${bgClass} p-4 rounded-r-lg">
                    <label class="block font-medium text-gray-800 mb-2">
                        How will you mitigate: <span class="font-bold">${threat.name}</span>?
                    </label>
                    <textarea id="threat-mitigation-${threat.value}" rows="3"
                        class="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                        placeholder="Describe specific controls, safeguards, or procedures to address this threat..."></textarea>
                </div>
            `;
        });
    });

    mitigationInputs.innerHTML = mitigationHtml;
}

function completeStep3() {
    if (!appState.step3.riskManagementComplete) {
        alert('Please complete at least one risk analysis before continuing.');
        return;
    }

    // Check all Phase 2 assessments
    const incomplete = [];

    if (!appState.step3.dataAssessmentComplete) {
        incomplete.push('Data & Infrastructure Assessment');
    }

    if (!(appState.step3.principles && appState.step3.principles['investment-capacity'] && appState.step3.principles['investment-capacity'].assessed)) {
        incomplete.push('Investment Capacity');
    }

    if (!(appState.step3.principles && appState.step3.principles['skilled-personnel'] && appState.step3.principles['skilled-personnel'].assessed)) {
        incomplete.push('Skilled Personnel');
    }

    if (!(appState.step3.principles && appState.step3.principles['regulatory-compliance'] && appState.step3.principles['regulatory-compliance'].assessed)) {
        incomplete.push('Governance and Compliance');
    }

    if (!(appState.step3.principles && appState.step3.principles['clear-objectives'] && appState.step3.principles['clear-objectives'].assessed)) {
        incomplete.push('Clear Objectives');
    }

    if (incomplete.length > 0) {
        alert('Please complete all Phase 2 assessments before proceeding to Step 4:\n\n• ' + incomplete.join('\n• '));
        return;
    }

    updateStepStatus(3, 'complete');
    saveProgress();
    navigateToStep(4);
}

// Export Phase 1 Assessment
function exportPhase1Assessment() {
    // Show the professional export format modal
    showExportFormatModal();
}

function showExportFormatModal() {
    const modal = document.getElementById('export-format-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Add escape key listener
        document.addEventListener('keydown', handleExportModalEscape);
    }
}

function closeExportFormatModal() {
    const modal = document.getElementById('export-format-modal');
    if (modal) {
        modal.classList.add('hidden');
        // Remove escape key listener
        document.removeEventListener('keydown', handleExportModalEscape);
    }
}

function handleExportModalEscape(e) {
    if (e.key === 'Escape') {
        closeExportFormatModal();
    }
}

function selectExportFormat(format) {
    closeExportFormatModal();

    if (format === 'pdf') {
        exportPhase1AsPDF();
    } else if (format === 'txt') {
        exportPhase1AsTXT();
    }
}

function exportPhase1AsPDF() {
    // Check if jsPDF library is loaded
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page.');
        return;
    }

    const { jsPDF } = window.jspdf;

    // Show loading message
    const exportButton = document.querySelector('button[onclick*="exportPhase1Assessment"]');
    const originalButtonText = (exportButton && exportButton.innerHTML);
    if (exportButton) {
        exportButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';
        exportButton.disabled = true;
    }

    showNotification('Generating PDF... This may take a moment.');

    setTimeout(() => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
            const pdf = new COGNITOPDFGenerator(doc);

            // Set custom filename for Phase 1 export
            const dateStr = new Date().toISOString().split('T')[0];
            pdf.setFilename('COGNITO_Phase1_Assessment_' + dateStr + '.pdf');

            pdf.generate();

            // Restore button
            if (exportButton) {
                exportButton.innerHTML = originalButtonText;
                exportButton.disabled = false;
            }
        } catch (error) {
            console.error('PDF export error:', error);

            // Restore button
            if (exportButton) {
                exportButton.innerHTML = originalButtonText;
                exportButton.disabled = false;
            }

            alert('Error generating PDF: ' + error.message);
        }
    }, 100);
}

function exportPhase1AsTXT() {
    const dateStr = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleString();

    const getDomainLabel = (domainId) => {
        const domainLabels = {
            'detection': 'Detection: Anomaly and Fault Detection',
            'prediction': 'Prediction: Forecasting and Proactive Analytics',
            'control': 'Control & Optimization: Decision-Making and Grid Operations',
            'business': 'Business & Customer Applications: Engagement and Enterprise Functions'
        };
        return domainLabels[domainId] || domainId;
    };

    let text = '';

    // === COVER PAGE ===
    text += '══════════════════════════════════════════════════════════════════\n';
    text += '                         COGNITO\n';
    text += '            AI Readiness Framework Assessment\n';
    text += '══════════════════════════════════════════════════════════════════\n\n';

    text += 'About COGNITO\n\n';
    text += 'COGNITO is a structured AI Readiness Self-Guide Framework developed\n';
    text += 'by Idaho National Laboratory, specifically tailored for electric\n';
    text += 'utilities. The framework guides organizations through a systematic\n';
    text += 'five-step process to evaluate AI readiness, identify appropriate use\n';
    text += 'cases, assess risks, and plan implementation with appropriate controls.\n\n';

    text += 'The Five-Step Process:\n\n';
    text += '  1. Identify Business Context - Map current capabilities and identify\n';
    text += '     AI opportunities\n\n';
    text += '  2. Align AI Use Cases - Match opportunities to appropriate AI\n';
    text += '     applications based on use case risk level and technology maturity\n\n';
    text += '  3. Analyze AI Principles - Explore readiness through structured\n';
    text += '     AI Readiness Principles\n\n';
    text += '  4. Implementation Planning & Readiness Validation - Define detailed\n';
    text += '     scenarios and build/buy/partner decisions\n\n';
    text += '  5. Evaluate Engineering Controls & Mitigations - Select appropriate\n';
    text += '     safeguards and governance structures\n\n';

    text += 'Assessment Details\n\n';
    text += `  Date Generated: ${timestamp}\n`;
    text += '  Framework Version: Phase 1 - Critical Assessment\n';
    text += '  Idaho National Laboratory\n\n\n';

    // === STEP 1 ===
    text += '══════════════════════════════════════════════════════════════════\n';
    text += 'STEP 1: IDENTIFY BUSINESS CONTEXT\n';
    text += '══════════════════════════════════════════════════════════════════\n\n';

    text += 'About This Step\n\n';
    text += 'Step 1 establishes a baseline understanding of your organization\'s\n';
    text += 'capability maturity across business functions. This assessment identifies\n';
    text += 'where AI can fix critical gaps, optimize functional processes, or enhance\n';
    text += 'high-performing operations. Each capability is rated on a 1-5 maturity\n';
    text += 'scale and classified by opportunity type (Fix, Optimize, or Enhance).\n\n';

    const capabilities = (appState.step1 && appState.step1.capabilities) || {};

    if (Object.keys(capabilities).length === 0) {
        text += 'No capability assessments completed.\n\n';
    } else {
        const maturityLabels = {
            1: '1 - Ad-Hoc',
            2: '2 - Repeatable',
            3: '3 - Standardized',
            4: '4 - Measured',
            5: '5 - Optimized'
        };
        const oppTypeLabels = { F: 'FOUNDATIONAL', O: 'Optimize', E: 'Enhance/Scale' };

        Object.keys(capabilities).forEach((capId, idx) => {
            const cap = capabilities[capId];
            text += '──────────────────────────────────────────────────────────────────\n';
            text += `Capability ${idx + 1}: ${cap.name || 'Unnamed Capability'}\n`;
            text += '──────────────────────────────────────────────────────────────────\n\n';

            text += 'Maturity Level Assessment\n\n';
            text += `    Level: ${maturityLabels[cap.maturityLevel] || 'Not assessed'}\n\n`;
            text += `    Opportunity Type: ${oppTypeLabels[cap.opportunityType] || 'Not specified'}\n\n`;

            if (cap.evidence) {
                text += '    Assessment Rationale:\n';
                text += '    ┌────────────────────────────────────────────────────────────┐\n';
                const evidenceLines = cap.evidence.split('\n');
                evidenceLines.forEach(line => {
                    const wrapped = line.match(/.{1,58}/g) || [line];
                    wrapped.forEach(segment => {
                        text += `    │ ${segment.padEnd(58)} │\n`;
                    });
                });
                text += '    └────────────────────────────────────────────────────────────┘\n\n';
            }

            if (cap.opportunities && cap.opportunities.length > 0) {
                text += `Identified Opportunities (${cap.opportunities.length}):\n\n`;

                cap.opportunities.forEach((opp, oppIdx) => {
                    text += `    Opportunity ${oppIdx + 1}: ${opp.problem || 'Unnamed opportunity'}\n\n`;

                    if (opp.problem) {
                        text += '        Problem Description:\n';
                        text += '        ┌──────────────────────────────────────────────────┐\n';
                        const problemLines = opp.problem.split('\n');
                        problemLines.forEach(line => {
                            const wrapped = line.match(/.{1,48}/g) || [line];
                            wrapped.forEach(segment => {
                                text += `        │ ${segment.padEnd(48)} │\n`;
                            });
                        });
                        text += '        └──────────────────────────────────────────────────┘\n\n';
                    }

                    if (opp.domains && opp.domains.length > 0) {
                        text += '        AI Domain(s):\n';
                        opp.domains.forEach(d => {
                            text += `          • ${getDomainLabel(d)}\n`;
                        });
                        text += '\n';
                    }

                    if (opp.impacts && opp.impacts.length > 0) {
                        text += `        Business Impact: ${opp.impacts.join(', ')}${opp.otherImpact ? `, ${opp.otherImpact}` : ''}\n\n`;
                    }

                    if (opp.financialImpact) {
                        text += `        Annual Financial Impact: ${opp.financialImpact}\n\n`;
                    }

                    if (opp.priority) {
                        text += `        Priority: ${opp.priority}\n\n`;
                    }
                });
            }

            text += '\n';
        });
    }

    // === STEP 2 ===
    text += '\n══════════════════════════════════════════════════════════════════\n';
    text += 'STEP 2: ALIGN AI USE CASES\n';
    text += '══════════════════════════════════════════════════════════════════\n\n';

    text += 'About This Step\n\n';
    text += 'Step 2 matches identified business opportunities to specific AI\n';
    text += 'applications from the COGNITO use case catalog. Each use case is\n';
    text += 'evaluated based on two critical dimensions: consequence profile (what\n';
    text += 'happens if the system fails) and technology readiness (maturity of the\n';
    text += 'technology). This ensures selected use cases align with organizational\n';
    text += 'risk tolerance and implementation capabilities.\n\n';

    const oppMappings = (appState.step2 && appState.step2.opportunityMappings) || {};

    if (Object.keys(oppMappings).length === 0) {
        text += 'No use cases selected.\n\n';
    } else {
        Object.keys(oppMappings).forEach((oppId, idx) => {
            const mapping = oppMappings[oppId];
            const useCase = useCaseCatalog.find(uc => uc.id === mapping.useCaseId);
            const allOpportunities = (appState.step2 && appState.step2.opportunities) || [];
            const oppDetails = allOpportunities.find(o => o.id === oppId);

            text += '──────────────────────────────────────────────────────────────────\n';
            text += `Use Case Selection ${idx + 1}\n`;
            text += '──────────────────────────────────────────────────────────────────\n\n';

            text += 'Linked Opportunity\n\n';
            text += `    Source Capability: ${(oppDetails && oppDetails.capability) || 'Unknown'}\n\n`;

            if ((oppDetails && oppDetails.problem)) {
                text += '    Opportunity Addressed:\n';
                text += '    ┌────────────────────────────────────────────────────────────┐\n';
                const problemLines = oppDetails.problem.split('\n');
                problemLines.forEach(line => {
                    const wrapped = line.match(/.{1,58}/g) || [line];
                    wrapped.forEach(segment => {
                        text += `    │ ${segment.padEnd(58)} │\n`;
                    });
                });
                text += '    └────────────────────────────────────────────────────────────┘\n\n';
            }

            text += 'Selected Use Case\n\n';
            text += `    >>> ${(useCase && useCase.name) || mapping.useCaseId} <<<\n\n`;
            text += `    Use Case Risk Level: ${(useCase && useCase.consequence) ? (useCase.consequence.charAt(0).toUpperCase() + useCase.consequence.slice(1)) : 'Unknown'}\n`;
            text += `    Technology Readiness: ${(useCase && useCase.readiness) || 'Unknown'}\n\n`;

            if ((useCase && useCase.description)) {
                text += '    Use Case Description:\n';
                text += '    ┌────────────────────────────────────────────────────────────┐\n';
                const descLines = useCase.description.split('\n');
                descLines.forEach(line => {
                    const wrapped = line.match(/.{1,58}/g) || [line];
                    wrapped.forEach(segment => {
                        text += `    │ ${segment.padEnd(58)} │\n`;
                    });
                });
                text += '    └────────────────────────────────────────────────────────────┘\n\n';
            }

            if ((useCase && useCase.justification)) {
                text += '    Why This Risk Level?\n';
                text += '    ┌────────────────────────────────────────────────────────────┐\n';
                const justLines = useCase.justification.split('\n');
                justLines.forEach(line => {
                    const wrapped = line.match(/.{1,58}/g) || [line];
                    wrapped.forEach(segment => {
                        text += `    │ ${segment.padEnd(58)} │\n`;
                    });
                });
                text += '    └────────────────────────────────────────────────────────────┘\n\n';
            }

            if (mapping.rationale) {
                text += '    User Selection Rationale:\n\n';
                text += '    Why This Use Case:\n';
                text += '    ┌────────────────────────────────────────────────────────────┐\n';
                const ratLines = mapping.rationale.split('\n');
                ratLines.forEach(line => {
                    const wrapped = line.match(/.{1,58}/g) || [line];
                    wrapped.forEach(segment => {
                        text += `    │ ${segment.padEnd(58)} │\n`;
                    });
                });
                text += '    └────────────────────────────────────────────────────────────┘\n\n';
            }
        });
    }

    // === STEP 3 ===
    text += '\n══════════════════════════════════════════════════════════════════\n';
    text += 'STEP 3: RISK MANAGEMENT ANALYSIS\n';
    text += '══════════════════════════════════════════════════════════════════\n\n';

    text += 'About This Step\n\n';
    text += 'Risk Management evaluates your ability to identify, assess, and mitigate\n';
    text += 'AI-specific risks. Each selected use case undergoes structured risk\n';
    text += 'analysis. The framework supports two levels: Core Risk Assessment (risk\n';
    text += 'scoring and characterization) and Comprehensive Risk Analysis (adds system\n';
    text += 'boundaries, failure modes, security analysis, and mitigations). This export\n';
    text += 'shows the level of analysis completed for each use case.\n\n';

    const riskAnalyses = (appState.step3 && appState.step3.riskAnalyses) || {};

    if (Object.keys(riskAnalyses).length === 0) {
        text += 'No risk analyses completed.\n\n';
    } else {
        Object.keys(riskAnalyses).forEach((ucId, idx) => {
            const analysis = riskAnalyses[ucId];
            const useCase = useCaseCatalog.find(uc => uc.id === ucId);

            // Detect if comprehensive analysis was completed
            const hasComprehensive = ((analysis.systemBoundaries && analysis.systemBoundaries.decisions)) ||
                                   ((analysis.failureModes && analysis.failureModes.availability && analysis.failureModes.availability.scenario)) ||
                                   ((analysis.failureModes && analysis.failureModes.accuracy && analysis.failureModes.accuracy.scenario)) ||
                                   ((analysis.failureModes && analysis.failureModes.latency && analysis.failureModes.latency.scenario)) ||
                                   (analysis.securityChecks && analysis.securityChecks.length > 0) ||
                                   ((analysis.mitigations && analysis.mitigations.engineering)) ||
                                   ((analysis.mitigations && analysis.mitigations.operational)) ||
                                   ((analysis.mitigations && analysis.mitigations.governance));

            const analysisLevel = hasComprehensive ? 'Comprehensive Risk Analysis' : 'Core Risk Assessment';

            text += '──────────────────────────────────────────────────────────────────\n';
            text += `Risk Analysis ${idx + 1}: ${(useCase && useCase.name) || ucId}\n`;
            text += '──────────────────────────────────────────────────────────────────\n\n';
            text += `>>> ${analysisLevel} <<<\n\n`;

            text += 'Overall Risk Assessment\n\n';
            text += `    Organizational Risk Level: ${analysis.riskLevel || 'Not assessed'}\n`;
            text += `    Total Risk Score: ${analysis.totalScore || 0}/45\n`;
            text += `    Analysis Completed: ${new Date(analysis.completedAt).toLocaleString()}\n\n`;

            text += 'Consequence Scores\n';
            text += 'Rating Scale: 1 = Low, 2 = Low-Medium, 3 = Medium, 4 = Medium-High,\n';
            text += '              5 = High\n\n';

            consequenceCategories.forEach(cat => {
                const score = (analysis.consequenceScores ? analysis.consequenceScores[cat.id] : undefined) || 0;
                let scoreLabel = 'Not assessed';
                if (score === 1) scoreLabel = 'Low';
                else if (score === 2) scoreLabel = 'Low-Medium';
                else if (score === 3) scoreLabel = 'Medium';
                else if (score === 4) scoreLabel = 'Medium-High';
                else if (score === 5) scoreLabel = 'High';

                text += `    ${cat.name}: ${score}/5 - ${scoreLabel}\n`;
                text += `    ${cat.description}\n\n`;
            });

            if (hasComprehensive) {
                // Show comprehensive sections
                text += 'System Boundaries\n\n';

                if ((analysis.systemBoundaries && analysis.systemBoundaries.decisions)) {
                    text += '    What decisions will the AI system make?\n';
                    text += '    ┌────────────────────────────────────────────────────────────┐\n';
                    const decisionLines = analysis.systemBoundaries.decisions.split('\n');
                    decisionLines.forEach(line => {
                        const wrapped = line.match(/.{1,58}/g) || [line];
                        wrapped.forEach(segment => {
                            text += `    │ ${segment.padEnd(58)} │\n`;
                        });
                    });
                    text += '    └────────────────────────────────────────────────────────────┘\n\n';
                }

                if ((analysis.systemBoundaries && analysis.systemBoundaries.humanControl)) {
                    text += '    What decisions remain with human operators?\n';
                    text += '    ┌────────────────────────────────────────────────────────────┐\n';
                    const humanLines = analysis.systemBoundaries.humanControl.split('\n');
                    humanLines.forEach(line => {
                        const wrapped = line.match(/.{1,58}/g) || [line];
                        wrapped.forEach(segment => {
                            text += `    │ ${segment.padEnd(58)} │\n`;
                        });
                    });
                    text += '    └────────────────────────────────────────────────────────────┘\n\n';
                }

                if ((analysis.systemBoundaries && analysis.systemBoundaries.stopConditions)) {
                    text += '    Under what conditions should AI stop and alert humans?\n';
                    text += '    ┌────────────────────────────────────────────────────────────┐\n';
                    const stopLines = analysis.systemBoundaries.stopConditions.split('\n');
                    stopLines.forEach(line => {
                        const wrapped = line.match(/.{1,58}/g) || [line];
                        wrapped.forEach(segment => {
                            text += `    │ ${segment.padEnd(58)} │\n`;
                        });
                    });
                    text += '    └────────────────────────────────────────────────────────────┘\n\n';
                }

                if ((analysis.systemBoundaries && analysis.systemBoundaries.worstCase)) {
                    text += '    Worst operational state if AI fails completely?\n';
                    text += '    ┌────────────────────────────────────────────────────────────┐\n';
                    const worstLines = analysis.systemBoundaries.worstCase.split('\n');
                    worstLines.forEach(line => {
                        const wrapped = line.match(/.{1,58}/g) || [line];
                        wrapped.forEach(segment => {
                            text += `    │ ${segment.padEnd(58)} │\n`;
                        });
                    });
                    text += '    └────────────────────────────────────────────────────────────┘\n\n';
                }

                text += 'Failure Mode Analysis\n\n';

                const failureModes = [
                    { key: 'availability', label: 'Availability Failure' },
                    { key: 'accuracy', label: 'Accuracy Failure' },
                    { key: 'latency', label: 'Speed/Latency Failure' }
                ];

                failureModes.forEach(mode => {
                    if ((analysis.failureModes && analysis.failureModes[mode.key] && analysis.failureModes[mode.key].scenario)) {
                        text += `    ${mode.label} Scenario:\n`;
                        text += '    ┌────────────────────────────────────────────────────────────┐\n';
                        const scenarioLines = analysis.failureModes[mode.key].scenario.split('\n');
                        scenarioLines.forEach(line => {
                            const wrapped = line.match(/.{1,58}/g) || [line];
                            wrapped.forEach(segment => {
                                text += `    │ ${segment.padEnd(58)} │\n`;
                            });
                        });
                        text += '    └────────────────────────────────────────────────────────────┘\n\n';

                        if (analysis.failureModes[mode.key].detection) {
                            text += '    How would you detect it?\n';
                            text += '    ┌────────────────────────────────────────────────────────────┐\n';
                            const detectionLines = analysis.failureModes[mode.key].detection.split('\n');
                            detectionLines.forEach(line => {
                                const wrapped = line.match(/.{1,58}/g) || [line];
                                wrapped.forEach(segment => {
                                    text += `    │ ${segment.padEnd(58)} │\n`;
                                });
                            });
                            text += '    └────────────────────────────────────────────────────────────┘\n\n';
                        }
                    }
                });

                if (analysis.securityChecks && analysis.securityChecks.length > 0) {
                    text += 'Identified Security Threats\n\n';
                    analysis.securityChecks.forEach(check => {
                        const threat = threatDescriptions[check.value];
                        if (threat) {
                            text += `    • ${threat.name} (${threat.category})\n`;
                        }
                    });
                    text += '\n';
                }

                text += 'Threat-Specific Mitigations\n\n';

                let hasMitigations = false;

                // Export threat-specific mitigations
                if (analysis.threatMitigations && Object.keys(analysis.threatMitigations).length > 0) {
                    hasMitigations = true;

                    Object.entries(analysis.threatMitigations).forEach(([threatId, data]) => {
                        if (data.mitigation && data.mitigation.trim()) {
                            text += `    ${data.threat}:\n`;
                            text += '    ┌────────────────────────────────────────────────────────────┐\n';
                            const mitLines = data.mitigation.split('\n');
                            mitLines.forEach(line => {
                                const wrapped = line.match(/.{1,58}/g) || [line];
                                wrapped.forEach(segment => {
                                    text += `    │ ${segment.padEnd(58)} │\n`;
                                });
                            });
                            text += '    └────────────────────────────────────────────────────────────┘\n\n';
                        }
                    });
                }

                if (!hasMitigations) {
                    text += '    No threat-specific mitigation strategies were documented for this use case.\n\n';
                }
            } else {
                // Core only - show note
                text += '┌──────────────────────────────────────────────────────────────┐\n';
                text += '│ NOTE: Core Risk Assessment Only                             │\n';
                text += '│                                                              │\n';
                text += '│ This use case completed core risk scoring and               │\n';
                text += '│ characterization. Comprehensive Risk Analysis (system       │\n';
                text += '│ boundaries, failure modes, security threats, and mitigation │\n';
                text += '│ strategies) is available but has not been completed yet.    │\n';
                text += '│ You can add comprehensive analysis at any time by           │\n';
                text += '│ reopening the Risk Analysis Wizard.                         │\n';
                text += '└──────────────────────────────────────────────────────────────┘\n';
            }

            text += '\n';
        });
    }

    // === ABOUT PHASE 2 ===
    text += '══════════════════════════════════════════════════════════════════\n';
    text += 'ABOUT PHASE 2\n';
    text += '══════════════════════════════════════════════════════════════════\n\n';

    text += 'Phase 1 Complete\n\n';
    text += 'You have completed Phase 1 of the COGNITO AI Readiness Framework, which\n';
    text += 'includes opportunity identification, use case alignment, and foundational\n';
    text += 'risk assessment. This provides sufficient insight for initial decision-\n';
    text += 'making and stakeholder discussions.\n\n';

    text += 'What Phase 2 Includes\n\n';
    text += 'Phase 2 provides comprehensive depth of analysis for organizations\n';
    text += 'actively approaching AI implementation. Phase 2 completes the full\n';
    text += 'COGNITO framework with the following additional content:\n\n';

    text += 'Step 3: Complete Analyze AI Principles\n';
    text += 'In addition to Risk Management, Phase 2 includes five additional\n';
    text += 'principles:\n';
    text += '  • Data & Infrastructure - Access to quality data and technical systems\n';
    text += '  • Investment Capacity - Financial resources for development and maintenance\n';
    text += '  • Skilled Personnel - Staff with technical skills and domain expertise\n';
    text += '  • Governance and Compliance - Ability to meet industry regulations and standards\n';
    text += '  • Clear Objectives - Well-defined business goals and success metrics\n\n';

    text += 'Step 4: Implementation Planning & Readiness Validation\n';
    text += 'Detailed scenario definition connecting current operations to AI-enabled\n';
    text += 'futures, including build/buy/partner decisions and resource validation.\n\n';

    text += 'Step 5: Evaluate Engineering Controls & Mitigations\n';
    text += 'Identification of appropriate safeguards across engineering, operational,\n';
    text += 'and governance domains based on consequence analysis and implementation\n';
    text += 'approach.\n\n';

    text += '┌──────────────────────────────────────────────────────────────────┐\n';
    text += '│ To generate your complete Phase 2 assessment, continue through  │\n';
    text += '│ Steps 3-5 in the COGNITO application and export the full report.│\n';
    text += '└──────────────────────────────────────────────────────────────────┘\n';

    // Save as TXT
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `COGNITO_Phase1_Assessment_${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showNotification === 'function') {
        showNotification('Phase 1 assessment exported as TXT successfully!');
    }
}
function initializeDataAssessment() {
    updateDataAssessmentStatus();
}

// Update the Data Assessment status on landing page
function updateDataAssessmentStatus() {
    const statusSection = document.getElementById('data-assessment-status-section');
    const completedList = document.getElementById('data-assessment-completed-list');
    const summaryDiv = document.getElementById('data-assessment-summary');
    const buttonText = document.getElementById('data-assessment-button-text');

    if (!statusSection) return;

    if (!appState.step3.dataAssessments || Object.keys(appState.step3.dataAssessments).length === 0) {
        statusSection.classList.add('hidden');
        // Reset button text to "Start" when no assessments exist
        if (buttonText) {
            buttonText.textContent = 'Start Data Assessment';
        }
        return;
    }

    // Update button text to "Edit" when assessments exist
    if (buttonText) {
        buttonText.textContent = 'Edit Data Assessment';
    }

    statusSection.classList.remove('hidden');
    completedList.innerHTML = '';

    const assessments = appState.step3.dataAssessments;
    const totalUseCases = getAllUseCaseIdsFromStep2().length;
    let completedCount = 0;

    Object.keys(assessments).forEach(useCaseId => {
        const assessment = assessments[useCaseId];
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCase) return;

        completedCount++;

        const decisionColors = {
            'proceed': 'bg-green-100 text-green-800',
            'address-gaps': 'bg-yellow-100 text-yellow-800',
            'reconsider': 'bg-red-100 text-red-800'
        };
        const decisionLabels = {
            'proceed': 'Proceed',
            'address-gaps': 'Address Gaps',
            'reconsider': 'Reconsider'
        };

        const decisionColor = decisionColors[assessment.decision] || 'bg-gray-100 text-gray-800';
        const decisionLabel = decisionLabels[assessment.decision] || 'Pending';

        const itemHTML = `
            <div class="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                <div class="flex items-center">
                    <span class="text-green-500 mr-2">✓</span>
                    <span class="font-medium">${useCase.name}</span>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="px-2 py-1 rounded text-xs font-medium ${decisionColor}">${decisionLabel}</span>
                    <span class="text-sm text-gray-500">${(assessment.dataElements && assessment.dataElements.length) || 0} elements</span>
                    <button onclick="editDataAssessment('${useCaseId}')" class="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition">
                        Edit →
                    </button>
                </div>
            </div>
        `;
        completedList.innerHTML += itemHTML;
    });

    summaryDiv.textContent = `${completedCount} of ${totalUseCases} use cases assessed`;
}

function editDataAssessment(useCaseId) {
    openDataAssessmentWizard();
    setTimeout(() => {
        const select = document.getElementById('data-wizard-use-case-select');
        select.value = useCaseId;
        onDataUseCaseSelected();
    }, 100);
}

// Open the Data Assessment Wizard
function openDataAssessmentWizard() {
    // Reset wizard state
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

    // Populate use case dropdown
    const select = document.getElementById('data-wizard-use-case-select');
    select.innerHTML = '<option value="">-- Select a use case --</option>';

    const useCaseIds = getAllUseCaseIdsFromStep2();
    useCaseIds.forEach(useCaseId => {
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (useCase) {
            const isCompleted = (appState.step3 && appState.step3.dataAssessments ? appState.step3.dataAssessments[useCaseId] : undefined);
            const statusText = isCompleted ? ' ✓' : '';
            select.innerHTML += `<option value="${useCaseId}">${useCase.name}${statusText}</option>`;
        }
    });

    // Update previous assessments display
    updateDataWizardPreviousAssessments();

    // Show modal
    document.getElementById('data-wizard-modal').classList.remove('hidden');
    showDataWizardStep(0);
}

function closeDataWizard() {
    document.getElementById('data-wizard-modal').classList.add('hidden');
}

function updateDataWizardPreviousAssessments() {
    const container = document.getElementById('data-wizard-previous-assessments');
    const list = document.getElementById('data-wizard-completed-list');
    const summary = document.getElementById('data-wizard-completion-summary');

    const assessments = (appState.step3 && appState.step3.dataAssessments) || {};
    const totalUseCases = getAllUseCaseIdsFromStep2().length;
    let completedCount = 0;

    list.innerHTML = '';

    Object.keys(assessments).forEach(useCaseId => {
        const assessment = assessments[useCaseId];
        const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCase) return;

        completedCount++;

        const decisionColors = {
            'proceed': 'bg-green-100 text-green-800',
            'address-gaps': 'bg-yellow-100 text-yellow-800',
            'reconsider': 'bg-red-100 text-red-800'
        };
        const decisionLabels = {
            'proceed': 'Proceed',
            'address-gaps': 'Address Gaps',
            'reconsider': 'Reconsider'
        };

        list.innerHTML += `
            <div class="flex items-center justify-between">
                <span class="font-medium text-sm">${useCase.name}</span>
                <span class="px-2 py-0.5 rounded text-xs font-medium ${decisionColors[assessment.decision] || 'bg-gray-100'}">${decisionLabels[assessment.decision] || 'Pending'}</span>
            </div>
        `;
    });

    if (completedCount > 0) {
        container.classList.remove('hidden');
        summary.textContent = `${completedCount} of ${totalUseCases} use cases assessed`;
    } else {
        container.classList.add('hidden');
    }
}

function onDataUseCaseSelected() {
    const select = document.getElementById('data-wizard-use-case-select');
    const confirmation = document.getElementById('data-wizard-selected-confirmation');
    const existingAssessment = document.getElementById('data-wizard-existing-assessment');
    const nameSpan = document.getElementById('data-wizard-selected-name');
    const nextBtn = document.getElementById('data-wizard-next-btn');

    confirmation.classList.add('hidden');
    existingAssessment.classList.add('hidden');

    if (select.value) {
        dataWizardState.selectedUseCaseId = select.value;
        const useCase = useCaseCatalog.find(uc => uc.id === select.value);
        const useCaseName = useCase ? useCase.name : select.value;

        // Find linked opportunities for this use case
        const linkedOpportunities = getLinkedOpportunitiesForUseCase(select.value);
        const opportunitiesHtml = formatOpportunityList(linkedOpportunities);

        // Check for existing assessment
        const existingData = (appState.step3 && appState.step3.dataAssessments ? appState.step3.dataAssessments[select.value] : undefined);

        if (existingData) {
            document.getElementById('data-existing-name').textContent = useCaseName;
            const decisionLabels = {
                'proceed': '✅ Proceed',
                'address-gaps': '⚠️ Address Gaps',
                'reconsider': '❌ Reconsider'
            };
            document.getElementById('data-existing-decision').textContent = decisionLabels[existingData.decision] || 'Pending';
            document.getElementById('data-existing-elements').textContent = `${(existingData.dataElements && existingData.dataElements.length) || 0} defined`;

            // Display linked opportunities in existing assessment section
            document.getElementById('data-wizard-existing-opportunity-list').innerHTML = opportunitiesHtml;

            existingAssessment.classList.remove('hidden');
            nextBtn.classList.add('hidden');
        } else {
            nameSpan.textContent = useCaseName;

            // Display linked opportunities in new confirmation section
            document.getElementById('data-wizard-opportunity-list').innerHTML = opportunitiesHtml;

            confirmation.classList.remove('hidden');
            nextBtn.disabled = false;
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'hidden');
        }
    } else {
        dataWizardState.selectedUseCaseId = null;
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.classList.remove('hidden');
    }
}

function resumeDataAssessment() {
    const useCaseId = dataWizardState.selectedUseCaseId;
    const existingData = (appState.step3 && appState.step3.dataAssessments ? appState.step3.dataAssessments[useCaseId] : undefined);

    if (!existingData) {
        alert('Error: Could not find existing assessment data.');
        return;
    }

    // Load existing data
    dataWizardState.dataElements = [...(existingData.dataElements || [])];
    dataWizardState.sourceMappings = { ...(existingData.sourceMappings || {}) };
    dataWizardState.gapAnalysis = { ...(existingData.gapAnalysis || {}) };
    dataWizardState.integrationAssessments = { ...(existingData.integrationAssessments || {}) };
    dataWizardState.governance = { ...(existingData.governance || {}) };
    dataWizardState.decision = existingData.decision;
    dataWizardState.justification = existingData.justification || '';

    // Go to review step
    showDataWizardStep(5);
}

function startFreshDataAssessment() {
    if (!confirm('This will clear your previous assessment. Are you sure you want to start fresh?')) {
        return;
    }

    dataWizardState.dataElements = [];
    dataWizardState.sourceMappings = {};
    dataWizardState.gapAnalysis = {};
    dataWizardState.integrationAssessments = {};
    dataWizardState.governance = {};
    dataWizardState.decision = null;
    dataWizardState.justification = '';

    showDataWizardStep(1);
}

function showDataWizardStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.data-wizard-step').forEach(step => {
        step.classList.add('hidden');
    });

    // Show current step
    document.getElementById(`data-wizard-step-${stepNum}`).classList.remove('hidden');

    dataWizardState.currentStep = stepNum;

    // Update progress
    updateDataWizardProgress();
    updateDataWizardButtons();

    // Step-specific initialization
    if (stepNum === 1) {
        renderDataElements();
    } else if (stepNum === 2) {
        renderGapAnalysis();
    } else if (stepNum === 3) {
        renderIntegrationRequirements();
    } else if (stepNum === 4) {
        renderGovernanceStep();
    } else if (stepNum === 5) {
        renderReviewStep();
    }
}

function updateDataWizardProgress() {
    const step = dataWizardState.currentStep;
    const totalSteps = 5;
    const progress = (step / totalSteps) * 100;

    document.getElementById('data-wizard-progress-bar').style.width = `${progress}%`;
    document.getElementById('data-wizard-step-label').textContent = `Step ${step} of ${totalSteps}`;
}

function updateDataWizardButtons() {
    const step = dataWizardState.currentStep;
    const backBtn = document.getElementById('data-wizard-back-btn');
    const nextBtn = document.getElementById('data-wizard-next-btn');
    const exitBtn = document.getElementById('data-wizard-exit-btn');

    // Back button
    backBtn.classList.toggle('hidden', step === 0);

    // Next/Exit buttons
    if (step === 5) {
        nextBtn.classList.add('hidden');
        exitBtn.classList.remove('hidden');
    } else {
        exitBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');

        if (step === 0) {
            nextBtn.querySelector('span').textContent = 'Begin Assessment';
            nextBtn.disabled = !dataWizardState.selectedUseCaseId;
            nextBtn.classList.toggle('opacity-50', !dataWizardState.selectedUseCaseId);
            nextBtn.classList.toggle('cursor-not-allowed', !dataWizardState.selectedUseCaseId);
        } else {
            nextBtn.querySelector('span').textContent = 'Continue';
            nextBtn.disabled = false;
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

function dataWizardBack() {
    if (dataWizardState.currentStep > 0) {
        saveCurrentDataStep();
        showDataWizardStep(dataWizardState.currentStep - 1);
    }
}

function dataWizardNext() {
    const step = dataWizardState.currentStep;

    if (step === 0) {
        if (!dataWizardState.selectedUseCaseId) {
            alert('Please select a use case first.');
            return;
        }
        // Add initial data element if none exist
        if (dataWizardState.dataElements.length === 0) {
            addDataElement();
        }
        showDataWizardStep(1);
    } else {
        saveCurrentDataStep();
        showDataWizardStep(step + 1);
    }
}

function saveCurrentDataStep() {
    const step = dataWizardState.currentStep;

    // Save data elements AND source mappings (Step 1 now includes both)
    if (step === 1) {
        const elements = [];
        document.querySelectorAll('.data-element-row').forEach((row, index) => {
            // Get selected radio button values
            const volumeRadio = row.querySelector('.volume-radio:checked');
            const accuracyRadio = row.querySelector('.accuracy-radio:checked');

            elements.push({
                id: row.dataset.id || `element-${index}`,
                name: (function(){ var _el = row.querySelector('.element-name'); return _el ? _el.value : ''; })() || '',
                description: (function(){ var _el = row.querySelector('.element-description'); return _el ? _el.value : ''; })() || '',
                volume: volumeRadio ? volumeRadio.value : '',
                volumeOther: (function(){ var _el = row.querySelector('.volume-other'); return _el ? _el.value : ''; })() || '',
                accuracy: accuracyRadio ? accuracyRadio.value : '',
                accuracyOther: (function(){ var _el = row.querySelector('.accuracy-other'); return _el ? _el.value : ''; })() || '',
                critical: (function(){ var _el = row.querySelector('.element-critical'); return _el ? _el.checked : false; })() || false
            });

            // Also save source mapping for this element (new combined functionality)
            const elementId = row.dataset.id;
            if (elementId) {
                dataWizardState.sourceMappings[elementId] = {
                    status: (function(){ var _el = row.querySelector('.mapping-status'); return _el ? _el.value : ''; })() || '',
                    sourceSystem: (function(){ var _el = row.querySelector('.mapping-source'); return _el ? _el.value : ''; })() || '',
                    quality: (function(){ var _el = row.querySelector('.mapping-quality'); return _el ? _el.value : ''; })() || ''
                };
            }
        });
        dataWizardState.dataElements = elements.filter(e => e.name.trim() !== '');
    }

    // Save gap analysis (was step 3, now step 2)
    if (step === 2) {
        document.querySelectorAll('.gap-analysis-row').forEach(row => {
            const elementId = row.dataset.elementId;
            dataWizardState.gapAnalysis[elementId] = {
                impact: (function(){ var _el = row.querySelector('.gap-impact'); return _el ? _el.value : ''; })() || '',
                remediation: (function(){ var _el = row.querySelector('.gap-remediation'); return _el ? _el.value : ''; })() || '',
                effort: (function(){ var _el = row.querySelector('.gap-effort'); return _el ? _el.value : ''; })() || ''
            };
        });
    }

    // Save integration assessments (was step 4, now step 3)
    if (step === 3) {
        document.querySelectorAll('.integration-row').forEach(row => {
            const systemName = row.dataset.system;

            // Get selected radio button value
            const methodRadio = row.querySelector('.integration-method-radio:checked');

            dataWizardState.integrationAssessments[systemName] = {
                complexity: (function(){ var _el = row.querySelector('.integration-complexity'); return _el ? _el.value : ''; })() || '',
                method: methodRadio ? methodRadio.value : '',
                methodOther: (function(){ var _el = row.querySelector('.integration-method-other'); return _el ? _el.value : ''; })() || ''
            };
        });
    }

    // Save governance (was step 5, now step 4)
    if (step === 4) {
        dataWizardState.governance = {
            classification: {
                checked: (document.getElementById('gov-classification') ? document.getElementById('gov-classification').checked : false) || false,
                notes: (document.getElementById('gov-classification-notes') ? document.getElementById('gov-classification-notes').value : '') || ''
            },
            access: {
                checked: (document.getElementById('gov-access') ? document.getElementById('gov-access').checked : false) || false,
                notes: (document.getElementById('gov-access-notes') ? document.getElementById('gov-access-notes').value : '') || ''
            },
            lineage: {
                checked: (document.getElementById('gov-lineage') ? document.getElementById('gov-lineage').checked : false) || false,
                notes: (document.getElementById('gov-lineage-notes') ? document.getElementById('gov-lineage-notes').value : '') || ''
            },
            privacy: {
                checked: (document.getElementById('gov-privacy') ? document.getElementById('gov-privacy').checked : false) || false,
                notes: (document.getElementById('gov-privacy-notes') ? document.getElementById('gov-privacy-notes').value : '') || ''
            },
            security: {
                checked: (document.getElementById('gov-security') ? document.getElementById('gov-security').checked : false) || false,
                notes: (document.getElementById('gov-security-notes') ? document.getElementById('gov-security-notes').value : '') || ''
            },
            audit: {
                checked: (document.getElementById('gov-audit') ? document.getElementById('gov-audit').checked : false) || false,
                notes: (document.getElementById('gov-audit-notes') ? document.getElementById('gov-audit-notes').value : '') || ''
            }
        };
    }

    // Save decision (was step 6, now step 5)
    if (step === 5) {
        const selectedDecision = document.querySelector('input[name="data-decision"]:checked');
        dataWizardState.decision = (selectedDecision && selectedDecision.value) || null;
        dataWizardState.justification = (document.getElementById('data-decision-justification') ? document.getElementById('data-decision-justification').value : '') || '';
    }
}

// ==========================================
// TOGGLEABLE RADIO BUTTONS
// ==========================================

function makeRadioToggleable(event) {
    const radio = event.target;

    // Check if this radio was already selected
    if (radio.dataset.wasChecked === 'true') {
        // Uncheck it
        radio.checked = false;
        radio.dataset.wasChecked = 'false';
    } else {
        // Mark as checked
        radio.dataset.wasChecked = 'true';

        // Clear the wasChecked flag on other radios in the same group
        const name = radio.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
            if (r !== radio) {
                r.dataset.wasChecked = 'false';
            }
        });
    }
}

// ==========================================
// Step 1: Data Elements
// ==========================================
function renderDataElements() {
    const container = document.getElementById('data-elements-container');
    container.innerHTML = '';

    if (dataWizardState.dataElements.length === 0) {
        // Add one empty element to start
        dataWizardState.dataElements.push({
            id: 'element-0',
            name: '',
            description: '',
            volume: '',
            volumeOther: '',
            accuracy: '',
            accuracyOther: '',
            critical: false
        });
    }

    dataWizardState.dataElements.forEach((element, index) => {
        container.innerHTML += createDataElementRow(element, index);
    });

    // Use setTimeout to ensure DOM is fully rendered before counting
    setTimeout(() => {
        updateDataElementCounts();
        updateSourceMappingCounts();
    }, 0);
}

function createDataElementRow(element, index) {
    const mapping = dataWizardState.sourceMappings[element.id] || {};

    return `
        <div class="data-element-row bg-white border border-gray-200 rounded-xl p-4" data-id="${element.id}">
            <div class="flex items-start justify-between mb-3">
                <span class="text-sm font-semibold text-gray-500">Data Element ${index + 1}</span>
                <button onclick="removeDataElement(${index})" class="text-red-500 hover:text-red-700 text-sm">
                    ✕ Remove
                </button>
            </div>

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Element Name *</label>
                    <input type="text" class="element-name w-full p-2 border border-gray-300 rounded-lg text-sm"
                           value="${element.name}" placeholder="e.g., Work Order History">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <input type="text" class="element-description w-full p-2 border border-gray-300 rounded-lg text-sm"
                           value="${element.description}" placeholder="Brief description of this data element">
                </div>
            </div>

            <!-- Availability & Source -->
            <div class="mt-3 border-t border-gray-200 pt-3">
                <label class="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Data Availability</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Availability Status *</label>
                        <select class="mapping-status w-full p-2 border border-gray-300 rounded-lg text-sm" onchange="updateSourceMappingCounts()">
                            <option value="">-- Select --</option>
                            <option value="available" ${mapping.status === 'available' ? 'selected' : ''}>✓ Available</option>
                            <option value="derivable" ${mapping.status === 'derivable' ? 'selected' : ''}>◐ Derivable</option>
                            <option value="partial" ${mapping.status === 'partial' ? 'selected' : ''}>⚠ Partial</option>
                            <option value="missing" ${mapping.status === 'missing' ? 'selected' : ''}>✗ Missing</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Source System</label>
                        <input type="text" class="mapping-source w-full p-2 border border-gray-300 rounded-lg text-sm"
                               value="${mapping.sourceSystem || ''}" placeholder="e.g., SCADA, GIS, EAM">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Data Quality Notes</label>
                        <input type="text" class="mapping-quality w-full p-2 border border-gray-300 rounded-lg text-sm"
                               value="${mapping.quality || ''}" placeholder="Quality issues or notes">
                    </div>
                </div>
            </div>

            <!-- Volume Assessment -->
            <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-2">Data Volume</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                        <input type="radio" name="volume-${element.id}" class="volume-radio mr-2" value="< 1 year"
                               ${element.volume === '< 1 year' ? 'checked' : ''}
                               data-was-checked="${element.volume === '< 1 year' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">< 1 year history</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                        <input type="radio" name="volume-${element.id}" class="volume-radio mr-2" value="1-3 years"
                               ${element.volume === '1-3 years' ? 'checked' : ''}
                               data-was-checked="${element.volume === '1-3 years' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">1-3 years history</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                        <input type="radio" name="volume-${element.id}" class="volume-radio mr-2" value="3+ years"
                               ${element.volume === '3+ years' ? 'checked' : ''}
                               data-was-checked="${element.volume === '3+ years' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">3+ years history</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                        <input type="radio" name="volume-${element.id}" class="volume-radio mr-2" value="Sparse/incomplete"
                               ${element.volume === 'Sparse/incomplete' ? 'checked' : ''}
                               data-was-checked="${element.volume === 'Sparse/incomplete' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">Sparse/incomplete</span>
                    </label>
                </div>
                <input type="text" class="volume-other w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
                       value="${element.volumeOther || ''}" placeholder="Other volume details...">
            </div>

            <!-- Accuracy Assessment -->
            <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-2">Data Accuracy</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition">
                        <input type="radio" name="accuracy-${element.id}" class="accuracy-radio mr-2" value="90%+ accurate"
                               ${element.accuracy === '90%+ accurate' ? 'checked' : ''}
                               data-was-checked="${element.accuracy === '90%+ accurate' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">90%+ accurate</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition">
                        <input type="radio" name="accuracy-${element.id}" class="accuracy-radio mr-2" value="70-90% accurate"
                               ${element.accuracy === '70-90% accurate' ? 'checked' : ''}
                               data-was-checked="${element.accuracy === '70-90% accurate' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">70-90% accurate</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-yellow-50 transition">
                        <input type="radio" name="accuracy-${element.id}" class="accuracy-radio mr-2" value="< 70% accurate"
                               ${element.accuracy === '< 70% accurate' ? 'checked' : ''}
                               data-was-checked="${element.accuracy === '< 70% accurate' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">< 70% accurate</span>
                    </label>
                    <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 transition">
                        <input type="radio" name="accuracy-${element.id}" class="accuracy-radio mr-2" value="Unknown quality"
                               ${element.accuracy === 'Unknown quality' ? 'checked' : ''}
                               data-was-checked="${element.accuracy === 'Unknown quality' ? 'true' : 'false'}"
                               onclick="makeRadioToggleable(event)">
                        <span class="text-xs">Unknown quality</span>
                    </label>
                </div>
                <input type="text" class="accuracy-other w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
                       value="${element.accuracyOther || ''}" placeholder="Other accuracy details...">
            </div>

            <div class="mt-3 flex items-center">
                <input type="checkbox" class="element-critical w-4 h-4 text-red-600 rounded" ${element.critical ? 'checked' : ''} onchange="updateDataElementCounts()">
                <label class="ml-2 text-sm text-gray-700">This is a <span class="font-semibold text-red-600">critical</span> data element (must have)</label>
            </div>
        </div>
    `;
}

function addDataElement() {
    const newElement = {
        id: `element-${Date.now()}`,
        name: '',
        description: '',
        volume: '',
        volumeOther: '',
        accuracy: '',
        accuracyOther: '',
        critical: false
    };

    // Save current elements first
    saveCurrentDataStep();

    dataWizardState.dataElements.push(newElement);
    renderDataElements();
}

function removeDataElement(index) {
    if (dataWizardState.dataElements.length <= 1) {
        alert('You need at least one data element.');
        return;
    }

    saveCurrentDataStep();
    dataWizardState.dataElements.splice(index, 1);
    renderDataElements();
}

function updateDataElementCounts() {
    // Count from DOM for real-time updates
    const rows = document.querySelectorAll('.data-element-row');
    const total = rows.length;
    let critical = 0;

    rows.forEach(row => {
        const criticalCheckbox = row.querySelector('.element-critical');
        if (criticalCheckbox && criticalCheckbox.checked) {
            critical++;
        }
    });

    document.getElementById('data-elements-count').textContent = total;
    document.getElementById('critical-elements-count').textContent = critical;
}

// Step 2: Source Mapping
function renderDataSourceMapping() {
    const container = document.getElementById('data-mapping-container');
    container.innerHTML = '';

    if (dataWizardState.dataElements.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No data elements defined. Go back to Step 1 to add data elements.</p>';
        return;
    }

    dataWizardState.dataElements.forEach(element => {
        if (!element.name) return;

        const mapping = dataWizardState.sourceMappings[element.id] || {};

        container.innerHTML += `
            <div class="source-mapping-row bg-white border border-gray-200 rounded-xl p-4" data-element-id="${element.id}">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <span class="font-semibold text-gray-800">${element.name}</span>
                        ${element.critical ? '<span class="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Critical</span>' : ''}
                        <p class="text-xs text-gray-500 mt-1">${element.description || 'No description'}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <select class="mapping-status w-full p-2 border border-gray-300 rounded-lg text-sm" onchange="updateSourceMappingCounts()">
                            <option value="">-- Select --</option>
                            <option value="available" ${mapping.status === 'available' ? 'selected' : ''}>✓ Available</option>
                            <option value="derivable" ${mapping.status === 'derivable' ? 'selected' : ''}>◐ Derivable</option>
                            <option value="partial" ${mapping.status === 'partial' ? 'selected' : ''}>⚠ Partial</option>
                            <option value="missing" ${mapping.status === 'missing' ? 'selected' : ''}>✗ Missing</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Source System</label>
                        <input type="text" class="mapping-source w-full p-2 border border-gray-300 rounded-lg text-sm"
                               value="${mapping.sourceSystem || ''}" placeholder="e.g., SCADA, GIS, EAM">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Data Quality Notes</label>
                        <input type="text" class="mapping-quality w-full p-2 border border-gray-300 rounded-lg text-sm"
                               value="${mapping.quality || ''}" placeholder="Quality issues or notes">
                    </div>
                </div>
            </div>
        `;
    });

    updateSourceMappingCounts();
}

function updateSourceMappingCounts() {
    const rows = document.querySelectorAll('.data-element-row');
    let counts = { available: 0, derivable: 0, partial: 0, missing: 0 };

    rows.forEach(row => {
        const status = (function(){ var _el = row.querySelector('.mapping-status'); return _el ? _el.value : ''; })();
        if (status && counts.hasOwnProperty(status)) {
            counts[status]++;
        }
    });

    document.getElementById('status-available-count').textContent = counts.available;
    document.getElementById('status-derivable-count').textContent = counts.derivable;
    document.getElementById('status-partial-count').textContent = counts.partial;
    document.getElementById('status-missing-count').textContent = counts.missing;
}

// Step 3: Gap Analysis
function renderGapAnalysis() {
    const container = document.getElementById('gaps-container');
    const noGapsMessage = document.getElementById('no-gaps-message');
    const gapSummary = document.getElementById('gap-summary');

    container.innerHTML = '';

    // Find elements with gaps (partial or missing)
    const gapElements = dataWizardState.dataElements.filter(element => {
        const mapping = dataWizardState.sourceMappings[element.id];
        return mapping && (mapping.status === 'partial' || mapping.status === 'missing');
    });

    if (gapElements.length === 0) {
        noGapsMessage.classList.remove('hidden');
        gapSummary.classList.add('hidden');
        return;
    }

    noGapsMessage.classList.add('hidden');
    gapSummary.classList.remove('hidden');

    gapElements.forEach(element => {
        const mapping = dataWizardState.sourceMappings[element.id] || {};
        const gap = dataWizardState.gapAnalysis[element.id] || {};
        const statusLabel = mapping.status === 'missing' ? '✗ Missing' : '⚠ Partial';
        const statusColor = mapping.status === 'missing' ? 'text-red-600' : 'text-yellow-600';

        container.innerHTML += `
            <div class="gap-analysis-row bg-white border border-gray-200 rounded-xl p-4" data-element-id="${element.id}">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <span class="font-semibold text-gray-800">${element.name}</span>
                        <span class="ml-2 ${statusColor} text-sm font-medium">${statusLabel}</span>
                        ${element.critical ? '<span class="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Critical</span>' : ''}
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Impact on AI Model</label>
                        <select class="gap-impact w-full p-2 border border-gray-300 rounded-lg text-sm" onchange="updateGapCounts()">
                            <option value="">-- Select --</option>
                            <option value="critical" ${gap.impact === 'critical' ? 'selected' : ''}>Critical - Blocks implementation</option>
                            <option value="high" ${gap.impact === 'high' ? 'selected' : ''}>High - Significantly degrades</option>
                            <option value="medium" ${gap.impact === 'medium' ? 'selected' : ''}>Medium - Moderate effects</option>
                            <option value="low" ${gap.impact === 'low' ? 'selected' : ''}>Low - Workarounds available</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Remediation Plan</label>
                        <input type="text" class="gap-remediation w-full p-2 border border-gray-300 rounded-lg text-sm"
                               value="${gap.remediation || ''}" placeholder="How to acquire/improve?">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">Effort / Timeline</label>
                        <select class="gap-effort w-full p-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">-- Select timeline --</option>
                            <option value="immediate" ${gap.effort === 'immediate' ? 'selected' : ''}>Immediate (< 1 month)</option>
                            <option value="short-term" ${gap.effort === 'short-term' ? 'selected' : ''}>Short-term (1-3 months)</option>
                            <option value="medium-term" ${gap.effort === 'medium-term' ? 'selected' : ''}>Medium-term (3-6 months)</option>
                            <option value="long-term" ${gap.effort === 'long-term' ? 'selected' : ''}>Long-term (6-12 months)</option>
                            <option value="major-initiative" ${gap.effort === 'major-initiative' ? 'selected' : ''}>Major initiative (> 12 months)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    });

    updateGapCounts();
}

function updateGapCounts() {
    const rows = document.querySelectorAll('.gap-analysis-row');
    let counts = { critical: 0, high: 0, medium: 0, low: 0 };

    rows.forEach(row => {
        const impact = (function(){ var _el = row.querySelector('.gap-impact'); return _el ? _el.value : ''; })();
        if (impact && counts.hasOwnProperty(impact)) {
            counts[impact]++;
        }
    });

    document.getElementById('gap-critical-count').textContent = counts.critical;
    document.getElementById('gap-high-count').textContent = counts.high;
    document.getElementById('gap-medium-count').textContent = counts.medium;
    document.getElementById('gap-low-count').textContent = counts.low;
}

// Step 4: Integration Requirements
function renderIntegrationRequirements() {
    const container = document.getElementById('integration-container');
    const noSystemsMessage = document.getElementById('no-systems-message');
    const integrationSummary = document.getElementById('integration-summary');

    container.innerHTML = '';

    // Get unique source systems
    const systems = new Set();
    Object.values(dataWizardState.sourceMappings).forEach(mapping => {
        if (mapping.sourceSystem && mapping.sourceSystem.trim()) {
            systems.add(mapping.sourceSystem.trim());
        }
    });

    if (systems.size === 0) {
        noSystemsMessage.classList.remove('hidden');
        integrationSummary.classList.add('hidden');
        return;
    }

    noSystemsMessage.classList.add('hidden');
    integrationSummary.classList.remove('hidden');

    systems.forEach(systemName => {
        const assessment = dataWizardState.integrationAssessments[systemName] || {};
        const method = assessment.method || '';
        const systemId = systemName.replace(/\s+/g, '-').toLowerCase();

        container.innerHTML += `
            <div class="integration-row bg-white border border-gray-200 rounded-xl p-4" data-system="${systemName}">
                <div class="flex items-center justify-between mb-3">
                    <span class="font-semibold text-gray-800">🔗 ${systemName}</span>
                </div>

                <div class="mb-4">
                    <label class="block text-xs font-medium text-gray-600 mb-1">Integration Complexity</label>
                    <select class="integration-complexity w-full p-2 border border-gray-300 rounded-lg text-sm" onchange="updateIntegrationCounts()">
                        <option value="">-- Select --</option>
                        <option value="low" ${assessment.complexity === 'low' ? 'selected' : ''}>Low - Simple API/file export</option>
                        <option value="medium" ${assessment.complexity === 'medium' ? 'selected' : ''}>Medium - Transformation/mapping needed</option>
                        <option value="high" ${assessment.complexity === 'high' ? 'selected' : ''}>High - New infrastructure required</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-2">Integration Method Available</label>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="API"
                                   ${method === 'API' ? 'checked' : ''}
                                   data-was-checked="${method === 'API' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">API</span>
                        </label>
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="Database Access"
                                   ${method === 'Database Access' ? 'checked' : ''}
                                   data-was-checked="${method === 'Database Access' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">Database Access</span>
                        </label>
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="File Export/Import"
                                   ${method === 'File Export/Import' ? 'checked' : ''}
                                   data-was-checked="${method === 'File Export/Import' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">File Export/Import</span>
                        </label>
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="Control System Connection"
                                   ${method === 'Control System Connection' ? 'checked' : ''}
                                   data-was-checked="${method === 'Control System Connection' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">Control System Connection</span>
                        </label>
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="Manual Entry"
                                   ${method === 'Manual Entry' ? 'checked' : ''}
                                   data-was-checked="${method === 'Manual Entry' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">Manual Entry</span>
                        </label>
                        <label class="flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                            <input type="radio" name="method-${systemId}" class="integration-method-radio mr-2" value="Not available"
                                   ${method === 'Not available' ? 'checked' : ''}
                                   data-was-checked="${method === 'Not available' ? 'true' : 'false'}"
                                   onclick="makeRadioToggleable(event)">
                            <span class="text-xs">Not available</span>
                        </label>
                    </div>
                    <input type="text" class="integration-method-other w-full p-2 border border-gray-300 rounded-lg text-sm"
                           value="${assessment.methodOther || ''}" placeholder="Other integration method or details...">
                </div>
            </div>
        `;
    });

    updateIntegrationCounts();
}

function updateIntegrationCounts() {
    const rows = document.querySelectorAll('.integration-row');
    let counts = { low: 0, medium: 0, high: 0 };

    rows.forEach(row => {
        const complexity = (function(){ var _el = row.querySelector('.integration-complexity'); return _el ? _el.value : ''; })();
        if (complexity && counts.hasOwnProperty(complexity)) {
            counts[complexity]++;
        }
    });

    document.getElementById('integration-low-count').textContent = counts.low;
    document.getElementById('integration-medium-count').textContent = counts.medium;
    document.getElementById('integration-high-count').textContent = counts.high;
}

// Step 5: Governance
function renderGovernanceStep() {
    const gov = dataWizardState.governance;

    // Populate checkboxes and notes
    if (gov.classification) {
        document.getElementById('gov-classification').checked = gov.classification.checked;
        document.getElementById('gov-classification-notes').value = gov.classification.notes || '';
    }
    if (gov.access) {
        document.getElementById('gov-access').checked = gov.access.checked;
        document.getElementById('gov-access-notes').value = gov.access.notes || '';
    }
    if (gov.lineage) {
        document.getElementById('gov-lineage').checked = gov.lineage.checked;
        document.getElementById('gov-lineage-notes').value = gov.lineage.notes || '';
    }
    if (gov.privacy) {
        document.getElementById('gov-privacy').checked = gov.privacy.checked;
        document.getElementById('gov-privacy-notes').value = gov.privacy.notes || '';
    }
    if (gov.security) {
        document.getElementById('gov-security').checked = gov.security.checked;
        document.getElementById('gov-security-notes').value = gov.security.notes || '';
    }
    if (gov.audit) {
        document.getElementById('gov-audit').checked = gov.audit.checked;
        document.getElementById('gov-audit-notes').value = gov.audit.notes || '';
    }

    // Add event listeners for count update
    document.querySelectorAll('.governance-check').forEach(checkbox => {
        checkbox.addEventListener('change', updateGovernanceCount);
    });

    updateGovernanceCount();
}

function updateGovernanceCount() {
    const total = document.querySelectorAll('.governance-check').length;
    const checked = document.querySelectorAll('.governance-check:checked').length;
    document.getElementById('governance-checked-count').textContent = `${checked} / ${total}`;
}

// Step 6: Review
function renderReviewStep() {
    // Calculate status counts
    let statusCounts = { available: 0, derivable: 0, partial: 0, missing: 0 };
    let criticalMissing = 0;

    dataWizardState.dataElements.forEach(element => {
        const mapping = dataWizardState.sourceMappings[element.id];
        if ((mapping && mapping.status)) {
            statusCounts[mapping.status]++;
            if (mapping.status === 'missing' && element.critical) {
                criticalMissing++;
            }
        }
    });

    document.getElementById('summary-available').textContent = statusCounts.available;
    document.getElementById('summary-derivable').textContent = statusCounts.derivable;
    document.getElementById('summary-partial').textContent = statusCounts.partial;
    document.getElementById('summary-missing').textContent = statusCounts.missing;
    document.getElementById('summary-critical-missing').textContent = criticalMissing;

    // Gap counts
    let gapCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    Object.values(dataWizardState.gapAnalysis).forEach(gap => {
        if (gap.impact && gapCounts.hasOwnProperty(gap.impact)) {
            gapCounts[gap.impact]++;
        }
    });

    document.getElementById('summary-gap-critical').textContent = gapCounts.critical;
    document.getElementById('summary-gap-high').textContent = gapCounts.high;
    document.getElementById('summary-gap-medium').textContent = gapCounts.medium;
    document.getElementById('summary-gap-low').textContent = gapCounts.low;

    // Integration counts
    let intCounts = { low: 0, medium: 0, high: 0 };
    Object.values(dataWizardState.integrationAssessments).forEach(assessment => {
        if (assessment.complexity && intCounts.hasOwnProperty(assessment.complexity)) {
            intCounts[assessment.complexity]++;
        }
    });

    document.getElementById('summary-int-low').textContent = intCounts.low;
    document.getElementById('summary-int-medium').textContent = intCounts.medium;
    document.getElementById('summary-int-high').textContent = intCounts.high;

    // Governance count
    const govChecked = Object.values(dataWizardState.governance).filter(g => g.checked).length;
    document.getElementById('summary-governance').textContent = `${govChecked}/6`;

    // Restore decision selection
    if (dataWizardState.decision) {
        const radio = document.querySelector(`input[name="data-decision"][value="${dataWizardState.decision}"]`);
        if (radio) radio.checked = true;
    }

    // Restore justification
    document.getElementById('data-decision-justification').value = dataWizardState.justification || '';
}

function completeDataAssessment() {
    saveCurrentDataStep();

    if (!dataWizardState.decision) {
        alert('Please select a readiness decision before completing the assessment.');
        return;
    }

    // Save to appState
    if (!appState.step3.dataAssessments) {
        appState.step3.dataAssessments = {};
    }

    appState.step3.dataAssessments[dataWizardState.selectedUseCaseId] = {
        dataElements: [...dataWizardState.dataElements],
        sourceMappings: { ...dataWizardState.sourceMappings },
        gapAnalysis: { ...dataWizardState.gapAnalysis },
        integrationAssessments: { ...dataWizardState.integrationAssessments },
        governance: { ...dataWizardState.governance },
        decision: dataWizardState.decision,
        justification: dataWizardState.justification,
        completedAt: new Date().toISOString()
    };

    // Mark data assessment as complete
    appState.step3.dataAssessmentComplete = true;

    saveProgress();
    closeDataWizard();

    // Update the landing page
    updateDataAssessmentStatus();

    // Update Step 3 UI and button state
    updateStep3UI();

    // Check if more use cases need assessment
    const totalUseCases = getAllUseCaseIdsFromStep2().length;
    const completedAssessments = Object.keys(appState.step3.dataAssessments || {}).length;

    const decisionLabels = {
        'proceed': 'Proceed ✅',
        'address-gaps': 'Address Gaps ⚠️',
        'reconsider': 'Reconsider ❌'
    };

    if (completedAssessments < totalUseCases) {
        if (confirm(`Data Assessment Complete!\n\nDecision: ${decisionLabels[dataWizardState.decision]}\n\nWould you like to assess another use case?`)) {
            setTimeout(() => openDataAssessmentWizard(), 100);
        }
    } else {
        alert(`Data Assessment Complete!\n\nDecision: ${decisionLabels[dataWizardState.decision]}\n\nAll use cases have been assessed.`);
    }
}

// ==========================================
// QUESTION-BASED PRINCIPLE ASSESSMENTS
// ==========================================

// Principle name to prefix mapping
const principlePrefix = {
    'investment-capacity': 'ic',
    'skilled-personnel': 'sp',
    'regulatory-compliance': 'rc',
    'clear-objectives': 'co'
};

// Initialize principle assessment state
function initializePrincipleAssessments() {
    if (!appState.step3.principles) {
        appState.step3.principles = {};
    }

    const principles = ['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
    principles.forEach(p => {
        if (!appState.step3.principles[p]) {
            appState.step3.principles[p] = {
                questions: {},
                redFlags: [],
                gapsIdentified: null,
                summaryNotes: '',
                assessed: false
            };
        }
    });
}

// Update when a question status is selected
function updatePrincipleStatus(principleId) {
    initializePrincipleAssessments();

    const prefix = principlePrefix[principleId];
    if (!prefix) return;

    // Collect all question statuses
    for (let i = 1; i <= 4; i++) {
        const selected = document.querySelector(`input[name="${prefix}-q${i}-status"]:checked`);
        if (selected) {
            if (!appState.step3.principles[principleId].questions[`q${i}`]) {
                appState.step3.principles[principleId].questions[`q${i}`] = {};
            }
            appState.step3.principles[principleId].questions[`q${i}`].status = selected.value;
        }
    }

    // Update visual styling for selected options
    updateStatusOptionStyling(principleId);

    // Check if at least one question is answered
    const hasAnswer = Object.keys(appState.step3.principles[principleId].questions).some(
        q => appState.step3.principles[principleId].questions[q].status
    );

    appState.step3.principles[principleId].assessed = hasAnswer;

    // Update UI and save
    updatePrincipleCardStatus(principleId);
    updateStep3UI();
    saveProgress();
}

// Update visual styling for selected status options
function updateStatusOptionStyling(principleId) {
    const prefix = principlePrefix[principleId];
    if (!prefix) return;

    for (let i = 1; i <= 4; i++) {
        const options = document.querySelectorAll(`input[name="${prefix}-q${i}-status"]`);
        options.forEach(opt => {
            const label = opt.closest('label');
            const indicator = label.querySelector('.status-indicator');

            if (opt.checked) {
                // Remove any existing color classes
                label.classList.remove('border-gray-200', 'border-green-500', 'bg-green-50', 'border-yellow-500', 'bg-yellow-50',
                                       'border-red-500', 'bg-red-50', 'border-gray-500', 'bg-gray-100',
                                       'border-orange-500', 'bg-orange-50');
                indicator.classList.remove('border-gray-300', 'bg-green-500', 'border-green-500', 'bg-yellow-500', 'border-yellow-500',
                                           'bg-red-500', 'border-red-500', 'bg-gray-500', 'border-gray-500',
                                           'bg-orange-500', 'border-orange-500');

                // Apply neutral blue styling for all selected options
                label.classList.add('border-blue-500', 'bg-blue-50');
                indicator.classList.add('bg-blue-500', 'border-blue-500');
            } else {
                // Reset to default gray styling
                label.classList.remove('border-blue-500', 'bg-blue-50', 'border-green-500', 'bg-green-50',
                                       'border-yellow-500', 'bg-yellow-50', 'border-red-500', 'bg-red-50',
                                       'border-gray-500', 'bg-gray-100', 'border-orange-500', 'bg-orange-50');
                label.classList.add('border-gray-200');
                indicator.classList.remove('bg-blue-500', 'border-blue-500', 'bg-green-500', 'border-green-500',
                                           'bg-yellow-500', 'border-yellow-500', 'bg-red-500', 'border-red-500',
                                           'bg-gray-500', 'border-gray-500', 'bg-orange-500', 'border-orange-500');
                indicator.classList.add('border-gray-300');
            }
        });
    }
}

// Save notes for a question
function savePrincipleNotes(principleId, questionId, notes) {
    initializePrincipleAssessments();

    if (!appState.step3.principles[principleId].questions[questionId]) {
        appState.step3.principles[principleId].questions[questionId] = {};
    }
    appState.step3.principles[principleId].questions[questionId].notes = notes;

    saveProgress();
}

// Save red flags
function savePrincipleRedFlags(principleId) {
    initializePrincipleAssessments();

    const checkboxes = document.querySelectorAll(`.red-flag-check[data-principle="${principleId}"]`);
    const redFlags = [];

    checkboxes.forEach((cb, index) => {
        if (cb.checked) {
            redFlags.push(index);
        }
    });

    appState.step3.principles[principleId].redFlags = redFlags;
    saveProgress();
}

// Save overall assessment
function savePrincipleOverall(principleId) {
    initializePrincipleAssessments();

    const prefix = principlePrefix[principleId];
    if (!prefix) return;

    const gapsRadio = document.querySelector(`input[name="${prefix}-gaps"]:checked`);
    const summaryTextarea = document.getElementById(`${prefix}-summary-notes`);

    if (gapsRadio) {
        appState.step3.principles[principleId].gapsIdentified = gapsRadio.value;
    }
    if (summaryTextarea) {
        appState.step3.principles[principleId].summaryNotes = summaryTextarea.value;
    }

    saveProgress();
}

// Update principle card status in navigator
function updatePrincipleCardStatus(principleId) {
    const card = document.getElementById(`${principleId}-card`);
    const statusEl = document.getElementById(`${principleId}-status`);

    if (!card || !statusEl) return;

    const data = (appState.step3.principles ? appState.step3.principles[principleId] : undefined);
    if (data && data.assessed) {
        statusEl.innerHTML = '<span class="text-green-600 font-medium text-xs">✓</span>';
        card.classList.remove('border-gray-200');
        card.classList.add('border-green-400', 'bg-green-50');
    }
}

// Restore principle assessment data when viewing
function restorePrincipleData(principleId) {
    initializePrincipleAssessments();

    const data = (appState.step3.principles ? appState.step3.principles[principleId] : undefined);
    if (!data) return;

    const prefix = principlePrefix[principleId];
    if (!prefix) return;

    // Restore question statuses and notes
    Object.keys(data.questions || {}).forEach(qId => {
        const qData = data.questions[qId];
        const qNum = qId.replace('q', '');

        if (qData.status) {
            const radio = document.querySelector(`input[name="${prefix}-q${qNum}-status"][value="${qData.status}"]`);
            if (radio) {
                radio.checked = true;
            }
        }

        if (qData.notes) {
            const container = document.querySelector(`#${principleId}-content .principle-question[data-question="${qNum}"]`);
            if (container) {
                const textarea = container.querySelector('textarea');
                if (textarea) textarea.value = qData.notes;
            }
        }
    });

    // Update styling
    updateStatusOptionStyling(principleId);

    // Restore red flags
    if (data.redFlags && data.redFlags.length > 0) {
        const checkboxes = document.querySelectorAll(`.red-flag-check[data-principle="${principleId}"]`);
        data.redFlags.forEach(index => {
            if (checkboxes[index]) {
                checkboxes[index].checked = true;
            }
        });
    }

    // Restore overall assessment
    if (data.gapsIdentified) {
        const gapsRadio = document.querySelector(`input[name="${prefix}-gaps"][value="${data.gapsIdentified}"]`);
        if (gapsRadio) gapsRadio.checked = true;
    }

    if (data.summaryNotes) {
        const summaryTextarea = document.getElementById(`${prefix}-summary-notes`);
        if (summaryTextarea) summaryTextarea.value = data.summaryNotes;
    }
}

// Extend selectPrinciple to restore data for question-based principles
const originalSelectPrinciple = selectPrinciple;
selectPrinciple = function(principleId) {
    originalSelectPrinciple(principleId);

    // Restore data for question-based principles after a short delay
    if (['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'].includes(principleId)) {
        setTimeout(() => {
            restorePrincipleData(principleId);
        }, 50);
    }
};

// Update updateStep3UI to handle all principles
const originalUpdateStep3UI = updateStep3UI;
updateStep3UI = function() {
    originalUpdateStep3UI();

    // Initialize principles state
    initializePrincipleAssessments();

    // Count all completed principles
    let completedCount = 0;
    if (appState.step3.riskManagementComplete) completedCount++;
    if (appState.step3.dataAssessmentComplete) completedCount++;

    const questionPrinciples = ['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
    questionPrinciples.forEach(p => {
        if ((appState.step3.principles && appState.step3.principles[p] && appState.step3.principles[p].assessed)) {
            completedCount++;
            updatePrincipleCardStatus(p);
        }
    });

    // Update progress display
    document.getElementById('principles-progress-text').textContent = `${completedCount} / 6 Principles with Responses`;
    document.getElementById('principles-progress-bar').style.width = `${(completedCount / 6) * 100}%`;
};
