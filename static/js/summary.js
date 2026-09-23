/**
 * COGNITO Summary Module
 * Summary page generation and display
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// ============================================================================
// SUMMARY PAGE FUNCTIONS
// ============================================================================

function showSummary() {
    // Show summary page (it's a full-screen overlay)
    document.getElementById('summary-page').classList.remove('hidden');

    // Hide sidebar and toggle button on summary page for full-screen view
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('sidebar-toggle').style.display = 'none';

    // Set date
    document.getElementById('summary-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Generate content
    generateSummaryContent();

    // Scroll to top
    window.scrollTo(0, 0);

    // Also scroll the summary page itself to top
    document.getElementById('summary-page').scrollTop = 0;
}

// Generate Summary Content
function generateSummaryContent() {
    const container = document.getElementById('summary-content');
    if (!container) return;

    let html = '';

    // Introduction
    html += `
        <div class="bg-white rounded-lg border border-gray-200 p-8 avoid-break">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">About the COGNITO Framework</h2>
            <div class="prose max-w-none text-gray-700 space-y-4">
                <p class="leading-relaxed">
                    Developed by Idaho National Laboratory (INL), the COGNITO Framework provides a structured method for assessing AI readiness in the electric power sector.
                    It enables utilities to evaluate the technical, organizational, and governance factors that determine whether AI can be implemented responsibly.
                    The framework guides users through a five-step process that progresses from defining opportunities to planning risk controls:
                </p>
                <ol class="space-y-2 ml-6 list-decimal">
                    <li><strong>Identify Business Context:</strong> Map current business capabilities to identify where AI may be implemented to fix pain points, improve processes, or scale operations.</li>
                    <li><strong>Align AI Use Cases:</strong> Match opportunities to specific, technically achievable AI applications while considering a consequence-informed approach.</li>
                    <li><strong>Analyze AI Principles:</strong> Evaluate an organization's readiness across six principles while documenting capabilities, gaps, and risk indicators.</li>
                    <li><strong>Implementation Planning & Readiness Validation:</strong> Create a realistic implementation scenario that maps the path to progress from current-state to future-state operations, determine which implementation approach best meets the organization's needs, and validate that resources are prepared to execute implementation.</li>
                    <li><strong>Evaluate Engineering Controls & Mitigations:</strong> Utilize consequence analysis to identify appropriate safeguards across engineering, operational, and governance domains.</li>
                </ol>
                <p class="leading-relaxed">
                    The objective of COGNITO is to provide a structured process utilities can use to identify where AI is feasible, where capability gaps exist, and what level of oversight is required for responsible deployment.
                    COGNITO produces tangible outputs including a business capability assessment, a list of prioritized AI use cases, an organizational readiness evaluation, a detailed AI Scenario Outline, and considerations for controls and mitigations.
                </p>
            </div>
        </div>
    `;

    // Assessment Summary Stats - Calculate business capabilities assessed
    let capabilitiesAssessed = 0;
    let opportunitiesIdentified = 0;
    if ((appState.step1 && appState.step1.capabilities)) {
        capabilitiesAssessed = Object.keys(appState.step1.capabilities).length;
        Object.keys(appState.step1.capabilities || {}).forEach(capId => {
            const cap = appState.step1.capabilities[capId];
            if (cap.opportunities && Array.isArray(cap.opportunities)) {
                opportunitiesIdentified += cap.opportunities.length;
            }
        });
    }

    html += `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-8 avoid-break">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Assessment Completion Summary</h2>
            <div class="grid grid-cols-2 gap-6">
                <div class="text-center p-6 bg-white rounded-lg border-2 border-blue-300">
                    <div class="text-4xl font-bold text-blue-600">${capabilitiesAssessed}</div>
                    <div class="text-sm text-gray-600 mt-2 font-medium">Business Capabilities Assessed</div>
                </div>
                <div class="text-center p-6 bg-white rounded-lg border-2 border-blue-300">
                    <div class="text-4xl font-bold text-blue-600">${opportunitiesIdentified}</div>
                    <div class="text-sm text-gray-600 mt-2 font-medium">Opportunities Identified</div>
                </div>
            </div>
        </div>
    `;

    // Step 1: Business Context
    html += generateStep1Summary();

    // Step 2: Use Cases
    html += generateStep2Summary();

    // Step 3: Principles Analysis
    html += generateStep3Summary();

    // Step 4: Implementation Planning & Readiness Validation
    html += generateStep4Summary();

    // Step 5: Evaluate Engineering Controls & Mitigations
    html += generateStep5Summary();

    // Conclusion
    html += `
        <div class="bg-white rounded-lg border border-gray-200 p-8 avoid-break">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
            <div class="prose max-w-none text-gray-700 space-y-4">
                <p class="leading-relaxed">
                    This assessment provides a comprehensive evaluation of your organization's AI readiness. The documented findings should be reviewed
                    by key stakeholders and used to inform strategic decisions about AI implementation.
                </p>
                <p class="font-semibold text-gray-900">Recommended Actions:</p>
                <ul class="space-y-2 ml-6">
                    <li>Review identified gaps and develop remediation plans</li>
                    <li>Prioritize use cases based on business value and organizational readiness</li>
                    <li>Secure necessary resources and executive sponsorship</li>
                    <li>Establish governance structures for AI oversight</li>
                    <li>Begin pilot implementation with appropriate controls</li>
                </ul>
                <p class="text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
                    <strong>For more information:</strong> Visit <a href="https://csdet.inl.gov/" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">Idaho National Laboratory's Center for Securing Digital Energy Technology (CSDET)</a>
                   .
                </p>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Generate Step 1 Summary
function generateStep1Summary() {
    const capabilities = (appState.step1 && appState.step1.capabilities) || {};
    const capabilityKeys = Object.keys(capabilities);

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Step 1: Business Context Assessment</h2>
                <button onclick="navigateToStep(1)" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 1</button>
            </div>

            <div class="mb-6 p-4 bg-blue-100 border-l-4 border-blue-600">
                <p class="text-sm text-gray-800">
                    <strong>About This Step:</strong> Step 1 assesses current organizational capabilities to identify where AI can deliver value.
                    Each capability area is rated for <strong>maturity</strong> (how well-established current processes are) and classified by
                    <strong>opportunity type</strong> (whether AI should fix problems, optimize existing processes, or enhance what's working well).
                    Specific opportunities are then documented with their business impact and relevant AI application domains.
                </p>
            </div>
    `;

    if (capabilityKeys.length === 0) {
        html += `<p class="text-gray-500 italic">No capability assessments completed.</p>`;
    } else {
        // Count total opportunities
        let totalOpportunities = 0;
        capabilityKeys.forEach(capId => {
            const cap = capabilities[capId];
            if (cap.opportunities) {
                totalOpportunities += cap.opportunities.length;
            }
        });

        html += `
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Capabilities Assessed</p>
                        <p class="text-2xl font-bold text-blue-600">${capabilityKeys.length}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Opportunities Identified</p>
                        <p class="text-2xl font-bold text-blue-600">${totalOpportunities}</p>
                    </div>
                </div>
            </div>
        `;

        // Show each capability in detail
        capabilityKeys.forEach((capId, idx) => {
            const cap = capabilities[capId];
            const maturityLabel = getMaturityLabel(cap.maturityLevel);
            const maturityDesc = getMaturityDescription(cap.maturityLevel);
            const oppTypeLabel = getOpportunityTypeLabel(cap.opportunityType);
            const oppTypeDesc = getOpportunityTypeDescription(cap.opportunityType);

            html += `
                <div class="mb-8 border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 page-break avoid-break">
                    <h3 class="font-bold text-xl text-gray-900 mb-2">${idx + 1}. ${cap.name}</h3>

                    ${cap.description ? `
                        <div class="mb-4 p-3 bg-white rounded border border-gray-200">
                            <p class="text-xs font-semibold text-gray-500 mb-1">CAPABILITY DESCRIPTION</p>
                            <p class="text-sm text-gray-700 italic">${cap.description}</p>
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="p-3 bg-white rounded border border-gray-200">
                            <p class="text-xs font-semibold text-gray-500 mb-1">MATURITY SCORE</p>
                            <p class="text-xs text-gray-600 italic mb-2">Rating of how well-established and reliable current processes are (1=Ad-Hoc, 2=Repeatable, 3=Standardized, 4=Measured, 5=Optimized). Higher scores indicate more mature processes that may benefit from AI enhancement, while lower scores suggest opportunities for AI to establish foundational capabilities.</p>
                            <p class="text-lg font-bold text-gray-900 mb-2">${cap.maturityLevel ? `${cap.maturityLevel}/5 - ${maturityLabel}` : 'Not assessed'}</p>
                            ${maturityDesc ? `<p class="text-xs text-gray-600 italic">${maturityDesc}</p>` : ''}
                        </div>
                        <div class="p-3 bg-white rounded border border-gray-200">
                            <p class="text-xs font-semibold text-gray-500 mb-1">OPPORTUNITY TYPE</p>
                            <p class="text-xs text-gray-600 italic mb-2">Classification determining how AI should be applied based on current maturity level. FOUNDATIONAL (scores 1-2) indicates AI may help establish reliable processes; Optimize (score 3) suggests AI can improve standardized but inefficient processes; Enhance/Scale (scores 4-5) means AI can expand capabilities of already high-performing operations.</p>
                            <p class="text-lg font-bold text-gray-900 mb-2">${oppTypeLabel}</p>
                            ${oppTypeDesc ? `<p class="text-xs text-gray-600 italic">${oppTypeDesc}</p>` : ''}
                        </div>
                    </div>

                    ${cap.evidence ? `
                        <div class="mb-4 p-3 bg-white rounded border border-gray-200">
                            <p class="text-xs font-semibold text-gray-500 mb-1">CURRENT STATE EVIDENCE / NOTES</p>
                            <p class="text-sm text-gray-700">${cap.evidence}</p>
                        </div>
                    ` : ''}

                    ${cap.opportunities && cap.opportunities.length > 0 ? `
                        <div>
                            <p class="text-xs font-semibold text-gray-500 mb-2">IDENTIFIED OPPORTUNITIES</p>
                            <p class="text-xs text-gray-600 mb-3 italic">Specific business problems, process inefficiencies, bottlenecks, or enhancement areas where AI implementation could deliver measurable value. Each opportunity is prioritized (High/Medium/Low) based on business impact, strategic alignment, and urgency. Opportunities are mapped to relevant AI domains and categorized by expected business benefits.</p>
                            <div class="space-y-3">
                                ${cap.opportunities.map((opp, oppIdx) => `
                                    <div class="bg-white p-4 rounded border border-gray-300">
                                        <div class="flex items-start justify-between mb-2">
                                            <p class="text-sm font-bold text-gray-900">${oppIdx + 1}. ${opp.problem || 'Opportunity'}</p>
                                            <span class="text-xs px-2 py-1 rounded font-semibold bg-gray-100 text-gray-800">${opp.priority || 'Not Set'} Priority</span>
                                        </div>
                                        ${(opp.impacts && opp.impacts.length > 0) || opp.otherImpact ? `
                                            <div class="mb-2">
                                                <p class="text-xs font-semibold text-gray-500">Business Impact:</p>
                                                <p class="text-xs text-gray-600 italic mb-1">Categories of organizational value this opportunity could deliver, including operational improvements (Cost Reduction, Reliability Improvement, Safety Enhancement), customer-facing benefits (Customer Satisfaction, Service Quality), and strategic advantages (Regulatory Compliance, Competitive Advantage, Innovation Enablement).</p>
                                                <p class="text-sm text-gray-700">${formatBusinessImpacts(opp.impacts || [], opp.otherImpact || '')}</p>
                                            </div>
                                        ` : ''}
                                        ${opp.domains && opp.domains.length > 0 ? `
                                            <div>
                                                <p class="text-xs font-semibold text-gray-500 mb-1">AI Domains:</p>
                                                <p class="text-xs text-gray-600 italic mb-2">Fundamental types of AI problems this opportunity addresses. Detection identifies unusual patterns and threats; Prediction forecasts future states for proactive planning; Control & Optimization determines best actions for operational efficiency; Business & Customer enhances enterprise operations and customer engagement. Each domain description below provides specific applications and examples relevant to electric utility operations.</p>
                                                <div class="space-y-3">
                                                    ${opp.domains.map(domain => `
                                                        <div class="bg-purple-50 border-l-4 border-purple-500 rounded p-3">
                                                            <div class="text-sm font-semibold text-purple-900 mb-2">${getDomainFullName(domain)}</div>
                                                            <div class="text-xs text-gray-700 leading-relaxed">${getDomainDescription([domain])}</div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        // End of capabilities loop
    }

    html += `</div>`;
    return html;
}

function getMaturityLabel(score) {
    switch(parseInt(score)) {
        case 1: return 'Ad-Hoc';
        case 2: return 'Repeatable';
        case 3: return 'Standardized';
        case 4: return 'Measured';
        case 5: return 'Optimized';
        default: return 'Not Assessed';
    }
}

function getOpportunityTypeLabel(type) {
    switch(type) {
        case 'F': return 'FOUNDATIONAL';
        case 'O': return 'Optimize';
        case 'E': return 'Enhance/Scale';
        default: return 'Not Specified';
    }
}

function getMaturityDescription(score) {
    switch(parseInt(score)) {
        case 1: return 'Processes are poorly defined or undocumented, with success depending on individual effort rather than standardized procedures. Outcomes are unpredictable and inconsistent due to reactive problem-solving approaches, and no formal performance metrics exist.';
        case 2: return 'Basic processes exist and can be repeated, though documentation remains informal or inconsistent. Some performance tracking occurs but is not standardized, outcomes vary by person, and the organization is beginning to establish management practices.';
        case 3: return 'Processes are documented and standardized across the organization with employees following established procedures. Performance metrics are defined and tracked, cross-functional integration exists, and outcomes are generally consistent and predictable.';
        case 4: return 'Processes are measured using statistical and quantitative techniques with data-driven decision-making as standard practice. Performance is monitored and controlled, improvements are based on empirical evidence, and strong performance management systems are in place.';
        case 5: return 'Continuous improvement is embedded in organizational culture with proactive innovation identification. The focus is on preventing problems before they occur through regular refinement based on lessons learned, with agile response to changing conditions.';
        default: return '';
    }
}

function getOpportunityTypeDescription(type) {
    switch(type) {
        case 'F': return 'Low-maturity functions require fundamental improvement and represent areas where AI may help establish more reliable processes or transform workflows that currently depend heavily on individual expertise.';
        case 'O': return 'Standardized but inefficient functions have established processes with identifiable bottlenecks or performance gaps that AI could address through better resource allocation, scheduling, or decision support.';
        case 'E': return 'High-performing functions operate reliably but could benefit from AI to handle increased complexity, expand capabilities, or maintain performance as demands grow.';
        default: return '';
    }
}

function getDomainDescription(domains) {
    if (!domains || domains.length === 0) return '';

    const descriptions = {
        'detection': 'Detection tasks involve identifying unusual patterns or events that could indicate faults, anomalies, or security threats in the grid. Examples include detecting equipment failures, line faults, cyber intrusions, or abnormal grid oscillations. AI-based detection augments traditional alarms by analyzing high-volume sensor data from SCADA, PMU, or smart meter streams to catch subtle issues that rule-based systems might miss.',
        'Detection': 'Detection tasks involve identifying unusual patterns or events that could indicate faults, anomalies, or security threats in the grid. Examples include detecting equipment failures, line faults, cyber intrusions, or abnormal grid oscillations. AI-based detection augments traditional alarms by analyzing high-volume sensor data from SCADA, PMU, or smart meter streams to catch subtle issues that rule-based systems might miss.',
        'prediction': 'Prediction tasks involve forecasting future states of grid inputs and outputs to improve planning and dispatch. AI enhances traditional forecasting (demand, load, renewable generation) by learning complex patterns from historical and real-time data while enabling multivariate processing. Applications include failure prognostics, outage forecasting, resource availability prediction (wind and solar), and stability or reliability risk assessment.',
        'Prediction': 'Prediction tasks involve forecasting future states of grid inputs and outputs to improve planning and dispatch. AI enhances traditional forecasting (demand, load, renewable generation) by learning complex patterns from historical and real-time data while enabling multivariate processing. Applications include failure prognostics, outage forecasting, resource availability prediction (wind and solar), and stability or reliability risk assessment.',
        'control': 'Optimization tasks determine the best set of actions or configurations for the grid to meet objectives such as cost minimization, loss reduction, or reliability improvement under operational constraints. AI augments traditional grid optimization by handling high-dimensional decision spaces and adapting to changing conditions in real time. Examples include coordinating voltage regulators and inverters for voltage control, optimizing power dispatch in microgrids, and balancing generation, storage, and loads during peak demand.',
        'Control & Optimization': 'Optimization tasks determine the best set of actions or configurations for the grid to meet objectives such as cost minimization, loss reduction, or reliability improvement under operational constraints. AI augments traditional grid optimization by handling high-dimensional decision spaces and adapting to changing conditions in real time. Examples include coordinating voltage regulators and inverters for voltage control, optimizing power dispatch in microgrids, and balancing generation, storage, and loads during peak demand.',
        'business': 'Business and customer applications leverage AI (particularly generative AI) to improve enterprise operations and customer engagement. Applications range from customer service chatbots and personalized energy recommendations to internal knowledge assistants that help staff quickly access information. While these applications typically carry lower operational risk than grid control functions, they require careful attention to data privacy, output accuracy, and customer satisfaction.',
        'Business & Customer': 'Business and customer applications leverage AI (particularly generative AI) to improve enterprise operations and customer engagement. Applications range from customer service chatbots and personalized energy recommendations to internal knowledge assistants that help staff quickly access information. While these applications typically carry lower operational risk than grid control functions, they require careful attention to data privacy, output accuracy, and customer satisfaction.'
    };

    const selectedDescs = domains.map(d => descriptions[d]).filter(Boolean);
    return selectedDescs.length > 0 ? selectedDescs.join(' ') : '';
}

function getDomainFullName(domain) {
    const names = {
        'detection': 'Detection: Anomaly and Fault Detection',
        'prediction': 'Prediction: Forecasting and Proactive Analytics',
        'control': 'Control & Optimization: Decision-Making and Grid Operations',
        'business': 'Business & Customer: Engagement and Enterprise Functions'
    };
    return names[domain] || domain;
}

// Generate Step 2 Summary
function generateStep2Summary() {
    // The ACTUAL data is in opportunityMappings, not selectedUseCases!
    const opportunityMappings = (appState.step2 && appState.step2.opportunityMappings) || {};
    const opportunities = (appState.step2 && appState.step2.opportunities) || [];

    // Build a list of selected use cases from the mappings
    const useCaseMap = new Map();

    Object.keys(opportunityMappings).forEach(oppId => {
        const mapping = opportunityMappings[oppId];
        if (mapping && mapping.useCaseId) {
            const useCaseId = mapping.useCaseId;

            // Get catalog data for this use case
            const catalogUseCase = useCaseCatalog.find(cat => cat.id === useCaseId);

            if (catalogUseCase) {
                // If we already have this use case, just add the opportunity to it
                if (!useCaseMap.has(useCaseId)) {
                    useCaseMap.set(useCaseId, {
                        id: catalogUseCase.id,
                        name: catalogUseCase.name,
                        consequence: catalogUseCase.consequence ?
                            catalogUseCase.consequence.charAt(0).toUpperCase() + catalogUseCase.consequence.slice(1) : 'Unknown',
                        readiness: catalogUseCase.readiness || 'Unknown',
                        description: catalogUseCase.description || '',
                        domains: catalogUseCase.domains || [],
                        consequenceJustification: catalogUseCase.justification || '',
                        opportunities: []
                    });
                }

                // Find the opportunity details
                const opp = opportunities.find(o => o.id === oppId);
                if (opp) {
                    useCaseMap.get(useCaseId).opportunities.push({
                        capability: opp.capability,
                        problem: opp.problem,
                        priority: opp.priority
                    });
                }
            }
        }
    });

    const useCases = Array.from(useCaseMap.values());

    if (useCases.length === 0) {
        return `
            <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-900">Step 2: AI Use Cases</h2>
                    <button onclick="navigateToStep(2)" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 2</button>
                </div>
                <p class="text-gray-500 italic">No use cases selected.</p>
            </div>
        `;
    }

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Step 2: AI Use Case Selection</h2>
                <button onclick="navigateToStep(2)" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 2</button>
            </div>

            <div class="mb-6 p-4 bg-purple-100 border-l-4 border-purple-600">
                <p class="text-sm text-gray-800">
                    <strong>About This Step:</strong> Step 2 matches identified opportunities to specific AI applications from a comprehensive use case catalog.
                    Each use case is evaluated on two critical dimensions: <strong>Risk Profile</strong> (what happens if the AI system fails) and
                    <strong>Technology Readiness</strong> (how proven the technology is across the utility industry). This ensures selected use cases
                    align with organizational risk tolerance and implementation capabilities.
                </p>
            </div>

            <p class="text-gray-600 mb-6">Selected ${useCases.length} AI use case${useCases.length !== 1 ? 's' : ''} aligned with organizational capabilities and risk tolerance.</p>
            <div class="space-y-6">
    `;

    useCases.forEach((uc, idx) => {
        // Data is already complete from catalog lookup above
        const name = uc.name;
        const consequence = uc.consequence.charAt(0).toUpperCase() + uc.consequence.slice(1);
        const readiness = uc.readiness;
        const description = uc.description;
        const domains = uc.domains;
        const consequenceJustification = uc.consequenceJustification;

        const consequenceColor = {
            'Low': 'green',
            'Moderate': 'yellow',
            'High': 'orange',
            'Highest': 'red'
        }[consequence] || 'gray';

        const consequenceExplanation = {
            'Low': 'Support functions with limited direct operational impact. Failures result in reduced efficiency or missed optimization opportunities, but do not directly threaten grid stability, service continuity, or safety. Humans remain primary decision-makers.',
            'Moderate': 'Important operations with sufficient time for human review before action. Failures result in financial losses, reliability metric degradation, or suboptimal decisions affecting service quality, but rarely create immediate safety risks or large-scale service interruptions.',
            'High': 'Critical decisions with significant safety or reliability implications. Failures result in extended outages, unsafe operating conditions, compromised asset integrity, or inability to prevent catastrophic events. Direct influence on operational decisions with life-safety implications.',
            'Highest': 'Real-time autonomous control with immediate safety and reliability impacts. Direct autonomous control of grid protection, stability, and operations in milliseconds to seconds. Failure modes include cascading outages, equipment damage, loss of service to large populations, and potential threats to personnel or public safety.'
        }[consequence] || '';

        const readinessExplanation = {
            'Ready Now': 'Proven commercial solutions with demonstrated utility sector success. Commercial solutions exist and are widely deployed across the utility industry. Multiple utilities have implemented the technology and report measurable operational benefits. The technology is considered mature and proven for operational use.',
            'Emerging': 'Early deployments and pilots with validated concepts but limited adoption. Solutions are in pilot programs or early operational deployment. Limited but credible demonstrations and research projects have validated the concept. The technology shows significant promise, but adoption is not yet widespread across the industry.',
            'Future State': 'Research-stage concepts with 3-5+ year timeline to commercial availability. The use case is primarily conceptual or in early research stages with no significant operational deployments. Widespread commercial solutions do not yet exist, and practical adoption at scale is expected in the longer term, typically beyond the next 3-5 years.'
        }[readiness] || '';

        html += `
            <div class="border-l-4 border-${consequenceColor}-500 pl-6 py-4 bg-${consequenceColor}-50 page-break avoid-break">
                <div class="mb-3">
                    <h3 class="font-bold text-xl text-gray-900">${idx + 1}. ${name}</h3>
                </div>

                ${description ? `
                    <div class="mb-3 p-3 bg-white rounded border border-gray-200">
                        <p class="text-xs font-semibold text-gray-500 mb-1">USE CASE DESCRIPTION</p>
                        <p class="text-sm text-gray-700">${description}</p>
                    </div>
                ` : ''}

                ${domains && domains.length > 0 ? `
                    <div class="mb-3 p-3 bg-white rounded border border-gray-200">
                        <p class="text-xs font-semibold text-gray-500 mb-1">AI DOMAINS</p>
                        <div class="flex flex-wrap gap-2 mb-2">
                            ${domains.map(domain => `
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">${domain}</span>
                            `).join('')}
                        </div>
                        <p class="text-xs text-gray-600 italic">${getDomainDescription(domains)}</p>
                    </div>
                ` : ''}

                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="p-3 bg-white rounded border border-gray-200">
                        <p class="text-xs font-semibold text-gray-500 mb-1">USE CASE RISK LEVEL</p>
                        <p class="text-sm font-bold text-gray-900 mb-2">${consequence}</p>
                        <p class="text-xs text-gray-600 italic leading-relaxed">${consequenceExplanation || 'Risk level not specified. This indicates the potential operational, safety, and reliability impacts if the AI system fails or produces incorrect outputs.'}</p>
                    </div>
                    <div class="p-3 bg-white rounded border border-gray-200">
                        <p class="text-xs font-semibold text-gray-500 mb-1">TECHNOLOGY READINESS</p>
                        <p class="text-sm font-bold text-gray-900 mb-2">${readiness}</p>
                        <p class="text-xs text-gray-600 italic leading-relaxed">${readinessExplanation || 'Technology readiness not specified. This indicates how proven and commercially available the technology is across the utility industry.'}</p>
                    </div>
                </div>

                ${consequenceJustification ? `
                    <div class="mb-3 p-3 bg-white rounded border border-gray-200">
                        <p class="text-xs font-semibold text-gray-500 mb-1">WHY THIS CONSEQUENCE LEVEL</p>
                        <p class="text-sm text-gray-700">${consequenceJustification}</p>
                    </div>
                ` : ''}

                ${uc.opportunities && uc.opportunities.length > 0 ? `
                    <div class="p-3 bg-blue-50 rounded border border-blue-200">
                        <p class="text-xs font-semibold text-blue-900 mb-2">
                            ${uc.opportunities.length === 1 ? '✓ SELECTED TO ADDRESS THIS BUSINESS NEED:' : '✓ SELECTED TO ADDRESS THESE BUSINESS NEEDS:'}
                        </p>
                        <div class="space-y-2">
                            ${uc.opportunities.map(opp => `
                                <div class="bg-white p-2 rounded border border-blue-100">
                                    ${opp.capability ? `<p class="text-xs font-semibold text-gray-600 mb-1">${opp.capability}</p>` : ''}
                                    <p class="text-sm text-gray-800">${opp.problem}</p>
                                    ${opp.priority ? `<span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">${opp.priority} Priority</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Generate Step 3 Summary

function generateStep3Summary() {
    const step3 = appState.step3 || {};
    const riskAnalyses = step3.riskAnalyses || {};
    const dataAssessments = step3.dataAssessments || {};
    const principles = step3.principles || {};

    const riskKeys = Object.keys(riskAnalyses);
    const dataKeys = Object.keys(dataAssessments);

    // Question-based principle definitions (used to render readable summaries)
    const principleMeta = {
        'investment-capacity': {
            name: 'Investment Capacity',
            icon: '💰',
            description: 'Financial resources, budget approvals, and multi-year funding commitments for implementation and ongoing operations.',
            questions: [
                'Is budget approved and allocated for this AI initiative, or is funding still under review and contingent on additional approvals?',
                'What is the total estimated cost including infrastructure, personnel, vendor partnerships, data preparation, and ongoing operations?',
                'Is there a multi-year funding plan that includes recurring costs such as model retraining, performance monitoring, and support?',
                'Do executives and stakeholders understand the full cost of ownership including maintenance, monitoring, retraining, and potential scaling?'
            ],
            redFlags: [
                'No dedicated budget exists, funding is uncertain, or approval is contingent on unproven ROI projections',
                'Budget covers only initial deployment without funds allocated for ongoing operations, monitoring, or model maintenance',
                'Total cost of ownership has not been estimated or is significantly underestimated compared to project scope',
                'Funding depends on competing priorities, grant applications, or regulatory rate recovery that has not been approved'
            ]
        },
        'skilled-personnel': {
            name: 'Skilled Personnel',
            icon: '👥',
            description: 'Availability of staff with AI/ML technical skills, domain expertise, and operational experience to develop, deploy, and maintain systems.',
            questions: [
                'Do you have personnel with expertise in machine learning, data engineering, and model validation, or will you need external partners?',
                'Do operational staff have sufficient domain knowledge to interpret AI outputs and identify when results do not align with real-world conditions?',
                'Is there a plan for training, change management, and ongoing workforce development to sustain the AI capability?',
                'Do you have clear ownership for the AI system (product owner, model owner, operations owner) and defined roles/responsibilities?'
            ],
            redFlags: [
                'No internal staff have AI/ML experience and there is no plan/budget to obtain it (hire, train, or partner)',
                'Operational users are expected to rely on AI outputs without training or clear guidance for interpretation and override',
                'No one is accountable for model lifecycle management (monitoring, retraining, validation, decommissioning)',
                'Key personnel are overallocated; the program depends on “hero” effort rather than sustainable resourcing'
            ]
        },
        'regulatory-compliance': {
            name: 'Governance and Compliance',
            icon: '⚖️',
            description: 'Compliance with industry regulations, data privacy requirements, cybersecurity standards, and emerging AI governance expectations.',
            questions: [
                'Have you identified applicable regulations, standards, and internal policies that govern this AI use case (e.g., NERC CIP, privacy, model governance)?',
                'Is there a process to document and audit AI decisions, data lineage, and model changes for compliance and stakeholder review?',
                'Have cybersecurity, legal, and compliance stakeholders reviewed the AI use case and identified required controls before deployment?',
                'Do you have a plan for managing third-party/vendor compliance obligations if you buy or partner for the AI capability?'
            ],
            redFlags: [
                'Regulatory requirements are unclear or assumed; no compliance review has been performed',
                'No audit trail or documentation plan exists for AI decisions, data lineage, or model changes',
                'Cybersecurity/privacy controls are not defined for the AI system and its data flows',
                'Vendor/third-party responsibilities and compliance obligations are not contractually defined'
            ]
        },
        'clear-objectives': {
            name: 'Clear Objectives',
            icon: '🎯',
            description: 'Clear, measurable success criteria with stakeholder alignment on what the AI must accomplish and how success will be determined.',
            questions: [
                'Are the business objectives for this AI use case specific, measurable, and agreed upon by key stakeholders?',
                'Have you defined how AI performance will be evaluated (KPIs, thresholds, validation approach) and who will sign off?',
                'Is the scope and intended operational workflow for using the AI output clearly defined (where, when, by whom, and for what decisions)?',
                'Do you have a plan for monitoring performance over time and revisiting objectives as conditions change?'
            ],
            redFlags: [
                'Objectives are vague (“use AI to improve X”) and success criteria are not measurable',
                'No agreed evaluation plan exists (KPIs, thresholds, validation, sign-off responsibility)',
                'AI output use in operations is unclear; decision rights and workflow are undefined',
                'No plan exists to monitor drift/performance over time or update objectives'
            ]
        }
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function statusBadge(status) {
        const map = {
            'good': { text: '✓ Good', cls: 'bg-green-100 text-green-800' },
            'needs-work': { text: '⚠ Needs Work', cls: 'bg-yellow-100 text-yellow-800' },
            'red-flag': { text: '🚩 Red Flag', cls: 'bg-red-100 text-red-800' },
            'not-sure': { text: '? Not Sure', cls: 'bg-gray-100 text-gray-800' }
        };
        const s = map[status];
        if (!s) return '';
        return `<span class="px-2 py-0.5 rounded text-xs font-semibold ${s.cls}">${s.text}</span>`;
    }

    function riskColorFor(level) {
        const l = String(level || '').toLowerCase();
        if (l === 'low') return { bar: 'border-green-500', bg: 'bg-green-50', pill: 'bg-green-100 text-green-800' };
        if (l === 'medium') return { bar: 'border-yellow-500', bg: 'bg-yellow-50', pill: 'bg-yellow-100 text-yellow-800' };
        if (l === 'high') return { bar: 'border-orange-500', bg: 'bg-orange-50', pill: 'bg-orange-100 text-orange-800' };
        if (l === 'critical') return { bar: 'border-red-600', bg: 'bg-red-50', pill: 'bg-red-100 text-red-800' };
        return { bar: 'border-gray-400', bg: 'bg-gray-50', pill: 'bg-gray-100 text-gray-800' };
    }

    function useCaseDisplayName(useCaseId) {
        // Try to map to catalog name; fall back to raw id
        const uc = (typeof useCaseCatalog !== 'undefined' && Array.isArray(useCaseCatalog))
            ? useCaseCatalog.find(u => u.id === useCaseId)
            : null;
        return (uc && uc.name) || useCaseId || 'Use Case';
    }

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Step 3: AI Readiness Principles Analysis</h2>
                <button onclick="navigateToStep(3)" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 3</button>
            </div>

            <div class="mb-6 p-4 bg-green-100 border-l-4 border-green-600">
                <p class="text-sm text-gray-800">
                    <strong>About This Step:</strong> Step 3 evaluates organizational readiness across six AI readiness principles.
                    The summary below consolidates (1) risk analysis, (2) data & infrastructure readiness, and (3) the remaining
                    organizational principles captured through question-driven assessments.
                </p>
            </div>
    `;

    const hasAnyContent =
        riskKeys.length > 0 ||
        dataKeys.length > 0 ||
        Object.keys(principles || {}).some(k => (principles[k] ? principles[k].assessed : undefined));

    if (!hasAnyContent) {
        html += `<p class="text-gray-500 italic">No Step 3 readiness assessment responses found.</p>`;
        html += `</div>`;
        return html;
    }

    // ============================================================
    // RISK
    // ============================================================
    html += `
        <div class="mt-2 mb-8 page-break avoid-break">
            <h3 class="text-lg font-bold text-gray-900 mb-2">🛡️ Risk</h3>
            <p class="text-gray-600 mb-4">
                Risk characterization and optional deep-dive content (only fields that were completed are shown).
            </p>
    `;

    if (riskKeys.length === 0) {
        html += `<p class="text-gray-500 italic">No risk analyses completed.</p>`;
    } else {
        riskKeys.forEach((useCaseId, idx) => {
            const ra = riskAnalyses[useCaseId] || {};
            const colors = riskColorFor(ra.riskLevel);
            const headerName = escapeHtml(useCaseDisplayName(useCaseId));

            html += `
                <div class="mb-6 border-l-4 ${colors.bar} pl-6 py-4 ${colors.bg} avoid-break">
                    <div class="flex justify-between items-start mb-4">
                        <h4 class="font-bold text-lg text-gray-900">${idx + 1}. ${headerName}</h4>
                        <div class="text-right">
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${colors.pill}">
                                ${escapeHtml(ra.riskLevel || 'Unknown')} Risk
                            </span>
                            ${typeof ra.totalScore !== 'undefined' ? `
                                <div class="text-xs text-gray-700 mt-1">Risk Characterization Score: <strong>${escapeHtml(ra.totalScore)}</strong>/45</div>
                            ` : ''}
                        </div>
                    </div>
            `;

            // Consequence Assessment (detailed scores)
            const cs = ra.consequenceScores || {};
            const consequenceCategoryNames = {
                'service-loss': 'Service Loss Extent',
                'outage-duration': 'Outage Duration',
                'safety-impact': 'Safety Impact',
                'asset-integrity': 'Asset Integrity',
                'privacy-security': 'Privacy/Data Security',
                'data-loss': 'Data Loss',
                'economic-cost': 'Direct Economic Cost',
                'reliability-metrics': 'Reliability Metrics',
                'reputation': 'Reputation Impact'
            };
            const hasConsequenceScores = Object.keys(cs).some(k => !k.endsWith('-notes') && cs[k] > 0);
            if (hasConsequenceScores) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">CONSEQUENCE ASSESSMENT</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200">
                            <div class="grid grid-cols-3 gap-3">
                                ${Object.keys(consequenceCategoryNames).map(catId => {
                                    const score = cs[catId];
                                    const notes = cs[catId + '-notes'];
                                    if (score === undefined || score === 0) return '';
                                    return `
                                        <div class="text-sm">
                                            <span class="text-gray-600">${consequenceCategoryNames[catId]}:</span>
                                            <span class="font-semibold text-gray-800 ml-1">${score}/5</span>
                                            ${notes ? `<p class="text-xs text-gray-500 mt-0.5 italic">${escapeHtml(notes)}</p>` : ''}
                                        </div>
                                    `;
                                }).filter(Boolean).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }

            // System Boundaries & Decision Authority
            const sb = ra.systemBoundaries || {};
            if (sb.aiDecisions || sb.humanDecisions || sb.alertConditions || sb.worstCase) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">SYSTEM BOUNDARIES & DECISION AUTHORITY</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                            ${sb.aiDecisions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What decisions or actions will the AI system make?</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sb.aiDecisions)}</p>
                                </div>
                            ` : ''}
                            ${sb.humanDecisions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What decisions remain with human operators?</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sb.humanDecisions)}</p>
                                </div>
                            ` : ''}
                            ${sb.alertConditions ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Under what conditions should the AI stop and alert humans?</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sb.alertConditions)}</p>
                                </div>
                            ` : ''}
                            ${sb.worstCase ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">What is the worst operational state if the AI fails completely?</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sb.worstCase)}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            // Failure Mode Identification
            const fm = ra.failureModes || {};
            const fmEnabled = ((fm.availability && fm.availability.enabled) || (fm.accuracy && fm.accuracy.enabled) || (fm.latency && fm.latency.enabled));
            if (fmEnabled) {
                const renderFailure = (title, f) => {
                    if (!(f && f.enabled)) return '';
                    const blocks = [];
                    if (f.how) blocks.push(`<div><p class="text-xs font-medium text-gray-500">How could this occur?</p><p class="text-sm text-gray-700 mt-1">${escapeHtml(f.how)}</p></div>`);
                    if (f.impact) blocks.push(`<div><p class="text-xs font-medium text-gray-500">What is the impact?</p><p class="text-sm text-gray-700 mt-1">${escapeHtml(f.impact)}</p></div>`);
                    if (f.detect) blocks.push(`<div><p class="text-xs font-medium text-gray-500">How would you detect it?</p><p class="text-sm text-gray-700 mt-1">${escapeHtml(f.detect)}</p></div>`);
                    if (blocks.length === 0) return '';
                    return `
                        <div class="border-l-4 border-red-500 pl-3">
                            <p class="text-sm font-bold text-gray-900 mb-2">${escapeHtml(title)}</p>
                            <div class="space-y-2">${blocks.join('')}</div>
                        </div>
                    `;
                };

                const failureHtml = [
                    renderFailure('Availability Failure (System Goes Down)', fm.availability),
                    renderFailure('Accuracy Failure (Bad / Misleading Output)', fm.accuracy),
                    renderFailure('Speed/Latency Failure (Too Slow to be Useful)', fm.latency)
                ].filter(Boolean).join('');

                if (failureHtml) {
                    html += `
                        <div class="mb-4">
                            <p class="text-xs font-semibold text-gray-600 mb-2">FAILURE MODE IDENTIFICATION</p>
                            <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                                ${failureHtml}
                            </div>
                        </div>
                    `;
                }
            }

            // Security Considerations (checked threats)
            if (Array.isArray(ra.securityChecks) && ra.securityChecks.length > 0) {
                const items = ra.securityChecks.map(ch => {
                    const td = (typeof threatDescriptions !== 'undefined') ? threatDescriptions[ch.value] : null;
                    const label = (td && td.name) || ch.value;
                    const category = (td && td.category) || ch.category || '';
                    return `<li><span class="font-medium">${escapeHtml(label)}</span>${category ? ` <span class="text-xs text-gray-500">(${escapeHtml(category)})</span>` : ''}</li>`;
                }).join('');

                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">SECURITY CONSIDERATIONS</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200">
                            <ul class="text-sm text-gray-700 list-disc list-inside space-y-1">
                                ${items}
                            </ul>
                        </div>
                    </div>
                `;
            }

            // Mitigation Strategies & Controls
            const mit = ra.mitigations || {};
            const threatMit = ra.threatMitigations || {};
            const hasGeneralMit = (mit.engineering || mit.operational || mit.governance);
            const hasThreatMit = (threatMit && Object.keys(threatMit).length > 0);

            if (hasGeneralMit || hasThreatMit) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">MITIGATION STRATEGIES & CONTROLS</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                            ${mit.engineering ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Engineering Controls</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(mit.engineering)}</p>
                                </div>
                            ` : ''}
                            ${mit.operational ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Operational Controls</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(mit.operational)}</p>
                                </div>
                            ` : ''}
                            ${mit.governance ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Governance Controls</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(mit.governance)}</p>
                                </div>
                            ` : ''}
                            ${hasThreatMit ? `
                                <div class="pt-2 border-t border-gray-200">
                                    <p class="text-xs font-medium text-gray-500 mb-2">Threat-Specific Mitigations</p>
                                    <div class="space-y-2">
                                        ${Object.keys(threatMit).map(k => {
                                            const t = threatMit[k];
                                            if (!(t && t.mitigation)) return '';
                                            return `
                                                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                    <p class="text-sm font-semibold text-gray-800">${escapeHtml(t.threat || k)}</p>
                                                    ${t.category ? `<p class="text-xs text-gray-500 mb-1">${escapeHtml(t.category)}</p>` : ''}
                                                    <p class="text-sm text-gray-700">${escapeHtml(t.mitigation)}</p>
                                                </div>
                                            `;
                                        }).filter(Boolean).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            // Risk of Status Quo
            const sq = ra.statusQuo || {};
            if (sq.currentRisks || sq.missedOpportunities || sq.competitive || sq.inefficiencies) {
                html += `
                    <div class="mb-2">
                        <p class="text-xs font-semibold text-gray-600 mb-2">RISK OF STATUS QUO</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                            ${sq.currentRisks ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Current risks and limitations</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sq.currentRisks)}</p>
                                </div>
                            ` : ''}
                            ${sq.missedOpportunities ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Missed opportunities</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sq.missedOpportunities)}</p>
                                </div>
                            ` : ''}
                            ${sq.competitive ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Competitive / regulatory pressure</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sq.competitive)}</p>
                                </div>
                            ` : ''}
                            ${sq.inefficiencies ? `
                                <div>
                                    <p class="text-xs font-medium text-gray-500">Operational inefficiencies</p>
                                    <p class="text-sm text-gray-700 mt-1">${escapeHtml(sq.inefficiencies)}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        });
    }

    html += `</div>`;

    // ============================================================
    // DATA & INFRASTRUCTURE
    // ============================================================
    html += `
        <div class="mt-8 mb-8 page-break avoid-break">
            <h3 class="text-lg font-bold text-gray-900 mb-2">📊 Data &amp; Infrastructure</h3>
            <p class="text-gray-600 mb-4">
                Consolidated view of the Data Assessment (ideal data profile, source mapping, gaps, integration, governance, and the final readiness decision).
            </p>
    `;

    if (dataKeys.length === 0) {
        html += `<p class="text-gray-500 italic">No data assessments completed.</p>`;
    } else {
        dataKeys.forEach((useCaseId, idx) => {
            const a = dataAssessments[useCaseId] || {};
            const headerName = escapeHtml(useCaseDisplayName(useCaseId));
            const elements = Array.isArray(a.dataElements) ? a.dataElements : [];
            const mappings = a.sourceMappings || {};
            const gaps = a.gapAnalysis || {};
            const integrations = a.integrationAssessments || {};
            const gov = a.governance || {};
            const decision = a.decision || '';
            const justification = a.justification || '';

            const decisionMap = {
                'proceed': { text: 'Proceed ✅', cls: 'bg-green-100 text-green-800' },
                'address-gaps': { text: 'Address Gaps ⚠️', cls: 'bg-yellow-100 text-yellow-800' },
                'reconsider': { text: 'Reconsider ❌', cls: 'bg-red-100 text-red-800' }
            };

            html += `
                <div class="mb-6 border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 avoid-break">
                    <div class="flex justify-between items-start mb-4">
                        <h4 class="font-bold text-lg text-gray-900">${idx + 1}. ${headerName}</h4>
                        ${decision ? `
                            <span class="px-3 py-1 rounded-full text-xs font-bold ${((decisionMap[decision] ? decisionMap[decision].cls : undefined)) || 'bg-gray-100 text-gray-800'}">
                                ${escapeHtml(((decisionMap[decision] ? decisionMap[decision].text : undefined)) || decision)}
                            </span>
                        ` : ''}
                    </div>
            `;

            // Ideal Data Profile
            const definedElements = elements.filter(e => e && e.name && String(e.name).trim() !== '');
            if (definedElements.length > 0) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">IDEAL DATA PROFILE</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                            ${definedElements.map(e => `
                                <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-semibold text-gray-800">${escapeHtml(e.name)}</p>
                                        ${e.critical ? `<span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Critical</span>` : ''}
                                    </div>
                                    ${e.description ? `<p class="text-sm text-gray-700 mt-1">${escapeHtml(e.description)}</p>` : ''}
                                    ${(e.volume || e.volumeOther || e.accuracy || e.accuracyOther) ? `
                                        <div class="text-xs text-gray-600 mt-1 space-y-0.5">
                                            ${(e.volume || e.volumeOther) ? `<div><strong>Volume:</strong> ${escapeHtml(e.volumeOther || e.volume)}</div>` : ''}
                                            ${(e.accuracy || e.accuracyOther) ? `<div><strong>Accuracy:</strong> ${escapeHtml(e.accuracyOther || e.accuracy)}</div>` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Mapped data sources
            const mappedItems = definedElements
                .map(e => {
                    const m = mappings[e.id] || {};
                    const has = m.status || m.sourceSystem || m.quality;
                    return has ? { e, m } : null;
                })
                .filter(Boolean);

            if (mappedItems.length > 0) {
                const statusMap = {
                    'available': { text: '✓ Available', cls: 'bg-green-100 text-green-800' },
                    'derivable': { text: '◐ Derivable', cls: 'bg-blue-100 text-blue-800' },
                    'partial': { text: '⚠ Partial', cls: 'bg-yellow-100 text-yellow-800' },
                    'missing': { text: '✗ Missing', cls: 'bg-red-100 text-red-800' }
                };

                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">MAPPED DATA SOURCES</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                            ${mappedItems.map(({ e, m }) => `
                                <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <p class="text-sm font-semibold text-gray-800">${escapeHtml(e.name)}</p>
                                        ${m.status ? `<span class="px-2 py-0.5 rounded text-xs font-semibold ${((statusMap[m.status] ? statusMap[m.status].cls : undefined)) || 'bg-gray-100 text-gray-800'}">${escapeHtml(((statusMap[m.status] ? statusMap[m.status].text : undefined)) || m.status)}</span>` : ''}
                                    </div>
                                    ${(m.sourceSystem || m.quality) ? `
                                        <div class="text-sm text-gray-700 space-y-1">
                                            ${m.sourceSystem ? `<div><strong>Source System:</strong> ${escapeHtml(m.sourceSystem)}</div>` : ''}
                                            ${m.quality ? `<div><strong>Data Quality Notes:</strong> ${escapeHtml(m.quality)}</div>` : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Gaps
            const gapItems = definedElements
                .map(e => {
                    const m = mappings[e.id] || {};
                    const g = gaps[e.id] || {};
                    const isGap = (m.status === 'partial' || m.status === 'missing');
                    const hasGapInfo = isGap && (g.impact || g.remediation || g.effort);
                    return hasGapInfo ? { e, m, g } : null;
                })
                .filter(Boolean);

            if (gapItems.length > 0) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">GAPS</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                            ${gapItems.map(({ e, m, g }) => `
                                <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <p class="text-sm font-semibold text-gray-800">${escapeHtml(e.name)}</p>
                                        <span class="text-xs font-semibold ${m.status === 'missing' ? 'text-red-600' : 'text-yellow-700'}">
                                            ${m.status === 'missing' ? '✗ Missing' : '⚠ Partial'}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-700 space-y-1">
                                        ${g.impact ? `<div><strong>Impact:</strong> ${escapeHtml(g.impact)}</div>` : ''}
                                        ${g.remediation ? `<div><strong>Remediation Plan:</strong> ${escapeHtml(g.remediation)}</div>` : ''}
                                        ${g.effort ? `<div><strong>Effort / Timeline:</strong> ${getEffortLabel(g.effort)}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Integration Requirements
            const integrationKeys = Object.keys(integrations || {});
            const integrationItems = integrationKeys
                .map(sys => ({ sys, ia: integrations[sys] || {} }))
                .filter(x => x.ia.complexity || x.ia.method || x.ia.methodOther);

            if (integrationItems.length > 0) {
                const cxMap = {
                    'low': { text: 'Low', cls: 'bg-green-100 text-green-800' },
                    'medium': { text: 'Medium', cls: 'bg-yellow-100 text-yellow-800' },
                    'high': { text: 'High', cls: 'bg-red-100 text-red-800' }
                };

                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">INTEGRATION REQUIREMENTS</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                            ${integrationItems.map(({ sys, ia }) => `
                                <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <p class="text-sm font-semibold text-gray-800">🔗 ${escapeHtml(sys)}</p>
                                        ${ia.complexity ? `<span class="px-2 py-0.5 rounded text-xs font-semibold ${((cxMap[ia.complexity] ? cxMap[ia.complexity].cls : undefined)) || 'bg-gray-100 text-gray-800'}">${escapeHtml(((cxMap[ia.complexity] ? cxMap[ia.complexity].text : undefined)) || ia.complexity)} Complexity</span>` : ''}
                                    </div>
                                    <div class="text-sm text-gray-700 space-y-1">
                                        ${(ia.method || ia.methodOther) ? `<div><strong>Method:</strong> ${escapeHtml(ia.methodOther || ia.method)}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Data Governance & Security
            const govItems = Object.keys(gov || {}).map(k => ({ k, v: gov[k] })).filter(x => (x.v && x.v.checked) || ((x.v && x.v.notes) && String(x.v.notes).trim()));
            if (govItems.length > 0) {
                const govLabel = {
                    classification: 'Data Classification',
                    access: 'Access Controls',
                    lineage: 'Lineage & Provenance',
                    privacy: 'Privacy & Consent',
                    security: 'Security Controls',
                    audit: 'Audit & Monitoring'
                };

                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">DATA GOVERNANCE & SECURITY</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-3">
                            ${govItems.map(({ k, v }) => `
                                <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <p class="text-sm font-semibold text-gray-800">${escapeHtml(govLabel[k] || k)}</p>
                                        ${v.checked ? `<span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded font-semibold">Addressed</span>` : `<span class="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded font-semibold">Not Checked</span>`}
                                    </div>
                                    ${v.notes ? `<p class="text-sm text-gray-700">${escapeHtml(v.notes)}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Review & Decision
            if (decision || justification) {
                html += `
                    <div class="mb-2">
                        <p class="text-xs font-semibold text-gray-600 mb-2">REVIEW &amp; DECISION</p>
                        <div class="bg-white rounded-lg p-4 border border-blue-200 space-y-2">
                            ${decision ? `<div class="text-sm text-gray-700"><strong>Decision:</strong> ${escapeHtml(((decisionMap[decision] ? decisionMap[decision].text : undefined)) || decision)}</div>` : ''}
                            ${justification ? `<div class="text-sm text-gray-700"><strong>Justification:</strong> ${escapeHtml(justification)}</div>` : ''}
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        });
    }

    html += `</div>`;

    // ============================================================
    // REMAINING AI PRINCIPLES (question-based)
    // ============================================================
    html += `
        <div class="mt-8 page-break avoid-break">
            <h3 class="text-lg font-bold text-gray-900 mb-2">📌 Other AI Readiness Principles</h3>
            <p class="text-gray-600 mb-4">
                Only completed question responses, notes, selected red flag indicators, and the overall assessment are shown.
            </p>
    `;

    const principleIds = ['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
    const anyPrincipleContent = principleIds.some(pid => (principles && principles[pid] ? principles[pid].assessed : undefined));

    if (!anyPrincipleContent) {
        html += `<p class="text-gray-500 italic">No question-based principle assessments completed.</p>`;
    } else {
        principleIds.forEach((pid, idx) => {
            const p = principles[pid];
            if (!p || !p.assessed) return;

            const meta = principleMeta[pid];
            const qData = p.questions || {};
            const answeredQ = Object.keys(qData).filter(qid => (qData[qid] ? qData[qid].status : undefined) || ((qData[qid] ? qData[qid].notes : undefined) && String(qData[qid].notes).trim()));

            const selectedRedFlags = Array.isArray(p.redFlags)
                ? p.redFlags.map(i => (meta && meta.redFlags ? meta.redFlags[i] : undefined)).filter(Boolean)
                : [];

            const hasOverall = p.gapsIdentified || (p.summaryNotes && String(p.summaryNotes).trim());

            html += `
                <div class="mb-6 border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 avoid-break">
                    <h4 class="font-bold text-lg text-gray-900 mb-2">${(meta && meta.icon) || ''} ${idx + 1}. ${escapeHtml((meta && meta.name) || pid)}</h4>
                    ${(meta && meta.description) ? `<p class="text-xs text-gray-600 italic mb-3">${escapeHtml(meta.description)}</p>` : ''}
            `;

            if (answeredQ.length > 0) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-gray-600 mb-2">COMPLETED QUESTIONS</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                `;

                // Keep question order 1-4
                for (let qNum = 1; qNum <= 4; qNum++) {
                    const qid = `q${qNum}`;
                    const d = qData[qid] || {};
                    const show = d.status || (d.notes && String(d.notes).trim());
                    if (!show) continue;

                    const qText = (meta && meta.questions ? meta.questions[qNum - 1] : undefined) || `Question ${qNum}`;
                    html += `
                        <div class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                            <div class="flex items-start justify-between gap-3">
                                <p class="text-sm font-medium text-gray-800">${qNum}. ${escapeHtml(qText)}</p>
                                ${d.status ? statusBadge(d.status) : ''}
                            </div>
                            ${d.notes ? `<p class="text-sm text-gray-700 mt-2"><strong>Notes:</strong> ${escapeHtml(d.notes)}</p>` : ''}
                        </div>
                    `;
                }

                html += `</div></div>`;
            }

            if (selectedRedFlags.length > 0) {
                html += `
                    <div class="mb-4">
                        <p class="text-xs font-semibold text-red-600 mb-2">🚩 RED FLAG INDICATORS</p>
                        <div class="bg-white rounded-lg p-4 border border-red-200">
                            <ul class="text-sm text-gray-700 list-disc list-inside space-y-1">
                                ${selectedRedFlags.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }

            if (hasOverall) {
                html += `
                    <div>
                        <p class="text-xs font-semibold text-gray-600 mb-2">OVERALL ASSESSMENT</p>
                        <div class="bg-white rounded-lg p-4 border border-purple-200 space-y-2">
                            ${p.gapsIdentified ? `<div class="text-sm text-gray-700"><strong>Gaps identified?</strong> ${escapeHtml(p.gapsIdentified)}</div>` : ''}
                            ${p.summaryNotes ? `<div class="text-sm text-gray-700"><strong>Summary:</strong> ${escapeHtml(p.summaryNotes)}</div>` : ''}
                        </div>
                    </div>
                `;
            }

            if (answeredQ.length === 0 && selectedRedFlags.length === 0 && !hasOverall) {
                html += `<p class="text-sm text-gray-600 italic">Assessment marked complete, but no specific responses were captured.</p>`;
            }

            html += `</div>`;
        });
    }

    html += `</div></div>`;
    return html;
}
// Generate Step 4 Summary
function generateStep4Summary() {
    const worksheets = (appState.step4 && appState.step4.worksheets) || {};
    const worksheetKeys = Object.keys(worksheets);

    const nonEmpty = (v) => v !== undefined && v !== null && String(v).trim() !== '';
    const safe = (v) => escapeHtml(v);

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Step 4: Implementation Planning & Readiness Validation</h2>
                <button onclick="navigateToStep(4)" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 4</button>
            </div>

            <p class="text-sm text-gray-600 mb-6">
                This section includes only the Step 4 worksheet fields (new content) captured for each selected use case. Empty fields are omitted.
            </p>
    `;

    if (worksheetKeys.length === 0) {
        html += `<p class="text-gray-500 italic">Implementation planning not yet started.</p>`;
        html += `</div>`;
        return html;
    }

    let included = 0;

    worksheetKeys.forEach((useCaseId) => {
        const worksheet = worksheets[useCaseId] || {};

        // Display name: prefer Step 2 selection name, then catalog, else id
        let ucName = useCaseId;
        if ((appState.step2 && appState.step2.selectedUseCases) && (appState.step2.selectedUseCases[useCaseId] ? appState.step2.selectedUseCases[useCaseId].name : undefined)) {
            ucName = appState.step2.selectedUseCases[useCaseId].name;
        } else if (typeof useCaseCatalog !== 'undefined' && Array.isArray(useCaseCatalog)) {
            const uc = useCaseCatalog.find(u => u.id === useCaseId);
            if ((uc && uc.name)) ucName = uc.name;
        }

        // Step 4 fields (ONLY)
        const whoAffected = (worksheet.currentState && worksheet.currentState.whoAffected);

        const corePurpose = (worksheet.aiDescription && worksheet.aiDescription.corePurpose);
        const userInteraction = (worksheet.aiDescription && worksheet.aiDescription.userInteraction);
        const scopeBoundaries = (worksheet.aiDescription && worksheet.aiDescription.scopeBoundaries);

        const kpis = Array.isArray(worksheet.kpis)
            ? worksheet.kpis.filter(k =>
                nonEmpty((k && k.metric)) || nonEmpty((k && k.baseline)) || nonEmpty((k && k.target)) || nonEmpty((k && k.timeframe))
            )
            : [];

        const bbd = worksheet.buildBuyDecision || {};
        const hasBuildBuy =
            nonEmpty(bbd.finalDecision) ||
            nonEmpty(bbd.customization) ||
            nonEmpty(bbd.timeline) ||
            nonEmpty(bbd.expertise) ||
            nonEmpty(bbd.budget) ||
            nonEmpty(bbd.risk);

        const hasAny =
            nonEmpty(whoAffected) ||
            nonEmpty(corePurpose) ||
            nonEmpty(userInteraction) ||
            nonEmpty(scopeBoundaries) ||
            kpis.length > 0 ||
            hasBuildBuy;

        if (!hasAny) return;

        included++;

        html += `
            <div class="mb-8 avoid-break">
                <div class="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-gray-50 px-5 py-4">
                        <h3 class="text-lg font-bold text-gray-900">${safe(ucName)}</h3>
</div>

                    <div class="p-5 space-y-6">
                        ${nonEmpty(whoAffected) ? `
                            <div class="bg-white rounded-lg border border-gray-200 p-4">
                                <p class="text-xs font-semibold text-gray-500 mb-2">WHO IS AFFECTED</p>
                                <p class="text-sm text-gray-800">${safe(whoAffected)}</p>
                            </div>
                        ` : ''}

                        ${(nonEmpty(corePurpose) || nonEmpty(userInteraction) || nonEmpty(scopeBoundaries)) ? `
                            <div class="bg-white rounded-lg border border-gray-200 p-4">
                                <p class="text-xs font-semibold text-gray-500 mb-2">AI SOLUTION DESCRIPTION</p>
                                ${nonEmpty(corePurpose) ? `<p class="text-sm text-gray-800 mb-1"><strong>Core purpose:</strong> ${safe(corePurpose)}</p>` : ''}
                                ${nonEmpty(userInteraction) ? `<p class="text-sm text-gray-800 mb-1"><strong>User interaction:</strong> ${safe(userInteraction)}</p>` : ''}
                                ${nonEmpty(scopeBoundaries) ? `<p class="text-sm text-gray-800"><strong>Scope boundaries:</strong> ${safe(scopeBoundaries)}</p>` : ''}
                            </div>
                        ` : ''}

                        ${kpis.length ? `
                            <div class="bg-white rounded-lg border border-gray-200 p-4">
                                <p class="text-xs font-semibold text-gray-500 mb-2">EXPECTED OUTCOMES & KPIs</p>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-sm">
                                        <thead>
                                            <tr class="text-left text-xs text-gray-500 border-b">
                                                <th class="py-2 pr-4">Metric</th>
                                                <th class="py-2 pr-4">Baseline</th>
                                                <th class="py-2 pr-4">Target</th>
                                                <th class="py-2">Timeframe</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y">
                                            ${kpis.map(k => `
                                                <tr>
                                                    <td class="py-2 pr-4 font-medium text-gray-900">${safe(k.metric || '-')}</td>
                                                    <td class="py-2 pr-4 text-gray-700">${safe(k.baseline || '-')}</td>
                                                    <td class="py-2 pr-4 text-gray-700">${safe(k.target || '-')}</td>
                                                    <td class="py-2 text-gray-700">${safe(k.timeframe || '-')}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : ''}

                        ${hasBuildBuy ? `
                            <div class="bg-white rounded-lg border border-gray-200 p-4">
                                <p class="text-xs font-semibold text-gray-500 mb-2">BUILD VS. BUY DECISION SUPPORT</p>
                                ${nonEmpty(bbd.finalDecision) ? `<p class="text-sm text-gray-800 mb-2"><strong>Decision:</strong> ${safe(bbd.finalDecision)}</p>` : ''}
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800">
                                    ${nonEmpty(bbd.customization) ? `<div><span class="font-semibold">Customization:</span> ${safe(bbd.customization)}</div>` : ''}
                                    ${nonEmpty(bbd.timeline) ? `<div><span class="font-semibold">Timeline:</span> ${safe(bbd.timeline)}</div>` : ''}
                                    ${nonEmpty(bbd.expertise) ? `<div><span class="font-semibold">Expertise:</span> ${safe(bbd.expertise)}</div>` : ''}
                                    ${nonEmpty(bbd.budget) ? `<div><span class="font-semibold">Budget:</span> ${safe(bbd.budget)}</div>` : ''}
                                    ${nonEmpty(bbd.risk) ? `<div class="md:col-span-2"><span class="font-semibold">Risk considerations:</span> ${safe(bbd.risk)}</div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    if (included === 0) {
        html += `<p class="text-gray-500 italic">Implementation planning worksheets created but not yet filled out.</p>`;
    } else {
        html += `<p class="text-xs text-gray-500 mt-2 italic">Included ${included} use case${included !== 1 ? 's' : ''} with Step 4 worksheet details.</p>`;
    }

    html += `</div>`;
    return html;
}

// Generate Step 5 Summary
function generateStep5Summary() {
    const controls = (appState.step5 && appState.step5.controls) || {};
    const controlKeys = Object.keys(controls).filter(k => (controls[k] ? controls[k].trim() : ""));

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 p-8 page-break avoid-break">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Step 5: Evaluate Engineering Controls & Mitigations</h2>
                <button onclick="navigateToStep(5)" class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden">Edit Step 5</button>
            </div>

            <div class="mb-6 p-4 bg-purple-100 border-l-4 border-purple-600">
                <p class="text-sm text-gray-800">
                    <strong>About This Step:</strong> Step 5 identifies safeguards, monitoring mechanisms, and governance processes required for
                    responsible AI deployment. Controls are organized into three categories: <strong>Engineering</strong> (system architecture and
                    fail-safes), <strong>Operational</strong> (monitoring and incident response), and <strong>Governance</strong> (oversight and
                    compliance). The rigor of controls scales with consequence levels—higher-risk applications demand more comprehensive safeguards.
                </p>
            </div>
    `;

    if (controlKeys.length === 0) {
        html += `<p class="text-gray-500 italic">No control responses documented.</p>`;
    } else {
        html += `<p class="text-gray-600 mb-6">Documented ${controlKeys.length} of 13 control questions across engineering, operational, and governance domains.</p>`;

        const controlNames = {
            'eng-1': 'Manual Override Capability',
            'eng-2': 'Fail-Safe Mechanisms',
            'eng-3': 'Redundancy Design',
            'eng-4': 'Deployment Architecture',
            'eng-5': 'Operator Trust Indicators',
            'ops-1': 'Watchdog & Monitoring Systems',
            'ops-2': 'AI-Specific Incident Response',
            'ops-3': 'Performance Baselines & Thresholds',
            'ops-4': 'Model Retraining & Recalibration',
            'gov-1': 'Vendor Security & Performance Requirements',
            'gov-2': 'Governance Program Integration',
            'gov-3': 'System Component Visibility',
            'gov-4': 'Approval Authority & Review Processes'
        };

        const controlDescriptions = {
            'eng-1': 'Does your AI system include manual override capability that enables operators to assume control seamlessly? High-consequence applications may require immediate operator control without system restart or reconfiguration. Consider how operators will transition from AI-assisted to manual operation.',
            'eng-2': 'What fail-safe mechanisms revert the system to a known safe state when AI outputs exceed expected bounds or confidence thresholds fall below acceptable levels? Systems might default to conservative, rule-based operation rather than halting entirely. Consider what "safe state" means for your specific application and operational context.',
            'eng-3': 'Have you designed redundancy to avoid single points of failure in critical functions? Options to consider include multiple models with diverse architectures or maintaining traditional control systems as active backups. Evaluate whether your use case risk profile justifies the additional complexity and cost of redundant systems.',
            'eng-4': 'What is your deployment architecture, and how does it align with your consequence profile? On-premises, edge, hybrid, and cloud deployments each present different risk tradeoffs around latency, data residency, availability, and control. Consider how communication failures, processing delays, or cloud service interruptions would impact your operations.',
            'eng-5': 'How will operators know when to trust AI outputs versus when to intervene? Consider whether confidence indicators, explainability features, and defined thresholds for escalation are appropriate for your application. Evaluate what information operators need to make informed decisions about AI recommendations.',
            'ops-1': 'What watchdog systems or monitoring mechanisms track AI model health, including input data quality, processing latency, output distributions, and model drift? Consider what constitutes abnormal behavior for your specific model and what response timeframes are appropriate. Evaluate how monitoring alerts will integrate with existing operational procedures.',
            'ops-2': 'How will your organization detect and respond to AI-specific incidents such as model poisoning, adversarial inputs, data exfiltration, or unexpected model behavior? AI incident response may require specialized playbooks beyond traditional IT security. Consider scenarios specific to your deployment and how they map to existing incident response procedures.',
            'ops-3': 'What baseline metrics establish normal AI system performance, and what thresholds trigger investigation or intervention? Consider defining acceptable ranges for accuracy, latency, and availability based on your operational requirements. Balance sensitivity (catching real issues) against specificity (avoiding alert fatigue).',
            'ops-4': 'How frequently will models be retrained or recalibrated, and what testing validates model updates before production deployment? Consider what triggers retraining (time-based, performance degradation, data drift) and what validation is sufficient to confirm model updates are safe to deploy. Evaluate testing requirements against your consequence profile.',
            'gov-1': 'What security and performance requirements apply to AI vendors, and how are these documented in contracts and service level agreements? Consider vendor responsibilities for security, updates, vulnerability disclosure, and incident notification. Evaluate what contractual protections are appropriate for your use case and consequence profile.',
            'gov-2': 'How does AI deployment integrate with your existing governance programs for cybersecurity, data privacy, regulatory compliance, and operational risk management? Consider how AI systems fit within existing frameworks rather than creating parallel governance structures. Evaluate which existing policies and procedures need to be extended to cover AI-specific considerations.',
            'gov-3': 'What visibility do you have into AI system components, including model architectures, training data provenance, third-party libraries, and software dependencies? Consider what level of transparency is necessary for your risk profile and compliance obligations. Evaluate vendor willingness to provide documentation and how you will track component changes over time.',
            'gov-4': 'Who in your organization has authority to approve AI deployments, modifications, or decommissioning, and what review processes ensure appropriate oversight? Consider whether existing approval authorities are sufficient or whether AI applications require specialized review. Evaluate what cross-functional input (IT, OT, legal, compliance, business units) is appropriate for your governance model.',
        };

        const controlCategories = {
            'Engineering Controls ⚙️': ['eng-1', 'eng-2', 'eng-3', 'eng-4', 'eng-5'],
            'Operational Controls 📊': ['ops-1', 'ops-2', 'ops-3', 'ops-4'],
            'Governance Controls 🏛️': ['gov-1', 'gov-2', 'gov-3', 'gov-4']
        };

        const categoryDescriptions = {
            'Engineering Controls ⚙️': 'System architecture safeguards built into AI deployment including manual overrides, fail-safe mechanisms, redundancy, and deployment design.',
            'Operational Controls 📊': 'Ongoing monitoring, incident response, and model maintenance processes that detect problems during operation and ensure continued performance.',
            'Governance Controls 🏛️': 'Organizational oversight, vendor management, and integration with existing compliance programs ensuring AI aligns with risk management frameworks.'
        };

        Object.keys(controlCategories).forEach(category => {
            const categoryKeys = controlCategories[category].filter(k => controlKeys.includes(k));

            if (categoryKeys.length > 0) {
                html += `
                    <div class="mb-6 page-break avoid-break">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">${category}</h3>
                        <p class="text-xs text-gray-600 italic mb-3">${categoryDescriptions[category] || ''}</p>
                        <div class="space-y-3">
                `;

                categoryKeys.forEach(key => {
                    const descHtml = controlDescriptions[key]
                        ? `<p class="text-xs text-gray-600 mb-2 italic">${controlDescriptions[key]}</p>`
                        : '';

                    html += `
                        <div class="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50">
                            <p class="font-semibold text-gray-900 mb-1">${controlNames[key] || key}</p>
                            ${descHtml}
                            <p class="text-sm text-gray-700">${controls[key]}</p>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }
        });

        // Add reference guide
        html += `

        `;
    }

    html += `</div>`;

    return html;
}

// Export to PDF
// ==========================
// CLEAN EXPORT (PDF + TXT)
// ==========================
