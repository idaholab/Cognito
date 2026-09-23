/**
 * COGNITO Utilities Module
 * Common utility functions used across modules
 * Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
 */

// ============================================
// NOTIFICATION & UI UTILITIES
// ============================================

function showNotification(message) {
    try {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');

        if (!notification || !notificationText) {
            console.warn('[showNotification] Notification elements not found');
            return;
        }

        notificationText.textContent = message;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    } catch (error) {
        console.error('[showNotification] Error:', error);
    }
}

function updateUI() {
    updateHeader();
    updateNavigationButtons();
}

// Auto-save on visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveProgress();
    }
});

// ============================================
// STRING UTILITIES
// ============================================

// HTML escaping utility
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Capitalize first letter utility
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// DOMAIN & LABEL UTILITIES
// ============================================

// Get human-readable domain label
function getDomainLabel(domain) {
    const labels = {
        'detection': 'Detection',
        'prediction': 'Prediction',
        'control': 'Control & Optimization',
        'business': 'Business & Customer'
    };
    return labels[domain.toLowerCase()] || domain;
}

// ============================================
// CONSEQUENCE BADGE UTILITIES
// ============================================

// Get CSS class for consequence text
function getConsequenceTextClass(consequence) {
    const classes = {
        'Low': 'text-green-600',
        'Moderate': 'text-yellow-600',
        'High': 'text-orange-600',
        'Highest': 'text-red-600'
    };
    return classes[consequence] || 'text-gray-600';
}

// Get CSS class for consequence badge
function getConsequenceBadgeClass(consequence) {
    const normalized = consequence.charAt(0).toUpperCase() + consequence.slice(1).toLowerCase();
    const classes = {
        'Low': 'bg-green-100 text-green-800',
        'Moderate': 'bg-yellow-100 text-yellow-800',
        'High': 'bg-orange-100 text-orange-800',
        'Highest': 'bg-red-100 text-red-800'
    };
    return classes[normalized] || 'bg-gray-100 text-gray-800';
}

// ============================================
// READINESS BADGE UTILITIES
// ============================================

// Get CSS class for readiness badge
function getReadinessBadgeClass(readiness) {
    const classes = {
        'Ready Now': 'bg-gray-100 text-gray-800',
        'Emerging': 'bg-gray-100 text-gray-800',
        'Future State': 'bg-gray-100 text-gray-800',
        'Ready Now / Emerging': 'bg-gray-100 text-gray-800'
    };
    return classes[readiness] || 'bg-gray-100 text-gray-800';
}

// Get subtext description for readiness level
function getReadinessSubtext(readiness) {
    const subtexts = {
        'Ready Now': 'Proven solutions exist today',
        'Emerging': 'In active development and testing',
        'Future State': 'Research and development stage',
        'Ready Now / Emerging': 'Solutions exist with evolving capabilities'
    };
    return subtexts[readiness] || '';
}

// Format readiness badge with optional subtext
function formatReadinessBadge(readiness, badgeClass, size = 'normal', uppercase = false, darkBg = false) {
    const subtext = getReadinessSubtext(readiness);
    const displayText = uppercase ? readiness.toUpperCase() : readiness;
    const subtextColor = darkBg ? 'text-blue-100' : 'text-gray-500';

    if (size === 'small') {
        return `
            <div class="inline-flex flex-col ml-2">
                <span class="px-2 py-0.5 ${badgeClass} rounded text-xs font-medium">
                    ${displayText}
                </span>
                ${subtext ? `<span class="text-[9px] ${subtextColor} italic text-center mt-0.5">${subtext}</span>` : ''}
            </div>
        `;
    } else if (size === 'large') {
        return `
            <div class="inline-flex flex-col">
                <span class="inline-flex items-center px-4 py-2 ${badgeClass} rounded-lg text-sm font-bold border-2 border-current">
                    ${displayText}
                </span>
                ${subtext ? `<span class="text-xs ${subtextColor} italic text-center mt-1">${subtext}</span>` : ''}
            </div>
        `;
    } else {
        return `
            <div class="inline-flex flex-col">
                <span class="inline-flex items-center px-3 py-1 ${badgeClass} rounded-full text-xs font-semibold">
                    ${displayText}
                </span>
                ${subtext ? `<span class="text-[10px] ${subtextColor} italic text-center mt-0.5">${subtext}</span>` : ''}
            </div>
        `;
    }
}

// ============================================
// STATE SYNCHRONIZATION UTILITIES
// ============================================

// Rebuild legacy selectedUseCases structure from opportunityMappings
function rebuildLegacySelectedUseCasesFromOpportunityMappings() {
    if (!appState.step2) return;
    if (!appState.step2.opportunityMappings) appState.step2.opportunityMappings = {};
    const legacy = {};
    Object.keys(appState.step2.opportunityMappings || {}).forEach(oppId => {
        const m = appState.step2.opportunityMappings[oppId];
        if (m && m.useCaseId) {
            legacy[m.useCaseId] = legacy[m.useCaseId] || {};
            legacy[m.useCaseId].opportunityId = oppId;
            if (legacy[m.useCaseId].priority === undefined) legacy[m.useCaseId].priority = '';
        }
    });
    appState.step2.selectedUseCases = legacy;
}
