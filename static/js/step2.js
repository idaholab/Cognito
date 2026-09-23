/**
 * COGNITO Step 2 Module
 * AI Use Case Catalog - Matching opportunities to AI applications
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// STEP 2 FUNCTIONS - AI USE CASE CATALOG
// ============================================

const useCaseCatalog = [
    // LOW CONSEQUENCE
    {
        id: 'uc-1',
        name: 'Asset Health Monitoring',
        consequence: 'low',
        readiness: 'Ready Now',
        domains: ['detection'],
        description: 'AI analyzes real-time and historical sensor data from transformers, circuit breakers, and other grid equipment to assess current equipment condition and detect early signs of degradation. Systems generate health scores, condition indices, and anomaly alerts by integrating multiple data streams from installed monitoring systems and operational telemetry. Outputs inform inspection prioritization and validate equipment status against expected performance baselines.',
        justification: 'Detection errors result in missed degradation signals or false alarms requiring unnecessary inspections, affecting maintenance resource allocation and potentially allowing equipment to operate closer to failure thresholds. However, monitoring operates as input among many maintenance decisions, with engineering review before action. Traditional periodic inspections and condition-based monitoring continue regardless of AI outputs. Consequences remain primarily operational efficiency impacts rather than direct safety or reliability threats, as multiple validation layers exist before equipment decisions are made.'
    },
    {
        id: 'uc-1b',
        name: 'Predictive Maintenance',
        consequence: 'low',
        readiness: 'Ready Now',
        domains: ['prediction'],
        description: 'AI forecasts equipment failures by analyzing historical maintenance records, failure patterns, environmental conditions, and asset health trends to estimate remaining useful life and optimal maintenance timing. Systems recommend preventive maintenance schedules, predict failure probability windows, and identify maintenance deferral opportunities to minimize downtime while extending asset life. Outputs support maintenance planning and capital investment prioritization.',
        justification: 'Prediction errors lead to premature maintenance causing unnecessary cost or delayed maintenance representing missed optimization opportunities. However, maintenance planning operates on weeks-to-months timescales with engineering review before work scheduling, and failed predictions do not prevent traditional time-based or condition-based maintenance programs from continuing. Consequences remain primarily economic rather than operational or safety-critical since multiple opportunities exist for validation before equipment failure occurs.'
    },
    {
        id: 'uc-2',
        name: 'Work Order Optimization',
        consequence: 'low',
        readiness: 'Ready Now / Emerging',
        domains: ['business', 'control'],
        description: 'AI optimizes switching sequences, maintenance scheduling, and work order routing to minimize outage duration and crew travel time. Systems coordinate planned outages with operational constraints and customer impact considerations.',
        justification: 'Optimization errors result in less efficient work scheduling, increased crew travel time, or sub-optimal outage windows affecting operational costs and resource utilization. However, work order planning allows extensive human review before execution where errors do not prevent manual scheduling processes from functioning. Impacts remain limited to workforce efficiency and minor customer inconvenience from sub-optimal planned outage timing rather than safety or reliability consequences.'
    },
    {
        id: 'uc-3',
        name: 'Field Workforce Mobile Tools',
        consequence: 'low',
        readiness: 'Ready Now / Emerging',
        domains: ['business'],
        description: 'Mobile applications provide field crews with AI-powered decision support, including equipment identification, diagnostic guidance, safety checklists, and real-time communication with dispatchers and engineers.',
        justification: 'Tool failures require crews to use traditional paper-based procedures or contact dispatch for information causing minor delays but not preventing work completion. Incorrect equipment identification or diagnostic suggestions are validated by experienced technicians before action, and the application does not directly control equipment. Consequences remain limited to reduced field efficiency and potentially longer task completion times without affecting safety or service continuity.'
    },
    {
        id: 'uc-4',
        name: 'Event Pattern Analysis',
        consequence: 'low',
        readiness: 'Ready Now',
        domains: ['detection', 'prediction'],
        description: 'Machine learning identifies patterns across safety incidents, equipment failures, and outage events to reveal systemic issues and predict future occurrences. Systems correlate seemingly unrelated events to expose root causes.',
        justification: 'Pattern analysis supports long-term process improvement and root cause investigation where errors result in missed insights or incorrect correlation of events affecting quality of continuous improvement initiatives. However, analysis operates retrospectively on historical data with engineering validation before driving changes to procedures or policies. No immediate operational impact results from analytical errors, limiting consequences to the effectiveness of long-term planning and process improvement efforts.'
    },
    {
        id: 'uc-5',
        name: 'Grid & DER Monitoring',
        consequence: 'low',
        readiness: 'Emerging',
        domains: ['detection'],
        description: 'AI monitors distribution grid conditions and distributed energy resource behavior to detect anomalies, violations, and emerging issues. Systems provide early warning of equipment malfunctions, power quality problems, and operational constraint violations.',
        justification: 'This monitoring application provides informational awareness rather than direct control where false positives create unnecessary investigations but do not affect operations. False negatives delay detection of emerging issues, but traditional SCADA alarms and human monitoring provide redundant detection layers. Sufficient time exists for human validation before operational decisions are made, with consequences primarily affecting situational awareness quality rather than grid reliability or safety.'
    },
    {
        id: 'uc-6',
        name: 'Safety Knowledge Management',
        consequence: 'low',
        readiness: 'Ready Now',
        domains: ['business', 'detection'],
        description: 'AI-powered knowledge systems capture safety procedures, lessons learned, and hazard identification from experienced personnel. Systems provide context-aware safety guidance to field crews and flag potential safety violations before they occur.',
        justification: 'Knowledge system errors result in incomplete or incorrect information retrieval requiring crews to consult alternative sources including supervisors, paper manuals, or colleagues. The system does not replace required safety training, job briefings, or supervisor approval for hazardous work. Consequences remain limited to reduced efficiency in accessing institutional knowledge while critical safety decisions remain subject to qualified worker judgment and supervision, preventing direct safety impacts from system errors.'
    },
    {
        id: 'uc-7',
        name: 'Contractor Performance Analytics',
        consequence: 'low',
        readiness: 'Emerging',
        domains: ['business'],
        description: 'AI tracks contractor productivity, quality, safety compliance, and cost performance across projects. Systems identify high-performing contractors, flag underperformance, and support data-driven contractor selection and management.',
        justification: 'Performance tracking errors affect contractor evaluation accuracy and selection decisions for future work with impacts remaining primarily contractual and financial. Incorrect performance assessments do not affect current project execution or grid operations, and sufficient time exists for human review of analytics before contractor decisions are made. Consequences remain limited to potential sub-optimal contractor selection or disputes over performance ratings without immediate operational or safety implications.'
    },
    // MODERATE CONSEQUENCE
    {
        id: 'uc-8',
        name: 'Model Validation & Digital Twin',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['prediction'],
        description: 'AI validates models against a centralized data lake, providing a single source of truth. Digital twins simulate grid operations for scenario testing and validation. Virtual replicas of physical assets and grid infrastructure serve as central sources of truth for asset health, system state, and operational planning. Real-time sensor data and historical records validate models and enable engineers to simulate scenarios, test control strategies, and train operators in safe digital environments. Requires sophisticated data integration and advanced modeling capabilities.',
        justification: 'Incorrect model validation leads to acceptance of flawed planning tools or rejection of accurate operational models, degrading long-term decision quality, and data quality issues propagate across multiple dependent systems. However, validation typically occurs offline with engineering review before operational deployment, providing sufficient time to detect and correct errors before grid impacts occur, limiting consequences to planning efficiency rather than immediate operational impacts.'
    },
    {
        id: 'uc-9',
        name: 'Energy Market Optimization',
        consequence: 'moderate',
        readiness: 'Emerging',
        domains: ['control'],
        description: 'AI optimizes participation in wholesale and retail energy markets through trend and price analysis. AI platforms forecast wholesale market prices, compute opportunity costs, and generate optimized bids across energy, capacity, and ancillary service markets. Systems perform multi-market optimization, portfolio management across generation and storage assets, and risk management. Automated trading algorithms execute strategies while maintaining regulatory compliance.',
        justification: 'Bidding errors result in financial losses through sub-optimal market positions or penalty exposure, but do not directly impact grid reliability since physical operations remain under separate control systems. Failed market optimization reduces revenue and increases operational costs, but errors can be corrected in subsequent trading intervals. Primary risks involve financial exposure and regulatory compliance if AI strategies violate market rules rather than immediate operational or safety consequences.'
    },
    {
        id: 'uc-10',
        name: 'Cybersecurity Operations',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['detection'],
        description: 'AI monitors SCADA/ICS traffic and operational technology networks for anomalies to detect cyber threats. AI continuously monitors operational technology networks for anomalous behavior patterns that may indicate cyberattacks, insider threats, or system compromises. Machine learning models detect threats faster than signature-based systems, provide context about attack vectors, and recommend proportionate incident responses while reducing false positive alerts. Anomaly detection capabilities in edge devices enhance security.',
        justification: 'This detection function does not directly control equipment, and false positives create alert fatigue and divert security resources while false negatives delay incident response. Cybersecurity operates as defense-in-depth with multiple layers where AI errors affect detection speed and analyst efficiency but do not directly cause grid operational impacts. Time remains available for human validation of alerts before taking protective actions, distinguishing this from real-time control applications.'
    },
    {
        id: 'uc-11',
        name: 'Grid Forecasting (Load, Generation, Weather)',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['prediction'],
        description: 'AI predicts future load and renewable generation patterns for improved dispatch planning, integrating weather data, historical patterns, and real-time sensor inputs. Systems provide short-term (minutes to hours) and medium-term (days ahead) forecasts to support operational planning and real-time dispatch decisions. Localized processing in edge devices supports real-time forecasting.',
        justification: 'Forecast errors result in sub-optimal unit commitment, reserve positioning, or demand response activation that creates economic inefficiency, and significant forecast deviations may require more expensive real-time corrections. However, forecasting operates on day-ahead to hours-ahead timescales providing multiple opportunities for human review and adjustment before operational impacts occur. The function does not directly control equipment, limiting consequences primarily to economic efficiency rather than immediate reliability or safety impacts.'
    },
    {
        id: 'uc-12',
        name: 'Customer Load Management & Demand Response',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['control', 'business'],
        description: 'AI learns customer behavior to control smart devices for grid stability during peak demand. AI disaggregates smart meter data to identify individual appliance usage patterns, detect billing anomalies, and provide personalized energy efficiency recommendations. Systems enhance customer interaction and service management, reduce call center volumes by proactively addressing customer concerns, and enable targeted demand-side management programs.',
        justification: 'Demand response errors affect load balancing and peak shaving effectiveness reducing program value, and customer comfort impacts from incorrect device control create satisfaction issues and program opt-outs. Financial impacts arise from billing errors or missed demand response opportunities, but aggregated load control operates with human oversight and individual customer impacts are limited. The application carries no direct safety implications, with consequences primarily affecting program performance and customer satisfaction.'
    },
    {
        id: 'uc-13',
        name: 'Customer Analytics & Engagement',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['business'],
        description: 'Advanced AI disaggregates smart meter data to identify individual appliance usage patterns with high granularity, detect billing anomalies, predict customer churn, and provide hyper-personalized energy efficiency recommendations. These systems also power intelligent customer engagement and support by enabling proactive outreach, personalized communications, dynamic rate design, and real-time digital assistance. AI chatbots and virtual agents enhance customer experience by resolving common inquiries and facilitating enrollment in utility programs, while analytics drive sophisticated segmentation and improved satisfaction outcomes.',
        justification: 'Analytics errors result in missed revenue protection opportunities, ineffective customer programs, or incorrect targeting of energy efficiency investments with privacy implications if customer data is mishandled. However, customer-facing analytics operate with human review of recommendations and do not directly impact grid operations or service delivery. Financial and reputational impacts represent primary concerns rather than operational or safety consequences.'
    },
    {
        id: 'uc-14',
        name: 'Outage Risk Analytics',
        consequence: 'moderate',
        readiness: 'Ready Now',
        domains: ['prediction', 'detection'],
        description: 'AI models analyze historical outage data, weather patterns, vegetation conditions, and asset health to predict outage probability and reliability impacts. Systems provide risk-based prioritization for preventive maintenance and grid hardening investments.',
        justification: 'Risk prediction errors lead to sub-optimal allocation of maintenance budgets or misidentification of reliability improvement opportunities affecting long-term performance metrics. However, risk analytics support multi-year planning processes with extensive engineering review before capital deployment decisions where errors impact investment efficiency but do not create immediate operational consequences. The extended planning timelines provide opportunities to validate predictions before resources are committed.'
    },
    {
        id: 'uc-15',
        name: 'Real-Time Crew Dispatch Optimization',
        consequence: 'moderate',
        readiness: 'Emerging',
        domains: ['control', 'business'],
        description: 'AI dynamically assigns crews to outages and work orders based on real-time location, skills, availability, and priority. Systems adjust assignments as conditions change to optimize restoration time and resource utilization.',
        justification: 'Dispatch optimization errors result in longer outage durations and reduced crew efficiency affecting reliability metrics and customer satisfaction, and sub-optimal routing increases operational costs and delays service restoration. However, dispatchers maintain oversight and can override AI recommendations where consequences remain primarily economic and customer satisfaction-related rather than safety-critical. Human supervision provides a validation layer that limits potential impacts.'
    },
    {
        id: 'uc-16',
        name: 'Advanced Training & Simulation',
        consequence: 'moderate',
        readiness: 'Future State',
        domains: ['business'],
        description: 'Generative AI creates realistic fault scenarios and emergency simulations for operator training in both transmission/distribution control rooms and generation facilities. Systems adapt training difficulty based on operator performance and generate synthetic edge cases rarely encountered in real operations to improve emergency preparedness.',
        justification: 'Training simulation errors reduce operator preparedness for real events potentially affecting response quality during actual emergencies. However, training operates in non-operational environments with no direct grid impacts where simulation failures affect workforce development timelines but do not immediately compromise grid reliability. Errors are typically identified during training sessions before affecting operational performance, providing opportunities for correction before real-world application.'
    },
    // HIGH CONSEQUENCE
    {
        id: 'uc-17',
        name: 'Fault Location',
        consequence: 'high',
        readiness: 'Emerging',
        domains: ['detection'],
        description: 'AI enhances fault location capabilities by combining SCADA, AMI, and sensor data to automatically pinpoint fault locations with high precision, aiding in efficient identification and isolation of issues. Systems analyze waveform patterns, impedance calculations, and historical fault data.',
        justification: 'This application directly informs protection and restoration decisions where incorrect fault location delays service restoration and misdirects field crews to wrong locations, resulting in unnecessary extended outages for customers. In wildfire-prone regions, misidentified faults may prevent timely de-energization and create life-safety risks. The function serves as a precursor to autonomous control systems and therefore requires high accuracy and reliability to support safe grid operations.'
    },
    {
        id: 'uc-18',
        name: 'DERMS - Distributed Energy Resource Management',
        consequence: 'high',
        readiness: 'Ready Now',
        domains: ['prediction', 'control'],
        description: 'AI optimizes dispatch of behind-the-meter and front-of-the-meter DER assets (solar, storage, EV chargers, flexible loads), balancing grid conditions, market participation, and customer needs. Platforms coordinate thousands of distributed resources, provide advanced situational awareness, automated dispatch to manage grid constraints, and program management for aggregated DERs. Integration with ADMS enables real-time coordination between distributed resources and bulk grid operations. Localized AI processing in edge devices enhances efficiency.',
        justification: 'Incorrect dispatch of distributed energy resources affects voltage stability, frequency regulation, and feeder loading where system failures during peak demand or contingency conditions compromise grid reliability. Aggregated DER control errors can cascade across multiple feeders, and improper coordination with distribution operations creates operational conflicts and potential equipment damage that threatens service continuity.'
    },
    {
        id: 'uc-19',
        name: 'Power Flow & Interconnection Analyses',
        consequence: 'high',
        readiness: 'Ready Now',
        domains: ['prediction'],
        description: 'AI runs system impact studies, considering diverse energy resource mixes and dynamic model setups. AI-enhanced load flow and state estimation functions calculate real-time and predicted power flows at any point on the distribution grid. Advanced network models integrate SCADA telemetry, GIS data, and device settings to identify constraints, support automated switching decisions, and accelerate interconnection study processes for new DER connections. AI considers larger mixes of resources, more combinatorial situations, and sets up models dynamically.',
        justification: 'Incorrect power flow analysis leads to approval of interconnections that violate thermal or voltage limits, potentially causing equipment failures or service interruptions when new resources energize. Errors in contingency analysis create operational blind spots for planning, and flawed hosting capacity assessments result in under-investment in necessary infrastructure or rejection of feasible interconnection requests that affect grid modernization and reliability.'
    },
    {
        id: 'uc-20',
        name: 'Wildfire Prediction & Monitoring',
        consequence: 'high',
        readiness: 'Ready Now',
        domains: ['detection', 'prediction'],
        description: 'AI processes video streams from camera networks to detect smoke signatures in real-time. Machine learning models predict wildfire ignition risk based on weather, vegetation moisture, equipment condition, and historical fire data. Systems integrate with utility operations to enable proactive de-energization decisions and rapid crew dispatch for confirmed ignitions.',
        justification: 'This application carries direct life-safety implications where false negatives (missed fire detections) result in catastrophic wildfires, loss of life, property destruction, and liability exposure. False positives (unnecessary public safety power shutoff events) cause large-scale service interruptions, economic impacts, and public health risks to medically vulnerable populations. The timing criticality for de-energization decisions requires high confidence in AI outputs to balance competing safety and reliability objectives.'
    },
    {
        id: 'uc-21',
        name: 'Outage Management System (OMS)',
        consequence: 'high',
        readiness: 'Emerging',
        domains: ['detection', 'control'],
        description: 'AI-integrated outage management systems help utilities detect, locate, and restore power outages. AI-driven models analyze historical data, weather patterns, maintenance records, and sensor data to predict the likelihood and location of potential outages. Systems calculate optimal switching sequences, coordinate crew dispatch, and provide real-time situational awareness during outages to accelerate restoration efforts.',
        justification: 'Incorrect outage detection or prioritization significantly extends customer outage durations during storm events, and flawed crew dispatch optimization misdirects restoration resources and delays service to critical facilities including hospitals and emergency services. AI errors during switching sequence calculations can result in equipment damage or personnel safety risks, and system failures during major events compromise emergency response coordination when it is most critically needed.'
    },
    {
        id: 'uc-22',
        name: 'Robotic Operations',
        consequence: 'high',
        readiness: 'Emerging',
        domains: ['control'],
        description: 'Autonomous robots perform live-line maintenance and repairs on energized equipment without human workers. AI-equipped drones conduct inspections in hazardous environments, mapping conditions and examining components in areas unsafe for humans. Systems combine computer vision, manipulation, and navigation capabilities for complex tasks in hazardous environments.',
        justification: 'This application has direct personnel safety implications when operating near energized equipment where robotic failures during live-line work create arc flash hazards, equipment damage, and potential injuries. Navigation or manipulation errors in confined spaces such as underground vaults and substations result in costly equipment damage and extended outages. The technology remains experimental with limited operational track record, requiring extensive validation before widespread deployment.'
    },
    // HIGHEST CONSEQUENCE
    {
        id: 'uc-23',
        name: 'Autonomous Grid Control',
        consequence: 'highest',
        readiness: 'Future State',
        domains: ['control'],
        description: 'AI dynamically adjusts grid protection settings and autonomously reacts to frequency, voltage, and topology changes. Advanced automation systems detect faults, isolate affected segments, and automatically reroute power through alternative paths in real-time. AI algorithms adapt protection settings dynamically based on grid conditions and coordinate distributed switching devices to maintain service during both normal operations and extreme weather events. Localized AI in edge devices supports real-time adjustments, enhancing stability and resilience.',
        justification: 'This application provides direct autonomous control of protection schemes and real-time grid operations without human intervention timeframes. Incorrect AI decisions result in cascading failures, equipment damage, widespread service interruption, and potential safety incidents. The system exhibits the highest impact across all consequence dimensions including safety, reliability, asset integrity, and ability to restore service, with no opportunity for human validation before actions are executed.'
    },
    {
        id: 'uc-24',
        name: 'Fully Autonomous Control Systems',
        consequence: 'highest',
        readiness: 'Future State',
        domains: ['control'],
        description: 'Generative AI and large language models synthesize real-time operational data to provide control room operators with recommended actions during complex events. Fully autonomous distribution and microgrid systems dynamically form islands and coordinate distributed resources during extreme events without human oversight. AI-driven systems execute protection and restoration actions in milliseconds based on real-time grid state assessment.',
        justification: 'Complete automation of critical control decisions operates without human oversight or approval. System failures during autonomous islanding, resynchronization, or voltage control operations create immediate safety hazards and large-scale reliability impacts affecting service to entire communities. Extensive validation and fail-safe architectures are mandatory before any operational deployment due to the severity and immediacy of potential consequences.'
    }
];

// Investment Intensity Data
const investmentIntensityData = {
    'Asset Health Monitoring': {
        intensity: '$',
        level: 'Foundational',
        rationale: [
            'Leverages existing sensor infrastructure and monitoring systems already deployed on critical assets',
            'Well-established anomaly detection and condition assessment techniques with mature vendor solutions',
            'Can begin with high-value assets and expand incrementally based on monitoring coverage and organizational readiness'
        ]
    },
    'Predictive Maintenance': {
        intensity: '$',
        level: 'Foundational',
        rationale: [
            'Commercially available solutions from existing vendors with proven deployment track records across the utility industry',
            'Can leverage existing SCADA telemetry, maintenance records, and asset data without requiring new sensor infrastructure',
            'Incremental improvements can be achieved through model tuning rather than infrastructure investment'
        ]
    },
    'Event Pattern Analysis': {
        intensity: '$',
        level: 'Foundational',
        rationale: [
            'Uses existing SCADA data and operational event logs without requiring new hardware or sensors',
            'Established ML techniques for anomaly detection, pattern recognition, and event correlation are well-documented',
            'Can begin with focused, high-value use cases and expand incrementally',
            'Relatively straightforward integration with existing visualization and alerting tools'
        ]
    },
    'Safety Knowledge Management': {
        intensity: '$',
        level: 'Foundational',
        rationale: [
            'Can run on existing enterprise content management or knowledge base platforms with standard AI extensions',
            'Primary investment is content and data curation, structuring procedures, and building a comprehensive knowledge repository',
            'Standard natural language processing and semantic search technologies are mature and widely available',
            'Training and change management programs to drive adoption among target user groups'
        ]
    },
    'Grid Forecasting (Load, Generation, Weather)': {
        intensity: '$',
        level: 'Foundational',
        rationale: [
            'Commercially available solutions from existing vendors with proven deployment track records with utilities and grid operators',
            'Can leverage existing SCADA telemetry, AMI data, and standard weather data feeds without requiring new sensor infrastructure',
            'Well-established ML techniques (gradient boosting, neural networks) with strong vendor support and implementation guidance',
            'Incremental improvements can be achieved through model tuning rather than infrastructure investment'
        ]
    },
    'Fault Location': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Utilizes existing relay event data and SCADA streams, avoiding the need for widespread new sensor deployment',
            'Requires custom model development with utility-specific training data and validation',
            'Integration with protection systems and control room workflows demands careful engineering and testing protocols',
            'Ongoing model maintenance needed as grid equipment evolve over time'
        ]
    },
    'Outage Management System (OMS)': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Requires integration of multiple data sources including weather feeds, SCADA, GIS, vegetation management, and asset health systems',
            'Data hub or reliability analytics platform build-out typically necessary to normalize and correlate inputs',
            'System integration with existing OMS platforms and control room displays requires vendor coordination',
            'Demonstrated ROI through outage prevention and faster restoration helps justify investment'
        ]
    },
    'Outage Risk Analytics': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Builds on existing weather data, vegetation inspection records, and asset health information already collected by most utilities',
            'Analytics platform development and ML model training required to correlate risk factors with historical outage patterns',
            'Integration with maintenance planning and work management systems to operationalize risk scores',
            'Data quality assessment and improvement efforts are frequently necessary before models can be effective'
        ]
    },
    'Work Order Optimization': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Integration with enterprise work management, scheduling, and asset management systems across multiple platforms',
            'Real-time data feeds required for dynamic re-optimization as conditions change throughout the workday',
            'Workflow process changes and field crew training needed to realize benefits from optimized schedules',
            'Change management effort to gain workforce acceptance of AI-generated recommendations'
        ]
    },
    'Field Workforce Mobile Tools': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Leverages standard mobile devices (tablets, smartphones) that are already deployed to field personnel',
            'Cloud-based AI services for image recognition (nameplate OCR, equipment identification) and augmented reality overlays',
            'App development, user experience design, and offline functionality for areas with limited connectivity',
            'Training programs and ongoing support to drive adoption and proper usage across diverse field workforce'
        ]
    },
    'Real-Time Crew Dispatch Optimization': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Requires real-time GPS location tracking, skill/certification databases, and crew availability systems',
            'GIS integration for travel time estimation and route optimization under varying conditions',
            'Algorithm development for multi-objective optimization balancing response time, crew utilization, and customer impact',
            'Technology still maturing with limited large-scale deployments providing reference architectures'
        ]
    },
    'Grid & DER Monitoring': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'May require additional sensors or upgraded metering at DER interconnection points for visibility',
            'Real-time analytics platform for voltage monitoring, reverse power flow detection, and DER performance tracking',
            'Integration with ADMS, DER registries, and potentially third-party aggregator platforms',
            'Scalability challenges emerge as DER penetration grows and monitoring requirements expand'
        ]
    },
    'Contractor Performance Analytics': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Data collection and normalization from project management, procurement, timekeeping, and safety incident systems',
            'Analytics development for productivity benchmarking, safety metrics, and quality scorecards',
            'Integration across multiple contractor management platforms and potentially external data sources',
            'Emerging practice area with evolving metrics, benchmarks, and best practices still being established'
        ]
    },
    'Power Flow & Interconnection Analyses': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Builds on existing power system modeling tools with AI acceleration layers',
            'SCADA telemetry, GIS network models, and device settings integration for model accuracy',
            'Computationally intensive simulations but leverages established power engineering methods',
            'Accelerates study throughput and hosting capacity analysis without major new infrastructure investment'
        ]
    },
    'Energy Market Optimization': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Software-intensive solution with minimal physical infrastructure requirements',
            'Market rule compliance, certification, and ongoing adaptation as market designs evolve',
            'Integration with energy trading and risk management (ETRM) and settlement systems',
            'Robust backtesting, scenario analysis, and risk management capabilities essential for deployment'
        ]
    },
    'Customer Analytics & Engagement': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Dependent on smart meter data availability, quality, and granularity for disaggregation and behavioral insights',
            'Data privacy compliance, customer consent management, and state regulatory requirements',
            'Customer communication platform integration for personalized recommendations and program targeting',
            'Continuous experimentation infrastructure for testing engagement strategies and measuring effectiveness'
        ]
    },
    'Cybersecurity Operations': {
        intensity: '$$',
        level: 'Moderate',
        rationale: [
            'Builds on existing security information and event management (SIEM) infrastructure',
            'Model development specialized for OT/ICS environments with different traffic patterns than enterprise IT',
            'Security operations center integration with playbooks, escalation procedures, and response workflows',
            'Continuous model updates required as threat landscape evolves and adversary techniques change'
        ]
    },
    'Customer Load Management & Demand Response': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'Coordination of millions of distributed devices (smart thermostats, EV chargers, water heaters, batteries) in virtual power plant configurations',
            'Sophisticated real-time communication infrastructure required with sub-second response capabilities for grid services',
            'Individual device modeling and customer preference calibration needed to balance grid needs with occupant comfort and behavior',
            'Customer acquisition, engagement platforms, and ongoing retention programs represent significant operational expense',
            'Regulatory and wholesale market participation requirements add compliance complexity'
        ]
    },
    'Wildfire Prediction & Monitoring': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'Specialized camera networks, weather stations, and sensor deployment across large, often remote geographic areas with challenging terrain',
            'Satellite imagery integration, processing pipelines, and near-real-time analytics infrastructure',
            'High-bandwidth, resilient communication systems required in fire-prone areas where infrastructure is vulnerable',
            'Continuous model retraining needed as fire behavior patterns shift with climate conditions',
            '24/7 monitoring operations center with trained personnel and escalation protocols'
        ]
    },
    'Model Validation & Digital Twin': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'Enterprise data lake infrastructure with robust data governance, quality controls, and security frameworks',
            'Real-time sensor integration and data pipelines spanning transmission, distribution, and generation assets',
            'Advanced physics-based and data-driven modeling capabilities for accurate digital representation',
            'Ongoing maintenance of virtual asset replicas as physical systems change and age',
            'Substantial compute, storage, and networking infrastructure to support simulation workloads'
        ]
    },
    'DERMS - Distributed Energy Resource Management': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'Coordination platform for thousands of heterogeneous distributed resources with varying capabilities and owners',
            'Edge computing infrastructure deployed at scale for local control and communication resilience',
            'Bidirectional integration with ADMS for grid awareness and wholesale market systems for economic optimization',
            'Sophisticated forecasting, dispatch optimization, and control algorithms operating in near-real-time',
            'Cybersecurity requirements for distributed control architecture with expanded attack surface'
        ]
    },
    'Autonomous Grid Control': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'Advanced control algorithms with rigorous fail-safe requirements and graceful degradation modes',
            'Field device upgrades or replacements to enable autonomous, coordinated response capabilities',
            'Extensive testing, simulation, and staged deployment protocols given safety-critical nature',
            'Regulatory engagement and approval processes for autonomous control schemes',
            'High consequence of errors demands exceptional engineering rigor and organizational readiness'
        ]
    },
    'Advanced Training & Simulation': {
        intensity: '$$$',
        level: 'Significant',
        rationale: [
            'High-fidelity digital twin development replicating actual grid topology, equipment behavior, and system dynamics',
            'Generative AI capabilities for creating realistic, novel fault scenarios that adapt to trainee performance',
            'VR/AR hardware deployment, software platform licensing, and immersive environment development',
            'Extensive content development for realistic scenarios covering rare but critical events',
            'Integration with learning management and competency tracking systems for certification programs'
        ]
    },
    'Fully Autonomous Control Systems': {
        intensity: '$$$$',
        level: 'Transformational',
        rationale: [
            'Cutting-edge algorithms requiring extensive R&D investment with uncertain timelines to production readiness',
            'Complete system redundancy, fail-safe mechanisms, and graceful degradation for all failure modes',
            'Regulatory approval pathway is lengthy, uncertain, and varies by jurisdiction and application',
            'Comprehensive testing environments including hardware-in-the-loop and digital twin simulation',
            'Organizational change management to build trust and develop operational procedures for autonomous systems',
            'Severe consequences of errors (safety, reliability, financial) demand exceptional rigor throughout'
        ]
    },
    'Robotic Operations': {
        intensity: '$$$$',
        level: 'Transformational',
        rationale: [
            'Specialized robotic equipment and hardware engineered for harsh utility environments (weather, EMF, energized equipment)',
            'Autonomous navigation, manipulation, and task execution capabilities in unstructured field conditions',
            'Rigorous safety certification for live-line work, vegetation management, and inspection tasks',
            'Currently experimental with limited proven deployments; technology and use cases still developing',
            'Fleet maintenance, support infrastructure, and specialized operator training requirements'
        ]
    }
};

// Initialize Step 2 state in appState
if (!appState.step2 || !appState.step2.selectedUseCases) {
    appState.step2 = {
        selectedUseCases: {},
        opportunities: [],
        filters: {
            consequence: [],
            domain: []
        }
    };
}

function initializeStep2() {
    console.log('Initializing Step 2...');
    console.log('Use case catalog length:', useCaseCatalog.length);

    // Ensure step2 state exists
    if (!appState.step2 || !appState.step2.selectedUseCases) {
        appState.step2 = {
            // Legacy support: selectedUseCases kept for backward compatibility with older saves
            selectedUseCases: {},
            opportunities: [],
            // New: opportunity-centric mapping
            opportunityMappings: {},
            activeOpportunityId: '',
            filters: {
                consequence: [],
                domain: []
            }
        };
    }

    loadStep1Summary(); // Load opportunities from Step 1 into Step 2

    // Clean up orphaned data (mappings for opportunities that no longer exist)
    // This ensures Step 2 mappings stay in sync with Step 1 changes
    cleanupOrphanedData();

    renderUseCaseCatalog();
    // Render the opportunity-centric alignment board
    setTimeout(() => { renderOpportunityAlignmentBoard(); }, 0);

    // Small delay to ensure DOM is ready before restoring
    setTimeout(() => {
        restoreStep2Data();
        // Initialize filter visual state (show all filters with normal opacity initially)
        updateFilterVisualState();
    }, 50);
}

function loadStep1Summary() {
    const summaryContainer = document.getElementById('opportunities-summary');

    // Collect all opportunities from all capabilities
    let allOpportunities = [];
    let oppNumber = 1;

    Object.keys(appState.step1.capabilities || {}).forEach(capId => {
        const capability = appState.step1.capabilities[capId];
        if (capability.opportunities && capability.opportunities.length > 0) {
            capability.opportunities.forEach(opp => {
                allOpportunities.push({
                    number: oppNumber++,
                    id: `${capId}-${opp.id}`,
                    capability: capability.name,
                    problem: opp.problem,
                    domains: opp.domains || [],
                    priority: opp.priority
                });
            });
        }
    });

    // Store opportunities in state (this is the critical part)
    appState.step2.opportunities = allOpportunities;

    // Only update the summary container if it exists (it may have been removed in UI redesign)
    if (summaryContainer) {
        if (allOpportunities.length === 0) {
            summaryContainer.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-yellow-800 font-medium">No opportunities identified in Step 1.</p>
                    <p class="text-yellow-700 text-sm mt-1">Please complete Step 1 before proceeding.</p>
                </div>
            `;
        } else {
            summaryContainer.innerHTML = `
                <div class="mb-3">
                    <span class="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg">
                        ${allOpportunities.length} Opportunities Identified
                    </span>
                </div>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${allOpportunities.map(opp => `
                        <div class="bg-white rounded-lg p-4 border border-blue-200">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex-1">
                                    <span class="font-bold text-gray-900">Opportunity ${opp.number}</span>
                                    <span class="text-sm text-gray-600 ml-2">(from ${opp.capability})</span>
                                </div>
                                <span class="ml-4 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                                    ${opp.priority ? opp.priority.toUpperCase() : 'NOT SET'}
                                </span>
                            </div>
                            <p class="text-sm text-gray-700 mb-2">${opp.problem || 'No description provided'}</p>
                            ${opp.domains.length > 0 ? `
                                <div class="flex flex-wrap gap-2">
                                    ${opp.domains.map(domain => `
                                        <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                            ${getDomainLabel(domain)}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Keep opportunity mappings in sync
    ensureOpportunityMappingsInitialized();
    renderOpportunityAlignmentBoard();
}

function renderUseCaseCatalog() {
    const catalogContainer = document.getElementById('use-case-catalog');
    if (!catalogContainer) return;

    const consequenceLevels = [
        { key: 'low', label: 'Low Consequence', headerClasses: 'bg-green-100 hover:bg-green-200', textClasses: 'text-green-900' },
        { key: 'moderate', label: 'Moderate Consequence', headerClasses: 'bg-yellow-100 hover:bg-yellow-200', textClasses: 'text-yellow-900' },
        { key: 'high', label: 'High Consequence', headerClasses: 'bg-orange-100 hover:bg-orange-200', textClasses: 'text-orange-900' },
        { key: 'highest', label: 'Highest Consequence', headerClasses: 'bg-red-100 hover:bg-red-200', textClasses: 'text-red-900' }
    ];

    let catalogHTML = '';

    consequenceLevels.forEach(level => {
        const useCases = useCaseCatalog.filter(uc => uc.consequence === level.key);

        catalogHTML += `
            <div class="mb-6 use-case-group" data-consequence="${level.key}">
                <button onclick="toggleConsequenceSection('${level.key}')"
                        class="w-full flex items-center justify-between p-4 ${level.headerClasses} rounded-lg transition">
                    <h4 class="text-lg font-bold ${level.textClasses}">${level.label} (${useCases.length} use cases)</h4>
                    <svg id="chevron-${level.key}" class="w-6 h-6 ${level.textClasses} transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div id="section-${level.key}" class="mt-3 space-y-4" style="display: block;">
                    ${useCases.map(uc => createUseCaseCard(uc)).join('')}
                </div>
            </div>
        `;
    });

    catalogContainer.innerHTML = catalogHTML;

    // Apply any currently checked filters to the newly-rendered cards.
    // (Important after assigning a use case, since we re-render the catalog.)
    applyFilters();
}


// -----------------------------
// Step 2: Opportunity-centric mapping helpers
// -----------------------------
function ensureOpportunityMappingsInitialized() {
    if (!appState.step2.opportunityMappings) appState.step2.opportunityMappings = {};
    if (!appState.step2.activeOpportunityId) appState.step2.activeOpportunityId = '';

    // Create empty mapping records for each opportunity (do not overwrite existing)
    (appState.step2.opportunities || []).forEach(opp => {
        if (!appState.step2.opportunityMappings[opp.id]) {
            appState.step2.opportunityMappings[opp.id] = { useCaseId: '', consequence: '', readiness: '' };
        }
    });
}

// NOTE: escapeHtml is defined in utils.js









function getEffortLabel(value) {
    const effortLabels = {
        'immediate': 'Immediate (< 1 month)',
        'short-term': 'Short-term (1-3 months)',
        'medium-term': 'Medium-term (3-6 months)',
        'long-term': 'Long-term (6-12 months)',
        'major-initiative': 'Major initiative (> 12 months)'
    };
    return effortLabels[value] || value;
}

function getUseCaseById(useCaseId) {
    return useCaseCatalog.find(uc => uc.id === useCaseId);
}

function openUseCaseCatalogForOpportunity(opportunityId) {
    appState.step2.activeOpportunityId = opportunityId;
    // Start each new assignment session with no filters selected
    // (user can then apply filters intentionally)
    clearFilters();
    openUseCaseCatalogModal();
    renderOpportunityAlignmentBoard();
    // Note: renderUseCaseCatalog is called inside openUseCaseCatalogModal
}

function openUseCaseCatalogModal() {
    const modal = document.getElementById('use-case-catalog-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    ensureOpportunityMappingsInitialized();

    const context = document.getElementById('use-case-catalog-context');
    const clearBtn = document.getElementById('use-case-clear-selection');

    const opp = (appState.step2.opportunities || []).find(o => o.id === appState.step2.activeOpportunityId);

    if (!opp) {
        // No active opportunity - show opportunity selector
        if (clearBtn) clearBtn.classList.add('hidden');

        const opportunities = appState.step2.opportunities || [];

        if (context) {
            if (opportunities.length === 0) {
                context.innerHTML = `
                    <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p class="text-sm text-amber-700">No opportunities defined yet. Please complete Step 1 first.</p>
                    </div>
                `;
            } else {
                context.innerHTML = `
                    <div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Select opportunity to assign use case:
                        </label>
                        <select id="catalog-opportunity-selector" onchange="renderUseCaseCatalog()" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Choose an opportunity...</option>
                            ${opportunities.map(o => {
                                const mapping = (appState.step2.opportunityMappings ? appState.step2.opportunityMappings[o.id] : undefined);
                                const hasAssignment = !!(mapping && mapping.useCaseId);
                                const uc = hasAssignment ? getUseCaseById(mapping.useCaseId) : null;
                                const assignedText = uc ? ` (Currently: ${uc.name})` : '';
                                return `<option value="${o.id}">Opportunity ${o.number}: ${o.capability || 'Untitled'}${assignedText}</option>`;
                            }).join('')}
                        </select>
                    </div>
                `;
            }
        }

        renderUseCaseCatalog();
        return;
    }

    // Toggle clear selection button (only show if a use case is currently assigned)
    const mapping = (appState.step2.opportunityMappings ? appState.step2.opportunityMappings[opp.id] : undefined);
    const hasAssignment = !!(mapping && mapping.useCaseId);
    if (clearBtn) {
        clearBtn.classList.toggle('hidden', !hasAssignment);
    }

    // Build domain badges
    const domains = Array.isArray(opp.domains) ? opp.domains : [];
    const domainBadges = domains.length
        ? domains.map(d => `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ring-1 ring-blue-300">${(d || '').toString().charAt(0).toUpperCase() + (d || '').toString().slice(1)}</span>`).join(' ')
        : `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">No domain selected</span>`;

    const capability = opp.capability ? opp.capability : 'Capability';
    const problem = opp.problem ? opp.problem : '';

    if (context) {
        context.innerHTML = `
            <div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <div class="text-xs font-semibold uppercase tracking-wide text-blue-600">Assigning use case to</div>
                        <div class="mt-1 text-base font-semibold text-gray-900">
                            Opportunity ${opp.number || ''}
                            <span class="text-gray-400 font-normal">•</span>
                            <span class="text-gray-700 font-medium">${escapeHtml(capability)}</span>
                        </div>
                    </div>
                </div>
                ${problem ? `<div class="mt-2 text-sm text-gray-700 leading-relaxed">${escapeHtml(problem)}</div>` : ''}
                <div class="mt-3">
                    <div class="text-xs font-semibold text-blue-700 mb-1">AI Domains selected in Step 1:</div>
                    <div class="flex flex-wrap gap-2">${domainBadges}</div>
                </div>
                ${domains.length > 0 ? `
                    <div class="mt-3 pt-3 border-t border-blue-200">
                        <div class="flex items-center text-xs text-blue-800">
                            <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span><strong>Tip:</strong> Use cases with matching domains are highlighted with a blue border and "<span class="font-semibold text-blue-700">DOMAIN MATCH</span>" badge below.</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Re-render catalog to apply domain matching highlights
    renderUseCaseCatalog();

    // Highlight matching domain filters
    highlightMatchingDomainFilters();
}

// Helper function to get the effective opportunity ID (from active selection or dropdown)
function getEffectiveOpportunityId() {
    let oppId = appState.step2.activeOpportunityId;
    if (!oppId) {
        const selector = document.getElementById('catalog-opportunity-selector');
        if (selector && selector.value) {
            oppId = selector.value;
        }
    }
    return oppId;
}

// Highlight domain filter options that match the active opportunity's Step 1 selections
function highlightMatchingDomainFilters() {
    const activeOppId = getEffectiveOpportunityId();
    const activeOpp = (appState.step2.opportunities || []).find(o => o.id === activeOppId);
    const activeOppDomains = activeOpp && Array.isArray(activeOpp.domains) ? activeOpp.domains : [];

    // Normalize domain names for comparison
    const normalizedOppDomains = activeOppDomains.map(d => (d || '').toString().toLowerCase());

    // Domain filter value to label ID mapping
    const domainFilters = ['detection', 'prediction', 'control', 'business'];

    domainFilters.forEach(domain => {
        const label = document.getElementById(`filter-label-${domain}`);
        const badge = document.getElementById(`filter-badge-${domain}`);

        if (!label || !badge) return;

        // Check if this domain matches any of the opportunity's domains
        const isMatch = normalizedOppDomains.some(oppDomain =>
            domain.includes(oppDomain) || oppDomain.includes(domain)
        );

        if (isMatch) {
            // Highlight the filter option
            label.classList.add('bg-blue-50', 'border-2', 'border-blue-300', 'ring-1', 'ring-blue-200');
            badge.classList.remove('hidden');
        } else {
            // Remove highlighting
            label.classList.remove('bg-blue-50', 'border-2', 'border-blue-300', 'ring-1', 'ring-blue-200');
            badge.classList.add('hidden');
        }
    });
}


function closeUseCaseCatalogModal() {
    const modal = document.getElementById('use-case-catalog-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    appState.step2.activeOpportunityId = '';
    renderOpportunityAlignmentBoard();
    renderUseCaseCatalog();

    // Clear domain filter highlights
    clearDomainFilterHighlights();
}

function clearDomainFilterHighlights() {
    const domainFilters = ['detection', 'prediction', 'control', 'business'];
    domainFilters.forEach(domain => {
        const label = document.getElementById(`filter-label-${domain}`);
        const badge = document.getElementById(`filter-badge-${domain}`);
        if (label) {
            label.classList.remove('bg-blue-50', 'border-2', 'border-blue-300', 'ring-1', 'ring-blue-200');
        }
        if (badge) {
            badge.classList.add('hidden');
        }
    });
}
function unassignActiveOpportunityUseCase() {
    // Keep legacy selectedUseCases in sync
    ensureOpportunityMappingsInitialized();
    const oppId = appState.step2.activeOpportunityId;
    if (!oppId) return;

    if (appState.step2.opportunityMappings && appState.step2.opportunityMappings[oppId]) {
        appState.step2.opportunityMappings[oppId].useCaseId = '';
        appState.step2.opportunityMappings[oppId].consequence = '';
        appState.step2.opportunityMappings[oppId].readiness = '';
    }
    rebuildLegacySelectedUseCasesFromOpportunityMappings();

    // Clean up orphaned data in downstream steps (Steps 3-5)
    // This removes data for use cases that are no longer mapped to any opportunity
    cleanupOrphanedData();

    saveProgress();
    renderOpportunityAlignmentBoard();
    renderUseCaseCatalog();
    // Refresh modal context/button state
    openUseCaseCatalogModal();
}


function assignUseCaseToActiveOpportunity(useCaseId) {
    let oppId = appState.step2.activeOpportunityId;

    // If no active opportunity, check the catalog dropdown selector
    if (!oppId) {
        const selector = document.getElementById('catalog-opportunity-selector');
        if (selector && selector.value) {
            oppId = selector.value;
        }
    }

    if (!oppId) {
        showNotification('Please select an opportunity from the drop down menu above.', 'warning');
        return;
    }

    ensureOpportunityMappingsInitialized();

    const uc = getUseCaseById(useCaseId);
    appState.step2.opportunityMappings[oppId] = {
        useCaseId,
        consequence: (uc && uc.consequence) ? uc.consequence : '',
        readiness: (uc && uc.readiness) ? uc.readiness : ''
    };

    saveProgress();
    renderOpportunityAlignmentBoard();
    renderUseCaseCatalog();

    // Keep modal open so user can continue assigning, but show confirmation
    const opp = (appState.step2.opportunities || []).find(o => o.id === oppId);
    showNotification(`Assigned "${uc ? uc.name : 'use case'}" to "${opp ? ('Opportunity ' + opp.number) : 'opportunity'}".`, 'success');
}

function updateOpportunityConsequence(opportunityId, value) {
    ensureOpportunityMappingsInitialized();
    if (!appState.step2.opportunityMappings[opportunityId]) {
        appState.step2.opportunityMappings[opportunityId] = { useCaseId: '', consequence: '', readiness: '' };
    }
    appState.step2.opportunityMappings[opportunityId].consequence = value;
    saveProgress();
    renderOpportunityAlignmentBoard();
}

function updateOpportunityReadiness(opportunityId, value) {
    ensureOpportunityMappingsInitialized();
    if (!appState.step2.opportunityMappings[opportunityId]) {
        appState.step2.opportunityMappings[opportunityId] = { useCaseId: '', consequence: '', readiness: '' };
    }
    appState.step2.opportunityMappings[opportunityId].readiness = value;
    saveProgress();
    renderOpportunityAlignmentBoard();
}

function renderOpportunityAlignmentBoard() {
    const tableBody = document.getElementById('opportunity-alignment-table');
    const progressEl = document.getElementById('opportunity-alignment-progress');
    if (!tableBody) return;

    ensureOpportunityMappingsInitialized();

    const unmappedOnly = !!(document.getElementById('toggle-unmapped-only') ? document.getElementById('toggle-unmapped-only').checked : false);
    const opps = (appState.step2.opportunities || []);

    let mappedCount = 0;
    opps.forEach(o => {
        const m = appState.step2.opportunityMappings[o.id];
        if (m && m.useCaseId) mappedCount++;
    });
    if (progressEl) progressEl.textContent = `${mappedCount} of ${opps.length} opportunities mapped`;

    const rows = opps
        .filter(o => {
            if (!unmappedOnly) return true;
            const m = appState.step2.opportunityMappings[o.id];
            return !(m && m.useCaseId);
        })
        .map(o => {
            const mapping = appState.step2.opportunityMappings[o.id] || { useCaseId: '', consequence: '', readiness: '' };
            const uc = mapping.useCaseId ? getUseCaseById(mapping.useCaseId) : null;
            const isComplete = !!(mapping.useCaseId);
            const statusBadge = isComplete
                ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Complete</span>'
                : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Unmapped</span>';

            const activeRing = (appState.step2.activeOpportunityId === o.id)
                ? 'ring-2 ring-blue-300'
                : '';
            // Consequence Level and Technology Readiness are derived from the selected use case (not user-editable)
            const consequenceDisplay = uc ? (uc.consequence || '') : '';
            const readinessDisplay = uc ? (uc.readiness || '') : '';

            return `
                <tr class="hover:bg-gray-50 ${activeRing}">
                    <td class="px-4 py-3 align-top">
                        <div class="text-sm font-medium text-gray-900">${o.capability || ''}</div>
                    </td>
                    <td class="px-4 py-3 align-top">
                        <div class="text-sm font-medium text-gray-900">Opportunity ${o.number}</div>
                        <div class="text-xs text-gray-600 mt-1">${o.problem || ''}</div>
                    </td>
                    <td class="px-4 py-3 align-top">
                        ${uc ? `
                            <div class="text-sm font-bold text-gray-900">${uc.name}</div>
                        ` : `
                            <button onclick="openUseCaseCatalogForOpportunity('${o.id}')" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
                                Select use case
                            </button>
                        `}
                    </td>
                    <td class="px-4 py-3 align-top">
                        ${uc ? `<span class="px-3 py-1 rounded-full text-xs font-bold ${uc.consequence==='low'?'bg-green-100 text-green-800':uc.consequence==='moderate'?'bg-yellow-100 text-yellow-800':uc.consequence==='high'?'bg-orange-100 text-orange-800':'bg-red-100 text-red-800'}">${uc.consequence.toUpperCase()} CONSEQUENCE</span>` : `<span class="text-sm text-gray-400">—</span>`}
                    </td>
                    <td class="px-4 py-3 align-top">
                        ${uc ? `<span class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">${uc.readiness.toUpperCase()}</span>` : `<span class="text-sm text-gray-400">—</span>`}
                    </td>
                    <td class="px-4 py-3 align-top">${statusBadge}</td>
                    <td class="px-4 py-3 align-top text-center">
                        ${uc ? `
                            <button onclick="openUseCaseCatalogForOpportunity('${o.id}')" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium">
                                Change
                            </button>
                        ` : `<span class="text-sm text-gray-400">—</span>`}
                    </td>
                </tr>
            `;
        })
        .join('');

    tableBody.innerHTML = rows || `
        <tr><td class="px-6 py-8 text-sm text-gray-500" colspan="5">No opportunities found. Return to Step 1 to add opportunities.</td></tr>
    `;
}

function createUseCaseCard(useCase) {
    const activeOppId = getEffectiveOpportunityId();
    const activeMapping = activeOppId && appState.step2.opportunityMappings ? appState.step2.opportunityMappings[activeOppId] : null;
    const isAssignedToActive = !!(activeMapping && activeMapping.useCaseId === useCase.id);

    // Check if use case domains match the active opportunity's domains
    const activeOpp = (appState.step2.opportunities || []).find(o => o.id === activeOppId);
    const activeOppDomains = activeOpp && Array.isArray(activeOpp.domains) ? activeOpp.domains : [];

    // Normalize domain names for comparison
    const normalizedOppDomains = activeOppDomains.map(d => (d || '').toString().toLowerCase());
    const normalizedUseCaseDomains = useCase.domains.map(d => (d || '').toString().toLowerCase());

    // Check if any domain matches
    const hasMatchingDomain = normalizedOppDomains.length > 0 &&
        normalizedUseCaseDomains.some(ucDomain =>
            normalizedOppDomains.some(oppDomain =>
                ucDomain.includes(oppDomain) || oppDomain.includes(ucDomain)
            )
        );

    const consequenceClasses = {
        'low': 'bg-green-100 text-green-800',
        'moderate': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-orange-100 text-orange-800',
        'highest': 'bg-red-100 text-red-800'
    };

    const readinessClasses = {
        'Ready Now': 'bg-gray-100 text-gray-800',
        'Ready Now / Emerging': 'bg-gray-100 text-gray-800',
        'Emerging': 'bg-gray-100 text-gray-800',
        'Future State': 'bg-gray-100 text-gray-800'
    };

    const consequenceBadgeClass = consequenceClasses[useCase.consequence];
    const readinessBadgeClass = readinessClasses[useCase.readiness];

    // Apply highlighting styles if domain matches
    const cardBorderClass = hasMatchingDomain
        ? 'border-blue-400 ring-2 ring-blue-200 shadow-md'
        : 'border-gray-200';
    const recommendedBadge = hasMatchingDomain
        ? `<span class="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            DOMAIN MATCH
           </span>`
        : '';

    return `
        <div class="use-case-card bg-white border-2 ${cardBorderClass} rounded-lg p-6 hover:shadow-lg transition ${hasMatchingDomain ? 'domain-match' : ''}"
             data-use-case-id="${useCase.id}"
             data-consequence="${useCase.consequence}"
             data-domains="${useCase.domains.join(',')}"
             data-domain-match="${hasMatchingDomain}">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center flex-wrap">
                    <h5 class="text-lg font-bold text-gray-900">${useCase.name}</h5>
                    ${recommendedBadge}
                </div>
                ${isAssignedToActive ? `
                    <span class="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">SELECTED</span>
                ` : ''}
            </div>

            <!-- Badges with improved spacing -->
            <div class="mb-3 space-y-2">
                <!-- Consequence and Readiness badges -->
                <div class="flex flex-wrap gap-3 items-start">
                    <span class="px-3 py-1 ${consequenceBadgeClass} rounded-full text-xs font-bold">
                        ${useCase.consequence.toUpperCase()} CONSEQUENCE
                    </span>
                    ${formatReadinessBadge(useCase.readiness, readinessBadgeClass, 'normal', true)}
                </div>

                <!-- AI Domains -->
                ${useCase.domains.length > 0 ? `
                <div class="flex flex-wrap gap-2">
                    ${useCase.domains.map(domain => {
                        const normalizedDomain = (domain || '').toString().toLowerCase();
                        const isDomainMatch = normalizedOppDomains.some(oppDomain =>
                            normalizedDomain.includes(oppDomain) || oppDomain.includes(normalizedDomain)
                        );
                        return `
                            <span class="px-2 py-1 ${isDomainMatch ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300' : 'bg-gray-100 text-gray-700'} rounded text-xs font-medium">
                                ${getDomainLabel(domain)}${isDomainMatch ? ' ✓' : ''}
                            </span>
                        `;
                    }).join('')}
                </div>
                ` : ''}
            </div>

            <div class="mb-4">
                <p class="text-sm text-gray-700 mb-3">${useCase.description}</p>
                <details class="text-sm">
                    <summary class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                        Why this consequence classification?
                    </summary>
                    <p class="mt-2 text-gray-600 italic pl-4 border-l-2 border-blue-300">
                        ${useCase.justification}
                    </p>
                </details>
            </div>

            <button onclick="assignUseCaseToActiveOpportunity('${useCase.id}')"
                    id="assign-btn-${useCase.id}"
                    class="w-full px-4 py-2 ${!activeOppId ? 'bg-gray-300 cursor-not-allowed' : (isAssignedToActive ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')}
                           text-white rounded-lg transition font-medium"
                    ${!activeOppId ? 'disabled' : ''}>
                ${!activeOppId ? 'Select an Opportunity From Drop Down Menu Above' : (isAssignedToActive ? 'Assigned to This Opportunity' : 'Assign to Opportunity')}
            </button>
        </div>
    `;
}

function toggleConsequenceSection(level) {
    const section = document.getElementById(`section-${level}`);
    const chevron = document.getElementById(`chevron-${level}`);

    if (!section || !chevron) return;

    // Check if currently visible (either display is 'block' or empty/default)
    const isVisible = section.style.display !== 'none';

    if (isVisible) {
        // Hide it
        section.style.display = 'none';
        chevron.style.transform = 'rotate(-90deg)';
    } else {
        // Show it
        section.style.display = 'block';
        chevron.style.transform = 'rotate(0deg)';
    }
}

function applyFilters() {
    const consequenceFilters = Array.from(document.querySelectorAll('.consequence-filter:checked')).map(cb => cb.value);
    const domainFilters = Array.from(document.querySelectorAll('.domain-filter:checked')).map(cb => cb.value);

    appState.step2.filters.consequence = consequenceFilters;
    appState.step2.filters.domain = domainFilters;

    const allCards = document.querySelectorAll('.use-case-card');

    // Track counts per consequence level
    const consequenceCounts = {
        'low': { total: 0, visible: 0 },
        'moderate': { total: 0, visible: 0 },
        'high': { total: 0, visible: 0 },
        'highest': { total: 0, visible: 0 }
    };

    allCards.forEach(card => {
        const cardConsequence = card.dataset.consequence;
        const cardDomains = card.dataset.domains ? card.dataset.domains.split(',') : [];

        // Count total
        consequenceCounts[cardConsequence].total++;

        // If no filters selected, show all cards
        // Otherwise, card must match selected filters
        let matchesConsequence = consequenceFilters.length === 0 || consequenceFilters.includes(cardConsequence);
        let matchesDomain = domainFilters.length === 0 || domainFilters.some(filter => cardDomains.includes(filter));

        if (matchesConsequence && matchesDomain) {
            card.style.display = 'block';
            consequenceCounts[cardConsequence].visible++;
        } else {
            card.style.display = 'none';
        }
    });

    // Hide/show entire consequence level sections based on visible count
    document.querySelectorAll('.use-case-group').forEach(group => {
        const consequenceLevel = group.dataset.consequence;
        const count = consequenceCounts[consequenceLevel];

        if (count.visible === 0) {
            // No visible use cases in this section, hide it completely
            group.style.display = 'none';
        } else {
            // Has visible use cases, show the section
            group.style.display = 'block';
        }
    });

    // Update section headers with counts (only for visible sections)
    updateSectionHeaderCounts(consequenceCounts);

    // Update visual state of filter checkboxes
    updateFilterVisualState();

    // Update overall filter count
    updateFilterCount();
    saveProgress();
}

function updateFilterVisualState() {
    const consequenceFiltersChecked = document.querySelectorAll('.consequence-filter:checked').length;
    const domainFiltersChecked = document.querySelectorAll('.domain-filter:checked').length;

    // Update consequence filter labels
    document.querySelectorAll('.consequence-filter').forEach(checkbox => {
        const label = checkbox.closest('label');
        if (consequenceFiltersChecked === 0) {
            // No filters selected, show all at full opacity
            label.classList.remove('font-bold');
            label.style.opacity = '1';
        } else if (checkbox.checked) {
            // This filter is selected
            label.classList.add('font-bold');
            label.style.opacity = '1';
        } else {
            // This filter is not selected, fade it
            label.classList.remove('font-bold');
            label.style.opacity = '0.5';
        }
    });

    // Update domain filter labels
    document.querySelectorAll('.domain-filter').forEach(checkbox => {
        const label = checkbox.closest('label');
        const span = label.querySelector('span');
        if (domainFiltersChecked === 0) {
            // No filters selected, show all at full opacity
            span.classList.remove('font-bold');
            label.style.opacity = '1';
        } else if (checkbox.checked) {
            // This filter is selected
            span.classList.add('font-bold');
            label.style.opacity = '1';
        } else {
            // This filter is not selected, fade it
            span.classList.remove('font-bold');
            label.style.opacity = '0.5';
        }
    });
}

function updateSectionHeaderCounts(counts) {
    const consequenceLevels = [
        { key: 'low', label: 'Low Consequence' },
        { key: 'moderate', label: 'Moderate Consequence' },
        { key: 'high', label: 'High Consequence' },
        { key: 'highest', label: 'Highest Consequence' }
    ];

    consequenceLevels.forEach(level => {
        const headerButton = document.querySelector(`[onclick="toggleConsequenceSection('${level.key}')"] h4`);
        if (headerButton) {
            const count = counts[level.key];
            if (count.visible < count.total) {
                // Show visible/total when filtered
                headerButton.textContent = `${level.label} (${count.visible} of ${count.total} use cases)`;
            } else {
                // Show just total when all visible
                headerButton.textContent = `${level.label} (${count.total} use cases)`;
            }
        }
    });
}

function updateFilterCount() {
    const totalCards = document.querySelectorAll('.use-case-card').length;
    // Count cards that are not hidden (either no display style or display is not 'none')
    const visibleCards = Array.from(document.querySelectorAll('.use-case-card')).filter(card => {
        return card.style.display !== 'none';
    }).length;

    const filterCountEl = document.getElementById('filter-count');
    if (filterCountEl) {
        const consequenceFilters = Array.from(document.querySelectorAll('.consequence-filter:checked'));
        const domainFilters = Array.from(document.querySelectorAll('.domain-filter:checked'));
        const hasFilters = consequenceFilters.length > 0 || domainFilters.length > 0;

        if (hasFilters) {
            let filterText = 'Filters active: ';
            const filterParts = [];

            if (consequenceFilters.length > 0) {
                filterParts.push(`${consequenceFilters.length} consequence level${consequenceFilters.length > 1 ? 's' : ''}`);
            }
            if (domainFilters.length > 0) {
                filterParts.push(`${domainFilters.length} AI domain${domainFilters.length > 1 ? 's' : ''}`);
            }

            filterText += filterParts.join(', ');
            filterText += ` — Showing ${visibleCards} of ${totalCards} use cases`;
            filterCountEl.textContent = filterText;
            filterCountEl.className = 'text-sm font-semibold text-blue-700';
        } else {
            filterCountEl.textContent = `Showing all ${totalCards} use cases`;
            filterCountEl.className = 'text-sm font-medium text-gray-700';
        }
    }
}

function clearFilters() {
    document.querySelectorAll('.consequence-filter, .domain-filter').forEach(cb => cb.checked = false);
    applyFilters();
}

function selectUseCase(useCaseId) {
    console.log(`Selecting use case: ${useCaseId}`);
    console.log('State before selection:', JSON.parse(JSON.stringify(appState.step2.selectedUseCases)));

    // Check if already selected (defensive check)
    if (appState.step2.selectedUseCases[useCaseId]) {
        console.warn(`Use case ${useCaseId} already selected, skipping`);
        return;
    }

    // Find the use case in the catalog
    const useCaseData = useCaseCatalog.find(uc => uc.id === useCaseId);
    if (!useCaseData) {
        console.error(`Use case ${useCaseId} not found in catalog`);
        return;
    }

    // Capitalize consequence for display
    const consequenceMap = {
        'low': 'Low',
        'moderate': 'Moderate',
        'high': 'High',
        'highest': 'Highest'
    };

    // Initialize in state with all use case details
    appState.step2.selectedUseCases[useCaseId] = {
        id: useCaseData.id,
        name: useCaseData.name,
        consequence: consequenceMap[useCaseData.consequence] || useCaseData.consequence,
        readiness: useCaseData.readiness,
        domains: useCaseData.domains || [],
        description: useCaseData.description || '',
        consequenceJustification: useCaseData.justification || '',
        opportunityId: '',
        priority: '',
        selectionRationale: ''
    };

    console.log('State after selection:', JSON.parse(JSON.stringify(appState.step2.selectedUseCases)));

    // Update step status to in-progress
    updateStepStatus(2, 'in-progress');

    // Re-render catalog to show selection
    renderUseCaseCatalog();

    // Reapply filters to maintain filter state and update counts
    if (appState.step2.filters && (appState.step2.filters.consequence.length > 0 || appState.step2.filters.domain.length > 0)) {
        // Restore filter checkboxes
        appState.step2.filters.consequence.forEach(val => {
            const checkbox = document.querySelector(`.consequence-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        appState.step2.filters.domain.forEach(val => {
            const checkbox = document.querySelector(`.domain-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        applyFilters(); // This will update counts, visual state, and section visibility
    } else {
        // No filters, show all sections and initialize counts
        document.querySelectorAll('.use-case-group').forEach(group => {
            group.style.display = 'block';
        });

        const allCards = document.querySelectorAll('.use-case-card');
        const consequenceCounts = {
            'low': { total: 0, visible: 0 },
            'moderate': { total: 0, visible: 0 },
            'high': { total: 0, visible: 0 },
            'highest': { total: 0, visible: 0 }
        };

        allCards.forEach(card => {
            const cardConsequence = card.dataset.consequence;
            consequenceCounts[cardConsequence].total++;
            consequenceCounts[cardConsequence].visible++;
        });

        updateSectionHeaderCounts(consequenceCounts);
        updateFilterCount();
        updateFilterVisualState();
    }

    // Create worksheet (this will remove any existing one first)
    createUseCaseWorksheet(useCaseId);

    // Refresh all priority dropdowns to show correct number of options
    setTimeout(() => {
        refreshAllPriorityDropdowns();
    }, 100);

    // Show worksheet section
    document.getElementById('selected-use-cases-section').classList.remove('hidden');

    saveProgress();
    console.log('Use case selection complete');
}

function removeUseCase(useCaseId) {
    console.log(`Removing use case: ${useCaseId}`);
    console.log('State before removal:', JSON.parse(JSON.stringify(appState.step2.selectedUseCases)));

    // Check if use case exists in state
    if (!appState.step2.selectedUseCases[useCaseId]) {
        console.warn(`Use case ${useCaseId} not found in state, cleaning up DOM only`);
    }

    // Remove from state
    delete appState.step2.selectedUseCases[useCaseId];

    console.log('State after removal:', JSON.parse(JSON.stringify(appState.step2.selectedUseCases)));

    // Remove worksheet from DOM
    const worksheet = document.getElementById(`worksheet-${useCaseId}`);
    if (worksheet) {
        console.log(`Found worksheet DOM element for ${useCaseId}, removing...`);
        worksheet.remove();
    } else {
        console.warn(`Worksheet DOM element not found for ${useCaseId}`);
    }

    // Check if any selections remain
    const remainingSelections = Object.keys(appState.step2.selectedUseCases || {}).length;
    console.log(`Remaining selections: ${remainingSelections}`);

    if (remainingSelections === 0) {
        // No more selections - hide section and reset step status
        document.getElementById('selected-use-cases-section').classList.add('hidden');
        updateStepStatus(2, 'not-started');
    }

    // Re-render catalog to update buttons and badges
    renderUseCaseCatalog();

    // Reapply filters to maintain filter state and update counts
    if (appState.step2.filters && (appState.step2.filters.consequence.length > 0 || appState.step2.filters.domain.length > 0)) {
        // Restore filter checkboxes
        appState.step2.filters.consequence.forEach(val => {
            const checkbox = document.querySelector(`.consequence-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        appState.step2.filters.domain.forEach(val => {
            const checkbox = document.querySelector(`.domain-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        applyFilters(); // This will update counts, visual state, and section visibility
    } else {
        // No filters, show all sections and initialize counts
        document.querySelectorAll('.use-case-group').forEach(group => {
            group.style.display = 'block';
        });

        const allCards = document.querySelectorAll('.use-case-card');
        const consequenceCounts = {
            'low': { total: 0, visible: 0 },
            'moderate': { total: 0, visible: 0 },
            'high': { total: 0, visible: 0 },
            'highest': { total: 0, visible: 0 }
        };

        allCards.forEach(card => {
            const cardConsequence = card.dataset.consequence;
            consequenceCounts[cardConsequence].total++;
            consequenceCounts[cardConsequence].visible++;
        });

        updateSectionHeaderCounts(consequenceCounts);
        updateFilterCount();
        updateFilterVisualState();
    }

    // Refresh priority dropdowns for remaining worksheets
    if (remainingSelections > 0) {
        setTimeout(() => {
            refreshAllPriorityDropdowns();
        }, 100);
    }

    saveProgress();
    console.log('Use case removal complete');
}

function createUseCaseWorksheet(useCaseId) {
    const useCase = useCaseCatalog.find(uc => uc.id === useCaseId);
    if (!useCase) return;

    // Remove any existing worksheet with this ID first (defensive cleanup)
    const existingWorksheet = document.getElementById(`worksheet-${useCaseId}`);
    if (existingWorksheet) {
        console.log(`Removing existing worksheet for ${useCaseId}`);
        existingWorksheet.remove();
    }

    const consequenceClasses = {
        'low': 'bg-green-100 text-green-800',
        'moderate': 'bg-yellow-100 text-yellow-800',
        'high': 'bg-orange-100 text-orange-800',
        'highest': 'bg-red-100 text-red-800'
    };

    const readinessClasses = {
        'Ready Now': 'bg-gray-100 text-gray-800',
        'Ready Now / Emerging': 'bg-gray-100 text-gray-800',
        'Emerging': 'bg-gray-100 text-gray-800',
        'Future State': 'bg-gray-100 text-gray-800'
    };

    const consequenceBadgeClass = consequenceClasses[useCase.consequence];
    const readinessBadgeClass = readinessClasses[useCase.readiness];

    // Count number of selected use cases for priority dropdown
    const numSelectedUseCases = Object.keys(appState.step2.selectedUseCases || {}).length;

    const worksheetHTML = `
        <div id="worksheet-${useCaseId}" class="bg-gray-50 border-2 border-blue-300 rounded-xl p-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-900 mb-2">${useCase.name}</h4>
                    <div class="flex flex-wrap gap-3 items-start">
                        <span class="px-3 py-1 ${consequenceBadgeClass} rounded-full text-xs font-bold">
                            ${useCase.consequence.toUpperCase()} CONSEQUENCE
                        </span>
                        ${formatReadinessBadge(useCase.readiness, readinessBadgeClass, 'normal', true)}
                    </div>
                </div>
                <button onclick="removeUseCase('${useCaseId}')"
                        class="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    Remove
                </button>
            </div>

            <div class="space-y-4">
                <!-- Map to Opportunity -->
                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-2">
                        Which Step 1 opportunity does this use case address? <span class="text-red-600">*</span>
                    </label>
                    <select id="opportunity-${useCaseId}"
                            onchange="updateUseCaseWorksheet('${useCaseId}', 'opportunityId', this.value)"
                            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        <option value="">Select an opportunity...</option>
                        ${(appState.step2.opportunities || []).map((opp, idx) => `
                            <option value="${opp.id}">
                                Opportunity ${opp.number}: ${opp.problem.substring(0, 80)}${opp.problem.length > 80 ? '...' : ''}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <!-- Priority Assignment -->
                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-2">
                        Implementation Priority <span class="text-red-600">*</span>
                    </label>
                    <select id="priority-${useCaseId}"
                            onchange="updateUseCaseWorksheet('${useCaseId}', 'priority', this.value)"
                            class="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        <option value="">Select priority ranking...</option>
                        ${Array.from({length: numSelectedUseCases}, (_, i) => i + 1).map(num => `
                            <option value="${num}">${num}</option>
                        `).join('')}
                    </select>
                    <p class="text-xs text-gray-600 mt-1">
                        Rank from 1 (highest priority) to ${numSelectedUseCases} (lowest priority)
                    </p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('selected-use-cases-worksheets').insertAdjacentHTML('beforeend', worksheetHTML);

    // Auto-populate priority to "1" if this is the only selected use case
    if (numSelectedUseCases === 1) {
        setTimeout(() => {
            const prioritySelect = document.getElementById(`priority-${useCaseId}`);
            if (prioritySelect) {
                prioritySelect.value = '1';
                updateUseCaseWorksheet(useCaseId, 'priority', '1');
            }
        }, 50);
    }

    console.log(`Created worksheet for ${useCaseId}`);
}

function updateUseCaseWorksheet(useCaseId, field, value) {
    if (!appState.step2.selectedUseCases[useCaseId]) {
        appState.step2.selectedUseCases[useCaseId] = {};
    }

    appState.step2.selectedUseCases[useCaseId][field] = value;
    saveProgress();
}

function refreshAllPriorityDropdowns() {
    const numSelectedUseCases = Object.keys(appState.step2.selectedUseCases || {}).length;

    Object.keys(appState.step2.selectedUseCases || {}).forEach(useCaseId => {
        const prioritySelect = document.getElementById(`priority-${useCaseId}`);
        if (!prioritySelect) return;

        // Save current value
        const currentValue = prioritySelect.value;

        // Rebuild options
        let optionsHTML = '<option value="">Select priority ranking...</option>';
        for (let i = 1; i <= numSelectedUseCases; i++) {
            optionsHTML += `<option value="${i}">${i}</option>`;
        }
        prioritySelect.innerHTML = optionsHTML;

        // Restore value if still valid
        if (currentValue && parseInt(currentValue) <= numSelectedUseCases) {
            prioritySelect.value = currentValue;
        } else if (currentValue && parseInt(currentValue) > numSelectedUseCases) {
            // Value is now out of range, clear it
            prioritySelect.value = '';
            appState.step2.selectedUseCases[useCaseId].priority = '';
        }

        // Update helper text
        const helperText = prioritySelect.nextElementSibling;
        if (helperText && helperText.tagName === 'P') {
            helperText.textContent = `Rank from 1 (highest priority) to ${numSelectedUseCases} (lowest priority)`;
        }
    });

    // Auto-populate if only one use case
    if (numSelectedUseCases === 1) {
        const singleUseCaseId = Object.keys(appState.step2.selectedUseCases || {})[0];
        const prioritySelect = document.getElementById(`priority-${singleUseCaseId}`);
        if (prioritySelect && !prioritySelect.value) {
            prioritySelect.value = '1';
            appState.step2.selectedUseCases[singleUseCaseId].priority = '1';
        }
    }

    saveProgress();
}

function restoreStep2Data() {
    console.log('Restoring Step 2 data...');

    // Restore filters (if saved)
    if (appState.step2.filters && (appState.step2.filters.consequence.length > 0 || appState.step2.filters.domain.length > 0)) {
        appState.step2.filters.consequence.forEach(val => {
            const checkbox = document.querySelector(`.consequence-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        appState.step2.filters.domain.forEach(val => {
            const checkbox = document.querySelector(`.domain-filter[value="${val}"]`);
            if (checkbox) checkbox.checked = true;
        });
        applyFilters();
    } else {
        // No filters: show all sections + reset counts
        document.querySelectorAll('.use-case-group').forEach(group => {
            group.style.display = 'block';
        });
        updateFilterCount();
        updateFilterVisualState();
    }

    // Ensure opportunityMappings exists
    if (!appState.step2.opportunityMappings) appState.step2.opportunityMappings = {};

    // Backward compatibility: if legacy selectedUseCases exist, convert to opportunityMappings
    if (appState.step2.selectedUseCases && Object.keys(appState.step2.selectedUseCases || {}).length > 0) {
        Object.keys(appState.step2.selectedUseCases || {}).forEach(useCaseId => {
            const legacy = appState.step2.selectedUseCases[useCaseId];
            if (legacy && legacy.opportunityId) {
                if (!appState.step2.opportunityMappings[legacy.opportunityId]) {
                    const uc = useCaseCatalog.find(u => u.id === useCaseId);
                    appState.step2.opportunityMappings[legacy.opportunityId] = {
                        useCaseId,
                        consequence: uc ? uc.consequence : '',
                        readiness: uc ? uc.readiness : ''
                    };
                }
            }
        });
    }

    // Render the opportunity-centric board
    renderOpportunityAlignmentBoard();

    // Update catalog buttons to reflect active selection state
    renderUseCaseCatalog();
}

function completeStep2() {
    // Ensure Step 3 can read selected use cases (legacy compatibility)
    rebuildLegacySelectedUseCasesFromOpportunityMappings();
    // Validation: every opportunity must be mapped to a use case + consequence + readiness
    const opps = (appState.step2.opportunities || []);
    if (opps.length === 0) {
        alert('No opportunities were found from Step 1. Please return to Step 1 and capture opportunities first.');
        return;
    }

    if (!appState.step2.opportunityMappings) appState.step2.opportunityMappings = {};

    const missing = [];
    opps.forEach(opp => {
        const mapping = appState.step2.opportunityMappings[opp.id];
        const oppLabel = `Opportunity ${opp.number}`;
        if (!mapping || !mapping.useCaseId) {
            missing.push(`"${oppLabel}" → Use case not selected`);
            return;
        }
        if (!mapping.consequence) missing.push(`"${oppLabel}" → Risk level not set`);
        if (!mapping.readiness) missing.push(`"${oppLabel}" → Technology readiness not set`);
    });

    if (missing.length > 0) {
        alert('Please complete the following before continuing:\n\n' + missing.join('\\n'));
        return;
    }

    // Mark step complete
    updateStepStatus(2, 'complete');
    saveProgress();

    // Navigate to Step 3
    navigateToStep(3);
}

function showInfo(type) {
    if (type === 'ai-domains-info') {
        alert('AI Domains represent the fundamental types of problems AI can solve:\n\n' +
              '• Detection: Identifying anomalies, faults, or security threats\n' +
              '• Prediction: Forecasting future states and proactive analytics\n' +
              '• Control & Optimization: Decision-making and grid operations\n' +
              '• Business & Customer: Engagement and enterprise functions');
    } else if (type === 'priority-info') {
        alert('Priority indicates the business importance of addressing this opportunity:\n\n' +
              '• High: Critical business need with significant impact\n' +
              '• Medium: Important but not urgent\n' +
              '• Low: Nice to have, limited immediate impact');
    }
}

