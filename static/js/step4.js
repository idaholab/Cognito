/**
 * COGNITO Step 4 Module
 * Implementation Planning and Build/Buy Decision
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// STEP 4: IMPLEMENTATION PLANNING FUNCTIONS
// ========================================

function initializeStep4State() {
    if (!appState.step4) {
        appState.step4 = {
            selectedUseCases: [],
            worksheets: {},
            complete: false
        };
    }

    // Ensure selectedUseCases is always an array (fix for corrupted state)
    if (!Array.isArray(appState.step4.selectedUseCases)) {
        appState.step4.selectedUseCases = [];
    }

    // Ensure worksheets object exists
    if (!appState.step4.worksheets) {
        appState.step4.worksheets = {};
    }
}

// Navigate to Step 4 and populate use case selection
function showStep4() {
    console.log('[showStep4] Entering Step 4');
    console.log('[showStep4] Step 2 state:', appState.step2);

    // Refresh opportunities from Step 1 to ensure latest priority values are shown
    loadStep1Summary();

    initializeStep4State();

    // Debug: Check what use cases we can find
    const useCaseIds = getAllUseCaseIdsFromStep2();
    console.log('[showStep4] Found use case IDs:', useCaseIds);

    // SYNC: Remove any selected use cases that are no longer valid (not in Step 2)
    if (appState.step4.selectedUseCases && appState.step4.selectedUseCases.length > 0) {
        const validUseCaseSet = new Set(useCaseIds);
        const originalCount = appState.step4.selectedUseCases.length;
        appState.step4.selectedUseCases = appState.step4.selectedUseCases.filter(ucId => validUseCaseSet.has(ucId));
        if (appState.step4.selectedUseCases.length !== originalCount) {
            console.log('[showStep4] Removed invalid use cases. Was:', originalCount, 'Now:', appState.step4.selectedUseCases.length);
            saveProgress();
        }
    }

    // Auto-select all use cases from Step 2 if none are selected yet
    if (!appState.step4.selectedUseCases || appState.step4.selectedUseCases.length === 0) {
        if (useCaseIds.length > 0) {
            appState.step4.selectedUseCases = [...useCaseIds]; // Copy array
            console.log('[showStep4] Auto-selected use cases:', appState.step4.selectedUseCases);
            saveProgress();
        } else {
            console.warn('[showStep4] No use cases found from Step 2 to auto-select');
        }
    } else {
        console.log('[showStep4] Use cases already selected:', appState.step4.selectedUseCases);
    }

    populateStep4UseCaseSelection();
    updateImplementationWorksheets();
}

// Populate use case selection checkboxes from Step 2
function populateStep4UseCaseSelection() {
    const container = document.getElementById('step4-usecase-selection');
    const noUseCasesDiv = document.getElementById('step4-no-usecases');

    console.log('[populateStep4UseCaseSelection] Starting...');

    // Get use cases from Step 2 opportunity mappings
    const useCaseIds = getAllUseCaseIdsFromStep2();

    console.log('[populateStep4UseCaseSelection] Use case IDs:', useCaseIds);

    if (useCaseIds.length === 0) {
        console.warn('[populateStep4UseCaseSelection] No use cases found - showing warning');
        container.innerHTML = '';
        noUseCasesDiv.classList.remove('hidden');
        return;
    }

    console.log('[populateStep4UseCaseSelection] Found', useCaseIds.length, 'use cases - hiding warning');
    noUseCasesDiv.classList.add('hidden');
    container.innerHTML = '';

    // Iterate through selected use cases
    useCaseIds.forEach(useCaseId => {
        // Look up the full use case data from the catalog
        const useCaseData = useCaseCatalog.find(uc => uc.id === useCaseId);

        if (!useCaseData) {
            console.warn(`Use case ${useCaseId} not found in catalog`);
            return;
        }

        // Defensive check: ensure selectedUseCases array exists
        const isChecked = (appState.step4.selectedUseCases && Array.isArray(appState.step4.selectedUseCases))
            ? appState.step4.selectedUseCases.includes(useCaseId)
            : false;

        const checkbox = document.createElement('label');
        checkbox.className = 'flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ' + (isChecked ? 'border-blue-500 bg-blue-50' : 'border-gray-200');
        checkbox.innerHTML = `
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleStep4UseCase('${useCaseId}')" class="mt-1 mr-3">
            <div class="flex-1">
                <div class="font-semibold text-gray-900">${useCaseData.name}</div>
                <div class="text-sm text-gray-600 mt-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getConsequenceBadgeClass(useCaseData.consequence)}">
                        ${capitalizeFirst(useCaseData.consequence)} Consequence
                    </span>
                    ${formatReadinessBadge(useCaseData.readiness, getReadinessBadgeClass(useCaseData.readiness), 'small')}
                </div>
            </div>
        `;
        container.appendChild(checkbox);
        console.log('[populateStep4UseCaseSelection] Added checkbox for:', useCaseId, 'Checked:', isChecked);
    });

    console.log('[populateStep4UseCaseSelection] Completed - added', useCaseIds.length, 'checkboxes');
}

// NOTE: capitalizeFirst is defined in utils.js
// Toggle use case selection
function toggleStep4UseCase(useCaseName) {
    initializeStep4State();

    const index = appState.step4.selectedUseCases.indexOf(useCaseName);
    if (index > -1) {
        appState.step4.selectedUseCases.splice(index, 1);
    } else {
        appState.step4.selectedUseCases.push(useCaseName);
    }

    saveProgress();
    populateStep4UseCaseSelection();
    updateImplementationWorksheets();
}

// Update implementation worksheets based on selected use cases
function updateImplementationWorksheets() {
    const container = document.getElementById('implementation-worksheets');

    if (!appState.step4.selectedUseCases || appState.step4.selectedUseCases.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';

    appState.step4.selectedUseCases.forEach((useCaseId, index) => {
        // Look up the full use case data from the catalog
        const useCaseData = useCaseCatalog.find(uc => uc.id === useCaseId);

        if (!useCaseData) {
            console.warn(`Use case ${useCaseId} not found in catalog`);
            return;
        }

        // Add the ID to the use case object for reference
        const useCaseWithId = { ...useCaseData, id: useCaseId };

        const worksheet = createImplementationWorksheet(useCaseWithId, index);
        container.appendChild(worksheet);
    });
}

// Toggle worksheet collapse/expand
function toggleWorksheet(useCaseKey) {
    const content = document.getElementById(`worksheet-content-${useCaseKey}`);
    const chevron = document.getElementById(`worksheet-chevron-${useCaseKey}`);
    const worksheet = content ? content.closest('.bg-white.rounded-lg') : null;

    if (!content || !chevron) return;

    if (content.style.display === 'none') {
        // Expanding
        content.style.display = 'block';
        chevron.style.transform = 'rotate(0deg)';
    } else {
        // Collapsing
        content.style.display = 'none';
        chevron.style.transform = 'rotate(-90deg)';

        // Scroll to the top of the worksheet when collapsing
        if (worksheet) {
            worksheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Create implementation worksheet for a use case
function createImplementationWorksheet(useCase, index) {
    const worksheetDiv = document.createElement('div');
    worksheetDiv.className = 'bg-white rounded-lg border-2 border-gray-200 shadow-sm';
    worksheetDiv.id = `worksheet-${index}`;

    // Use useCase.id (or fallback to name) as the key for storing worksheet data
    const useCaseKey = useCase.id || useCase.name;

    // Initialize worksheet data
    if (!appState.step4.worksheets[useCaseKey]) {
        appState.step4.worksheets[useCaseKey] = {
            currentState: { whoAffected: '' },
            aiDescription: { corePurpose: '', userInteraction: '', scopeBoundaries: '' },
            kpis: [],
            buildBuyDecision: {
                customization: '',
                timeline: '',
                expertise: '',
                budget: '',
                risk: '',
                finalDecision: ''
            }
        };
    }

    const data = appState.step4.worksheets[useCaseKey];

    worksheetDiv.innerHTML = `
        <!-- Collapsible Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all" onclick="toggleWorksheet('${useCaseKey}')">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <h3 class="text-xl font-bold">${useCase.name || useCaseKey}</h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getConsequenceBadgeClass(useCase.consequence)}">
                            ${capitalizeFirst(useCase.consequence || 'Not specified')} Consequence
                        </span>
                        ${formatReadinessBadge(useCase.readiness || 'Not specified', getReadinessBadgeClass(useCase.readiness), 'normal', false, true)}
                    </div>
                </div>
                <div class="ml-4">
                    <svg id="worksheet-chevron-${useCaseKey}" class="w-6 h-6 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
        </div>

        <div id="worksheet-content-${useCaseKey}" class="p-6 space-y-8">

            <!-- Section 1: Current State & Problem Statement -->
            <div class="border-b border-gray-200 pb-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">1</span>
                    Current State & Problem Statement
                </h4>
                ${createCurrentStateSection(useCase, data, useCaseKey)}
            </div>

            <!-- Section 2: AI Description -->
            <div class="border-b border-gray-200 pb-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">2</span>
                    AI Solution Description
                </h4>
                ${createAIDescriptionSection(useCase, data, useCaseKey)}
            </div>

            <!-- Section 3: Technical Architecture -->
            <div class="border-b border-gray-200 pb-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">3</span>
                    Technical Architecture - Data Requirements
                </h4>
                ${createTechnicalArchitectureSection(useCase, data, useCaseKey)}
            </div>

            <!-- Section 4: Expected Outcomes & KPIs -->
            <div class="border-b border-gray-200 pb-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">4</span>
                    Expected Outcomes & KPIs
                </h4>
                ${createKPIsSection(useCase, data, useCaseKey)}
            </div>

            <!-- Section 5: Critical Dependencies & Risk Assessment -->
            <div class="border-b border-gray-200 pb-8">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">5</span>
                    Critical Dependencies & Risk Assessment
                </h4>
                ${createRiskAssessmentSection(useCase, data, useCaseKey)}
            </div>

            <!-- Section 6: Build vs. Buy Decision -->
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">6</span>
                    Build vs. Buy Decision Support
                </h4>
                ${createBuildBuySection(useCase, data, useCaseKey)}
            </div>

            <!-- Collapse Button at Bottom -->
            <div class="pt-6 border-t border-gray-200 mt-8">
                <button onclick="toggleWorksheet('${useCaseKey}')" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 font-medium">
                    <span>Collapse ${useCase.name || useCaseKey}</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                </button>
            </div>

        </div>
    `;

    return worksheetDiv;
}

// Create Current State section
function createCurrentStateSection(useCase, data, useCaseKey) {
    const opportunity = findOpportunityForUseCase(useCase);

    return `
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="text-sm text-gray-600 mb-2"><strong>From Step 1 - Business Opportunity:</strong></div>
            ${opportunity ? `
                <div class="mb-3">
                    <span class="font-semibold text-gray-900">Opportunity ${opportunity.number}</span>
                    <span class="text-sm text-gray-600 ml-2">(from ${opportunity.capability})</span>
                </div>
                <div class="text-gray-800">${opportunity.problem || 'No description provided'}</div>
                ${opportunity.domains && opportunity.domains.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mt-3">
                        <span class="text-xs text-gray-600 font-medium">AI Domains:</span>
                        ${opportunity.domains.map(domain => `
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                ${getDomainLabel(domain)}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
                ${opportunity.priority ? `
                    <div class="mt-2">
                        <span class="text-xs text-gray-600 font-medium">Priority:</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-800">
                            ${opportunity.priority.toUpperCase()}
                        </span>
                    </div>
                ` : ''}
            ` : `
                <div class="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p class="font-medium">No opportunity linked from Step 1</p>
                    <p class="text-sm mt-1">This use case was not mapped to a Step 1 opportunity in Step 2.</p>
                </div>
            `}
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Who is affected? <span class="text-red-500">*</span>
                <span class="text-gray-500 font-normal">(Specify roles, departments, or stakeholders)</span>
            </label>
            <textarea
                id="who-affected-${useCaseKey}"
                onchange="saveStep4Field(\'${useCaseKey}\', 'currentState', 'whoAffected', this.value)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Example: Field operations teams, dispatch operators, maintenance planners, customers in high-risk areas..."
            >${data.currentState.whoAffected || ''}</textarea>
        </div>
    `;
}

// Helper function to find opportunity for use case
function findOpportunityForUseCase(useCase) {
    // Get the use case ID from useCase object
    const useCaseId = useCase.id;

    if (!useCaseId || !appState.step2 || !appState.step2.opportunityMappings) {
        return null;
    }

    // Find the opportunity that maps to this use case
    const opportunityId = Object.keys(appState.step2.opportunityMappings).find(oppId => {
        const mapping = appState.step2.opportunityMappings[oppId];
        return mapping && mapping.useCaseId === useCaseId;
    });

    if (!opportunityId || !appState.step2.opportunities) {
        return null;
    }

    // Find the opportunity in Step 2's opportunities array by ID
    const opportunity = appState.step2.opportunities.find(opp => opp.id === opportunityId);

    return opportunity || null;
}


// Create AI Description section
function createAIDescriptionSection(useCase, data, useCaseKey) {
    return `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Core Purpose & Key Features <span class="text-red-500">*</span>
                    <span class="text-gray-500 font-normal">(What will this AI system do?)</span>
                </label>
                <textarea
                    id="core-purpose-${useCaseKey}"
                    onchange="saveStep4Field(\'${useCaseKey}\', 'aiDescription', 'corePurpose', this.value)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Example: Analyze historical outage data and weather patterns to predict high-risk outage scenarios 24-48 hours in advance. Key features: real-time weather integration, GIS-based risk mapping, automated crew pre-positioning recommendations..."
                >${data.aiDescription.corePurpose || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    User Interaction <span class="text-red-500">*</span>
                    <span class="text-gray-500 font-normal">(How will operators/staff use this system?)</span>
                </label>
                <textarea
                    id="user-interaction-${useCaseKey}"
                    onchange="saveStep4Field(\'${useCaseKey}\', 'aiDescription', 'userInteraction', this.value)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Example: Dispatch supervisors review daily risk dashboard each morning, receive automated alerts for high-risk conditions, use recommendations to optimize crew scheduling. System provides confidence scores for all predictions..."
                >${data.aiDescription.userInteraction || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Scope Boundaries <span class="text-red-500">*</span>
                    <span class="text-gray-500 font-normal">(What will the AI NOT do?)</span>
                </label>
                <textarea
                    id="scope-boundaries-${useCaseKey}"
                    onchange="saveStep4Field(\'${useCaseKey}\', 'aiDescription', 'scopeBoundaries', this.value)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Example: Will NOT automatically deploy crews without human approval, will NOT directly control grid equipment, will NOT replace dispatcher decision-making authority. Human operators retain final authority for all operational decisions..."
                >${data.aiDescription.scopeBoundaries || ''}</textarea>
            </div>
        </div>
    `;
}

// Create Technical Architecture section
function createTechnicalArchitectureSection(useCase, data, useCaseKey) {
    const dataElements = getDataElementsFromDeepDive(useCase);

    if (!dataElements || dataElements.length === 0) {
        return `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-yellow-800 font-medium">Data Deep Dive not completed</p>
                        <p class="text-sm text-yellow-700 mt-1">Return to Step 3 and complete the Data Mapping deep dive to auto-populate data requirements here.</p>
                        <button onclick="navigateToStep(3)" class="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm transition-colors">
                            Go to Step 3 - Data Deep Dive
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-4"><em>Data requirements from Step 3 Data Mapping Deep Dive:</em></p>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Data Element</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Volume</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Accuracy</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Critical</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Availability</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Source</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700">Quality</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${dataElements.map(elem => `
                            <tr>
                                <td class="px-4 py-2 font-medium text-gray-900">${elem.name}</td>
                                <td class="px-4 py-2 text-gray-600">${elem.description || '-'}</td>
                                <td class="px-4 py-2 text-gray-600">${elem.volume || '-'}</td>
                                <td class="px-4 py-2">
                                    ${elem.accuracy !== '-' ? `
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAccuracyBadgeClass(elem.accuracy)}">
                                            ${elem.accuracy}
                                        </span>
                                    ` : '<span class="text-gray-600">-</span>'}
                                </td>
                                <td class="px-4 py-2">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${elem.critical ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                                        ${elem.critical ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td class="px-4 py-2">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getAvailabilityBadgeClass(elem.availability)}">
                                        ${elem.availability}
                                    </span>
                                </td>
                                <td class="px-4 py-2 text-gray-600">${elem.source || '-'}</td>
                                <td class="px-4 py-2 text-gray-600">${elem.quality || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Helper function to get data elements from deep dive
function getDataElementsFromDeepDive(useCase) {
    // Get the use case ID
    const useCaseId = useCase.id;

    // Check if data assessment exists for this specific use case
    if (!appState.step3 || !appState.step3.dataAssessments || !appState.step3.dataAssessments[useCaseId]) {
        return [];
    }

    // Get the data assessment for this use case
    const assessment = appState.step3.dataAssessments[useCaseId];
    const dataElements = assessment.dataElements || [];
    const sourceMappings = assessment.sourceMappings || {};

    // Merge data elements with their source mappings
    return dataElements.map(elem => {
        const mapping = sourceMappings[elem.id] || {};

        // Combine radio selection with "Other" text if provided
        let volumeDisplay = '-';
        if (elem.volume && elem.volumeOther) {
            volumeDisplay = `${elem.volume} (${elem.volumeOther})`;
        } else if (elem.volume) {
            volumeDisplay = elem.volume;
        } else if (elem.volumeOther) {
            volumeDisplay = elem.volumeOther;
        }

        let accuracyDisplay = '-';
        if (elem.accuracy && elem.accuracyOther) {
            accuracyDisplay = `${elem.accuracy} (${elem.accuracyOther})`;
        } else if (elem.accuracy) {
            accuracyDisplay = elem.accuracy;
        } else if (elem.accuracyOther) {
            accuracyDisplay = elem.accuracyOther;
        }

        return {
            name: elem.name,
            description: elem.description,
            volume: volumeDisplay,
            accuracy: accuracyDisplay,
            critical: elem.critical,
            availability: mapping.status || 'Not specified',
            source: mapping.sourceSystem || '-',
            quality: mapping.quality || '-'
        };
    });
}

// Helper function for availability badge styling
function getAvailabilityBadgeClass(availability) {
    const classes = {
        'Available': 'bg-green-100 text-green-800',
        'Derivable': 'bg-blue-100 text-blue-800',
        'Partially Available': 'bg-yellow-100 text-yellow-800',
        'Missing': 'bg-red-100 text-red-800'
    };
    return classes[availability] || 'bg-gray-100 text-gray-800';
}

// Helper function for accuracy badge styling
function getAccuracyBadgeClass(accuracy) {
    // Extract the base accuracy value (without "Other" text in parentheses)
    const baseAccuracy = accuracy.split('(')[0].trim();
    const classes = {
        '90%+ accurate': 'bg-green-100 text-green-800',
        '70-90% accurate': 'bg-yellow-100 text-yellow-800',
        '< 70% accurate': 'bg-orange-100 text-orange-800',
        'Unknown quality': 'bg-gray-100 text-gray-800'
    };
    return classes[baseAccuracy] || 'bg-gray-100 text-gray-800';
}

// Create KPIs section
function createKPIsSection(useCase, data, useCaseKey) {
    const kpis = data.kpis || [];

    return `
        <div class="space-y-4">
            <p class="text-sm text-gray-600 mb-4">Define measurable success criteria for this AI implementation.</p>

            <div id="kpis-list-${useCaseKey}" class="space-y-3">
                ${kpis.length === 0 ? '<p class="text-gray-500 text-sm italic">No KPIs added yet. Click "+ Add KPI" to begin.</p>' : kpis.map((kpi, index) => createKPIRow(useCaseKey, kpi, index)).join('')}
            </div>

            <button
                onclick="addKPI(\'${useCaseKey}\')"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add KPI
            </button>
        </div>
    `;
}

// Create KPI row
function createKPIRow(useCaseKey, kpi, index) {
    return `
        <div class="grid grid-cols-12 gap-3 bg-gray-50 p-3 rounded-lg" data-kpi-index="${index}">
            <div class="col-span-3">
                <input
                    type="text"
                    placeholder="e.g., Outage duration"
                    value="${kpi.metric || ''}"
                    onchange="updateKPI('${useCaseKey}', ${index}, 'metric', this.value)"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <div class="text-xs text-gray-500 mt-1">KPI/Metric</div>
            </div>
            <div class="col-span-3">
                <input
                    type="text"
                    placeholder="e.g., 4.2 hours"
                    value="${kpi.baseline || ''}"
                    onchange="updateKPI('${useCaseKey}', ${index}, 'baseline', this.value)"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <div class="text-xs text-gray-500 mt-1">Baseline (Current)</div>
            </div>
            <div class="col-span-2">
                <input
                    type="text"
                    placeholder="e.g., 3.0 hours"
                    value="${kpi.target || ''}"
                    onchange="updateKPI('${useCaseKey}', ${index}, 'target', this.value)"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <div class="text-xs text-gray-500 mt-1">Target</div>
            </div>
            <div class="col-span-3">
                <input
                    type="text"
                    placeholder="e.g., OMS reports"
                    value="${kpi.measurement || ''}"
                    onchange="updateKPI('${useCaseKey}', ${index}, 'measurement', this.value)"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <div class="text-xs text-gray-500 mt-1">How Measured</div>
            </div>
            <div class="col-span-1 flex items-start justify-center pt-1">
                <button
                    onclick="removeKPI('${useCaseKey}', ${index})"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Remove KPI"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Add new KPI
function addKPI(useCaseName) {
    if (!appState.step4.worksheets[useCaseName].kpis) {
        appState.step4.worksheets[useCaseName].kpis = [];
    }

    appState.step4.worksheets[useCaseName].kpis.push({
        metric: '',
        baseline: '',
        target: '',
        measurement: ''
    });

    saveProgress();
    updateImplementationWorksheets();
}

// Update KPI field
function updateKPI(useCaseName, index, field, value) {
    if (!appState.step4.worksheets[useCaseName].kpis[index]) return;

    appState.step4.worksheets[useCaseName].kpis[index][field] = value;
    saveProgress();
}

// Remove KPI
function removeKPI(useCaseName, index) {
    appState.step4.worksheets[useCaseName].kpis.splice(index, 1);
    saveProgress();
    updateImplementationWorksheets();
}


// Create Risk Assessment section
function createRiskAssessmentSection(useCase, data, useCaseKey) {
    const riskData = getRiskAssessmentData(useCase);

    if (!riskData || !riskData.completed) {
        return `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-yellow-800 font-medium">Risk Assessment not completed</p>
                        <p class="text-sm text-yellow-700 mt-1">Return to Step 3 and complete the Risk Assessment wizard to auto-populate risk information here.</p>
                        <button onclick="navigateToStep(3)" class="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm transition-colors">
                            Go to Step 3 - Risk Assessment
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="bg-gray-50 rounded-lg p-4 space-y-4">
            <!-- Overall Risk Level -->
            <div>
                <h5 class="text-sm font-semibold text-gray-700 mb-3">Organizational Risk Level from Step 3 Analysis</h5>
                ${riskData.riskLevel && riskData.riskLevel !== 'Not Assessed' ? `
                    <div class="flex items-center space-x-4">
                        <span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${getRiskLevelBadgeClass(riskData.riskLevel)}">
                            ${riskData.riskLevel} Risk
                        </span>
                        <span class="text-sm text-gray-600">
                            Total Score: <strong>${riskData.totalScore}/45</strong>
                        </span>
                    </div>
                ` : `
                    <div class="text-sm text-gray-600 italic">Organizational risk level not calculated in Step 3 assessment</div>
                `}
            </div>

            <!-- Identified Failure Modes -->
            <div>
                <h5 class="text-sm font-semibold text-gray-700 mb-2">Identified Failure Modes</h5>
                <div class="space-y-2">
                    ${createFailureModesList(riskData.failureModes)}
                </div>
            </div>

            <!-- Critical Mitigations -->
            ${riskData.criticalMitigations && riskData.criticalMitigations.length > 0 ? `
                <div>
                    <h5 class="text-sm font-semibold text-gray-700 mb-2">Critical Mitigations Required</h5>
                    <ul class="space-y-1">
                        ${riskData.criticalMitigations.map(mit => `<li class="text-sm text-gray-700 flex items-start"><span class="text-blue-600 mr-2">•</span>${mit}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

// Helper function to get risk assessment data
function getRiskAssessmentData(useCase) {
    // Get the use case ID
    const useCaseId = useCase.id;

    // Check if risk analysis exists for this specific use case
    if (!appState.step3 || !appState.step3.riskAnalyses || !appState.step3.riskAnalyses[useCaseId]) {
        console.log(`No risk analysis found for use case: ${useCaseId}`);
        return null;
    }

    // Get the risk analysis for this use case
    const analysis = appState.step3.riskAnalyses[useCaseId];
    console.log(`Risk analysis found for ${useCaseId}:`, {
        totalScore: analysis.totalScore,
        riskLevel: analysis.riskLevel,
        hasFailureModes: !!analysis.failureModes,
        hasMitigations: !!analysis.mitigations
    });

    // Convert failure modes object to array for display
    const failureModesArray = [];
    if (analysis.failureModes) {
        const modeTypes = {
            'availability': 'Availability Failure',
            'accuracy': 'Accuracy Failure',
            'latency': 'Speed/Latency Failure'
        };

        Object.keys(modeTypes).forEach(key => {
            const mode = analysis.failureModes[key];
            if (mode && mode.enabled) {
                failureModesArray.push({
                    type: modeTypes[key],
                    scenario: mode.how || 'Not specified',
                    detection: mode.detect || 'Not specified',
                    impact: mode.impact || 'Not specified'
                });
            }
        });
    }

    // Format for display
    const result = {
        completed: true,
        totalScore: analysis.totalScore || 0,
        riskLevel: analysis.riskLevel || 'Not Assessed',
        failureModes: failureModesArray,
        criticalMitigations: extractCriticalMitigations(analysis.mitigations)
    };

    console.log(`Returning risk data for ${useCaseId}:`, result);
    return result;
}

// Helper function to extract critical mitigations
function extractCriticalMitigations(mitigations) {
    if (!mitigations) return [];

    const criticalList = [];

    // Extract from engineering controls
    if (mitigations.engineering && mitigations.engineering.trim()) {
        const items = mitigations.engineering.split('\n').filter(m => m.trim());
        criticalList.push(...items.slice(0, 3)); // Take first 3
    }

    // Extract from operational controls
    if (mitigations.operational && mitigations.operational.trim()) {
        const items = mitigations.operational.split('\n').filter(m => m.trim());
        criticalList.push(...items.slice(0, 2)); // Take first 2
    }

    // Extract from governance controls
    if (mitigations.governance && mitigations.governance.trim()) {
        const items = mitigations.governance.split('\n').filter(m => m.trim());
        criticalList.push(...items.slice(0, 2)); // Take first 2
    }

    return criticalList;
}

// Helper function for risk level badge
function getRiskLevelBadgeClass(level) {
    const classes = {
        'Minimal': 'bg-green-100 text-green-800 border-2 border-green-300',
        'Low': 'bg-green-100 text-green-800 border-2 border-green-300',
        'Moderate': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
        'Critical': 'bg-red-100 text-red-800 border-2 border-red-300'
    };
    return classes[level] || 'bg-gray-100 text-gray-800 border-2 border-gray-300';
}

// Helper function to create failure modes list
function createFailureModesList(failureModes) {
    if (!failureModes || failureModes.length === 0) {
        return '<p class="text-sm text-gray-600 italic">No failure modes identified</p>';
    }

    return failureModes.map(mode => `
        <div class="bg-white rounded p-3 border border-gray-200">
            <div class="font-medium text-gray-900 text-sm">${mode.type}</div>
            <div class="text-sm text-gray-600 mt-1"><strong>Scenario:</strong> ${mode.scenario}</div>
            ${mode.impact ? `<div class="text-sm text-gray-600 mt-1"><strong>Impact:</strong> ${mode.impact}</div>` : ''}
            ${mode.detection ? `<div class="text-xs text-gray-500 mt-1"><strong>Detection:</strong> ${mode.detection}</div>` : ''}
        </div>
    `).join('');
}

// Create Build vs. Buy Decision section
function createBuildBuySection(useCase, data, useCaseKey) {
    const decision = data.buildBuyDecision || {};

    // Get risk analysis data if available
    const riskAnalysis = appState.step3.riskAnalyses ? appState.step3.riskAnalyses[useCase.id] : null;
    const riskLevel = riskAnalysis ? riskAnalysis.riskLevel : null;
    const totalConsequenceScore = riskAnalysis ? riskAnalysis.totalScore : null;

    return `
        <!-- Build/Buy/Partner Descriptions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 class="font-semibold text-purple-900 mb-2">BUILD (Custom)</h5>
                <p class="text-sm text-purple-800 mb-2"><strong>Best When:</strong> Unique requirements, strategic IP, strong internal capabilities</p>
                <p class="text-sm text-purple-700"><strong>Considerations:</strong> Higher upfront cost, longer development time, sustained expertise needed</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 class="font-semibold text-blue-900 mb-2">BUY (Commercial)</h5>
                <p class="text-sm text-blue-800 mb-2"><strong>Best When:</strong> Proven solutions exist, faster time-to-value, limited internal expertise</p>
                <p class="text-sm text-blue-700"><strong>Considerations:</strong> Vendor dependency, customization limits, ongoing licensing costs</p>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 class="font-semibold text-orange-900 mb-2">PARTNER (Hybrid)</h5>
                <p class="text-sm text-orange-800 mb-2"><strong>Best When:</strong> Need expertise to accelerate, building capability over time</p>
                <p class="text-sm text-orange-700"><strong>Considerations:</strong> Knowledge transfer essential, may cost more, requires managing relationships</p>
            </div>
        </div>

        <!-- Pre-populated Context with Risk and Consequence -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 p-5 mb-6">
            <h5 class="font-semibold text-gray-900 mb-4">
                Context from Prior Steps
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="text-xs font-semibold text-gray-600 mb-2">USE CASE CONSEQUENCE RATING</div>
                    <span class="inline-flex items-center px-4 py-2 rounded-lg text-base font-bold border-2 border-current ${getConsequenceBadgeClass(useCase.consequence)}">
                        ${capitalizeFirst(useCase.consequence)} Consequence
                    </span>
                    <p class="text-xs text-gray-600 mt-2 italic">Higher consequence requires more rigorous controls and may favor commercial or partner solutions with proven track records</p>
                </div>
                ${riskLevel ? `
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="text-xs font-semibold text-gray-600 mb-2">RISK ANALYSIS SCORE (from Step 3)</div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="inline-flex items-center px-4 py-2 rounded-lg text-base font-bold border-2 ${getRiskLevelColor(riskLevel)}">
                            ${riskLevel} Risk
                        </span>
                        ${totalConsequenceScore ? `
                            <span class="text-sm text-gray-600">Score: <strong>${totalConsequenceScore}/45</strong></span>
                        ` : ''}
                    </div>
                    <p class="text-xs text-gray-600 italic">Higher risk may require partner expertise or proven commercial solutions with established support</p>
                </div>
                ` : `
                <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div class="text-xs font-semibold text-yellow-800 mb-2">RISK ANALYSIS NOT COMPLETED</div>
                    <p class="text-sm text-yellow-700 mb-2">Risk analysis provides important context for build vs. buy decisions</p>
                    <button onclick="navigateToStep(3)" class="px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs transition-colors">
                        Complete Risk Analysis
                    </button>
                </div>
                `}
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="text-xs font-semibold text-gray-600 mb-2">TECHNOLOGY READINESS</div>
                    ${formatReadinessBadge(useCase.readiness, getReadinessBadgeClass(useCase.readiness), 'large')}
                    <p class="text-xs text-gray-600 mt-3 italic">Ready Now technologies favor BUY, while Emerging/Future State may require BUILD or PARTNER approaches</p>
                </div>
            </div>
        </div>

        <!-- Decision Criteria with Tooltips -->
        <div class="space-y-4 mb-6">
            <h5 class="font-semibold text-gray-800 mb-3">Answer these questions to determine your approach:</h5>

            ${createDropdownWithTooltip(
                'customization',
                'Customization needs?',
                'How unique are your requirements? Critical customization favors BUILD, while standard needs favor BUY.',
                useCaseKey,
                decision.customization,
                [
                    { value: 'critical', label: 'Critical - unique requirements', scores: { build: 3, buy: 0, partner: 1 } },
                    { value: 'some', label: 'Some customization needed', scores: { build: 1, buy: 1, partner: 2 } },
                    { value: 'standard', label: 'Standard solution OK', scores: { build: 0, buy: 3, partner: 0 } }
                ]
            )}

            ${createDropdownWithTooltip(
                'timeline',
                'Target timeline?',
                'How quickly do you need this deployed? Short timelines favor BUY (commercial), longer timelines allow BUILD or PARTNER.',
                useCaseKey,
                decision.timeline,
                [
                    { value: 'short', label: 'Less than 6 months', scores: { build: 0, buy: 3, partner: 0 } },
                    { value: 'medium', label: '6-12 months', scores: { build: 0, buy: 1, partner: 2 } },
                    { value: 'long', label: 'Greater than 12 months', scores: { build: 2, buy: 0, partner: 1 } }
                ]
            )}

            ${createDropdownWithTooltip(
                'expertise',
                'Internal AI/ML expertise?',
                'Do you have AI/ML developers on staff? Strong teams can BUILD, limited teams need PARTNER, no expertise requires BUY or PARTNER.',
                useCaseKey,
                decision.expertise,
                [
                    { value: 'strong', label: 'Strong internal team', scores: { build: 3, buy: 0, partner: 0 } },
                    { value: 'limited', label: 'Limited - building capability', scores: { build: 0, buy: 0, partner: 3 } },
                    { value: 'none', label: 'None - need vendor', scores: { build: 0, buy: 2, partner: 1 } }
                ]
            )}

            ${createDropdownWithTooltip(
                'budget',
                'Budget structure?',
                'What budget model works for you? Large CapEx favors BUILD, OpEx model favors BUY (subscription), limited budget may require phased PARTNER approach.',
                useCaseKey,
                decision.budget,
                [
                    { value: 'capex', label: 'Large upfront capital OK', scores: { build: 2, buy: 0, partner: 0 } },
                    { value: 'opex', label: 'Prefer OpEx model', scores: { build: 0, buy: 2, partner: 0 } },
                    { value: 'limited', label: 'Limited budget', scores: { build: 0, buy: 1, partner: 1 } }
                ]
            )}

            ${createDropdownWithTooltip(
                'risk',
                'Risk tolerance for this use case?',
                'Higher consequence and risk favor proven BUY or PARTNER solutions with established support. Lower risk allows BUILD experimentation.',
                useCaseKey,
                decision.risk,
                [
                    { value: 'low', label: 'Low - can experiment', scores: { build: 2, buy: 0, partner: 0 } },
                    { value: 'medium', label: 'Medium - need some validation', scores: { build: 1, buy: 1, partner: 2 } },
                    { value: 'high', label: 'High - need proven solution', scores: { build: 0, buy: 3, partner: 1 } }
                ]
            )}
        </div>

        <!-- System Recommendation -->
        <div id="recommendation-${useCaseKey}" class="mb-6">
            ${createRecommendationDisplay(useCase, decision)}
        </div>

        <!-- Final Decision Selection -->
        <div>
            <div class="flex items-center justify-between mb-3">
                <h5 class="font-semibold text-gray-800">Your Final Decision:</h5>
                <span class="text-xs text-gray-500 italic">Click to select, click again to deselect</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${createDecisionCard('BUILD', 'purple', useCase, decision, useCaseKey)}
                ${createDecisionCard('BUY', 'blue', useCase, decision, useCaseKey)}
                ${createDecisionCard('PARTNER', 'orange', useCase, decision, useCaseKey)}
            </div>
        </div>
    `;
}

// Create dropdown with tooltip
function createDropdownWithTooltip(fieldName, label, tooltip, useCaseKey, currentValue, options) {
    return `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                ${label} <span class="text-red-500 ml-1">*</span>
                <div class="relative inline-block ml-2 group">
                    <svg class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                        ${tooltip}
                        <div class="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            </label>
            <select
                id="${fieldName}-${useCaseKey}"
                onchange="updateBuildBuyDecision('${useCaseKey}')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">-- Select --</option>
                ${options.map(opt => `
                    <option value="${opt.value}" ${currentValue === opt.value ? 'selected' : ''}>${opt.label}</option>
                `).join('')}
            </select>
        </div>
    `;
}

// Calculate build/buy/partner recommendation
function calculateBuildBuyRecommendation(decision) {
    let buildScore = 0;
    let buyScore = 0;
    let partnerScore = 0;

    // Customization scoring
    if (decision.customization === 'critical') {
        buildScore += 3;
        partnerScore += 1;
    } else if (decision.customization === 'some') {
        buildScore += 1;
        buyScore += 1;
        partnerScore += 2;
    } else if (decision.customization === 'standard') {
        buyScore += 3;
    }

    // Timeline scoring
    if (decision.timeline === 'short') {
        buyScore += 3;
    } else if (decision.timeline === 'medium') {
        buyScore += 1;
        partnerScore += 2;
    } else if (decision.timeline === 'long') {
        buildScore += 2;
        partnerScore += 1;
    }

    // Expertise scoring
    if (decision.expertise === 'strong') {
        buildScore += 3;
    } else if (decision.expertise === 'limited') {
        partnerScore += 3;
    } else if (decision.expertise === 'none') {
        buyScore += 2;
        partnerScore += 1;
    }

    // Budget scoring
    if (decision.budget === 'capex') {
        buildScore += 2;
    } else if (decision.budget === 'opex') {
        buyScore += 2;
    } else if (decision.budget === 'limited') {
        buyScore += 1;
        partnerScore += 1;
    }

    // Risk scoring (NEW)
    if (decision.risk === 'low') {
        buildScore += 2;
    } else if (decision.risk === 'medium') {
        buildScore += 1;
        buyScore += 1;
        partnerScore += 2;
    } else if (decision.risk === 'high') {
        buyScore += 3;
        partnerScore += 1;
    }

    // Determine recommendation
    const maxScore = Math.max(buildScore, buyScore, partnerScore);
    if (buildScore === maxScore) return 'BUILD';
    if (buyScore === maxScore) return 'BUY';
    return 'PARTNER';
}

// Create recommendation display
function createRecommendationDisplay(useCase, decision) {
    const allAnswered = decision.customization && decision.timeline && decision.expertise && decision.budget && decision.risk;

    if (!allAnswered) {
        return `
            <div class="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
                <p class="text-gray-600 text-sm">Answer all 5 questions above to see system recommendation</p>
            </div>
        `;
    }

    const recommendation = calculateBuildBuyRecommendation(decision);
    const colorClass = recommendation === 'BUILD' ? 'purple' : recommendation === 'BUY' ? 'blue' : 'orange';

    return `
        <div class="bg-${colorClass}-50 border-2 border-${colorClass}-400 rounded-lg p-6">
            <h5 class="text-sm font-medium text-${colorClass}-900 mb-2">System Recommendation:</h5>
            <div class="text-3xl font-bold text-${colorClass}-600">${recommendation}</div>
            <p class="text-sm text-${colorClass}-800 mt-2">Based on your answers, this approach best matches your requirements and constraints.</p>
        </div>
    `;
}

// Create decision card
// Create decision card - WITH TOGGLE SUPPORT
function createDecisionCard(option, color, useCase, decision, useCaseKey) {
    const isSelected = decision.finalDecision === option;
    const cardId = `decision-card-${useCaseKey}-${option}`;

    // Define colors
    const colors = {
        'BUILD': 'purple',
        'BUY': 'blue',
        'PARTNER': 'orange'
    };
    const actualColor = colors[option];

    // Enhanced classes with hover effects and scale
    const baseClasses = 'decision-card cursor-pointer border-2 rounded-lg p-6 text-center transition-all duration-200';
    const selectedClasses = `${baseClasses} border-${actualColor}-500 bg-${actualColor}-50 shadow-lg hover:shadow-xl hover:scale-105`;
    const unselectedClasses = `${baseClasses} border-gray-200 bg-white hover:border-${actualColor}-300 hover:shadow-md hover:scale-102`;

    return `
        <div id="${cardId}"
             onclick="handleDecisionClick('${useCaseKey}', '${option}')"
             class="${isSelected ? selectedClasses : unselectedClasses}">
            <div class="decision-title text-xl font-bold ${isSelected ? `text-${actualColor}-600` : 'text-gray-700'}">${option}</div>
            ${isSelected ? `<div class="decision-badge mt-2"><span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${actualColor}-600 text-white">✓ Selected</span></div>` : `<div class="decision-hint mt-2 text-xs text-gray-400">Click to select</div>`}
        </div>
    `;
}

// Handle decision click - TOGGLE SUPPORT (click to select, click again to deselect)
function handleDecisionClick(useCaseKey, decision) {
    console.log(`[handleDecisionClick] ${useCaseKey} -> ${decision}`);

    try {
        // 1. Check current state and toggle if needed
        if (!appState.step4.worksheets[useCaseKey]) {
            console.error('No worksheet found');
            return;
        }

        const currentDecision = appState.step4.worksheets[useCaseKey].buildBuyDecision.finalDecision;

        // Toggle logic: if clicking the same option, deselect it
        const newDecision = (currentDecision === decision) ? '' : decision;

        console.log(`[handleDecisionClick] Current: "${currentDecision}", New: "${newDecision}"`);

        appState.step4.worksheets[useCaseKey].buildBuyDecision.finalDecision = newDecision;

        // Save to localStorage
        appState.lastModified = new Date().toISOString();
        localStorage.setItem('cognitoAssessment', JSON.stringify(appState));
        console.log('[handleDecisionClick] Saved to localStorage');

        // 2. Update visual state for all three cards
        const colors = {
            'BUILD': 'purple',
            'BUY': 'blue',
            'PARTNER': 'orange'
        };

        ['BUILD', 'BUY', 'PARTNER'].forEach(option => {
            const card = document.getElementById(`decision-card-${useCaseKey}-${option}`);
            if (!card) return;

            const title = card.querySelector('.decision-title');
            const color = colors[option];

            // Base classes for all cards
            const baseClasses = 'decision-card cursor-pointer border-2 rounded-lg p-6 text-center transition-all duration-200';

            // Remove all existing badge/hint divs to prevent duplication
            const existingBadges = card.querySelectorAll('.decision-badge, .decision-hint');
            existingBadges.forEach(el => el.remove());

            // Also remove any divs that might be old "Click to select" hints
            const allDivs = card.querySelectorAll('div:not(.decision-title)');
            allDivs.forEach(el => {
                if (el.textContent.trim() === 'Click to select') {
                    el.remove();
                }
            });

            if (option === newDecision && newDecision !== '') {
                // Selected state with enhanced styling
                card.className = `${baseClasses} border-${color}-500 bg-${color}-50 shadow-lg hover:shadow-xl hover:scale-105`;
                if (title) title.className = `decision-title text-xl font-bold text-${color}-600`;

                // Add selected badge
                const badgeDiv = document.createElement('div');
                badgeDiv.className = 'decision-badge mt-2';
                badgeDiv.innerHTML = `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${color}-600 text-white">✓ Selected</span>`;
                card.appendChild(badgeDiv);
            } else {
                // Unselected state with subtle hover hint
                card.className = `${baseClasses} border-gray-200 bg-white hover:border-${color}-300 hover:shadow-md hover:scale-102`;
                if (title) title.className = 'decision-title text-xl font-bold text-gray-700';

                // Add "Click to select" hint
                const hintDiv = document.createElement('div');
                hintDiv.className = 'decision-hint mt-2 text-xs text-gray-400';
                hintDiv.textContent = 'Click to select';
                card.appendChild(hintDiv);
            }
        });

        console.log('[handleDecisionClick] Visual update complete');

    } catch (error) {
        console.error('[handleDecisionClick] Error:', error);
        alert('Error saving decision: ' + error.message);
    }
}


// Update build/buy decision
function updateBuildBuyDecision(useCaseName) {
    try {
        console.log('[updateBuildBuyDecision] Called for:', useCaseName);

        const customization = (function(_id){ var _el = document.getElementById(_id); return _el ? _el.value : ''; })(`customization-${useCaseName}`) || '';
        const timeline = (function(_id){ var _el = document.getElementById(_id); return _el ? _el.value : ''; })(`timeline-${useCaseName}`) || '';
        const expertise = (function(_id){ var _el = document.getElementById(_id); return _el ? _el.value : ''; })(`expertise-${useCaseName}`) || '';
        const budget = (function(_id){ var _el = document.getElementById(_id); return _el ? _el.value : ''; })(`budget-${useCaseName}`) || '';
        const risk = (function(_id){ var _el = document.getElementById(_id); return _el ? _el.value : ''; })(`risk-${useCaseName}`) || '';

        console.log('[updateBuildBuyDecision] Values:', { customization, timeline, expertise, budget, risk });

        if (!appState.step4.worksheets[useCaseName]) {
            console.error('[updateBuildBuyDecision] No worksheet found for:', useCaseName);
            return;
        }

        appState.step4.worksheets[useCaseName].buildBuyDecision = {
            ...appState.step4.worksheets[useCaseName].buildBuyDecision,
            customization,
            timeline,
            expertise,
            budget,
            risk
        };

        console.log('[updateBuildBuyDecision] Updated decision:', appState.step4.worksheets[useCaseName].buildBuyDecision);

        saveProgress();

        // Update recommendation display
        const recDiv = document.getElementById(`recommendation-${useCaseName}`);
        if (recDiv) {
            recDiv.innerHTML = createRecommendationDisplay({ name: useCaseName }, appState.step4.worksheets[useCaseName].buildBuyDecision);
            console.log('[updateBuildBuyDecision] Recommendation display updated');
        }

        console.log('[updateBuildBuyDecision] Complete');
    } catch (error) {
        console.error('[updateBuildBuyDecision] Error:', error);
        console.error('[updateBuildBuyDecision] Stack:', error.stack);
    }
}

// Save final decision - with scroll monitoring and prevention

// Save Step 4 field
function saveStep4Field(useCaseName, section, field, value) {
    if (!appState.step4.worksheets[useCaseName]) return;
    if (!appState.step4.worksheets[useCaseName][section]) {
        appState.step4.worksheets[useCaseName][section] = {};
    }
    appState.step4.worksheets[useCaseName][section][field] = value;
    saveProgress();
}

// NOTE: Badge and label utility functions are defined in utils.js:
// - getConsequenceTextClass, getConsequenceBadgeClass
// - getReadinessBadgeClass, getReadinessSubtext, formatReadinessBadge
// - getDomainLabel, capitalizeFirst

// Complete Step 4
function completeStep4() {
    console.log('[completeStep4] Validating Step 4...');
    console.log('[completeStep4] Selected use cases:', appState.step4.selectedUseCases);

    // Validate that at least one use case is selected
    if (!appState.step4.selectedUseCases || appState.step4.selectedUseCases.length === 0) {
        console.error('[completeStep4] No use cases selected');
        alert('Please select at least one use case before completing Step 4.\n\nTip: Check the boxes next to the use cases you want to plan for implementation.');
        return;
    }

    console.log('[completeStep4] Found', appState.step4.selectedUseCases.length, 'selected use case(s)');

    // Validate that required fields are filled for each selected use case
    let hasErrors = false;
    const errors = [];

    appState.step4.selectedUseCases.forEach(useCaseId => {
        const worksheet = appState.step4.worksheets[useCaseId];

        if (!worksheet) {
            console.warn('[completeStep4] No worksheet found for:', useCaseId);
            return;
        }

        // Look up use case name from catalog for better error messages
        const useCaseData = useCaseCatalog.find(uc => uc.id === useCaseId);
        const useCaseName = useCaseData ? useCaseData.name : useCaseId;

        // Check required fields
        if (!worksheet.currentState.whoAffected || worksheet.currentState.whoAffected.trim() === '') {
            errors.push(`${useCaseName}: "Who is affected?" field is required`);
            hasErrors = true;
        }

        if (!worksheet.aiDescription.corePurpose || worksheet.aiDescription.corePurpose.trim() === '') {
            errors.push(`${useCaseName}: "Core Purpose & Key Features" field is required`);
            hasErrors = true;
        }

        if (!worksheet.aiDescription.userInteraction || worksheet.aiDescription.userInteraction.trim() === '') {
            errors.push(`${useCaseName}: "User Interaction" field is required`);
            hasErrors = true;
        }

        if (!worksheet.aiDescription.scopeBoundaries || worksheet.aiDescription.scopeBoundaries.trim() === '') {
            errors.push(`${useCaseName}: "Scope Boundaries" field is required`);
            hasErrors = true;
        }

        if (!worksheet.kpis || worksheet.kpis.length === 0) {
            errors.push(`${useCaseName}: At least one KPI must be defined`);
            hasErrors = true;
        }

        const decision = worksheet.buildBuyDecision;
        if (!decision.customization || !decision.timeline || !decision.expertise || !decision.budget) {
            errors.push(`${useCaseName}: All Build/Buy decision criteria must be answered`);
            hasErrors = true;
        }

        if (!decision.finalDecision) {
            errors.push(`${useCaseName}: Final implementation decision (BUILD/BUY/PARTNER) must be selected`);
            hasErrors = true;
        }
    });

    if (hasErrors) {
        alert('Please complete all required fields before proceeding:\n\n' + errors.join('\n'));
        return;
    }

    // Mark Step 4 as complete
    appState.step4.complete = true;
    saveProgress();

    // Update navigation status
    updateStepStatus(4, 'complete');

    // Navigate to Step 5
    navigateToStep(5);
}

// Update Step 4 UI when navigating to this step
function updateStep4UI() {
    initializeStep4State();
    showStep4();
}

