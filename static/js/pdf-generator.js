/**
 * COGNITO PDF Generator Module
 * COGNITOPDFGenerator class for generating PDF reports
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// =============================================================================
// COGNITO PDF GENERATOR CLASS
// =============================================================================

class COGNITOPDFGenerator {
    constructor(doc) {
this.doc = doc;
this.pageWidth = 612;
this.pageHeight = 792;
this.margin = { top: 65, bottom: 55, left: 50, right: 50 };
this.contentWidth = this.pageWidth - this.margin.left - this.margin.right;
this.y = this.margin.top;
this.page = 1;
this.toc = [];

this.colors = {
    primary: [30, 64, 175],
    secondary: [59, 130, 246],
    accent: [147, 51, 234],
    text: [31, 41, 55],
    textLight: [107, 114, 128],
    success: [22, 163, 74],
    warning: [202, 138, 4],
    danger: [220, 38, 38],
    orange: [234, 88, 12],
    border: [209, 213, 219],
    bgLight: [249, 250, 251],
    white: [255, 255, 255]
};

// Comprehensive mapping of principle questions
this.principleQuestions = {
    'investment-capacity': {
        q1: 'Cost Understanding (Budget Risk): Has a preliminary cost estimate been developed for this AI initiative?',
        q2: 'ROI/Value Case (Value Risk): Is there a documented business case showing expected ROI or value creation from this AI initiative?',
        q3: 'Budget Approval Status (Budget Risk): Has funding been secured for this AI initiative?',
        q4: 'Total Cost of Ownership Awareness (Budget Risk): Do decision-makers understand the total cost of ownership including infrastructure, personnel, vendors, data preparation, and ongoing operations?'
    },
    'skilled-personnel': {
        q1: 'AI/ML Experience Level (Resource Risk): What level of AI/ML development experience exists within your organization or team?',
        q2: 'Operational Domain Expertise Involvement (Resource Risk): Are operational domain experts from the relevant business area actively involved in or supporting this AI initiative?',
        q3: 'Training & Upskilling Strategy (Resource Risk): Is there a plan to train or upskill team members working on this specific AI initiative to reduce knowledge gaps and dependencies?',
        q4: 'Resource Availability (Timeline Risk): Can qualified personnel dedicate sufficient time to this AI initiative?'
    },
    'regulatory-compliance': {
        q1: 'Applicable Regulations Identified (Compliance Risk): Have you identified which regulations apply to this AI use case (NERC CIP, PUC requirements, data privacy laws, etc.)?',
        q2: 'AI Governance Framework (Compliance Risk): Are AI governance policies, procedures, and documentation practices established?',
        q3: 'Cybersecurity Controls (Security Risk): Have required cybersecurity controls for AI systems, data protection, and model integrity been identified and implemented?',
        q4: 'IT/OT Requirements Alignment (Technical Risk): Has it been confirmed that this AI initiative can operate within existing internal IT/OT policies, security requirements, and technical constraints?'
    },
    'clear-objectives': {
        q1: 'Defined Success Metrics (Value Risk): Have you defined specific, measurable success metrics and the thresholds that will determine if this AI initiative should move forward?',
        q2: 'Baseline Measurements (Value Risk): Have baseline measurements been captured to compare AI system performance against current state?',
        q3: 'Stakeholder Alignment (Resource Risk): Do all key stakeholders (operations, IT, leadership, affected departments) agree on what success looks like?',
        q4: 'Technical-Business Alignment (Value Risk): Do the technical capabilities of the proposed AI solution align with the business outcomes you need to achieve?'
    }
};

// Comprehensive mapping of red flag indicators
this.redFlagIndicators = {
    'investment-capacity': [
        'No dedicated budget exists, funding is uncertain, or approval is contingent on unproven ROI projections',
        'Budget covers only initial deployment without funds allocated for ongoing operations, monitoring, or model maintenance',
        'Total cost of ownership has not been estimated or is significantly underestimated compared to project scope',
        'Funding depends on competing priorities, grant applications, or regulatory rate recovery that has not been approved',
        'Investment intensity rating significantly exceeds available budget or resource commitments'
    ],
    'skilled-personnel': [
        'No staff with relevant AI/ML experience exists, and no training program or hiring plan has been developed',
        'Complete dependence on vendors with no plan for internal knowledge transfer or long-term operational ownership',
        'Technical staff lack operational domain expertise, or operational staff lack technical understanding to validate AI outputs',
        'Key person dependencies exist with no succession planning or documentation of critical knowledge'
    ],
    'regulatory-compliance': [
        'Applicable regulations have not been identified, or compliance requirements are unclear and unresolved',
        'AI governance policies do not exist, and no framework is in place for documentation, oversight, or accountability',
        'Use case involves NERC CIP scope systems, customer data, or critical infrastructure but compliance review has not been performed',
        'No engagement with regulators has occurred despite use case potentially requiring approval or having reporting obligations'
    ],
    'clear-objectives': [
        'Objectives are vague or qualitative without specific, measurable targets for success',
        'No baseline metrics exist to measure improvement, or success criteria have not been defined',
        'Stakeholder alignment is weak, with different groups having conflicting expectations about outcomes',
        'No decision framework exists for determining whether to proceed to production, expand scope, or terminate the project'
    ]
};

// Status label mapping
this.statusLabels = {
    // Legacy status values
    'good': '✓ Good',
    'needs-work': '⚠ Needs Work',
    'red-flag': '🚩 Red Flag',
    'not-sure': '? Not Sure',
    // Investment Capacity Q1
    'detailed-estimate': 'Detailed estimate exists',
    'rough-estimate': 'Rough estimate exists',
    'no-estimate': 'No estimate yet',
    'dont-know': "Don't know",
    // Investment Capacity Q2
    'quantified-roi': 'Yes, with quantified ROI',
    'qualitative-benefits': 'Yes, qualitative benefits',
    'in-development': 'In development',
    'not-yet-developed': 'Not yet developed',
    // Investment Capacity Q3
    'approved-allocated': 'Yes, approved & allocated',
    'in-approval': 'In approval process',
    'not-requested': 'Not yet requested',
    'unsure': 'Unsure',
    // Investment Capacity Q4
    'comprehensive': 'Comprehensive understanding',
    'partial': 'Partial understanding',
    'limited': 'Limited understanding',
    'not-discussed': 'Not yet discussed',
    // Skilled Personnel Q1
    'strong-expertise': 'Strong in-house expertise',
    'some-experience': 'Some experience available',
    'limited-no-experience': 'Limited/no experience',
    'unsure-capabilities': 'Unsure of capabilities',
    // Skilled Personnel Q2
    'actively-involved': 'Actively involved in project',
    'available-consultation': 'Available for consultation',
    'limited-no-involvement': 'Limited/no involvement yet',
    'unsure-involvement': 'Unsure of involvement level',
    // Skilled Personnel Q3
    'formal-training': 'Formal training planned',
    'informal-learning': 'Informal learning expected',
    'not-planned': 'Not yet planned',
    'not-needed-unsure': 'Not needed/unsure',
    // Skilled Personnel Q4
    'dedicated-resources': 'Dedicated resources available',
    'partial-allocation': 'Partial allocation possible',
    'competing-priorities': 'Competing priorities exist',
    'not-determined': 'Not yet determined',
    // Governance and Compliance Q1
    'fully-identified': 'Fully identified & documented',
    'partially-identified': 'Partially identified',
    'not-reviewed': 'Not yet reviewed',
    'unsure-what-applies': 'Unsure what applies',
    // Governance and Compliance Q2
    'established-operational': 'Established & operational',
    'planned-not-started': 'Planned but not started',
    'not-addressed': 'Not yet addressed',
    // Governance and Compliance Q3
    'identified-implemented': 'Identified & implemented',
    'identified-implementing': 'Identified, implementing',
    'assessment-progress': 'Assessment in progress',
    'not-assessed': 'Not yet assessed',
    // Governance and Compliance Q4
    'confirmed-compatible': 'Confirmed compatible',
    'conflicts-identified': 'Potential conflicts identified',
    // Clear Objectives Q1
    'metrics-thresholds': 'Metrics & thresholds defined',
    'metrics-thresholds-tbd': 'Metrics defined, thresholds TBD',
    'general-goals': 'General goals only',
    'not-defined': 'Not yet defined',
    // Clear Objectives Q2
    'baselines-documented': 'Baselines documented',
    'collection-progress': 'Collection in progress',
    // Clear Objectives Q3
    'strong-alignment': 'Strong alignment exists',
    'general-agreement': 'General agreement',
    'some-disagreement': 'Some disagreement',
    'not-aligned': 'Not yet aligned',
    // Clear Objectives Q4
    'mostly-aligned': 'Mostly aligned',
    'uncertain-alignment': 'Uncertain alignment',
    'not-evaluated': 'Not yet evaluated'
};
    }

    setColor(c, type = 'text') {
if (type === 'text') this.doc.setTextColor(c[0], c[1], c[2]);
else if (type === 'draw') this.doc.setDrawColor(c[0], c[1], c[2]);
else if (type === 'fill') this.doc.setFillColor(c[0], c[1], c[2]);
    }

    newPage() { this.doc.addPage(); this.page++; this.y = this.margin.top; }

    checkSpace(needed) {
if (this.y + needed > this.pageHeight - this.margin.bottom) { this.newPage(); return true; }
return false;
    }

    clean(text) {
return (text || '').toString().replace(/[\uF000-\uF8FF]/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
    }

    wrap(text, maxWidth, fontSize) {
this.doc.setFontSize(fontSize);
const words = this.clean(text).split(' ').filter(w => w);
const lines = []; let line = '';
for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (this.doc.getTextWidth(test) > maxWidth && line) { lines.push(line); line = word; }
    else { line = test; }
}
if (line) lines.push(line);
return lines.length ? lines : [''];
    }

    text(str, x, size, opts = {}) {
const { color = this.colors.text, bold = false, italic = false, maxWidth = this.contentWidth - (x - this.margin.left), lineHeight = 1.4 } = opts;
const cleaned = this.clean(str);
if (!cleaned) return;
const style = bold ? (italic ? 'bolditalic' : 'bold') : (italic ? 'italic' : 'normal');
this.doc.setFontSize(size); this.doc.setFont('helvetica', style); this.setColor(color);
const lines = this.wrap(cleaned, maxWidth, size);
const h = size * lineHeight;
this.checkSpace(lines.length * h);
for (const line of lines) { this.doc.text(line, x, this.y); this.y += h; }
    }

    heading(title, level = 1) {
const sizes = { 1: 16, 2: 13, 3: 11 };
const size = sizes[level] || 11;
this.checkSpace(size + 30);
if (level === 1) {
    this.toc.push({ title: this.clean(title), page: this.page });
    this.y += 15;
    this.setColor(this.colors.primary, 'fill');
    this.doc.rect(this.margin.left, this.y - 12, 4, 16, 'F');
    this.text(title, this.margin.left + 12, size, { color: this.colors.primary, bold: true });
    this.setColor(this.colors.border, 'draw');
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin.left, this.y + 3, this.pageWidth - this.margin.right, this.y + 3);
    this.y += 12;
} else { this.y += 8; this.text(title, this.margin.left, size, { bold: true }); this.y += 3; }
    }

    label(lbl) {
this.checkSpace(18);
this.doc.setFontSize(10); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.text);
this.doc.text(this.clean(lbl).toUpperCase(), this.margin.left, this.y);
this.y += 14;
    }

    value(val, indent = 0) { if (!val || !this.clean(val)) return; this.text(val, this.margin.left + indent, 10); this.y += 3; }

    labelValue(lbl, val, indent = 0) { if (!val || !this.clean(val)) return; this.checkSpace(30); this.label(lbl); this.value(val, indent); }

    bullet(str, indent = 0) {
const x = this.margin.left + indent;
const lines = this.wrap(str, this.contentWidth - indent - 15, 10);
this.checkSpace(lines.length * 14 + 5);
this.setColor(this.colors.text, 'fill');
this.doc.circle(x + 3, this.y - 3, 2, 'F');
this.doc.setFontSize(10); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.text);
for (const line of lines) { this.doc.text(line, x + 12, this.y); this.y += 14; }
    }

    infoBox(str, borderColor = this.colors.secondary) {
const padding = 10;
const lines = this.wrap(str, this.contentWidth - padding * 2 - 6, 10);
const boxH = lines.length * 14 + padding * 2;
this.checkSpace(boxH + 10);
this.setColor(this.colors.bgLight, 'fill');
this.doc.rect(this.margin.left, this.y, this.contentWidth, boxH, 'F');
this.setColor(borderColor, 'fill');
this.doc.rect(this.margin.left, this.y, 4, boxH, 'F');
this.setColor(this.colors.border, 'draw');
this.doc.setLineWidth(0.5);
this.doc.rect(this.margin.left, this.y, this.contentWidth, boxH, 'S');
this.y += padding + 10;
this.doc.setFontSize(10); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.text);
for (const line of lines) { this.doc.text(line, this.margin.left + padding + 6, this.y); this.y += 14; }
this.y += padding - 5;
    }

    statBoxes(stats) {
const boxW = (this.contentWidth - 20) / stats.length;
const boxH = 50;
this.checkSpace(boxH + 15);
stats.forEach((s, i) => {
    const x = this.margin.left + (boxW + 10) * i;
    this.setColor([239, 246, 255], 'fill');
    this.doc.roundedRect(x, this.y, boxW, boxH, 4, 4, 'F');
    this.setColor(this.colors.secondary, 'draw');
    this.doc.setLineWidth(1);
    this.doc.roundedRect(x, this.y, boxW, boxH, 4, 4, 'S');
    this.doc.setFontSize(22); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.primary);
    this.doc.text(String(s.value), x + boxW / 2, this.y + 25, { align: 'center' });
    this.doc.setFontSize(8); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.textLight);
    this.doc.text(s.label, x + boxW / 2, this.y + 40, { align: 'center' });
});
this.y += boxH + 15;
    }

    table(headers, rows) {
if (!rows.length) return;
const colW = this.contentWidth / headers.length;
const rowH = 18;
this.checkSpace((rows.length + 1) * rowH + 10);
this.setColor([239, 246, 255], 'fill');
this.doc.rect(this.margin.left, this.y, this.contentWidth, rowH, 'F');
this.doc.setFontSize(9); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.text);
headers.forEach((h, i) => { this.doc.text(this.clean(h).substring(0, 20), this.margin.left + 5 + colW * i, this.y + 12); });
this.y += rowH;
this.doc.setFont('helvetica', 'normal');
rows.forEach((row, ri) => {
    if (ri % 2 === 1) { this.setColor(this.colors.bgLight, 'fill'); this.doc.rect(this.margin.left, this.y, this.contentWidth, rowH, 'F'); }
    this.setColor(this.colors.text);
    row.forEach((cell, ci) => { this.doc.text(this.clean(cell).substring(0, 25), this.margin.left + 5 + colW * ci, this.y + 12); });
    this.y += rowH;
});
this.setColor(this.colors.border, 'draw');
this.doc.rect(this.margin.left, this.y - (rows.length + 1) * rowH, this.contentWidth, (rows.length + 1) * rowH, 'S');
this.y += 10;
    }

    coverPage() {
this.setColor([239, 246, 255], 'fill');
this.doc.rect(0, 0, this.pageWidth, this.pageHeight * 0.45, 'F');
this.y = 180;
this.setColor(this.colors.primary, 'fill');
this.doc.circle(this.pageWidth / 2, this.y, 35, 'F');
this.doc.setFontSize(30); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.white);
this.doc.text('C', this.pageWidth / 2, this.y + 10, { align: 'center' });
this.y += 65;
this.doc.setFontSize(32); this.setColor(this.colors.primary);
this.doc.text('COGNITO', this.pageWidth / 2, this.y, { align: 'center' });
this.y += 28;
this.doc.setFontSize(14); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.text);
this.doc.text('AI Readiness Framework', this.pageWidth / 2, this.y, { align: 'center' });
this.y += 40;
this.doc.setFontSize(18); this.doc.setFont('helvetica', 'bold');
this.doc.text('Assessment Summary Report', this.pageWidth / 2, this.y, { align: 'center' });
this.y += 55;
this.doc.setFontSize(11); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.textLight);
const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
this.doc.text('Generated: ' + dateStr, this.pageWidth / 2, this.y, { align: 'center' });
this.y = this.pageHeight - 100;
this.setColor(this.colors.primary, 'draw'); this.doc.setLineWidth(2);
this.doc.line(this.pageWidth * 0.25, this.y, this.pageWidth * 0.75, this.y);
this.y += 22;
this.doc.setFontSize(11); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.primary);
this.doc.text('Idaho National Laboratory', this.pageWidth / 2, this.y, { align: 'center' });
this.y += 15;
this.doc.setFontSize(10); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.textLight);
this.doc.text('Center for Securing Digital Energy Technology (CSDET)', this.pageWidth / 2, this.y, { align: 'center' });
    }

    tocPage() {
this.newPage();
const tocPageNum = this.page;
this.y = this.margin.top;
this.doc.setFontSize(20); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.primary);
this.doc.text('Table of Contents', this.margin.left, this.y);
this.y += 30;
return tocPageNum;
    }

    updateTOC(tocPageNum) {
this.doc.setPage(tocPageNum);
let y = this.margin.top + 40;
for (const entry of this.toc) {
    this.doc.setFontSize(11); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.text);
    const title = entry.title.substring(0, 55);
    const pg = entry.page - 1;
    this.doc.text(title, this.margin.left + 10, y);
    const tw = this.doc.getTextWidth(title);
    this.setColor(this.colors.textLight);
    let dx = this.margin.left + 20 + tw;
    const end = this.pageWidth - this.margin.right - 20;
    while (dx < end) { this.doc.text('.', dx, y); dx += 4; }
    this.setColor(this.colors.text);
    this.doc.text(String(pg), this.pageWidth - this.margin.right, y, { align: 'right' });
    y += 18;
}
    }

    addHeadersFooters() {
const total = this.doc.internal.getNumberOfPages();
for (let i = 2; i <= total; i++) {
    this.doc.setPage(i);
    this.doc.setFontSize(8); this.doc.setFont('helvetica', 'normal'); this.setColor(this.colors.textLight);
    this.doc.text('COGNITO AI Readiness Assessment', this.margin.left, 35);
    this.doc.text('Idaho National Laboratory', this.pageWidth - this.margin.right, 35, { align: 'right' });
    this.setColor(this.colors.border, 'draw'); this.doc.setLineWidth(0.5);
    this.doc.line(this.margin.left, 42, this.pageWidth - this.margin.right, 42);
    this.doc.line(this.margin.left, this.pageHeight - 38, this.pageWidth - this.margin.right, this.pageHeight - 38);
    this.setColor(this.colors.textLight);
    this.doc.text('Center for Securing Digital Energy Technology (CSDET)', this.margin.left, this.pageHeight - 26);
    this.doc.text('Page ' + (i - 1) + ' of ' + (total - 1), this.pageWidth - this.margin.right, this.pageHeight - 26, { align: 'right' });
}
    }

    getUCName(id) {
if (typeof useCaseCatalog !== 'undefined' && Array.isArray(useCaseCatalog)) {
    const uc = useCaseCatalog.find(u => u.id === id);
    if (uc && uc.name) return uc.name;
}
return id || 'Use Case';
    }

    aboutSection() {
this.heading('About the COGNITO Framework', 1);
this.text('Developed by Idaho National Laboratory (INL), the COGNITO Framework provides a structured method for assessing AI readiness in the electric power sector. It enables utilities to evaluate the technical, organizational, and governance factors that determine whether AI can be implemented responsibly.', this.margin.left, 10, { lineHeight: 1.5 });
this.y += 10;
this.text('The framework guides users through a five-step process:', this.margin.left, 10, { bold: true });
this.y += 8;
['Identify Business Context: Map current capabilities to identify AI opportunities.',
 'Align AI Use Cases: Match opportunities to specific AI applications.',
 'Analyze AI Principles: Evaluate readiness across six key principles.',
 'Implementation Planning: Create scenarios and validate resources.',
 'Engineering Controls: Identify safeguards for responsible deployment.'
].forEach((s, i) => this.bullet('Step ' + (i + 1) + ' - ' + s, 10));
this.y += 15;
    }

    summarySection() {
this.heading('Assessment Completion Summary', 1);

// Collect capabilities and opportunities
let caps = 0, opps = 0, ucs = 0;
const capabilityNames = [];
const opportunityList = [];

if (appState.step1 && appState.step1.capabilities) {
    const capsObj = appState.step1.capabilities;
    caps = Object.keys(capsObj).length;
    Object.values(capsObj).forEach(c => {
        // Collect capability name
        if (c.name) capabilityNames.push(c.name);
        // Collect opportunities
        if (c.opportunities) {
            opps += c.opportunities.length;
            c.opportunities.forEach(o => {
                if (o.problem) {
                    opportunityList.push({
                        problem: o.problem,
                        priority: o.priority || 'Not Set',
                        capability: c.name || 'Unknown Capability'
                    });
                }
            });
        }
    });
}

// Collect use cases
const mappings = (appState.step2 && appState.step2.opportunityMappings) || {};
const ucSet = new Set();
const useCaseNames = [];
Object.values(mappings).forEach(m => {
    if (m && m.useCaseId) {
        ucSet.add(m.useCaseId);
    }
});
ucs = ucSet.size;

// Get use case names from catalog
ucSet.forEach(ucId => {
    if (typeof useCaseCatalog !== 'undefined' && Array.isArray(useCaseCatalog)) {
        const uc = useCaseCatalog.find(u => u.id === ucId);
        if (uc && uc.name) useCaseNames.push(uc.name);
        else useCaseNames.push(ucId);
    } else {
        useCaseNames.push(ucId);
    }
});

// Display stat boxes
this.statBoxes([{ value: caps, label: 'Capabilities Assessed' }, { value: opps, label: 'Opportunities Identified' }, { value: ucs, label: 'Use Cases Selected' }]);

// Display detailed lists
var self = this;

// Capabilities List
if (capabilityNames.length > 0) {
    this.checkSpace(40);
    this.heading('Capabilities Assessed', 2);
    capabilityNames.forEach(function(name, idx) {
        self.checkSpace(15);
        self.doc.setFontSize(10); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
        self.doc.text((idx + 1) + '. ' + name, self.margin.left + 10, self.y);
        self.y += 14;
    });
    this.y += 5;
}

// Opportunities List
if (opportunityList.length > 0) {
    this.checkSpace(40);
    this.heading('Opportunities Identified', 2);
    opportunityList.forEach(function(opp, idx) {
        self.checkSpace(25);
        self.doc.setFontSize(10); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
        var oppText = (idx + 1) + '. ' + opp.problem;
        var oppLines = self.wrap(oppText, self.contentWidth - 20, 10);
        oppLines.forEach(function(line) {
            self.doc.text(line, self.margin.left + 10, self.y);
            self.y += 12;
        });
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
        self.doc.text('Capability: ' + opp.capability + ' | Priority: ' + opp.priority, self.margin.left + 15, self.y);
        self.y += 14;
    });
    this.y += 5;
}

// Use Cases List
if (useCaseNames.length > 0) {
    this.checkSpace(40);
    this.heading('Use Cases Selected', 2);
    useCaseNames.forEach(function(name, idx) {
        self.checkSpace(15);
        self.doc.setFontSize(10); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
        var ucLines = self.wrap((idx + 1) + '. ' + name, self.contentWidth - 20, 10);
        ucLines.forEach(function(line) {
            self.doc.text(line, self.margin.left + 10, self.y);
            self.y += 14;
        });
    });
    this.y += 5;
}
    }

    step1Section() {
this.heading('Step 1: Business Context Assessment', 1);
this.infoBox('This step assesses current organizational capabilities to identify where AI can deliver value. Each capability is rated for maturity (1-5) and classified by opportunity type (Fix, Optimize, or Enhance).', this.colors.secondary);
this.y += 10;
const caps = (appState.step1 && appState.step1.capabilities) || {};
const keys = Object.keys(caps);
if (!keys.length) { this.text('No capability assessments completed.', this.margin.left, 10, { italic: true, color: this.colors.textLight }); return; }
keys.forEach((id, idx) => {
    const c = caps[id];
    this.checkSpace(80);
    this.heading((idx + 1) + '. ' + (c.name || 'Unnamed Capability'), 2);
    if (c.description) this.labelValue('Capability Description', c.description);
    if (c.maturityLevel) {
        const maturityDefs = {
            1: { name: 'Ad-Hoc', desc: 'Processes are poorly defined or undocumented, with success depending on individual effort rather than standardized procedures. Outcomes are unpredictable and inconsistent.' },
            2: { name: 'Repeatable', desc: 'Basic processes exist and can be repeated, though documentation remains informal or inconsistent. Some performance tracking occurs but is not standardized.' },
            3: { name: 'Standardized', desc: 'Processes are documented and standardized across the organization with employees following established procedures. Performance metrics are defined and tracked.' },
            4: { name: 'Measured', desc: 'Processes are measured using statistical and quantitative techniques with data-driven decision-making as standard practice. Performance is monitored and controlled.' },
            5: { name: 'Optimized', desc: 'Continuous improvement is embedded in organizational culture with proactive innovation identification. Focus is on preventing problems before they occur.' }
        };
        const sel = maturityDefs[c.maturityLevel];
        this.labelValue('Maturity Level', c.maturityLevel + '/5 - ' + (sel ? sel.name : ''));
        if (sel && sel.desc) {
            this.checkSpace(30);
            this.doc.setFontSize(9); this.doc.setFont('helvetica', 'italic'); this.setColor(this.colors.textLight);
            var descLines = this.wrap('Selected Level Definition: ' + sel.desc, this.contentWidth - 20, 9);
            descLines.forEach(line => { this.doc.text(line, this.margin.left + 10, this.y); this.y += 11; });
        }
        // Add Maturity Scale Reference
        this.checkSpace(80);
        this.y += 5;
        this.doc.setFontSize(9); this.doc.setFont('helvetica', 'bold'); this.setColor(this.colors.text);
        this.doc.text('Maturity Scale Reference (1-5):', this.margin.left + 10, this.y);
        this.y += 12;
        for (let lvl = 1; lvl <= 5; lvl++) {
            const def = maturityDefs[lvl];
            this.doc.setFontSize(8);
            this.doc.setFont('helvetica', 'normal');
            this.setColor(this.colors.textLight);
            this.doc.text(lvl + ' - ' + def.name, this.margin.left + 15, this.y);
            this.y += 10;
        }
        this.y += 5;
    }
    if (c.opportunityType) {
        const types = { F: 'FOUNDATIONAL', O: 'Optimize', E: 'Enhance/Scale' };
        this.labelValue('Opportunity Type', types[c.opportunityType] || c.opportunityType);
    }
    if (c.evidence) this.labelValue('Current State Evidence', c.evidence);
    if (c.opportunities && c.opportunities.length) {
        this.label('Identified Opportunities');
        c.opportunities.forEach(o => {
            this.checkSpace(40);
            this.bullet((o.problem || 'Opportunity') + ' (' + (o.priority || 'Not Set') + ' Priority)', 10);
            if (o.impacts && o.impacts.length) {
                var impactLabels = {
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
                this.text('Business Impact: ' + o.impacts.map(function(i) { return impactLabels[i] || capitalizeFirst(i); }).join(', '), this.margin.left + 25, 9, { color: this.colors.textLight });
            }
            if (o.domains && o.domains.length) {
                var domainLabels = {
                    'detection': 'Detection: Anomaly and Fault Detection',
                    'prediction': 'Prediction: Forecasting and Proactive Analytics',
                    'control': 'Control & Optimization: Decision-Making and Grid Operations',
                    'business': 'Business & Customer Applications: Engagement and Enterprise Functions'
                };
                this.text('AI Domains: ' + o.domains.map(function(d) { return domainLabels[d] || capitalizeFirst(d); }).join(', '), this.margin.left + 25, 9, { color: this.colors.textLight });
            }
        });
    }
    this.y += 10;
});
    }

    step2Section() {
this.heading('Step 2: AI Use Case Selection', 1);
this.infoBox('This step matches identified opportunities to specific AI applications from a comprehensive use case catalog. Each use case is evaluated on Use Case Risk Level (impact of failure) and Technology Readiness (commercial maturity).', this.colors.accent);
this.y += 10;
const mappings = (appState.step2 && appState.step2.opportunityMappings) || {};
const opportunities = (appState.step2 && appState.step2.opportunities) || [];
const ucMap = new Map();
Object.entries(mappings).forEach(function(entry) {
    var oppId = entry[0], m = entry[1];
    if (!m || !m.useCaseId) return;
    var uc = ucMap.get(m.useCaseId);
    if (!uc) {
        var cat = (typeof useCaseCatalog !== 'undefined') ? useCaseCatalog.find(function(u) { return u.id === m.useCaseId; }) : null;
        uc = { id: m.useCaseId, name: cat ? cat.name : m.useCaseId, consequence: cat ? cat.consequence : null, readiness: cat ? cat.readiness : null, description: cat ? cat.description : null, domains: cat ? cat.domains : null, justification: cat ? cat.justification : null, opps: [] };
        ucMap.set(m.useCaseId, uc);
    }
    var opp = opportunities.find(function(o) { return o.id === oppId; });
    if (opp) uc.opps.push(opp);
});
const useCases = Array.from(ucMap.values());
if (!useCases.length) { this.text('No use cases selected.', this.margin.left, 10, { italic: true, color: this.colors.textLight }); return; }
this.text('Selected ' + useCases.length + ' AI use case' + (useCases.length !== 1 ? 's' : '') + ' aligned with organizational needs.', this.margin.left, 10);
this.y += 10;
var self = this;
useCases.forEach(function(uc, idx) {
    self.checkSpace(100);
    self.heading((idx + 1) + '. ' + uc.name, 2);
    if (uc.description) self.labelValue('Use Case Description', uc.description);
    var cons = uc.consequence ? uc.consequence.charAt(0).toUpperCase() + uc.consequence.slice(1) : 'Unknown';
    self.labelValue('Use Case Risk Level', cons);

    // Add Use Case Risk Level definitions
    var riskLevelDefs = {
        'Low': 'Support functions with limited direct operational impact. Failures result in reduced efficiency or missed optimization opportunities, but do not directly threaten grid stability, service continuity, or safety.',
        'Moderate': 'Important operations with sufficient time for human review before action. Failures result in financial losses, reliability metric degradation, or suboptimal decisions affecting service quality.',
        'High': 'Critical decisions with significant safety or reliability implications. Failures result in extended outages, unsafe operating conditions, or compromised asset integrity.',
        'Highest': 'Real-time autonomous control with immediate safety and reliability impacts. Direct autonomous control of grid protection, stability, and operations in milliseconds to seconds.'
    };
    if (riskLevelDefs[cons]) {
        self.checkSpace(30);
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
        var riskLines = self.wrap('Definition: ' + riskLevelDefs[cons], self.contentWidth - 20, 9);
        riskLines.forEach(function(line) { self.doc.text(line, self.margin.left + 10, self.y); self.y += 11; });
    }
    // Add Risk Level Scale Reference
    self.checkSpace(50);
    self.y += 3;
    self.doc.setFontSize(8); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
    self.doc.text('Risk Level Scale:', self.margin.left + 10, self.y);
    self.y += 10;
    ['Low', 'Moderate', 'High', 'Highest'].forEach(function(lvl) {
        self.doc.setFontSize(8);
        self.doc.setFont('helvetica', 'normal');
        self.setColor(self.colors.textLight);
        self.doc.text(lvl, self.margin.left + 15, self.y);
        self.y += 9;
    });
    self.y += 3;

    self.labelValue('Technology Readiness', uc.readiness || 'Unknown');

    // Add Technology Readiness definitions
    var readinessDefs = {
        'Ready Now': 'Proven commercial solutions with demonstrated utility sector success. Multiple utilities have implemented the technology and report measurable operational benefits.',
        'Ready Now / Emerging': 'Solutions bridging proven and emerging stages. Core capabilities are demonstrated with some advanced features still maturing.',
        'Emerging': 'Early deployments and pilots with validated concepts but limited adoption. Limited but credible demonstrations and research projects have validated the concept.',
        'Future State': 'Research-stage concepts with 3-5+ year timeline to commercial availability. Widespread commercial solutions do not yet exist.'
    };
    var readinessVal = uc.readiness || 'Unknown';
    if (readinessDefs[readinessVal]) {
        self.checkSpace(30);
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
        var readLines = self.wrap('Definition: ' + readinessDefs[readinessVal], self.contentWidth - 20, 9);
        readLines.forEach(function(line) { self.doc.text(line, self.margin.left + 10, self.y); self.y += 11; });
    }
    // Add Technology Readiness Scale Reference
    self.checkSpace(50);
    self.y += 3;
    self.doc.setFontSize(8); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
    self.doc.text('Readiness Scale:', self.margin.left + 10, self.y);
    self.y += 10;
    ['Ready Now', 'Ready Now / Emerging', 'Emerging', 'Future State'].forEach(function(lvl) {
        self.doc.setFontSize(8);
        self.doc.setFont('helvetica', 'normal');
        self.setColor(self.colors.textLight);
        self.doc.text(lvl, self.margin.left + 15, self.y);
        self.y += 9;
    });
    self.y += 5;

    if (uc.domains && uc.domains.length) {
        var domainLabels = {
            'detection': 'Detection: Anomaly and Fault Detection',
            'prediction': 'Prediction: Forecasting and Proactive Analytics',
            'control': 'Control & Optimization: Decision-Making and Grid Operations',
            'business': 'Business & Customer Applications: Engagement and Enterprise Functions'
        };
        self.label('AI Domains');
        uc.domains.forEach(function(d) {
            var domainText = domainLabels[d] || (d.charAt(0).toUpperCase() + d.slice(1));
            self.doc.setFontSize(10); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
            self.doc.text('• ' + domainText, self.margin.left + 10, self.y);
            self.y += 14;
        });
    }
    if (uc.justification) self.labelValue('Use Case Risk Level Justification', uc.justification);
    if (uc.opps && uc.opps.length) {
        self.y += 3;
        self.label('Addresses These Business Needs');
        uc.opps.forEach(function(o) {
            self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
            var oppText = (o.capability ? o.capability + ': ' : '') + o.problem + ' (' + (o.priority || 'Not Set') + ' Priority)';
            self.text('• ' + oppText, self.margin.left + 10, 9);
        });
    }
    self.y += 10;
});
    }

    step3Section() {
this.heading('Step 3: Analyze AI Principles', 1);
this.infoBox('This step evaluates organizational readiness across key AI principles including Risk Management, Data Availability, Infrastructure, Investment Capacity, Skilled Personnel, Governance and Compliance, and Clear Objectives.', this.colors.warning);
this.y += 10;
var s3 = appState.step3 || {};
var risks = s3.riskAnalyses || {};
var data = s3.dataAssessments || {};
var principles = s3.principles || {};
var self = this;
var riskKeys = Object.keys(risks);
if (riskKeys.length) {
    this.heading('Risk Management', 2);

    // Consequence category labels for reference
    var consequenceCategoryNames = {
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

    riskKeys.forEach(function(ucId, idx) {
        var r = risks[ucId] || {};
        self.checkSpace(60);
        self.doc.setFontSize(11); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
        self.doc.text((idx + 1) + '. ' + self.getUCName(ucId), self.margin.left + 5, self.y);
        self.y += 15;

        // Organizational Risk Level
        if (r.riskLevel) {
            self.label('Organizational Risk Level');
            self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
            self.doc.text(r.riskLevel + (r.totalScore !== undefined ? ' (Score: ' + r.totalScore + '/45)' : ''), self.margin.left + 10, self.y);
            self.y += 12;

            // Add Risk Level definition
            var orgRiskDefs = {
                'Low': 'Total Score 1-9. Minimal operational impact if AI fails. Traditional processes provide adequate backup.',
                'Moderate': 'Total Score 10-20. Noticeable impact requiring significant response but limited direct safety or reliability threats.',
                'High': 'Total Score 21-30. Significant safety or reliability implications. Extended outages or unsafe conditions possible.',
                'Critical': 'Total Score 31-45. Severe consequences across multiple categories. Immediate safety and reliability impacts likely.'
            };
            if (orgRiskDefs[r.riskLevel]) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                var riskDefLines = self.wrap('Definition: ' + orgRiskDefs[r.riskLevel], self.contentWidth - 20, 9);
                riskDefLines.forEach(function(line) { self.doc.text(line, self.margin.left + 10, self.y); self.y += 11; });
            }
            // Add Risk Level Scale Reference
            self.checkSpace(50);
            self.y += 3;
            self.doc.setFontSize(8); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
            self.doc.text('Organizational Risk Level Scale (based on Total Score 1-45):', self.margin.left + 10, self.y);
            self.y += 10;
            [{ lvl: 'Low', range: '1-9' }, { lvl: 'Moderate', range: '10-20' }, { lvl: 'High', range: '21-30' }, { lvl: 'Critical', range: '31-45' }].forEach(function(item) {
                self.doc.setFontSize(8);
                self.doc.setFont('helvetica', 'normal');
                self.setColor(self.colors.textLight);
                self.doc.text(item.lvl + ' (' + item.range + ')', self.margin.left + 15, self.y);
                self.y += 9;
            });
            self.y += 5;
        }

        // Consequence Scores
        var cs = r.consequenceScores || {};
        var hasConsequenceScores = Object.keys(cs).some(function(k) { return !k.endsWith('-notes') && cs[k] > 0; });
        if (hasConsequenceScores) {
            self.checkSpace(40);
            self.label('Consequence Assessment');

            // Define scale labels for each category (0-5) - using exact labels from HTML definitions
            var consequenceScaleLabels = {
                'service-loss': ['No customers affected', 'Individual customer or premise', 'Small group (< 100 customers)', 'Neighborhood/feeder (100-1000 customers)', 'Large area/substation (1000+ customers)', 'Transmission-level impact (regional)'],
                'outage-duration': ['No outage', 'Momentary (< 15 min)', 'Brief (15-60 min)', 'Extended (1-4 hours)', 'Prolonged (4-24 hours)', 'Multi-day (> 24 hours)'],
                'safety-impact': ['No safety risk', 'Minor concern (awareness needed)', 'Potential for minor injury', 'Serious injury likely', 'Multiple serious injuries possible', 'Life-threatening or fatal'],
                'asset-integrity': ['No damage', 'Cosmetic (cleaning/repainting)', 'Minor repair (quick fix, low cost)', 'Significant repair (parts, downtime)', 'Major repair (weeks, substantial cost)', 'Total loss (replacement required)'],
                'privacy-security': ['No data exposed', 'Limited internal data only', 'Customer names/addresses', 'Account/payment details', 'Protected/regulated data (CEII, CIP)', 'Mass PII breach (legal exposure)'],
                'data-loss': ['No data lost', 'Fully recoverable (backups exist)', 'Partial loss (some gaps acceptable)', 'Significant loss (impacts operations)', 'Major loss (business disruption)', 'Complete/permanent loss'],
                'economic-cost': ['Negligible (< $10k)', 'Minor (< $50k)', 'Moderate ($50k-$100k)', 'Significant ($100k-$500k)', 'Major ($500k-$2M)', 'Severe (> $2M)'],
                'reliability-metrics': ['No measurable impact', 'Minimal (barely detectable)', 'Noticeable (internal tracking)', 'Moderate (potential regulatory notice)', 'Significant (affects benchmarks)', 'Severe (regulatory action likely)'],
                'reputation': ['No public awareness', 'Minimal (internal only)', 'Local attention (community level)', 'Regional coverage (state/area news)', 'Widespread (national attention)', 'Crisis (major brand impact)']
            };

            Object.keys(consequenceCategoryNames).forEach(function(catId) {
                var score = cs[catId];
                var notes = cs[catId + '-notes'];
                if (score !== undefined && score > 0) {
                    var scaleLabels = consequenceScaleLabels[catId] || [];
                    var selectedLabel = scaleLabels[score] || '';

                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('• ' + consequenceCategoryNames[catId] + ': ' + score + '/5' + (selectedLabel ? ' - ' + selectedLabel : ''), self.margin.left + 10, self.y);
                    self.y += 10;

                    // Add scale reference for this category
                    self.checkSpace(60);
                    self.doc.setFontSize(7); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.textLight);
                    self.doc.text('Scale: ', self.margin.left + 15, self.y);
                    self.y += 8;
                    for (var i = 0; i <= 5; i++) {
                        self.doc.setFontSize(7);
                        self.doc.setFont('helvetica', 'normal');
                        self.setColor(self.colors.textLight);
                        var label = scaleLabels[i] || ('Level ' + i);
                        self.doc.text(i + ' = ' + label, self.margin.left + 20, self.y);
                        self.y += 7;
                    }
                    self.y += 3;

                    if (notes) {
                        self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                        var noteLines = self.wrap('Notes: ' + notes, self.contentWidth - 30, 8);
                        noteLines.forEach(function(line) {
                            self.doc.text(line, self.margin.left + 15, self.y);
                            self.y += 9;
                        });
                    }
                    self.y += 5;
                }
            });
            self.y += 5;
        }

        // System Boundaries
        var sb = r.systemBoundaries || {};
        var hasBoundaries = sb.aiDecisions || sb.humanDecisions || sb.alertConditions || sb.worstCase;
        if (hasBoundaries) {
            self.checkSpace(60);
            self.label('System Boundaries & Decision Authority');

            if (sb.aiDecisions) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What decisions or actions will the AI system make?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var aiLines = self.wrap(sb.aiDecisions, self.contentWidth - 30, 9);
                aiLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            if (sb.humanDecisions) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What decisions remain with human operators?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var humanLines = self.wrap(sb.humanDecisions, self.contentWidth - 30, 9);
                humanLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            if (sb.alertConditions) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('Under what conditions should the AI stop and alert humans?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var alertLines = self.wrap(sb.alertConditions, self.contentWidth - 30, 9);
                alertLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            if (sb.worstCase) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What is the worst operational state if the AI fails completely?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var worstLines = self.wrap(sb.worstCase, self.contentWidth - 30, 9);
                worstLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }
        }

        // Failure Modes
        var fm = r.failureModes || {};
        if ((fm.availability && fm.availability.enabled) || (fm.accuracy && fm.accuracy.enabled) || (fm.latency && fm.latency.enabled)) {
            self.checkSpace(40);
            self.label('Failure Mode Identification');

            if (fm.availability && fm.availability.enabled) {
                self.checkSpace(50);
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('Availability Failure', self.margin.left + 10, self.y);
                self.y += 10;
                self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                self.doc.text('System is unavailable when needed (server down, network issues, resource exhaustion)', self.margin.left + 10, self.y);
                self.y += 12;

                if (fm.availability.how) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How could this occur?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var howLines = self.wrap(fm.availability.how, self.contentWidth - 35, 9);
                    howLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.availability.impact) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('What is the impact if it\'s unavailable?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var impactLines = self.wrap(fm.availability.impact, self.contentWidth - 35, 9);
                    impactLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.availability.detect) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How would you detect it?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var detectLines = self.wrap(fm.availability.detect, self.contentWidth - 35, 9);
                    detectLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                self.y += 5;
            }

            if (fm.accuracy && fm.accuracy.enabled) {
                self.checkSpace(50);
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('Accuracy/Inaccuracy Failure', self.margin.left + 10, self.y);
                self.y += 10;
                self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                self.doc.text('System produces incorrect outputs (false positives, false negatives, wrong predictions)', self.margin.left + 10, self.y);
                self.y += 12;

                if (fm.accuracy.how) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How could this occur?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var howLines = self.wrap(fm.accuracy.how, self.contentWidth - 35, 9);
                    howLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.accuracy.impact) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('What is the impact of incorrect outputs?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var impactLines = self.wrap(fm.accuracy.impact, self.contentWidth - 35, 9);
                    impactLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.accuracy.detect) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How would you detect it?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var detectLines = self.wrap(fm.accuracy.detect, self.contentWidth - 35, 9);
                    detectLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                self.y += 5;
            }

            if (fm.latency && fm.latency.enabled) {
                self.checkSpace(50);
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('Speed/Latency Failure', self.margin.left + 10, self.y);
                self.y += 10;
                self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                self.doc.text('System takes too long to respond (exceeds acceptable latency for time-critical applications)', self.margin.left + 10, self.y);
                self.y += 12;

                if (fm.latency.how) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How could this occur?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var howLines = self.wrap(fm.latency.how, self.contentWidth - 35, 9);
                    howLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.latency.impact) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('What is the impact of slow response?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var impactLines = self.wrap(fm.latency.impact, self.contentWidth - 35, 9);
                    impactLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                if (fm.latency.detect) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('How would you detect it?', self.margin.left + 15, self.y); self.y += 10;
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var detectLines = self.wrap(fm.latency.detect, self.contentWidth - 35, 9);
                    detectLines.forEach(function(line) { self.doc.text(line, self.margin.left + 20, self.y); self.y += 10; });
                }
                self.y += 5;
            }
        }

        // Security Checks
        var securityChecks = r.securityChecks || [];
        if (securityChecks.length > 0) {
            self.checkSpace(30);
            self.label('Security Considerations');
            // Labels and descriptions for security threat types
            var securityDetails = {
                'adversarial': { name: 'Adversarial Examples', category: 'Input Manipulation', desc: 'Carefully crafted inputs designed to fool the AI model into making incorrect predictions while appearing normal to humans' },
                'poisoning': { name: 'Data Poisoning', category: 'Input Manipulation', desc: 'Corrupting training data to introduce vulnerabilities, biases, or backdoors into the model during training' },
                'injection': { name: 'Input Injection', category: 'Input Manipulation', desc: 'Inserting malicious data into production inputs to manipulate AI behavior or extract sensitive information' },
                'inversion': { name: 'Model Inversion', category: 'Input Manipulation', desc: 'Attacks that extract sensitive training data or reconstruct private information by querying the model' },
                'theft': { name: 'Model Theft', category: 'Model Vulnerabilities', desc: 'Unauthorized extraction of model architecture, weights, or intellectual property through queries or system access' },
                'backdoors': { name: 'Model Backdoors', category: 'Model Vulnerabilities', desc: 'Hidden triggers embedded in the model that cause specific malicious behavior when activated' },
                'overfitting': { name: 'Overfitting & Generalization Failure', category: 'Model Vulnerabilities', desc: 'Model performs well on training data but fails on new scenarios, edge cases, or real-world conditions' },
                'explainability': { name: 'Lack of Explainability', category: 'Model Vulnerabilities', desc: 'Inability to understand or audit AI decisions, making it difficult to detect errors, biases, or malicious behavior' },
                'pretrained': { name: 'Compromised Pre-trained Models', category: 'Supply Chain', desc: 'Third-party models containing hidden backdoors, biases, or malicious functionality' },
                'dependencies': { name: 'Vulnerable Dependencies', category: 'Supply Chain', desc: 'Security flaws in ML libraries, frameworks, or software packages used by the AI system' },
                'deployment': { name: 'Insecure Deployment', category: 'Supply Chain', desc: 'Exposed APIs, weak authentication, unencrypted storage, or misconfigured infrastructure' },
                'vendor': { name: 'Cloud/Vendor Dependencies', category: 'Supply Chain', desc: 'Reliance on third-party AI services with uncertain security practices or data handling' },
                'logging': { name: 'Insufficient Logging/Monitoring', category: 'Operational Security', desc: 'Lack of audit trails, anomaly detection, or visibility into AI system behavior' },
                'access': { name: 'Weak Access Controls', category: 'Operational Security', desc: 'Inadequate authentication, authorization, or role-based access to AI systems and data' },
                'output': { name: 'Insecure Output Handling', category: 'Operational Security', desc: 'AI outputs used without validation, enabling injection attacks or unintended actions' },
                'leakage': { name: 'Data Leakage', category: 'Operational Security', desc: 'Unintentional exposure of sensitive data through model outputs, logs, or side channels' },
                'overreliance': { name: 'Over-reliance/Automation Bias', category: 'Human Factors', desc: 'Users trust AI outputs without critical evaluation, failing to catch errors or inappropriate recommendations' },
                'training': { name: 'Insufficient Training', category: 'Human Factors', desc: 'Operators lack understanding of AI limitations, appropriate use cases, or failure modes' },
                'insider': { name: 'Insider Threats', category: 'Human Factors', desc: 'Malicious or negligent insiders with access to AI systems, training data, or model parameters' },
                'social': { name: 'Social Engineering', category: 'Human Factors', desc: 'Manipulation of users to bypass AI system controls or extract sensitive information' }
            };

            // Group checks by category for better organization
            var checksByCategory = {};
            securityChecks.forEach(function(check) {
                var checkId = (typeof check === 'object') ? (check.value || check.id || '') : check;
                var detail = securityDetails[checkId] || { name: checkId, category: 'Other', desc: '' };
                if (!checksByCategory[detail.category]) {
                    checksByCategory[detail.category] = [];
                }
                checksByCategory[detail.category].push({ id: checkId, ...detail });
            });

            Object.entries(checksByCategory).forEach(function(entry) {
                var category = entry[0], checks = entry[1];
                self.checkSpace(30);
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text(category, self.margin.left + 10, self.y);
                self.y += 12;

                checks.forEach(function(check) {
                    self.checkSpace(25);
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    self.doc.text('• ' + check.name, self.margin.left + 15, self.y);
                    self.y += 10;

                    if (check.desc) {
                        self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
                        var descLines = self.wrap(check.desc, self.contentWidth - 40, 8);
                        descLines.forEach(function(line) {
                            self.doc.text(line, self.margin.left + 20, self.y);
                            self.y += 9;
                        });
                    }
                    self.y += 3;
                });
            });
        }

        // Threat Mitigations
        var tm = r.threatMitigations || {};
        var hasThreatMit = Object.keys(tm).some(function(k) {
            var val = tm[k];
            if (!val) return false;
            if (typeof val === 'string') return val.trim().length > 0;
            if (typeof val === 'object') return val.mitigation && val.mitigation.trim();
            return false;
        });
        if (hasThreatMit) {
            self.checkSpace(30);
            self.label('Mitigation Strategies & Controls');

            // Sub-heading for threat-specific mitigations
            self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
            self.doc.text('Threat-Specific Mitigations:', self.margin.left + 10, self.y);
            self.y += 12;

            Object.entries(tm).forEach(function(entry) {
                var k = entry[0], v = entry[1];
                if (v) {
                    self.checkSpace(45);
                    if (typeof v === 'object' && v.threat) {
                        // Threat name as bold header
                        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                        self.doc.text(v.threat, self.margin.left + 15, self.y);
                        self.y += 10;

                        // Category as small text
                        if (v.category) {
                            self.doc.setFontSize(8); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                            self.doc.text(v.category, self.margin.left + 15, self.y);
                            self.y += 10;
                        }

                        // Mitigation text
                        if (v.mitigation && v.mitigation.trim()) {
                            self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                            var mitLines = self.wrap(v.mitigation, self.contentWidth - 35, 9);
                            mitLines.forEach(function(line) {
                                self.doc.text(line, self.margin.left + 15, self.y);
                                self.y += 10;
                            });
                        }
                        self.y += 5;
                    } else if (typeof v === 'string' && v.trim()) {
                        // Legacy string format
                        self.labelValue(k, v, 10);
                    }
                }
            });
        }

        // Mitigations
        var mit = r.mitigations || {};
        var hasMit = mit.engineering || mit.operational || mit.governance;
        if (hasMit) {
            self.checkSpace(30);
            self.label('Planned Mitigations');
            if (mit.engineering) self.labelValue('Engineering Controls', mit.engineering, 10);
            if (mit.operational) self.labelValue('Operational Controls', mit.operational, 10);
            if (mit.governance) self.labelValue('Governance Controls', mit.governance, 10);
        }

        // Status Quo Analysis
        var sq = r.statusQuo || {};
        // Support both old field names (currentProcess, painPoints) and new ones (currentRisks, missedOpportunities)
        var hasSQ = sq.currentRisks || sq.currentProcess || sq.missedOpportunities || sq.painPoints || sq.competitive || sq.inefficiencies;
        if (hasSQ) {
            self.checkSpace(60);
            self.label('Risk of Status Quo');
            self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
            self.doc.text('Understanding the cost of inaction provides important context for AI implementation decisions.', self.margin.left + 10, self.y);
            self.y += 12;

            var currentRisksVal = sq.currentRisks || sq.currentProcess;
            if (currentRisksVal) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What are the current risks of NOT implementing this AI solution?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var riskLines = self.wrap(currentRisksVal, self.contentWidth - 30, 9);
                riskLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            var missedVal = sq.missedOpportunities || sq.painPoints;
            if (missedVal) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What opportunities would be missed?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var missedLines = self.wrap(missedVal, self.contentWidth - 30, 9);
                missedLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            if (sq.competitive) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What competitive disadvantages exist?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var compLines = self.wrap(sq.competitive, self.contentWidth - 30, 9);
                compLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }

            if (sq.inefficiencies) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('What operational inefficiencies persist?', self.margin.left + 10, self.y);
                self.y += 11;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                var ineffLines = self.wrap(sq.inefficiencies, self.contentWidth - 30, 9);
                ineffLines.forEach(function(line) { self.doc.text(line, self.margin.left + 15, self.y); self.y += 10; });
                self.y += 5;
            }
        }

        self.y += 10;
    });
}
var dataKeys = Object.keys(data);
if (dataKeys.length) {
    this.heading('Data Availability & Infrastructure', 2);
    dataKeys.forEach(function(ucId, idx) {
        var d = data[ucId] || {};
        self.checkSpace(50);
        self.doc.setFontSize(11); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
        self.doc.text((idx + 1) + '. ' + self.getUCName(ucId), self.margin.left + 5, self.y);
        self.y += 15;

        // Data Elements
        var dataElements = d.dataElements || [];
        if (dataElements.length > 0) {
            self.label('Ideal Data Profile');
            dataElements.forEach(function(elem) {
                self.checkSpace(40);
                // Handle both object format {name: '...'} and string format
                var elemName = (typeof elem === 'object') ? (elem.name || elem.label || elem.element || 'Unnamed Element') : elem;
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('• ' + elemName, self.margin.left + 10, self.y);
                self.y += 11;

                // Show Volume if available
                if (typeof elem === 'object' && elem.volume) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    var volumeText = 'Volume: ' + elem.volume;
                    if (elem.volumeOther) volumeText += ' (' + elem.volumeOther + ')';
                    self.doc.text(volumeText, self.margin.left + 15, self.y);
                    self.y += 10;
                }

                // Show Accuracy if available
                if (typeof elem === 'object' && elem.accuracy) {
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    var accuracyText = 'Accuracy: ' + elem.accuracy;
                    if (elem.accuracyOther) accuracyText += ' (' + elem.accuracyOther + ')';
                    self.doc.text(accuracyText, self.margin.left + 15, self.y);
                    self.y += 10;
                }

                // Show description if available
                if (typeof elem === 'object' && elem.description) {
                    self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var descLines = self.wrap(elem.description, self.contentWidth - 30, 8);
                    descLines.forEach(function(line) {
                        self.doc.text(line, self.margin.left + 15, self.y);
                        self.y += 9;
                    });
                }
                self.y += 3;
            });
            self.y += 3;
        }

        // Source Mappings (handle both old 'mappings' and new 'sourceMappings' property names)
        var mappings = d.sourceMappings || d.mappings || {};
        var mappingEntries = Object.entries(mappings).filter(function(e) { return e[1] && (e[1].status || e[1].sourceSystem || e[1].quality); });
        if (mappingEntries.length) {
            self.label('Mapped Data Sources');
            mappingEntries.forEach(function(e) {
                self.checkSpace(40);
                var elementId = e[0], v = e[1];
                // Find the element name by looking up the ID in dataElements
                var elementName = elementId;
                var matchingElement = dataElements.find(function(elem) {
                    return (typeof elem === 'object' && elem.id === elementId);
                });
                if (matchingElement && matchingElement.name) {
                    elementName = matchingElement.name;
                }

                var statusLabel = v.status || 'Unknown';
                // Capitalize first letter of status
                statusLabel = statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1);

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('• ' + elementName + ' (' + statusLabel + ')', self.margin.left + 10, self.y);
                self.y += 11;

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                if (v.sourceSystem) {
                    self.doc.text('Source System: ' + v.sourceSystem, self.margin.left + 15, self.y);
                    self.y += 10;
                }
                if (v.quality) {
                    self.doc.text('Data Quality Notes: ' + v.quality, self.margin.left + 15, self.y);
                    self.y += 10;
                }
                self.y += 3;
            });
            self.y += 3;
        }

        // Gap Analysis (handle both old 'gaps' and new 'gapAnalysis' property names)
        var gaps = d.gapAnalysis || d.gaps || {};
        var gapEntries = Object.entries(gaps).filter(function(e) { return e[1] && (e[1].impact || e[1].remediation || e[1].effort || e[1].severity); });
        if (gapEntries.length) {
            self.label('Gap Analysis');
            gapEntries.forEach(function(e) {
                var elementId = e[0], v = e[1];
                // Find the element name by looking up the ID in dataElements
                var elementName = elementId;
                var matchingElement = dataElements.find(function(elem) {
                    return (typeof elem === 'object' && elem.id === elementId);
                });
                if (matchingElement && matchingElement.name) {
                    elementName = matchingElement.name;
                }

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('• ' + elementName, self.margin.left + 10, self.y);
                self.y += 10;

                if (v.severity) self.text('  Severity: ' + v.severity, self.margin.left + 15, 9);
                if (v.impact) self.text('  Impact: ' + v.impact, self.margin.left + 15, 9);
                if (v.remediation) self.text('  Remediation: ' + v.remediation, self.margin.left + 15, 9);
                if (v.effort) {
                    var effortLabels = {
                        'immediate': 'Immediate (< 1 month)',
                        'short-term': 'Short-term (1-3 months)',
                        'medium-term': 'Medium-term (3-6 months)',
                        'long-term': 'Long-term (6-12 months)',
                        'major-initiative': 'Major initiative (> 12 months)'
                    };
                    var effortLabel = effortLabels[v.effort] || v.effort;
                    self.text('  Effort / Timeline: ' + effortLabel, self.margin.left + 15, 9);
                }
            });
            self.y += 3;
        }

        // Integration Assessments
        var integrations = d.integrationAssessments || {};
        var integrationEntries = Object.entries(integrations).filter(function(e) { return e[1] && (e[1].complexity || e[1].method || e[1].notes); });
        if (integrationEntries.length) {
            self.label('Integration Requirements');
            integrationEntries.forEach(function(e) {
                self.checkSpace(35);
                var systemName = e[0], v = e[1];

                var complexityLabel = v.complexity || 'Unknown';
                complexityLabel = complexityLabel.charAt(0).toUpperCase() + complexityLabel.slice(1);

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                self.doc.text('• ' + systemName + ' (' + complexityLabel + ' Complexity)', self.margin.left + 10, self.y);
                self.y += 11;

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                if (v.method) {
                    var methodText = 'Method: ' + v.method;
                    if (v.methodOther) methodText += ' (' + v.methodOther + ')';
                    self.doc.text(methodText, self.margin.left + 15, self.y);
                    self.y += 10;
                }
                if (v.notes) {
                    self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var noteLines = self.wrap('Notes: ' + v.notes, self.contentWidth - 30, 8);
                    noteLines.forEach(function(line) {
                        self.doc.text(line, self.margin.left + 15, self.y);
                        self.y += 9;
                    });
                }
                self.y += 3;
            });
            self.y += 3;
        }

        // Governance
        var gov = d.governance || {};
        var govEntries = Object.entries(gov).filter(function(e) { return e[1] && (e[1].checked || e[1].notes); });
        if (govEntries.length) {
            self.label('Data Governance & Security');
            var governanceLabels = {
                'classification': 'Data Classification',
                'access': 'Access Controls',
                'lineage': 'Lineage & Provenance',
                'privacy': 'Privacy Compliance',
                'security': 'Security Requirements',
                'audit': 'Audit Trail',
                'ownership': 'Data Ownership',
                'retention': 'Retention Policy',
                'quality': 'Quality Standards'
            };
            govEntries.forEach(function(e) {
                var k = e[0], v = e[1];
                var label = governanceLabels[k] || k;

                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('• ' + label + ': ' + (v.checked ? 'Addressed' : 'Not Addressed'), self.margin.left + 10, self.y);
                self.y += 10;

                if (v.notes) {
                    self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                    var noteLines = self.wrap('Notes: ' + v.notes, self.contentWidth - 30, 8);
                    noteLines.forEach(function(line) {
                        self.doc.text(line, self.margin.left + 15, self.y);
                        self.y += 9;
                    });
                }
            });
            self.y += 3;
        }

        // Final Decision
        if (d.decision) {
            self.checkSpace(30);
            var decisionLabels = {
                'proceed': 'Proceed',
                'address-gaps': 'Address Gaps',
                'reconsider': 'Reconsider'
            };

            self.label('Decision');
            self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
            self.doc.text(decisionLabels[d.decision] || d.decision, self.margin.left + 10, self.y);
            self.y += 12;
        }
        if (d.justification) self.labelValue('Justification', d.justification, 10);

        self.y += 10;
    });
}
var principleIds = ['investment-capacity', 'skilled-personnel', 'regulatory-compliance', 'clear-objectives'];
var assessedPrinciples = principleIds.filter(function(p) { return principles[p] && principles[p].assessed; });
if (assessedPrinciples.length) {
    this.heading('Additional Principles Assessment', 2);
    var meta = { 'investment-capacity': 'Investment Capacity', 'skilled-personnel': 'Skilled Personnel', 'regulatory-compliance': 'Governance and Compliance', 'clear-objectives': 'Clear Objectives' };
    var self = this;
    assessedPrinciples.forEach(function(pid, idx) {
        var p = principles[pid];
        self.checkSpace(60);

        // Principle heading
        self.doc.setFontSize(11); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
        self.doc.text((idx + 1) + '. ' + (meta[pid] || pid), self.margin.left + 5, self.y);
        self.y += 18;

        // Assessment Questions with full text
        var qData = p.questions || {};
        var questionTexts = self.principleQuestions[pid] || {};
        var hasQuestions = Object.keys(qData).some(function(qid) {
            var q = qData[qid];
            return q && (q.status || q.notes);
        });

        if (hasQuestions) {
            self.doc.setFontSize(10); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.secondary);
            self.doc.text('Assessment Questions', self.margin.left + 5, self.y);
            self.y += 12;

            Object.entries(qData).forEach(function(e) {
                var qid = e[0], q = e[1];
                if (q && (q.status || q.notes)) {
                    self.checkSpace(50);

                    // Get question text from mapping
                    var questionText = questionTexts[qid] || qid;
                    var statusLabel = self.statusLabels[q.status] || q.status || 'N/A';
                    // Remove emoji from status labels for PDF
                    statusLabel = statusLabel.replace(/[✓⚠🚩?]/g, '').trim();

                    // Question text
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                    var qLines = self.wrap(questionText, self.contentWidth - 20, 9);
                    qLines.forEach(function(line) {
                        self.doc.text(line, self.margin.left + 10, self.y);
                        self.y += 11;
                    });

                    // Status - all black
                    self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
                    self.doc.text('Status: ' + statusLabel, self.margin.left + 15, self.y);
                    self.y += 11;

                    // Notes if present
                    if (q.notes) {
                        self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.text);
                        var noteLines = self.wrap('Notes: ' + q.notes, self.contentWidth - 30, 8);
                        noteLines.forEach(function(line) {
                            self.doc.text(line, self.margin.left + 15, self.y);
                            self.y += 10;
                        });
                    }
                    self.y += 5;
                }
            });
        }

        // Red Flags with full text
        if (p.redFlags && p.redFlags.length) {
            self.checkSpace(40);
            self.label('Red Flags Identified');

            var redFlagTexts = self.redFlagIndicators[pid] || [];
            p.redFlags.forEach(function(rfIndex) {
                self.checkSpace(30);
                var flagText = redFlagTexts[rfIndex] || ('Red Flag #' + (rfIndex + 1));
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                var flagLines = self.wrap('• ' + flagText, self.contentWidth - 20, 9);
                flagLines.forEach(function(line) {
                    self.doc.text(line, self.margin.left + 10, self.y);
                    self.y += 11;
                });
            });
            self.y += 5;
        }

        // Overall Assessment
        if (p.gapsIdentified || p.summaryNotes) {
            self.checkSpace(40);
            self.label('Overall Assessment');

            if (p.gapsIdentified) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                self.doc.text('Gaps Identified: ' + (p.gapsIdentified === 'yes' ? 'Yes' : 'No'), self.margin.left + 10, self.y);
                self.y += 11;
            }

            if (p.summaryNotes) {
                self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
                var summaryLines = self.wrap('Summary: ' + p.summaryNotes, self.contentWidth - 20, 9);
                summaryLines.forEach(function(line) {
                    self.doc.text(line, self.margin.left + 10, self.y);
                    self.y += 11;
                });
            }
        }

        self.y += 15;
    });
}
if (!riskKeys.length && !dataKeys.length && !assessedPrinciples.length) {
    this.text('No principles analysis completed.', this.margin.left, 10, { italic: true, color: this.colors.textLight });
}
    }

    step4Section() {
this.heading('Step 4: Implementation Planning & Readiness Validation', 1);
this.infoBox('This step develops detailed implementation scenarios for each selected use case, including current state analysis, AI solution description, success metrics (KPIs), and build vs. buy decision support.', this.colors.success);
this.y += 10;
var worksheets = (appState.step4 && appState.step4.worksheets) || {};
var keys = Object.keys(worksheets);
if (!keys.length) { this.text('No implementation planning completed.', this.margin.left, 10, { italic: true, color: this.colors.textLight }); return; }
var self = this;
keys.forEach(function(ucId, idx) {
    var w = worksheets[ucId] || {};
    var cs = w.currentState || {};
    var ai = w.aiDescription || {};
    var bb = w.buildBuyDecision || {};
    var kpis = (w.kpis || []).filter(function(k) { return k && (k.metric || k.baseline || k.target); });
    var hasContent = cs.whoAffected || ai.corePurpose || ai.userInteraction || ai.scopeBoundaries || kpis.length || bb.finalDecision || bb.customization || bb.timeline;
    if (!hasContent) return;
    self.checkSpace(80);
    self.heading((idx + 1) + '. ' + self.getUCName(ucId), 2);
    if (cs.whoAffected) self.labelValue('Who Is Affected', cs.whoAffected);
    if (ai.corePurpose) self.labelValue('Core Purpose', ai.corePurpose);
    if (ai.userInteraction) self.labelValue('User Interaction', ai.userInteraction);
    if (ai.scopeBoundaries) self.labelValue('Scope Boundaries', ai.scopeBoundaries);
    if (kpis.length) {
        self.label('Expected Outcomes & KPIs');
        self.table(['Metric', 'Baseline', 'Target', 'Timeframe'], kpis.map(function(k) { return [k.metric || '-', k.baseline || '-', k.target || '-', k.timeframe || '-']; }));
    }
    if (bb.finalDecision || bb.customization || bb.timeline || bb.expertise || bb.budget || bb.risk) {
        self.y += 10;
        self.label('Build vs. Buy Decision');

        // Label mappings for Build vs Buy options
        var customizationLabels = {
            'critical': 'Critical - unique requirements',
            'some': 'Some customization needed',
            'standard': 'Standard solution OK'
        };
        var timelineLabels = {
            'short': 'Less than 6 months',
            'medium': '6-12 months',
            'long': 'Greater than 12 months'
        };
        var expertiseLabels = {
            'strong': 'Strong internal team',
            'limited': 'Limited - building capability',
            'none': 'None - need vendor'
        };
        var budgetLabels = {
            'capex': 'Large upfront capital OK',
            'opex': 'Prefer OpEx model',
            'limited': 'Limited budget'
        };
        var riskLabels = {
            'low': 'Low - can experiment',
            'medium': 'Medium - need some validation',
            'high': 'High - need proven solution'
        };

        if (bb.finalDecision) self.text('Decision: ' + bb.finalDecision, self.margin.left + 10, 10, { bold: true });
        if (bb.customization) self.text('Customization Needs: ' + (customizationLabels[bb.customization] || bb.customization), self.margin.left + 10, 9);
        if (bb.timeline) self.text('Target Timeline: ' + (timelineLabels[bb.timeline] || bb.timeline), self.margin.left + 10, 9);
        if (bb.expertise) self.text('Internal AI/ML Expertise: ' + (expertiseLabels[bb.expertise] || bb.expertise), self.margin.left + 10, 9);
        if (bb.budget) self.text('Budget Structure: ' + (budgetLabels[bb.budget] || bb.budget), self.margin.left + 10, 9);
        if (bb.risk) self.text('Risk Tolerance: ' + (riskLabels[bb.risk] || bb.risk), self.margin.left + 10, 9);
    }
    self.y += 10;
});
    }

    step5Section() {
this.heading('Step 5: Evaluate Engineering Controls & Mitigations', 1);
this.infoBox('This step identifies safeguards across three domains: Engineering Controls (system architecture, fail-safes), Operational Controls (monitoring, incident response), and Governance Controls (oversight, compliance). Control rigor scales with consequence level.', this.colors.danger);
this.y += 10;
var controls = (appState.step5 && appState.step5.controls) || {};
var keys = Object.keys(controls).filter(function(k) { return controls[k] && controls[k].trim(); });
if (!keys.length) { this.text('No control responses documented.', this.margin.left, 10, { italic: true, color: this.colors.textLight }); return; }

// Full control details with names and descriptions
var controlDetails = {
    'eng-1': {
        name: 'Manual Override Capability',
        desc: 'Does your AI system include manual override capability that enables operators to assume control seamlessly? High-consequence applications may require immediate operator control without system restart or reconfiguration.'
    },
    'eng-2': {
        name: 'Fail-Safe Mechanisms',
        desc: 'What fail-safe mechanisms revert the system to a known safe state when AI outputs exceed expected bounds or confidence thresholds fall below acceptable levels?'
    },
    'eng-3': {
        name: 'Redundancy Design',
        desc: 'Have you designed redundancy to avoid single points of failure in critical functions? Options include multiple models with diverse architectures or maintaining traditional control systems as active backups.'
    },
    'eng-4': {
        name: 'Deployment Architecture',
        desc: 'What is your deployment architecture, and how does it align with your consequence profile? On-premises, edge, hybrid, and cloud deployments each present different risk tradeoffs.'
    },
    'eng-5': {
        name: 'Operator Trust Indicators',
        desc: 'How will operators know when to trust AI outputs versus when to intervene? Consider confidence indicators, explainability features, and defined thresholds for escalation.'
    },
    'ops-1': {
        name: 'Watchdog & Monitoring',
        desc: 'What watchdog systems or monitoring mechanisms track AI model health, including input data quality, processing latency, output distributions, and model drift?'
    },
    'ops-2': {
        name: 'AI Incident Response',
        desc: 'How will your organization detect and respond to AI-specific incidents such as model poisoning, adversarial inputs, data exfiltration, or unexpected model behavior?'
    },
    'ops-3': {
        name: 'Performance Baselines',
        desc: 'What baseline metrics establish normal AI system performance, and what thresholds trigger investigation or intervention?'
    },
    'ops-4': {
        name: 'Model Retraining',
        desc: 'How frequently will models be retrained or recalibrated, and what testing validates model updates before production deployment?'
    },
    'gov-1': {
        name: 'Vendor Requirements',
        desc: 'What security and performance requirements apply to AI vendors, and how are these documented in contracts and service level agreements?'
    },
    'gov-2': {
        name: 'Governance Integration',
        desc: 'How does AI deployment integrate with your existing governance programs for cybersecurity, data privacy, regulatory compliance, and operational risk management?'
    },
    'gov-3': {
        name: 'Component Visibility',
        desc: 'What visibility do you have into AI system components, including model architectures, training data provenance, third-party libraries, and software dependencies?'
    },
    'gov-4': {
        name: 'Approval Authority',
        desc: 'Who in your organization has authority to approve AI deployments, modifications, or decommissioning, and what review processes ensure appropriate oversight?'
    }
};

var categories = {
    'Engineering Controls': ['eng-1', 'eng-2', 'eng-3', 'eng-4', 'eng-5'],
    'Operational Controls': ['ops-1', 'ops-2', 'ops-3', 'ops-4'],
    'Governance Controls': ['gov-1', 'gov-2', 'gov-3', 'gov-4']
};
var self = this;
Object.entries(categories).forEach(function(entry) {
    var cat = entry[0], catKeys = entry[1];
    var active = catKeys.filter(function(k) { return keys.indexOf(k) !== -1; });
    if (!active.length) return;
    self.heading(cat, 2);
    active.forEach(function(k) {
        self.checkSpace(60);
        var detail = controlDetails[k] || { name: k, desc: '' };

        // Control name as bold header
        self.doc.setFontSize(10); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
        self.doc.text(detail.name, self.margin.left + 5, self.y);
        self.y += 12;

        // Description in italic
        if (detail.desc) {
            self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
            var descLines = self.wrap(detail.desc, self.contentWidth - 15, 8);
            descLines.forEach(function(line) {
                self.doc.text(line, self.margin.left + 5, self.y);
                self.y += 9;
            });
            self.y += 5;
        }

        // Response label
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.primary);
        self.doc.text('Response:', self.margin.left + 10, self.y);
        self.y += 11;

        // User response
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
        var responseLines = self.wrap(controls[k], self.contentWidth - 25, 9);
        responseLines.forEach(function(line) {
            self.doc.text(line, self.margin.left + 15, self.y);
            self.y += 10;
        });
        self.y += 8;
    });
    self.y += 5;
});
    }

    frameworkReferenceSection() {
this.heading('Framework and Resource Reference', 1);
this.infoBox('This section provides authoritative sources of guidance for control design and implementation. These frameworks, standards, and best practices support your control implementation based on your consequence level and regulatory environment.', this.colors.info);
this.y += 10;

// Framework data organized by category
var frameworksByCategory = {
    'AI Governance': [
        {
            name: 'NIST AI Risk Management Framework (AI RMF)',
            description: 'Voluntary framework for managing risks associated with AI systems throughout their lifecycle.',
            whenToUse: 'Establishing organizational AI governance programs. Evaluating trustworthiness characteristics including validity, reliability, safety, security, explainability, and accountability.',
            link: 'https://www.nist.gov/itl/ai-risk-management-framework'
        },
        {
            name: 'OECD AI Principles',
            description: 'International principles for responsible stewardship of trustworthy AI.',
            whenToUse: 'Aligning AI strategy with human-centered values, transparency, robustness, and accountability commitments.',
            link: 'https://oecd.ai/en/ai-principles'
        }
    ],
    'Cybersecurity': [
        {
            name: 'NIST Cybersecurity Framework (CSF)',
            description: 'Voluntary framework for managing cybersecurity risk through five core functions: Identify, Protect, Detect, Respond, Recover.',
            whenToUse: 'Integrating AI systems into existing enterprise cybersecurity programs. Establishing baseline security controls.',
            link: 'https://www.nist.gov/cyberframework'
        },
        {
            name: 'NERC Critical Infrastructure Protection (CIP) Standards',
            description: 'Mandatory reliability standards for protecting bulk electric system cyber assets.',
            whenToUse: 'Required for utilities with CIP-scope systems. Applicable standards: CIP-005 (perimeters), CIP-007 (system security), CIP-008 (incident response), CIP-011 (information protection), CIP-012 (communications), CIP-013 (supply chain).',
            link: 'https://www.nerc.com/standards/reliability-standards/cip'
        },
        {
            name: 'IEC 62443 Series',
            description: 'International standards for industrial automation and control system security.',
            whenToUse: 'Designing security architectures for OT environments. Defining security levels for control systems. Implementing defense-in-depth for AI systems integrated with SCADA or DCS platforms.',
            link: 'https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards'
        },
        {
            name: 'OWASP Top 10 for Large Language Models and AI Security',
            description: 'Community-driven guidance on security vulnerabilities specific to AI and machine learning systems.',
            whenToUse: 'Evaluating AI-specific risks including prompt injection, training data poisoning, model theft, insecure output handling. Particularly relevant for generative AI or systems accepting user inputs.',
            link: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/'
        }
    ],
    'Consequence-Driven Engineering': [
        {
            name: 'Cyber-Informed Engineering (CIE)',
            description: 'Methodology for designing engineered controls that maintain critical functions during cyber incidents.',
            whenToUse: 'Implementing high-consequence AI applications requiring fail-safe operation. Evaluating interdependencies between IT, OT, and AI systems.',
            link: 'https://inl.gov/cie/'
        },
        {
            name: 'DOE Cybersecurity Capability Maturity Model (C2M2)',
            description: 'Tool for evaluating and improving cybersecurity capabilities across OT environments in the energy sector.',
            whenToUse: 'Assessing organizational readiness for AI deployment in critical infrastructure. Establishing baseline cybersecurity practices.',
            link: 'https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2'
        }
    ],
    'Grid Operations': [
        {
            name: 'NERC Standards for System Planning (MOD, TPL Series)',
            description: 'Reliability standards addressing modeling, data requirements, and transmission planning.',
            whenToUse: 'AI applications affecting load forecasting, generation modeling, or system planning functions.',
            link: 'https://www.nerc.com/standards/reliability-standards/tpl'
        },
        {
            name: 'IEEE Standards for Grid Modernization',
            description: 'Technical standards for grid automation, distributed energy resources, and power system communications.',
            whenToUse: 'Implementing AI for DER management, grid control, or smart grid integration. Key standards: IEEE 1547 (DER), IEEE 2030 (interoperability).',
            link: 'https://standards.ieee.org/'
        }
    ],
    'Vendor Management': [
        {
            name: 'NIST Secure Software Development Framework (SSDF)',
            description: 'Guidance for secure software development practices throughout the software development lifecycle.',
            whenToUse: 'Evaluating vendor development practices. Reviewing software bills of materials. Establishing security requirements for custom AI development.',
            link: 'https://csrc.nist.gov/Projects/ssdf'
        },
        {
            name: 'Electricity Subsector Cybersecurity Capability Maturity Model (ES-C2M2)',
            description: 'Electric utility-specific version of C2M2 with tailored guidance on vendor risk management.',
            whenToUse: 'Establishing vendor security assessment processes. Supply chain risk management programs for AI vendors and service providers.',
            link: 'https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2'
        }
    ]
};

var self = this;
Object.entries(frameworksByCategory).forEach(function(entry) {
    var category = entry[0];
    var frameworks = entry[1];

    self.checkSpace(60);
    self.heading(category, 2);

    frameworks.forEach(function(fw) {
        self.checkSpace(70);

        // Framework name as bold header
        self.doc.setFontSize(10); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.text);
        self.doc.text(fw.name, self.margin.left + 5, self.y);
        self.y += 12;

        // Description
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.text);
        var descLines = self.wrap(fw.description, self.contentWidth - 15, 9);
        descLines.forEach(function(line) {
            self.doc.text(line, self.margin.left + 5, self.y);
            self.y += 10;
        });
        self.y += 3;

        // When to Use
        self.doc.setFontSize(9); self.doc.setFont('helvetica', 'bold'); self.setColor(self.colors.secondary);
        self.doc.text('When to Use:', self.margin.left + 5, self.y);
        self.y += 10;

        self.doc.setFontSize(8); self.doc.setFont('helvetica', 'italic'); self.setColor(self.colors.textLight);
        var useLines = self.wrap(fw.whenToUse, self.contentWidth - 15, 8);
        useLines.forEach(function(line) {
            self.doc.text(line, self.margin.left + 10, self.y);
            self.y += 9;
        });
        self.y += 3;

        // Link
        self.doc.setFontSize(8); self.doc.setFont('helvetica', 'normal'); self.setColor(self.colors.primary);
        self.doc.textWithLink('Link: ' + fw.link, self.margin.left + 5, self.y, { url: fw.link });
        self.y += 15;
    });

    self.y += 5;
});

// Disclaimer
this.checkSpace(50);
this.y += 10;
this.doc.setFontSize(8); this.doc.setFont('helvetica', 'italic'); this.setColor(this.colors.textLight);
var disclaimer = 'Note: The controls and frameworks referenced in this section are guidance resources, not mandatory requirements unless specified by your regulatory environment. Use them to inform your decisions based on your organization\'s unique needs, risk tolerance, and operational context.';
var disclaimerLines = this.wrap(disclaimer, this.contentWidth, 8);
var self = this;
disclaimerLines.forEach(function(line) {
    self.doc.text(line, self.margin.left, self.y);
    self.y += 9;
});
    }

    nextStepsSection() {
this.heading('Next Steps & Recommendations', 1);
this.text('This assessment provides a comprehensive evaluation of your organization\'s AI readiness. The documented findings should be reviewed by key stakeholders and used to inform strategic decisions about AI implementation.', this.margin.left, 10, { lineHeight: 1.5 });
this.y += 10;
this.text('Recommended Actions:', this.margin.left, 10, { bold: true });
this.y += 8;
var self = this;
['Review identified gaps and develop remediation plans', 'Prioritize use cases based on business value and readiness', 'Secure necessary resources and executive sponsorship', 'Establish governance structures for AI oversight', 'Begin pilot implementation with appropriate controls', 'Define success metrics and monitoring procedures'].forEach(function(r) { self.bullet(r, 10); });
this.y += 15;
this.text('For more information, visit Idaho National Laboratory\'s Center for Securing Digital Energy Technology (CSDET) at https://csdet.inl.gov', this.margin.left, 9, { color: this.colors.textLight });
    }

    generate() {
// Clean up orphaned data before generating PDF to ensure accurate counts
cleanupOrphanedData();

this.coverPage();
var tocPage = this.tocPage();
this.newPage(); this.aboutSection(); this.summarySection();
this.newPage(); this.step1Section();
this.newPage(); this.step2Section();
this.newPage(); this.step3Section();
this.newPage(); this.step4Section();
this.newPage(); this.step5Section();
this.newPage(); this.frameworkReferenceSection();
this.newPage(); this.nextStepsSection();
this.updateTOC(tocPage);
this.addHeadersFooters();
var dateStr = new Date().toISOString().split('T')[0];
var outputFilename = this.customFilename || ('COGNITO_Assessment_' + dateStr + '.pdf');
this.doc.save(outputFilename);
showNotification('PDF exported successfully!');
    }

    setFilename(filename) {
this.customFilename = filename;
    }
}
function exportToText() {
    try {
// Generate/refresh the summary content before exporting
generateSummaryContent();

const blocks = getSummaryExportBlocks();
const lines = [];

const underline = (t, ch = '-') => ch.repeat(Math.min(120, Math.max(8, t.length)));
const clean = (t) => (t || '')
    .replace(/[\uF000-\uF8FF]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

blocks.forEach(b => {
    if (b.type === 'spacer') { lines.push(''); return; }

    if (b.type === 'title')   { const t = clean(b.text); lines.push(t.toUpperCase()); lines.push(underline(t, '=')); lines.push(''); return; }
    if (b.type === 'subtitle'){ const t = clean(b.text); lines.push(t); lines.push(underline(t)); lines.push(''); return; }
    if (b.type === 'meta')    { lines.push(clean(b.text)); lines.push(''); return; }

    if (b.type === 'h2') { const t = clean(b.text); lines.push(t.toUpperCase()); lines.push(underline(t)); lines.push(''); return; }
    if (b.type === 'h3') { const t = clean(b.text); lines.push(t); lines.push(underline(t)); lines.push(''); return; }
    if (b.type === 'h4') { const t = clean(b.text); lines.push(t); lines.push(underline(t)); lines.push(''); return; }
    if (b.type === 'h5') { const t = clean(b.text); lines.push('  ' + t); lines.push('  ' + underline(t)); lines.push(''); return; }

    if (b.type === 'li') { lines.push('  • ' + clean(b.text)); return; }

    if (b.type === 'table') {
        const headers = (b.headers || []).map(clean).filter(Boolean);
        const rows = (b.rows || []).map(r => (r || []).map(clean));
        if (headers.length) { lines.push('  ' + headers.join(' | ')); lines.push('  ' + underline(headers.join(' | '))); }
        rows.forEach(r => { const row = r.filter(x => x !== undefined && x !== null).join(' | '); if (row.trim()) lines.push('  ' + row); });
        lines.push('');
        return;
    }

    lines.push(clean(b.text));
    lines.push('');
});

const dateStr = new Date().toISOString().split('T')[0];
downloadTextFile(`COGNITO_Assessment_Summary_${dateStr}.txt`, lines.join('\n'));
if (typeof showNotification === 'function') showNotification('Assessment exported as TXT successfully!');
    } catch (e) {
console.error('Text export error:', e);
alert('Text export failed. Please check the console for details.');
    }
}

