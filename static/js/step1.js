/**
 * COGNITO Step 1 Module
 * Business Context Assessment - Capability selection and maturity evaluation
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// STEP 1 FUNCTIONS
// ============================================

const capabilityDefinitions = {
    'field-operations': {
        name: 'Field Operations',
        description: 'Field Operations encompasses the deployment, coordination, and execution of field work including crew dispatch, equipment installation and maintenance, outage response, vegetation management, and mobile workforce coordination. This function represents the utility\'s ability to safely and efficiently execute work in the field and respond to operational events.'
    },
    'system-operations': {
        name: 'System Operations',
        description: 'System Operations include real-time monitoring and control of the electric grid through control center operations, SCADA and energy management systems, real-time decision-making during normal and emergency conditions, load balancing, and coordination of generation and distribution resources. This function represents the utility\'s ability to maintain reliable service and respond to dynamic grid conditions.'
    },
    'asset-management': {
        name: 'Asset Management',
        description: 'Asset Management covers the strategic oversight of utility infrastructure throughout its lifecycle including asset health monitoring, condition assessment, maintenance planning and scheduling, capital investment prioritization, and asset performance tracking. This function represents the utility\'s ability to optimize the reliability, performance, and cost-effectiveness of physical infrastructure.'
    },
    'planning-engineering': {
        name: 'Planning and Engineering',
        description: 'Planning and Engineering addresses long-term system development and technical analysis including load forecasting, capacity planning, system impact studies, interconnection analysis, capital project design, and regulatory compliance analysis. This function represents the utility\'s ability to anticipate future needs and engineer solutions that meet reliability and regulatory requirements.'
    },
    'customer-operations': {
        name: 'Customer Operations',
        description: 'Customer Operations encompasses all customer-facing functions including contact center operations, billing and payment systems, outage communication, demand response program management, and customer satisfaction initiatives. This function represents the utility\'s ability to serve customers effectively and manage the customer relationship throughout the service lifecycle.'
    }
};

const maturityLevels = {
    1: {
        name: 'Ad-Hoc',
        description: 'Processes are poorly defined or undocumented, with success depending on individual effort rather than standardized procedures. Outcomes are unpredictable and inconsistent due to reactive problem-solving approaches, and no formal performance metrics exist.',
        type: 'FOUNDATIONAL',
        color: 'gray'
    },
    2: {
        name: 'Repeatable',
        description: 'Basic processes exist and can be repeated, though documentation remains informal or inconsistent. Some performance tracking occurs but is not standardized, outcomes vary by person, and the organization is beginning to establish management practices.',
        type: 'FOUNDATIONAL',
        color: 'gray'
    },
    3: {
        name: 'Standardized',
        description: 'Processes are documented and standardized across the organization with employees following established procedures. Performance metrics are defined and tracked, cross-functional integration exists, and outcomes are generally consistent and predictable.',
        type: 'OPTIMIZE',
        color: 'gray'
    },
    4: {
        name: 'Measured',
        description: 'Processes are measured using statistical and quantitative techniques with data-driven decision-making as standard practice. Performance is monitored and controlled, improvements are based on empirical evidence, and strong performance management systems are in place.',
        type: 'ENHANCE/SCALE',
        color: 'gray'
    },
    5: {
        name: 'Optimized',
        description: 'Continuous improvement is embedded in organizational culture with proactive innovation identification. The focus is on preventing problems before they occur through regular refinement based on lessons learned, with agile response to changing conditions.',
        type: 'ENHANCE/SCALE',
        color: 'gray'
    }
};

function toggleCustomCapability() {
    const checkbox = document.getElementById('custom-capability-checkbox');
    const fields = document.getElementById('custom-capability-fields');

    if (checkbox.checked) {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
        document.getElementById('custom-capability-name').value = '';
        document.getElementById('custom-capability-description').value = '';
    }

    updateCapabilitySelection();
}

function updateCapabilitySelection() {
    const checkboxes = document.querySelectorAll('.capability-checkbox');
    const customCheckbox = document.getElementById('custom-capability-checkbox');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked) || customCheckbox.checked;

    document.getElementById('start-assessment-btn').disabled = !anyChecked;
}

function startAssessment() {
    const checkboxes = document.querySelectorAll('.capability-checkbox:checked');
    const customCheckbox = document.getElementById('custom-capability-checkbox');

    // Build list of currently selected capability IDs
    const selectedCapabilityIds = new Set();

    // Add standard capabilities
    checkboxes.forEach(checkbox => {
        selectedCapabilityIds.add(checkbox.value);
    });

    // Handle custom capability
    let customCapabilityId = null;
    if (customCheckbox.checked) {
        const customName = document.getElementById('custom-capability-name').value.trim();
        const customDesc = document.getElementById('custom-capability-description').value.trim();

        if (!customName || !customDesc) {
            alert('Please provide both a name and description for your custom capability.');
            return;
        }

        // Check if we already have a custom capability in state
        const existingCustom = Object.keys(appState.step1.capabilities || {}).find(id => id.startsWith('custom-'));
        if (existingCustom) {
            customCapabilityId = existingCustom;
            // Update the name and description in case they changed
            appState.step1.capabilities[existingCustom].name = customName;
            appState.step1.capabilities[existingCustom].description = customDesc;
        } else {
            customCapabilityId = 'custom-' + Date.now();
        }
        selectedCapabilityIds.add(customCapabilityId);
    }

    if (selectedCapabilityIds.size === 0) {
        alert('Please select at least one capability to assess.');
        return;
    }

    // Initialize capabilities object if needed
    if (!appState.step1.capabilities) {
        appState.step1.capabilities = {};
    }

    // Build new capabilities object, preserving data for still-selected capabilities
    const newCapabilities = {};

    // Add/update selected capabilities
    selectedCapabilityIds.forEach(capabilityId => {
        if (appState.step1.capabilities[capabilityId]) {
            // Capability already exists - preserve its data
            newCapabilities[capabilityId] = appState.step1.capabilities[capabilityId];
        } else {
            // New capability - initialize it
            if (capabilityId.startsWith('custom-')) {
                // Custom capability
                const customName = document.getElementById('custom-capability-name').value.trim();
                const customDesc = document.getElementById('custom-capability-description').value.trim();
                newCapabilities[capabilityId] = {
                    id: capabilityId,
                    name: customName,
                    description: customDesc,
                    maturityLevel: null,
                    evidence: '',
                    opportunities: []
                };
            } else {
                // Standard capability
                const def = capabilityDefinitions[capabilityId];
                newCapabilities[capabilityId] = {
                    id: capabilityId,
                    name: def.name,
                    description: def.description,
                    maturityLevel: null,
                    evidence: '',
                    opportunities: []
                };
            }
        }
    });

    // Replace capabilities with new set (removes deselected capabilities)
    appState.step1.capabilities = newCapabilities;

    // Clean up orphaned data in downstream steps (Steps 2-5)
    // This removes data for capabilities/opportunities/use cases that were deselected
    cleanupOrphanedData();

    // Clear existing assessment forms
    const assessmentFormsContainer = document.getElementById('assessment-forms');
    // Remove all capability cards but keep the back button
    const capabilityCards = assessmentFormsContainer.querySelectorAll('[id^="capability-"]');
    capabilityCards.forEach(card => card.remove());

    // Hide capability selection
    document.getElementById('capability-selection').style.display = 'none';

    // Create assessment forms for each selected capability
    for (const capId in appState.step1.capabilities) {
        createCapabilityAssessment(capId);

        // Restore data if it exists
        const capability = appState.step1.capabilities[capId];

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
                const container = document.getElementById(`opportunities-${capId}`);
                if (container) {
                    container.innerHTML = '';

                    capability.opportunities.forEach((opp) => {
                        // Use createOpportunityDOM instead of addOpportunity to avoid duplicating in state
                        createOpportunityDOM(capId, opp.id);

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

    // Show assessment forms
    assessmentFormsContainer.classList.remove('hidden');
    document.getElementById('complete-step1-btn').classList.remove('hidden');

    // Mark step as in progress
    updateStepStatus(1, 'in-progress');

    // Scroll to top of page after DOM updates
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Also scroll the main content container
        const mainContent = document.getElementById('main-content-area');
        if (mainContent) mainContent.scrollTop = 0;
    }, 50);

    saveProgress();
}

function backToCapabilitySelection() {
    if (confirm('Going back will allow you to change your capability selections. Your current progress will be saved. Continue?')) {
        // Save current progress
        saveProgress();

        // Update checkboxes to reflect current capabilities in state
        // First, uncheck all
        document.querySelectorAll('.capability-checkbox').forEach(cb => cb.checked = false);
        document.getElementById('custom-capability-checkbox').checked = false;
        document.getElementById('custom-capability-fields').classList.add('hidden');

        // Then check the ones that are in our current state
        if (appState.step1.capabilities) {
            for (const capId in appState.step1.capabilities) {
                if (capId.startsWith('custom-')) {
                    // Custom capability
                    const capability = appState.step1.capabilities[capId];
                    document.getElementById('custom-capability-checkbox').checked = true;
                    document.getElementById('custom-capability-fields').classList.remove('hidden');
                    document.getElementById('custom-capability-name').value = capability.name;
                    document.getElementById('custom-capability-description').value = capability.description;
                } else {
                    // Standard capability
                    const checkbox = document.querySelector(`.capability-checkbox[value="${capId}"]`);
                    if (checkbox) checkbox.checked = true;
                }
            }
        }

        // Update button state
        updateCapabilitySelection();

        // Show capability selection
        document.getElementById('capability-selection').style.display = 'block';

        // Hide assessment forms
        document.getElementById('assessment-forms').classList.add('hidden');
        document.getElementById('complete-step1-btn').classList.add('hidden');

        // Scroll to top
        setTimeout(() => {
            window.scrollTo(0, 0);
            const mainContent = document.getElementById('main-content-area');
            if (mainContent) mainContent.scrollTop = 0;
        }, 50);
    }
}

function createCapabilityAssessment(capabilityId) {
    const capability = appState.step1.capabilities[capabilityId];
    const container = document.getElementById('assessment-forms');

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-8';
    card.id = `capability-${capabilityId}`;

    card.innerHTML = `
        <div class="border-b border-gray-200 pb-4 mb-6">
            <h3 class="text-2xl font-bold text-gray-900">${capability.name}</h3>
            <p class="text-sm text-gray-600 mt-2">${capability.description}</p>
        </div>

        <!-- Section 1: Rate Maturity Level -->
        <div class="mb-8">
            <div class="flex items-center mb-1">
                <h4 class="text-lg font-semibold text-gray-800">Section 1: Rate Current Maturity Level</h4>
            </div>
            <p class="text-sm text-gray-600 mb-4">Select one score below (hover over the info icon in each box for details):</p>

            <div class="grid grid-cols-5 gap-3 mb-4">
                ${[1, 2, 3, 4, 5].map(level => {
                    const info = maturityLevels[level];
                    const borderColor = 'border-blue-500';
                    const tooltipId = `maturity-tooltip-${capabilityId}-${level}`;
                    return `
                        <div id="maturity-${capabilityId}-${level}" class="relative z-0 hover:z-[100]">
                            <!-- Clickable card content with padding to avoid icon overlap -->
                            <div onclick="selectMaturityLevel('${capabilityId}', ${level})"
                                 style="transition: transform 0.2s ease, box-shadow 0.2s ease; height: 120px;"
                                 class="border-2 ${borderColor} rounded-lg p-4 pr-10 cursor-pointer text-center hover:bg-gray-50 hover:scale-105 hover:shadow-md flex flex-col justify-center">
                                <div class="text-2xl font-bold text-gray-800 mb-1">${level}</div>
                                <div class="text-sm font-semibold text-gray-700">${info.name}</div>
                            </div>

                            <!-- Info icon with tooltip - absolute positioned, NO z-index to avoid stacking context -->
                            <div class="absolute top-2 right-2" onclick="event.stopPropagation()">
                                <div class="relative">
                                    <!-- Info icon button -->
                                    <button type="button"
                                            class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                            onmouseenter="showTooltip('${tooltipId}')"
                                            onmouseleave="hideTooltip('${tooltipId}')">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <!-- Tooltip popup -->
                                    <div id="${tooltipId}"
                                         class="hidden absolute z-[10000] w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                                         onmouseenter="showTooltip('${tooltipId}')"
                                         onmouseleave="hideTooltip('${tooltipId}')">
                                        <div class="font-semibold mb-2">${info.name}</div>
                                        <div>${info.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Selected Maturity with Classification Badge -->
            <div id="maturity-selected-${capabilityId}" class="hidden">
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-2">
                    <p class="text-sm font-semibold text-blue-900" id="maturity-text-${capabilityId}"></p>
                </div>
                <div class="flex items-center mt-2">
                    <span class="text-sm font-medium text-gray-700 mr-2">Overall Classification:</span>
                    <span id="classification-badge-${capabilityId}" class="px-3 py-1 rounded-full text-sm font-bold"></span>
                    <div class="relative inline-block ml-2">
                        <button type="button"
                                class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                onmouseenter="showTooltip('classification-info-${capabilityId}')"
                                onmouseleave="hideTooltip('classification-info-${capabilityId}')">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <div id="classification-info-${capabilityId}"
                             class="hidden absolute z-[10000] w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                             onmouseenter="showTooltip('classification-info-${capabilityId}')"
                             onmouseleave="hideTooltip('classification-info-${capabilityId}')">
                            <div class="font-semibold mb-2">Opportunity Classification:</div>
                            <div class="space-y-2">
                                <div><strong class="text-white">FOUNDATIONAL (Levels 1-2):</strong> Low-maturity functions require fundamental improvement and represent areas where AI may help establish more reliable processes or transform workflows that currently depend heavily on individual expertise.</div>
                                <div><strong class="text-white">OPTIMIZE (Level 3):</strong> Standardized but inefficient functions have established processes with identifiable bottlenecks or performance gaps that AI could address through better resource allocation, scheduling, or decision support.</div>
                                <div><strong class="text-white">ENHANCE/SCALE (Levels 4-5):</strong> High-performing functions operate reliably but could benefit from AI to handle increased complexity, expand capabilities, or maintain performance as demands grow.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Evidence -->
        <div class="mb-8">
            <h4 class="text-lg font-semibold text-gray-800 mb-1">Section 2: Provide Evidence / Current State Notes</h4>
            <p class="text-sm text-gray-600 mb-2"><span class="text-red-600">*</span> Required - Be specific with examples</p>

            <textarea id="evidence-${capabilityId}"
                      onchange="updateEvidence('${capabilityId}')"
                      class="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Example: Describe specific examples of how this capability operates today with measurable details..."></textarea>
        </div>

        <!-- Section 3: Opportunities -->
        <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-1">Section 3: Opportunities within ${capability.name}</h4>
            <p class="text-sm text-gray-600 mb-4">Identify specific problems where AI could help in this area</p>

            <div id="opportunities-${capabilityId}" class="space-y-4 mb-4">
                <!-- Opportunities will be added here -->
            </div>

            <button onclick="addOpportunity('${capabilityId}')"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add Opportunity</span>
            </button>
            <p class="text-xs text-gray-500 mt-2 italic">Select all opportunities relevant to your organization. Each will be individually assessed for risk, feasibility, and requirements in your final report. Adding opportunities is optional—add as many or as few as you'd like.</p>
        </div>
    `;

    container.appendChild(card);

    // Only add initial opportunity if the capability has no saved opportunities
    // This prevents duplication when going back and forth
    if (!capability.opportunities || capability.opportunities.length === 0) {
        addOpportunity(capabilityId);
    }
}

function selectMaturityLevel(capabilityId, level) {
    // Update state
    appState.step1.capabilities[capabilityId].maturityLevel = level;

    // Auto-set opportunity type based on maturity level
    // 1-2: FOUNDATIONAL, 3: Optimize, 4-5: Enhance/Scale
    if (level <= 2) {
        appState.step1.capabilities[capabilityId].opportunityType = 'F';
    } else if (level === 3) {
        appState.step1.capabilities[capabilityId].opportunityType = 'O';
    } else if (level >= 4) {
        appState.step1.capabilities[capabilityId].opportunityType = 'E';
    }

    // Visual feedback - remove selection from all boxes
    for (let i = 1; i <= 5; i++) {
        const box = document.getElementById(`maturity-${capabilityId}-${i}`);
        // Find the inner card div and remove selected class
        const innerCard = box.querySelector('div[onclick]');
        if (innerCard) {
            innerCard.classList.remove('maturity-selected');
        }
    }

    // Add selection to clicked box's inner card
    const selectedBox = document.getElementById(`maturity-${capabilityId}-${level}`);
    const selectedInnerCard = selectedBox.querySelector('div[onclick]');
    if (selectedInnerCard) {
        selectedInnerCard.classList.add('maturity-selected');
    }

    // Show selection text and classification
    const info = maturityLevels[level];
    const selectionDiv = document.getElementById(`maturity-selected-${capabilityId}`);
    const maturityText = document.getElementById(`maturity-text-${capabilityId}`);
    const classificationBadge = document.getElementById(`classification-badge-${capabilityId}`);

    maturityText.textContent = `Selected: ${level} - ${info.name}`;

    // Update classification badge
    const bgColor = 'bg-gray-100 text-gray-800';

    classificationBadge.className = `px-3 py-1 rounded-full text-sm font-bold ${bgColor}`;
    classificationBadge.textContent = info.type;

    selectionDiv.classList.remove('hidden');

    saveProgress();
}

// Tooltip hover buffer system - prevents tooltips from closing accidentally
const tooltipTimers = {};

function showTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (!tooltip) return;

    // Cancel any pending hide timer for this tooltip
    if (tooltipTimers[tooltipId]) {
        clearTimeout(tooltipTimers[tooltipId]);
        delete tooltipTimers[tooltipId];
    }

    // Show the tooltip
    tooltip.classList.remove('hidden');

    // Boost the parent card's z-index to ensure tooltip appears above other cards
    const card = tooltip.closest('[id^="maturity-"]');
    if (card) {
        card.style.zIndex = '100';
    }

    // Position the tooltip to prevent off-screen issues
    positionTooltip(tooltip);

    // Add hover listeners to the tooltip itself to keep it open
    if (!tooltip.dataset.listenersAdded) {
        tooltip.addEventListener('mouseenter', () => {
            if (tooltipTimers[tooltipId]) {
                clearTimeout(tooltipTimers[tooltipId]);
                delete tooltipTimers[tooltipId];
            }
        });

        tooltip.addEventListener('mouseleave', () => {
            startHideTimer(tooltipId);
        });

        tooltip.dataset.listenersAdded = 'true';
    }
}

function hideTooltip(tooltipId) {
    // Start a delayed hide (hover buffer)
    startHideTimer(tooltipId);
}

function startHideTimer(tooltipId) {
    // Cancel existing timer
    if (tooltipTimers[tooltipId]) {
        clearTimeout(tooltipTimers[tooltipId]);
    }

    // Set new timer with 300ms grace period
    tooltipTimers[tooltipId] = setTimeout(() => {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            tooltip.classList.add('hidden');

            // Reset the parent card's z-index when tooltip is hidden
            const card = tooltip.closest('[id^="maturity-"]');
            if (card) {
                card.style.zIndex = '';
            }
        }
        delete tooltipTimers[tooltipId];
    }, 300);
}

function positionTooltip(tooltip) {
    // Small delay to ensure tooltip is rendered
    setTimeout(() => {
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check if tooltip goes off right edge
        if (rect.right > viewportWidth - 8) {
            // Flip to left side
            tooltip.classList.remove('left-full', 'ml-2');
            tooltip.classList.add('right-full', 'mr-2');
        }

        // Check if tooltip goes off top
        if (rect.top < 8) {
            tooltip.style.top = '8px';
            tooltip.style.transform = 'translateY(0)';
        }

        // Check if tooltip goes off bottom
        if (rect.bottom > viewportHeight - 8) {
            const newTop = viewportHeight - rect.height - 8;
            tooltip.style.top = newTop + 'px';
            tooltip.style.transform = 'translateY(0)';
        }
    }, 10);
}

function updateEvidence(capabilityId) {
    const textarea = document.getElementById(`evidence-${capabilityId}`);
    appState.step1.capabilities[capabilityId].evidence = textarea.value;
    saveProgress();
}

function createOpportunityDOM(capabilityId, opportunityId) {
    const container = document.getElementById(`opportunities-${capabilityId}`);

    const opportunityCard = document.createElement('div');
    opportunityCard.className = 'border-2 border-gray-300 rounded-lg p-6';
    opportunityCard.id = `opportunity-${capabilityId}-${opportunityId}`;

    opportunityCard.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h5 class="font-semibold text-gray-800">Opportunity ${container.children.length + 1}</h5>
            <button onclick="removeOpportunity('${capabilityId}', ${opportunityId})"
                    class="text-red-600 hover:text-red-800 text-sm">
                Remove
            </button>
        </div>

        <div class="space-y-4">
            <!-- Problem Description -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Problem Description <span class="text-red-600">*</span>
                </label>
                <textarea id="problem-${capabilityId}-${opportunityId}"
                          onchange="updateOpportunity('${capabilityId}', ${opportunityId})"
                          class="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Describe the specific problem or gap that AI could address..."></textarea>
            </div>

            <!-- AI Domains -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">AI Domain(s)</label>
                <p class="text-xs text-gray-600 mb-3 italic">Select the types of AI problems this opportunity addresses. Hover over the info icon for detailed descriptions.</p>
                <div class="grid grid-cols-1 gap-3">
                    <!-- Detection Domain -->
                    <label class="flex items-start space-x-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                        <input type="checkbox" class="mt-1" value="detection"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <div class="font-semibold text-sm text-gray-900">Detection: Anomaly and Fault Detection</div>
                                <div class="relative inline-block ml-2">
                                    <button type="button"
                                            class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                            onmouseenter="showTooltip('detection-info-${capabilityId}-${opportunityId}')"
                                            onmouseleave="hideTooltip('detection-info-${capabilityId}-${opportunityId}')">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div id="detection-info-${capabilityId}-${opportunityId}"
                                         class="hidden absolute z-[10000] w-96 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                                         onmouseenter="showTooltip('detection-info-${capabilityId}-${opportunityId}')"
                                         onmouseleave="hideTooltip('detection-info-${capabilityId}-${opportunityId}')">
                                        <div class="font-semibold mb-2 text-white">Detection: Anomaly and Fault Detection</div>
                                        <p class="mb-2 leading-relaxed">Detection tasks involve identifying unusual patterns or events that could indicate faults, anomalies, or security threats in the grid. Examples include detecting equipment failures, line faults, cyber intrusions, or abnormal grid oscillations.</p>
                                        <p class="mb-2 leading-relaxed">AI-based detection augments traditional alarms by analyzing high-volume sensor data from SCADA, PMU, or smart meter streams to catch subtle issues that rule-based systems might miss.</p>
                                        <div class="mt-2 pt-2 border-t border-gray-700 italic text-gray-300">
                                            Examples: "We don't know about equipment degradation until it fails" or "Cyber threats go undetected in operational networks"
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">Identifying unusual patterns, faults, or security threats</div>
                        </div>
                    </label>

                    <!-- Prediction Domain -->
                    <label class="flex items-start space-x-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                        <input type="checkbox" class="mt-1" value="prediction"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <div class="font-semibold text-sm text-gray-900">Prediction: Forecasting and Proactive Analytics</div>
                                <div class="relative inline-block ml-2">
                                    <button type="button"
                                            class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                            onmouseenter="showTooltip('prediction-info-${capabilityId}-${opportunityId}')"
                                            onmouseleave="hideTooltip('prediction-info-${capabilityId}-${opportunityId}')">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div id="prediction-info-${capabilityId}-${opportunityId}"
                                         class="hidden absolute z-[10000] w-96 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                                         onmouseenter="showTooltip('prediction-info-${capabilityId}-${opportunityId}')"
                                         onmouseleave="hideTooltip('prediction-info-${capabilityId}-${opportunityId}')">
                                        <div class="font-semibold mb-2 text-white">Prediction: Forecasting and Proactive Analytics</div>
                                        <p class="mb-2 leading-relaxed">Prediction tasks involve forecasting future states of grid inputs and outputs to improve planning and dispatch. AI enhances traditional forecasting (demand, load, renewable generation) by learning complex patterns from historical and real-time data while enabling multivariate processing.</p>
                                        <p class="mb-2 leading-relaxed">Applications include failure prognostics, outage forecasting, resource availability prediction (wind and solar), and stability or reliability risk assessment.</p>
                                        <div class="mt-2 pt-2 border-t border-gray-700 italic text-gray-300">
                                            Examples: "We can't forecast load accurately during weather events" or "Asset failures occur without warning"
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">Forecasting future conditions for proactive planning</div>
                        </div>
                    </label>

                    <!-- Control & Optimization Domain -->
                    <label class="flex items-start space-x-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                        <input type="checkbox" class="mt-1" value="control"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <div class="font-semibold text-sm text-gray-900">Control & Optimization: Decision-Making</div>
                                <div class="relative inline-block ml-2">
                                    <button type="button"
                                            class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                            onmouseenter="showTooltip('control-info-${capabilityId}-${opportunityId}')"
                                            onmouseleave="hideTooltip('control-info-${capabilityId}-${opportunityId}')">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div id="control-info-${capabilityId}-${opportunityId}"
                                         class="hidden absolute z-[10000] w-96 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                                         onmouseenter="showTooltip('control-info-${capabilityId}-${opportunityId}')"
                                         onmouseleave="hideTooltip('control-info-${capabilityId}-${opportunityId}')">
                                        <div class="font-semibold mb-2 text-white">Control & Optimization: Decision-Making and Grid Operations</div>
                                        <p class="mb-2 leading-relaxed">Optimization tasks determine the best set of actions or configurations for the grid to meet objectives such as cost minimization, loss reduction, or reliability improvement under operational constraints.</p>
                                        <p class="mb-2 leading-relaxed">AI augments traditional grid optimization by handling high-dimensional decision spaces and adapting to changing conditions in real time. Examples include coordinating voltage regulators and inverters for voltage control, optimizing power dispatch in microgrids, and balancing generation, storage, and loads during peak demand.</p>
                                        <div class="mt-2 pt-2 border-t border-gray-700 italic text-gray-300">
                                            Examples: "Process Z is inefficient and could be optimized" or "Real-time decisions require faster analysis than manual processes allow"
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">Optimizing configurations and operations in real-time</div>
                        </div>
                    </label>

                    <!-- Business & Customer Domain -->
                    <label class="flex items-start space-x-2 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                        <input type="checkbox" class="mt-1" value="business"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <div class="font-semibold text-sm text-gray-900">Business & Customer: Engagement and Enterprise</div>
                                <div class="relative inline-block ml-2">
                                    <button type="button"
                                            class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                            onmouseenter="showTooltip('business-info-${capabilityId}-${opportunityId}')"
                                            onmouseleave="hideTooltip('business-info-${capabilityId}-${opportunityId}')">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div id="business-info-${capabilityId}-${opportunityId}"
                                         class="hidden absolute z-[10000] w-96 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                                         onmouseenter="showTooltip('business-info-${capabilityId}-${opportunityId}')"
                                         onmouseleave="hideTooltip('business-info-${capabilityId}-${opportunityId}')">
                                        <div class="font-semibold mb-2 text-white">Business & Customer Applications: Engagement and Enterprise Functions</div>
                                        <p class="mb-2 leading-relaxed">Business and customer applications leverage AI (particularly generative AI) to improve enterprise operations and customer engagement. Applications range from customer service chatbots and personalized energy recommendations to internal knowledge assistants that help staff quickly access information.</p>
                                        <p class="mb-2 leading-relaxed">While these applications typically carry lower operational risk than grid control functions, they require careful attention to data privacy, output accuracy, and customer satisfaction.</p>
                                        <div class="mt-2 pt-2 border-t border-gray-700 italic text-gray-300">
                                            Examples: "Tasks are manual and repetitive" or "We could personalize customer communications at scale"
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">Enterprise operations and customer-facing applications</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Business Impact -->
            <div>
                <div class="flex items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">Business Impact of AI Application (select all that apply)</label>
                    <div class="relative inline-block ml-2">
                        <button type="button"
                                class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                onmouseenter="showTooltip('impact-info-${capabilityId}-${opportunityId}')"
                                onmouseleave="hideTooltip('impact-info-${capabilityId}-${opportunityId}')">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <div id="impact-info-${capabilityId}-${opportunityId}"
                             class="hidden absolute z-[10000] w-80 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                             onmouseenter="showTooltip('impact-info-${capabilityId}-${opportunityId}')"
                             onmouseleave="hideTooltip('impact-info-${capabilityId}-${opportunityId}')">
                            <div class="font-semibold mb-2">Rate the potential business value of applying AI to this capability.</div>
                            <div class="space-y-2">
                                <div>Consider factors like revenue impact, cost reduction, operational efficiency, competitive advantage, or strategic alignment.</div>
                                <div>This assessment is critical for beginning to establish clear ROI expectations for the AI project.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                    <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="reliability"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Reliability Improvement</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="cost-reduction"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Cost Reduction</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="customer-satisfaction"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Customer Satisfaction</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="operational-efficiency"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Operational Efficiency</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="safety"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Safety Enhancement</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="asset-life"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Asset Life Extension</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="regulatory"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Regulatory Compliance</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="response-time"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Response Time Improvement</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="risk-reduction"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Risk Reduction</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="grid-resilience"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Grid Resilience</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="workforce-productivity"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Workforce Productivity</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" class="business-impact-checkbox" value="revenue-protection"
                                   onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700">Revenue Protection</span>
                        </label>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-300">
                        <label class="flex items-start space-x-2 cursor-pointer">
                            <input type="checkbox" id="other-impact-${capabilityId}-${opportunityId}" class="business-impact-checkbox mt-1" value="other"
                                   onchange="toggleOtherImpact('${capabilityId}', ${opportunityId})">
                            <span class="text-sm text-gray-700 font-medium">Other</span>
                        </label>
                        <textarea id="other-impact-text-${capabilityId}-${opportunityId}"
                                  class="hidden w-full h-16 p-2 mt-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                                  placeholder="Describe other business impacts..."
                                  onchange="updateOpportunity('${capabilityId}', ${opportunityId})"></textarea>
                    </div>
                </div>
            </div>

            <!-- Priority -->
            <div>
                <div class="flex items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">Priority</label>
                    <div class="relative inline-block ml-2">
                        <button type="button"
                                class="text-gray-400 hover:text-blue-600 transition-colors cursor-help"
                                onmouseenter="showTooltip('priority-info-${capabilityId}-${opportunityId}')"
                                onmouseleave="hideTooltip('priority-info-${capabilityId}-${opportunityId}')">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <div id="priority-info-${capabilityId}-${opportunityId}"
                             class="hidden absolute z-[10000] w-64 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-2xl left-full ml-2 top-1/2 -translate-y-1/2 pointer-events-auto"
                             onmouseenter="showTooltip('priority-info-${capabilityId}-${opportunityId}')"
                             onmouseleave="hideTooltip('priority-info-${capabilityId}-${opportunityId}')">
                            <div class="font-semibold mb-2">Priority indicates the business importance:</div>
                            <div class="space-y-2">
                                <div><strong>High:</strong> Critical business need with significant impact</div>
                                <div><strong>Medium:</strong> Important but not urgent</div>
                                <div><strong>Low:</strong> Nice to have, limited immediate impact</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-4">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="priority-${capabilityId}-${opportunityId}" value="high"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <span class="text-sm font-medium text-gray-700">High</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="priority-${capabilityId}-${opportunityId}" value="medium"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <span class="text-sm font-medium text-gray-700">Medium</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="priority-${capabilityId}-${opportunityId}" value="low"
                               onchange="updateOpportunity('${capabilityId}', ${opportunityId})">
                        <span class="text-sm font-medium text-gray-700">Low</span>
                    </label>
                </div>
            </div>
        </div>
    `;

    container.appendChild(opportunityCard);
}

function addOpportunity(capabilityId) {
    const opportunityId = Date.now();

    // Initialize opportunity in state
    if (!appState.step1.capabilities[capabilityId].opportunities) {
        appState.step1.capabilities[capabilityId].opportunities = [];
    }

    appState.step1.capabilities[capabilityId].opportunities.push({
        id: opportunityId,
        problem: '',
        domains: [],
        impacts: [],
        otherImpact: '',
        priority: ''
    });

    // Create the DOM
    createOpportunityDOM(capabilityId, opportunityId);

    saveProgress();
}

function removeOpportunity(capabilityId, opportunityId) {
    if (confirm('Are you sure you want to remove this opportunity?')) {
        // Remove from DOM
        const element = document.getElementById(`opportunity-${capabilityId}-${opportunityId}`);
        element.remove();

        // Remove from state
        const opportunities = appState.step1.capabilities[capabilityId].opportunities;
        const index = opportunities.findIndex(opp => opp.id === opportunityId);
        if (index > -1) {
            opportunities.splice(index, 1);
        }

        // Clean up orphaned data in downstream steps (Steps 2-5)
        cleanupOrphanedData();

        saveProgress();
    }
}

function updateOpportunity(capabilityId, opportunityId) {
    const opportunities = appState.step1.capabilities[capabilityId].opportunities;
    const opportunity = opportunities.find(opp => opp.id === opportunityId);

    if (!opportunity) return;

    // Update problem description
    const problemTextarea = document.getElementById(`problem-${capabilityId}-${opportunityId}`);
    if (problemTextarea) {
        opportunity.problem = problemTextarea.value;
    }

    // Update AI domains
    const domainCheckboxes = document.querySelectorAll(`#opportunity-${capabilityId}-${opportunityId} input[type="checkbox"]:not(.business-impact-checkbox)`);
    opportunity.domains = Array.from(domainCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Update business impacts
    const impactCheckboxes = document.querySelectorAll(`#opportunity-${capabilityId}-${opportunityId} .business-impact-checkbox`);
    opportunity.impacts = Array.from(impactCheckboxes)
        .filter(cb => cb.checked && cb.value !== 'other')
        .map(cb => cb.value);

    // Update other impact text
    const otherImpactText = document.getElementById(`other-impact-text-${capabilityId}-${opportunityId}`);
    if (otherImpactText) {
        opportunity.otherImpact = otherImpactText.value;
    }

    // Update priority
    const priorityRadio = document.querySelector(`input[name="priority-${capabilityId}-${opportunityId}"]:checked`);
    if (priorityRadio) {
        opportunity.priority = priorityRadio.value;
    }

    saveProgress();
}

function toggleOtherImpact(capabilityId, opportunityId) {
    const otherCheckbox = document.getElementById(`other-impact-${capabilityId}-${opportunityId}`);
    const otherTextarea = document.getElementById(`other-impact-text-${capabilityId}-${opportunityId}`);

    if (otherCheckbox && otherTextarea) {
        if (otherCheckbox.checked) {
            otherTextarea.classList.remove('hidden');
        } else {
            otherTextarea.classList.add('hidden');
            otherTextarea.value = '';
        }
    }

    updateOpportunity(capabilityId, opportunityId);
}

function getBusinessImpactLabel(value) {
    const labels = {
        'reliability': 'Reliability Improvement',
        'cost-reduction': 'Cost Reduction',
        'customer-satisfaction': 'Customer Satisfaction',
        'operational-efficiency': 'Operational Efficiency',
        'safety': 'Safety Enhancement',
        'asset-life': 'Asset Life Extension',
        'regulatory': 'Regulatory Compliance',
        'response-time': 'Response Time Improvement',
        'risk-reduction': 'Risk Reduction',
        'grid-resilience': 'Grid Resilience',
        'workforce-productivity': 'Workforce Productivity',
        'revenue-protection': 'Revenue Protection'
    };
    return labels[value] || value;
}

function formatBusinessImpacts(impacts, otherImpact) {
    let impactList = impacts.map(i => getBusinessImpactLabel(i));
    if (otherImpact) {
        impactList.push(`Other: ${otherImpact}`);
    }
    return impactList.join(', ');
}

function completeStep1() {
    // Validate that all capabilities have required data
    const capabilities = appState.step1.capabilities;
    let isValid = true;
    let missingFields = [];

    for (const capId in capabilities) {
        const cap = capabilities[capId];

        if (!cap.maturityLevel) {
            missingFields.push(`${cap.name}: Maturity level not selected`);
            isValid = false;
        }

        if (!cap.evidence || cap.evidence.trim() === '') {
            missingFields.push(`${cap.name}: Evidence/notes not provided`);
            isValid = false;
        }

        if (!cap.opportunities || cap.opportunities.length === 0) {
            missingFields.push(`${cap.name}: No opportunities identified`);
            isValid = false;
        }
    }

    if (!isValid) {
        alert('Please complete all required fields:\n\n' + missingFields.join('\n'));
        return;
    }

    // Mark step as complete
    updateStepStatus(1, 'complete');
    saveProgress();

    // Navigate to Step 2
    navigateToStep(2);
}


