/**
 * COGNITO Step 5 Module
 * Engineering Controls Evaluation
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 *
 */

// ===== STEP 5: ENGINEERING CONTROLS =====

function initializeStep5State() {
    if (!appState.step5) {
        appState.step5 = {
            controls: {},
            complete: false
        };
    }
}

// Framework data
const frameworkData = [
    {
        category: 'ai-governance',
        name: 'NIST AI Risk Management Framework (AI RMF)',
        description: 'Voluntary framework for managing risks associated with AI systems throughout their lifecycle.',
        whenToUse: 'Establishing organizational AI governance programs. Evaluating trustworthiness characteristics including validity, reliability, safety, security, explainability, and accountability.',
        link: 'https://www.nist.gov/itl/ai-risk-management-framework'
    },
    {
        category: 'ai-governance',
        name: 'OECD AI Principles',
        description: 'International principles for responsible stewardship of trustworthy AI.',
        whenToUse: 'Aligning AI strategy with human-centered values, transparency, robustness, and accountability commitments.',
        link: 'https://oecd.ai/en/ai-principles'
    },
    {
        category: 'cybersecurity',
        name: 'NIST Cybersecurity Framework (CSF)',
        description: 'Voluntary framework for managing cybersecurity risk through five core functions: Identify, Protect, Detect, Respond, Recover.',
        whenToUse: 'Integrating AI systems into existing enterprise cybersecurity programs. Establishing baseline security controls.',
        link: 'https://www.nist.gov/cyberframework'
    },
    {
        category: 'cybersecurity',
        name: 'NERC Critical Infrastructure Protection (CIP) Standards',
        description: 'Mandatory reliability standards for protecting bulk electric system cyber assets.',
        whenToUse: 'Required for utilities with CIP-scope systems. Applicable standards: CIP-005 (perimeters), CIP-007 (system security), CIP-008 (incident response), CIP-011 (information protection), CIP-012 (communications), CIP-013 (supply chain).',
        link: 'https://www.nerc.com/standards/reliability-standards/cip'
    },
    {
        category: 'cybersecurity',
        name: 'IEC 62443 Series',
        description: 'International standards for industrial automation and control system security.',
        whenToUse: 'Designing security architectures for OT environments. Defining security levels for control systems. Implementing defense-in-depth for AI systems integrated with SCADA or DCS platforms.',
        link: 'https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards'
    },
    {
        category: 'cybersecurity',
        name: 'OWASP Top 10 for Large Language Models and AI Security',
        description: 'Community-driven guidance on security vulnerabilities specific to AI and machine learning systems.',
        whenToUse: 'Evaluating AI-specific risks including prompt injection, training data poisoning, model theft, insecure output handling. Particularly relevant for generative AI or systems accepting user inputs.',
        link: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/'
    },
    {
        category: 'consequence-engineering',
        name: 'Cyber-Informed Engineering (CIE)',
        description: 'Methodology for designing engineered controls that maintain critical functions during cyber incidents.',
        whenToUse: 'Implementing high-consequence AI applications requiring fail-safe operation. Evaluating interdependencies between IT, OT, and AI systems.',
        link: 'https://inl.gov/cie/'
    },
    {
        category: 'consequence-engineering',
        name: 'DOE Cybersecurity Capability Maturity Model (C2M2)',
        description: 'Tool for evaluating and improving cybersecurity capabilities across OT environments in the energy sector.',
        whenToUse: 'Assessing organizational readiness for AI deployment in critical infrastructure. Establishing baseline cybersecurity practices.',
        link: 'https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2'
    },
    {
        category: 'grid-operations',
        name: 'NERC Standards for System Planning (MOD, TPL Series)',
        description: 'Reliability standards addressing modeling, data requirements, and transmission planning.',
        whenToUse: 'AI applications affecting load forecasting, generation modeling, or system planning functions.',
        link: 'https://www.nerc.com/standards/reliability-standards/tpl'
    },
    {
        category: 'grid-operations',
        name: 'IEEE Standards for Grid Modernization',
        description: 'Technical standards for grid automation, distributed energy resources, and power system communications.',
        whenToUse: 'Implementing AI for DER management, grid control, or smart grid integration. Key standards: IEEE 1547 (DER), IEEE 2030 (interoperability).',
        link: 'https://standards.ieee.org/'
    },
    {
        category: 'vendor-management',
        name: 'NIST Secure Software Development Framework (SSDF)',
        description: 'Guidance for secure software development practices throughout the software development lifecycle.',
        whenToUse: 'Evaluating vendor development practices. Reviewing software bills of materials. Establishing security requirements for custom AI development.',
        link: 'https://csrc.nist.gov/Projects/ssdf'
    },
    {
        category: 'vendor-management',
        name: 'Electricity Subsector Cybersecurity Capability Maturity Model (ES-C2M2)',
        description: 'Electric utility-specific version of C2M2 with tailored guidance on vendor risk management.',
        whenToUse: 'Establishing vendor security assessment processes. Supply chain risk management programs for AI vendors and service providers.',
        link: 'https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2'
    }
];

// Show Step 5
function showStep5() {
    console.log('[showStep5] Initializing Step 5');

    // Refresh opportunities from Step 1 to ensure latest priority values are shown
    loadStep1Summary();

    initializeStep5State();

    // Load context summary
    loadStep5ContextSummary();

    // Load saved control responses
    loadStep5Controls();

    // Initialize frameworks table
    renderFrameworksTable('all');

    // Update progress
    updateStep5Progress();

    console.log('[showStep5] Step 5 initialized');
}

// Load context summary from previous steps
function loadStep5ContextSummary() {
    const container = document.getElementById('step5-context-summary');
    if (!container) return;

    if (!appState.step4.selectedUseCases || appState.step4.selectedUseCases.length === 0) {
        container.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-yellow-800 font-medium">No implementation plans from Step 4</p>
                        <p class="text-sm text-yellow-700 mt-1 mb-3">
                            Step 5 controls are specific to the use cases you're actively implementing. You need to complete Step 4 implementation worksheets before proceeding to Step 5.
                        </p>
                        <button onclick="navigateToStep(4)" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm transition-colors">
                            Go to Step 4
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    let html = '';

    appState.step4.selectedUseCases.forEach(useCaseId => {
        const useCaseData = useCaseCatalog.find(uc => uc.id === useCaseId);
        if (!useCaseData) return;

        const worksheet = appState.step4.worksheets[useCaseId];
        const riskAnalysis = appState.step3.riskAnalyses ? appState.step3.riskAnalyses[useCaseId] : null;

        // Get consequence badge class
        const consequenceBadge = getConsequenceBadgeClass(useCaseData.consequence);

        // Get readiness badge class
        const readinessBadge = getReadinessBadgeClass(useCaseData.readiness);

        // Get risk level badge
        const riskLevelBadges = {
            'Minimal': 'bg-green-100 text-green-800 border-green-300',
            'Low': 'bg-green-100 text-green-800 border-green-300',
            'Moderate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Critical': 'bg-red-100 text-red-800 border-red-300'
        };

        html += `
            <div class="border-2 border-blue-300 rounded-lg bg-white shadow-sm">
                <!-- Use Case Header -->
                <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xl font-bold text-gray-900">${useCaseData.name}</h4>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                            Step 4 Implementation
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">${useCaseData.description}</p>
                    <p class="text-xs text-gray-600 italic">
                        This use case appears here because you completed an implementation worksheet for it in Step 4. The information below is carried forward to inform your control decisions.
                    </p>
                </div>

                <div class="p-6 space-y-6">
                    <!-- Step 2 Information -->
                    <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <div class="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                                    2
                                </div>
                                <h5 class="font-bold text-gray-900 text-lg">From Step 2: Use Case Selection</h5>
                            </div>
                            <button onclick="navigateToStep(2)" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                                Edit in Step 2
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p class="text-xs font-semibold text-gray-600 mb-2">CONSEQUENCE LEVEL</p>
                                <span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${consequenceBadge} border-2 border-current">
                                    ${capitalizeFirst(useCaseData.consequence)} Consequence
                                </span>
                            </div>
                            <div>
                                <p class="text-xs font-semibold text-gray-600 mb-2">TECHNOLOGY READINESS</p>
                                ${formatReadinessBadge(useCaseData.readiness, readinessBadge, 'large')}
                            </div>
                        </div>
                    </div>

                    <!-- Step 3 Risk Analysis -->
                    ${riskAnalysis ? `
                    <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <div class="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                                    3
                                </div>
                                <h5 class="font-bold text-gray-900 text-lg">From Step 3: Risk Analysis</h5>
                            </div>
                            <button onclick="navigateToStep(3)" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                                Edit in Step 3
                            </button>
                        </div>

                        <!-- Risk Characterization -->
                        <div class="mb-4">
                            <p class="text-xs font-semibold text-gray-600 mb-2">RISK CHARACTERIZATION</p>
                            <div class="bg-white rounded-lg p-4 border border-purple-200">
                                <div class="flex items-center space-x-4">
                                    <div>
                                        <p class="text-xs text-gray-600 mb-1">Overall Risk Level</p>
                                        <span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${riskLevelBadges[riskAnalysis.riskLevel] || 'bg-gray-100 text-gray-800'} border-2">
                                            ${riskAnalysis.riskLevel} Risk
                                        </span>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-600 mb-1">Total Risk Score</p>
                                        <p class="text-2xl font-bold text-gray-900">${riskAnalysis.totalScore}/45</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- System Boundaries -->
                        ${riskAnalysis.systemBoundaries && (riskAnalysis.systemBoundaries.aiDecisions || riskAnalysis.systemBoundaries.humanDecisions || riskAnalysis.systemBoundaries.alertConditions || riskAnalysis.systemBoundaries.worstCase) ? `
                        <div class="mb-4">
                            <p class="text-xs font-semibold text-gray-600 mb-2">SYSTEM BOUNDARIES & DECISION AUTHORITY</p>
                            <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                                ${riskAnalysis.systemBoundaries.aiDecisions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What decisions or actions will the AI system make?</p>
                                    <p class="text-sm text-gray-700 mt-1">${riskAnalysis.systemBoundaries.aiDecisions}</p>
                                </div>
                                ` : ''}
                                ${riskAnalysis.systemBoundaries.humanDecisions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What decisions remain with human operators?</p>
                                    <p class="text-sm text-gray-700 mt-1">${riskAnalysis.systemBoundaries.humanDecisions}</p>
                                </div>
                                ` : ''}
                                ${riskAnalysis.systemBoundaries.alertConditions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Under what conditions should the AI stop and alert humans?</p>
                                    <p class="text-sm text-gray-700 mt-1">${riskAnalysis.systemBoundaries.alertConditions}</p>
                                </div>
                                ` : ''}
                                ${riskAnalysis.systemBoundaries.worstCase ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What is the worst operational state if the AI fails completely?</p>
                                    <p class="text-sm text-gray-700 mt-1">${riskAnalysis.systemBoundaries.worstCase}</p>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Failure Modes -->
                        ${riskAnalysis.failureModes && ((riskAnalysis.failureModes.availability && riskAnalysis.failureModes.availability.enabled) || (riskAnalysis.failureModes.accuracy && riskAnalysis.failureModes.accuracy.enabled) || (riskAnalysis.failureModes.latency && riskAnalysis.failureModes.latency.enabled)) ? `
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">FAILURE MODE IDENTIFICATION</p>
                            <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                                ${(riskAnalysis.failureModes.availability && riskAnalysis.failureModes.availability.enabled) ? `
                                <div class="border-l-4 border-red-500 pl-3">
                                    <p class="text-sm font-bold text-gray-900 mb-2">Availability Failure (System Goes Down)</p>
                                    ${riskAnalysis.failureModes.availability.how ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">How could this occur?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.availability.how}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.availability.impact ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">What's the impact if it's unavailable?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.availability.impact}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.availability.detect ? `
                                    <div>
                                        <p class="text-xs font-medium text-gray-500">How would you detect it?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.availability.detect}</p>
                                    </div>
                                    ` : ''}
                                </div>
                                ` : ''}

                                ${(riskAnalysis.failureModes.accuracy && riskAnalysis.failureModes.accuracy.enabled) ? `
                                <div class="border-l-4 border-orange-500 pl-3">
                                    <p class="text-sm font-bold text-gray-900 mb-2">Accuracy Failure (Wrong Outputs Produced)</p>
                                    ${riskAnalysis.failureModes.accuracy.how ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">How could this occur?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.accuracy.how}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.accuracy.impact ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">What's the impact of wrong outputs?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.accuracy.impact}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.accuracy.detect ? `
                                    <div>
                                        <p class="text-xs font-medium text-gray-500">How would you detect it?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.accuracy.detect}</p>
                                    </div>
                                    ` : ''}
                                </div>
                                ` : ''}

                                ${(riskAnalysis.failureModes.latency && riskAnalysis.failureModes.latency.enabled) ? `
                                <div class="border-l-4 border-yellow-500 pl-3">
                                    <p class="text-sm font-bold text-gray-900 mb-2">Speed/Latency Failure (Unacceptably Slow Response)</p>
                                    ${riskAnalysis.failureModes.latency.how ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">How could this occur?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.latency.how}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.latency.impact ? `
                                    <div class="mb-2">
                                        <p class="text-xs font-medium text-gray-500">What's the impact of slow response?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.latency.impact}</p>
                                    </div>
                                    ` : ''}
                                    ${riskAnalysis.failureModes.latency.detect ? `
                                    <div>
                                        <p class="text-xs font-medium text-gray-500">How would you detect it?</p>
                                        <p class="text-sm text-gray-700 mt-1">${riskAnalysis.failureModes.latency.detect}</p>
                                    </div>
                                    ` : ''}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                    ` : `
                    <div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div class="flex-1">
                                <p class="text-sm font-semibold text-blue-900 mb-1">No Risk Analysis for This Use Case</p>
                                <p class="text-sm text-blue-700 mb-3">Consider your consequence level when documenting control requirements.</p>
                                <button onclick="navigateToStep(3)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    Complete Risk Analysis in Step 3
                                </button>
                            </div>
                        </div>
                    </div>
                    `}

                    <!-- Step 4 Implementation Approach -->
                    ${worksheet && worksheet.buildBuyDecision && worksheet.buildBuyDecision.finalDecision ? `
                    <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <div class="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                                    4
                                </div>
                                <h5 class="font-bold text-gray-900 text-lg">From Step 4: Implementation Approach</h5>
                            </div>
                            <button onclick="navigateToStep(4)" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                                Edit in Step 4
                            </button>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-600 mb-2">IMPLEMENTATION STRATEGY</p>
                            <span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-orange-200 text-orange-900 border-2 border-orange-400">
                                ${worksheet.buildBuyDecision.finalDecision} Approach
                            </span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Load saved control responses
function loadStep5Controls() {
    const controlIds = [
        'eng-1', 'eng-2', 'eng-3', 'eng-4', 'eng-5',
        'ops-1', 'ops-2', 'ops-3', 'ops-4',
        'gov-1', 'gov-2', 'gov-3', 'gov-4'
    ];

    controlIds.forEach(id => {
        const textarea = document.getElementById(`control-${id}`);
        if (textarea && appState.step5.controls && appState.step5.controls[id]) {
            textarea.value = appState.step5.controls[id];
        }
    });
}

// Save Step 5 control response
function saveStep5Control(controlId, value) {
    if (!appState.step5.controls) {
        appState.step5.controls = {};
    }
    appState.step5.controls[controlId] = value;
    saveProgress();
    updateStep5Progress();
}

// Update progress indicator
function updateStep5Progress() {
    const total = 13;
    let completed = 0;

    if (appState.step5.controls) {
        Object.values(appState.step5.controls).forEach(value => {
            if (value && value.trim() !== '') {
                completed++;
            }
        });
    }

    const progressText = document.getElementById('step5-progress-text');
    if (progressText) {
        progressText.textContent = `You have documented responses for ${completed} of ${total} control questions`;
    }
}

// Toggle category section
// Switch between control tabs in Step 5
function switchControlTab(tabName) {
    // Hide all tab contents
    const tabs = ['engineering', 'operational', 'governance'];
    tabs.forEach(tab => {
        const content = document.getElementById(`${tab}-tab`);
        const button = document.querySelector(`.control-tab[onclick*="${tab}"]`);
        if (content) {
            content.classList.remove('active');
        }
        if (button) {
            button.classList.remove('active');
        }
    });

    // Show selected tab
    const selectedContent = document.getElementById(`${tabName}-tab`);
    const selectedButton = document.querySelector(`.control-tab[onclick*="${tabName}"]`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Toggle Implementation Context Summary visibility
function toggleImplementationContext() {
    const content = document.getElementById('implementation-context-content');
    const chevron = document.getElementById('implementation-context-chevron');

    if (!content || !chevron) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

// Toggle Framework Reference visibility
function toggleFrameworkReference() {
    const content = document.getElementById('framework-reference-content');
    const chevron = document.getElementById('framework-reference-chevron');

    if (!content || !chevron) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

function toggleCategory(category) {
    const content = document.getElementById(`${category}-controls`);
    const chevron = document.getElementById(`${category}-chevron`);

    if (!content || !chevron) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

// Filter frameworks table
function filterFrameworks(category) {
    // Update button styles
    const buttons = ['all', 'ai-governance', 'cybersecurity', 'consequence-engineering', 'grid-operations', 'vendor-management'];
    buttons.forEach(btn => {
        const button = document.getElementById(`filter-${btn}`);
        if (button) {
            if (btn === category) {
                button.className = 'px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors';
            } else {
                button.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors';
            }
        }
    });

    // Render filtered table
    renderFrameworksTable(category);
}

// Render frameworks table
function renderFrameworksTable(category) {
    const tbody = document.getElementById('frameworks-table-body');
    if (!tbody) return;

    const filtered = category === 'all'
        ? frameworkData
        : frameworkData.filter(f => f.category === category);

    // Category badges
    const categoryBadges = {
        'ai-governance': '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">AI Governance</span>',
        'cybersecurity': '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">Cybersecurity</span>',
        'consequence-engineering': '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">Consequence Engineering</span>',
        'grid-operations': '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">Grid Operations</span>',
        'vendor-management': '<span class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">Vendor Management</span>'
    };

    let html = '';

    filtered.forEach(framework => {
        html += `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-4 align-top">
                    <div class="font-semibold text-gray-900 text-sm mb-2">${framework.name}</div>
                    ${categoryBadges[framework.category]}
                </td>
                <td class="px-4 py-4 align-top">
                    <div class="space-y-2">
                        <div>
                            <p class="text-sm text-gray-700 leading-relaxed">${framework.description}</p>
                        </div>
                        <div class="pt-1 border-t border-gray-100">
                            <p class="text-xs font-semibold text-gray-500 mb-1">WHEN TO USE:</p>
                            <p class="text-xs text-gray-600 leading-relaxed">${framework.whenToUse}</p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-center align-top">
                    <a href="${framework.link}" target="_blank" class="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Complete Step 5
function completeStep5() {
    // Mark Step 5 as complete
    appState.step5.complete = true;
    saveProgress();

    // Update navigation status
    updateStepStatus(5, 'complete');

    // Show custom completion modal
    showCompletionModal();
}

// Show completion modal
function showCompletionModal() {
    const modal = document.getElementById('completion-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

// Close completion modal
function closeCompletionModal() {
    const modal = document.getElementById('completion-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Proceed to summary from completion modal
function proceedToSummary() {
    closeCompletionModal();
    showSummary();
}

// Update Step 5 UI when navigating to this step
function updateStep5UI() {
    initializeStep5State();
    showStep5();
}

