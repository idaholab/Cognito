/**
 * COGNITO Export Module
 * PDF and text export functionality
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// ==========================
// EXPORT FUNCTIONS
// ==========================

function getSummaryExportBlocks() {
    // Build an ordered, structured representation of what is currently rendered in the on-screen summary.
    // This keeps export output aligned with the user-visible document.
    const blocks = [];
    const title = 'COGNITO AI Readiness Assessment';
    const subtitle = 'Executive Summary Report';
    const generated = new Date().toLocaleString();

    blocks.push({ type: 'title', text: title });
    blocks.push({ type: 'subtitle', text: subtitle });
    blocks.push({ type: 'meta', text: `Generated: ${generated}` });
    blocks.push({ type: 'spacer' });

    const root = document.getElementById('summary-content');
    if (!root) {
blocks.push({ type: 'p', text: 'Summary content was not found.' });
return blocks;
    }

    // Collect elements in visual order, but avoid duplicating content inside tables.
    const elements = Array.from(root.querySelectorAll('h2,h3,h4,h5,p,li,table'));
    const isInsideTable = (el) => el.closest('table') && el.tagName.toLowerCase() !== 'table';
    const normalize = (t) => (t || '')
// remove icon-font/private glyphs that can leak into exports
.replace(/[\uF000-\uF8FF]/g, '')
.replace(/[\u200B-\u200D\uFEFF]/g, '')
.replace(/\s+/g, ' ')
.trim();

    elements.forEach(el => {
if (!el) return;
if (el.classList && el.classList.contains('print:hidden')) return;
if (isInsideTable(el)) return;

const tag = el.tagName.toLowerCase();

if (tag === 'table') {
    const rows = Array.from(el.querySelectorAll('tr'));
    const headerRow = rows.find(r => r.querySelector('th')) || rows[0];
    const headers = headerRow
        ? Array.from(headerRow.querySelectorAll('th,td')).map(c => normalize(c.innerText)).filter(Boolean)
        : [];
    const dataRows = rows
        .filter(r => r !== headerRow)
        .map(r => Array.from(r.querySelectorAll('td,th')).map(c => normalize(c.innerText)));

    const cleanedRows = dataRows
        .map(r => (headers.length ? r.slice(0, headers.length) : r).map(x => normalize(x)))
        .filter(r => r.some(Boolean));

    if (headers.length || cleanedRows.length) {
        blocks.push({ type: 'table', headers, rows: cleanedRows });
        blocks.push({ type: 'spacer' });
    }
    return;
}

const text = normalize(el.innerText);
if (!text) return;

if (tag === 'h2') blocks.push({ type: 'h2', text });
else if (tag === 'h3') blocks.push({ type: 'h3', text });
else if (tag === 'h4') blocks.push({ type: 'h4', text });
else if (tag === 'h5') blocks.push({ type: 'h5', text });
else if (tag === 'li') blocks.push({ type: 'li', text });
else blocks.push({ type: 'p', text });
    });

    return blocks;
}

function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =============================================================================
// PROFESSIONAL PDF EXPORT - COGNITO AI Readiness Assessment
// Comprehensive export that reads directly from appState to capture ALL data
// =============================================================================

function exportToPDF() {
    if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
alert('PDF library not loaded. Please refresh the page.');
return;
    }

    const { jsPDF } = window.jspdf;

    showNotification('Generating PDF... This may take a moment.');

    setTimeout(() => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
            const pdf = new COGNITOPDFGenerator(doc);
            pdf.generate();
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error generating PDF: ' + error.message);
        }
    }, 100);
}
