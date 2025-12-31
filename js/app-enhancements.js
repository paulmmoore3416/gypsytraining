/**
 * Enhanced Features for Gypsy's Training Journey
 * Medical Hub, Behavior Analysis, and Certification modules
 */

// ========================================
// Medical Hub Module
// ========================================

function setupMedicalHub() {
    // Health vitals logger
    const logVitalsBtn = document.getElementById('log-vitals');
    if (logVitalsBtn) {
        logVitalsBtn.addEventListener('click', logHealthVitals);
    }

    // Symptom logger
    const logSymptomBtn = document.getElementById('log-symptom');
    if (logSymptomBtn) {
        logSymptomBtn.addEventListener('click', logSymptomIncident);
    }

    // Expense tracker
    const addExpenseBtn = document.getElementById('add-expense');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', addMedicalExpense);
    }

    // Load saved medical data
    loadMedicalData();
}

function logHealthVitals() {
    const vital = {
        id: Date.now(),
        date: document.getElementById('vital-date').value,
        weight: document.getElementById('vital-weight').value,
        temp: document.getElementById('vital-temp').value,
        heartRate: document.getElementById('vital-hr').value,
        respRate: document.getElementById('vital-rr').value,
        energy: document.getElementById('vital-energy').value,
        notes: document.getElementById('vital-notes').value
    };

    if (!vital.date || !vital.weight) {
        alert('Please enter at least date and weight');
        return;
    }

    if (!AppState.medical) AppState.medical = { vitals: [], symptoms: [], expenses: [] };
    if (!AppState.medical.vitals) AppState.medical.vitals = [];

    AppState.medical.vitals.push(vital);
    Storage.save('medical', AppState.medical);

    // Clear form
    document.getElementById('vital-date').value = '';
    document.getElementById('vital-weight').value = '';
    document.getElementById('vital-temp').value = '';
    document.getElementById('vital-hr').value = '';
    document.getElementById('vital-rr').value = '';
    document.getElementById('vital-energy').value = '';
    document.getElementById('vital-notes').value = '';

    loadVitalsHistory();
    updateHealthScore();
}

function loadVitalsHistory() {
    const vitalsLog = document.getElementById('vitals-log');
    if (!vitalsLog || !AppState.medical || !AppState.medical.vitals) return;

    const vitals = AppState.medical.vitals || [];

    if (vitals.length === 0) {
        vitalsLog.innerHTML = '<tr><td colspan="7" class="empty-state">No vitals logged yet. Start tracking above.</td></tr>';
        return;
    }

    vitalsLog.innerHTML = vitals.slice(-20).reverse().map(v => `
        <tr>
            <td>${formatDate(v.date)}</td>
            <td>${v.weight} lbs</td>
            <td>${v.temp ? v.temp + '°F' : '--'}</td>
            <td>${v.heartRate ? v.heartRate + ' BPM' : '--'}</td>
            <td>${v.respRate ? v.respRate + '/min' : '--'}</td>
            <td>${getEnergyLabel(v.energy)}</td>
            <td>${v.notes || '--'}</td>
        </tr>
    `).join('');
}

function getEnergyLabel(value) {
    const labels = { '1': 'Very Low', '2': 'Low', '3': 'Normal', '4': 'High', '5': 'Very High' };
    return labels[value] || '--';
}

function logSymptomIncident() {
    const symptom = {
        id: Date.now(),
        datetime: document.getElementById('symptom-datetime').value,
        type: document.getElementById('symptom-type').value,
        severity: document.getElementById('symptom-severity').value,
        description: document.getElementById('symptom-description').value,
        actions: document.getElementById('symptom-actions').value,
        outcome: document.getElementById('symptom-outcome').value
    };

    if (!symptom.datetime || !symptom.type || !symptom.description) {
        alert('Please fill in required fields');
        return;
    }

    if (!AppState.medical) AppState.medical = { vitals: [], symptoms: [], expenses: [] };
    if (!AppState.medical.symptoms) AppState.medical.symptoms = [];

    AppState.medical.symptoms.push(symptom);
    Storage.save('medical', AppState.medical);

    // Clear form
    document.getElementById('symptom-datetime').value = '';
    document.getElementById('symptom-type').value = '';
    document.getElementById('symptom-severity').value = '';
    document.getElementById('symptom-description').value = '';
    document.getElementById('symptom-actions').value = '';
    document.getElementById('symptom-outcome').value = '';

    loadSymptomHistory();
}

function loadSymptomHistory() {
    const symptomLog = document.getElementById('symptom-log');
    if (!symptomLog || !AppState.medical || !AppState.medical.symptoms) return;

    const symptoms = AppState.medical.symptoms || [];

    if (symptoms.length === 0) {
        symptomLog.innerHTML = '<p class="empty-state">No incidents logged. Hopefully it stays that way!</p>';
        return;
    }

    symptomLog.innerHTML = symptoms.slice(-10).reverse().map(s => `
        <div class="symptom-entry ${s.severity}">
            <h4>${s.type.toUpperCase()} - ${s.severity.toUpperCase()}</h4>
            <p><strong>Date/Time:</strong> ${new Date(s.datetime).toLocaleString()}</p>
            <p><strong>Description:</strong> ${s.description}</p>
            ${s.actions ? `<p><strong>Actions Taken:</strong> ${s.actions}</p>` : ''}
            ${s.outcome ? `<p><strong>Outcome:</strong> ${s.outcome}</p>` : ''}
        </div>
    `).join('');
}

function addMedicalExpense() {
    const expense = {
        id: Date.now(),
        date: document.getElementById('expense-date').value,
        category: document.getElementById('expense-category').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        description: document.getElementById('expense-description').value
    };

    if (!expense.date || !expense.category || !expense.amount) {
        alert('Please fill in all fields');
        return;
    }

    if (!AppState.medical) AppState.medical = { vitals: [], symptoms: [], expenses: [] };
    if (!AppState.medical.expenses) AppState.medical.expenses = [];

    AppState.medical.expenses.push(expense);
    Storage.save('medical', AppState.medical);

    // Clear form
    document.getElementById('expense-date').value = '';
    document.getElementById('expense-category').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';

    loadExpenseHistory();
    updateExpenseSummary();
}

function loadExpenseHistory() {
    const expenseLog = document.getElementById('expense-log');
    if (!expenseLog || !AppState.medical || !AppState.medical.expenses) return;

    const expenses = AppState.medical.expenses || [];

    if (expenses.length === 0) {
        expenseLog.innerHTML = '<tr><td colspan="4" class="empty-state">No expenses tracked yet.</td></tr>';
        return;
    }

    expenseLog.innerHTML = expenses.slice(-20).reverse().map(e => `
        <tr>
            <td>${formatDate(e.date)}</td>
            <td>${e.category}</td>
            <td>${e.description}</td>
            <td>$${e.amount.toFixed(2)}</td>
        </tr>
    `).join('');
}

function updateExpenseSummary() {
    if (!AppState.medical || !AppState.medical.expenses) return;

    const expenses = AppState.medical.expenses || [];
    const now = new Date();
    const thisMonth = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);

    const thisYear = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + e.amount, 0);

    const lifetime = expenses.reduce((sum, e) => sum + e.amount, 0);

    document.getElementById('expense-month').textContent = `$${thisMonth.toFixed(2)}`;
    document.getElementById('expense-year').textContent = `$${thisYear.toFixed(2)}`;
    document.getElementById('expense-lifetime').textContent = `$${lifetime.toFixed(2)}`;
}

function updateHealthScore() {
    // Simple health score based on recent vitals
    if (!AppState.medical || !AppState.medical.vitals || AppState.medical.vitals.length === 0) {
        document.getElementById('health-score').textContent = '--';
        return;
    }

    const recent = AppState.medical.vitals.slice(-5);
    const avgEnergy = recent.reduce((sum, v) => sum + (parseInt(v.energy) || 3), 0) / recent.length;
    const score = Math.round((avgEnergy / 5) * 100);

    document.getElementById('health-score').textContent = score + '%';
}

function loadMedicalData() {
    const saved = Storage.load('medical');
    if (saved) {
        AppState.medical = saved;
        loadVitalsHistory();
        loadSymptomHistory();
        loadExpenseHistory();
        updateExpenseSummary();
        updateHealthScore();
    }
}

// ========================================
// Behavior Analysis Module
// ========================================

function setupBehaviorAnalysis() {
    const behaviorForm = document.getElementById('behavior-log-form');
    if (behaviorForm) {
        behaviorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            logBehaviorObservation();
        });
    }

    // Intensity slider
    const intensitySlider = document.getElementById('behavior-intensity');
    if (intensitySlider) {
        intensitySlider.addEventListener('input', (e) => {
            document.getElementById('intensity-value').textContent = e.target.value;
        });
    }

    // Export behavior data
    const exportBtn = document.getElementById('export-behavior-data');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportBehaviorData);
    }

    loadBehaviorData();
}

function logBehaviorObservation() {
    const observation = {
        id: Date.now(),
        datetime: document.getElementById('behavior-datetime').value,
        environment: document.getElementById('behavior-environment').value,
        handlerState: document.getElementById('handler-state').value,
        behaviorType: document.getElementById('behavior-type').value,
        trigger: document.getElementById('behavior-trigger').value,
        description: document.getElementById('behavior-description').value,
        intensity: parseInt(document.getElementById('behavior-intensity').value),
        duration: document.getElementById('behavior-duration').value,
        response: document.getElementById('behavior-response').value,
        outcome: document.getElementById('behavior-outcome').value,
        notes: document.getElementById('behavior-notes').value
    };

    if (!AppState.behavior) AppState.behavior = { observations: [] };
    if (!AppState.behavior.observations) AppState.behavior.observations = [];

    AppState.behavior.observations.push(observation);
    Storage.save('behavior', AppState.behavior);

    // Reset form
    document.getElementById('behavior-log-form').reset();
    document.getElementById('intensity-value').textContent = '5';

    loadBehaviorHistory();
    updateBehaviorStats();
    identifyTriggers();
}

function loadBehaviorHistory() {
    const historyDiv = document.getElementById('behavior-history');
    if (!historyDiv || !AppState.behavior || !AppState.behavior.observations) return;

    const observations = AppState.behavior.observations || [];

    if (observations.length === 0) {
        historyDiv.innerHTML = '<p class="empty-state">No behavior observations logged yet. Start tracking above to identify patterns and measure progress.</p>';
        return;
    }

    historyDiv.innerHTML = observations.slice(-20).reverse().map(obs => {
        const category = getBehaviorCategory(obs.behaviorType);
        return `
            <div class="behavior-entry ${category}">
                <h4>${obs.behaviorType.replace('-', ' ').toUpperCase()}</h4>
                <p><strong>Date/Time:</strong> ${new Date(obs.datetime).toLocaleString()}</p>
                <p><strong>Environment:</strong> ${obs.environment} | <strong>Intensity:</strong> ${obs.intensity}/10</p>
                ${obs.trigger ? `<p><strong>Trigger:</strong> ${obs.trigger}</p>` : ''}
                <p><strong>Description:</strong> ${obs.description}</p>
                ${obs.outcome ? `<p><strong>Outcome:</strong> ${obs.outcome}</p>` : ''}
            </div>
        `;
    }).join('');
}

function getBehaviorCategory(type) {
    const positive = ['calm', 'focused', 'obedient', 'alert-appropriate', 'protective', 'social', 'task-performance'];
    const concerning = ['aggressive', 'fearful', 'destructive', 'excessive-barking', 'separation'];

    if (positive.includes(type)) return 'positive';
    if (concerning.includes(type)) return 'concerning';
    return 'needs-attention';
}

function updateBehaviorStats() {
    if (!AppState.behavior || !AppState.behavior.observations) return;

    const obs = AppState.behavior.observations || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeek = obs.filter(o => new Date(o.datetime) >= weekAgo);

    document.getElementById('entries-week').textContent = thisWeek.length;

    // Calculate success rate
    const withOutcomes = obs.filter(o => o.outcome);
    const successful = withOutcomes.filter(o => o.outcome === 'success' || o.outcome === 'partial');
    const successRate = withOutcomes.length > 0 ? Math.round((successful.length / withOutcomes.length) * 100) : 0;

    document.getElementById('success-rate').textContent = successRate + '%';
}

function identifyTriggers() {
    if (!AppState.behavior || !AppState.behavior.observations) return;

    const obs = AppState.behavior.observations || [];
    const triggers = {};

    obs.forEach(o => {
        if (o.trigger) {
            const t = o.trigger.toLowerCase();
            triggers[t] = (triggers[t] || 0) + 1;
        }
    });

    const triggerList = document.getElementById('trigger-list');
    if (!triggerList) return;

    const sorted = Object.entries(triggers).sort((a, b) => b[1] - a[1]).slice(0, 10);

    if (sorted.length === 0) {
        triggerList.innerHTML = '<p class="empty-state">As you log behaviors, common triggers will be identified here.</p>';
        return;
    }

    document.getElementById('trigger-count').textContent = Object.keys(triggers).length;

    triggerList.innerHTML = sorted.map(([trigger, count]) => `
        <div class="trigger-card">
            <h4>${trigger}</h4>
            <p><strong>${count}</strong> occurrences</p>
        </div>
    `).join('');
}

function exportBehaviorData() {
    if (!AppState.behavior || !AppState.behavior.observations || AppState.behavior.observations.length === 0) {
        alert('No behavior data to export');
        return;
    }

    downloadJSON(AppState.behavior, `gypsy-behavior-data-${new Date().toISOString().split('T')[0]}.json`);
}

function loadBehaviorData() {
    const saved = Storage.load('behavior');
    if (saved) {
        AppState.behavior = saved;
        loadBehaviorHistory();
        updateBehaviorStats();
        identifyTriggers();
    }
}

// ========================================
// Certification Module
// ========================================

function setupCertificationModule() {
    // PAT checkboxes
    const patCheckboxes = document.querySelectorAll('.pat-item input[type="checkbox"]');
    patCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateCertificationProgress);
    });

    // Trial inputs
    const trialInputs = document.querySelectorAll('.trial-input');
    trialInputs.forEach(input => {
        input.addEventListener('change', updateCertificationProgress);
    });

    // Documentation checkboxes
    const docCheckboxes = document.querySelectorAll('.doc-item input[type="checkbox"]');
    docCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateCertificationProgress);
    });

    // Milestone checkboxes
    const milestoneCheckboxes = document.querySelectorAll('.milestone input[type="checkbox"]');
    milestoneCheckboxes.forEach(cb => {
        cb.addEventListener('change', saveCertificationData);
    });

    loadCertificationData();
}

function updateCertificationProgress() {
    // Count PAT items passed
    const patCheckboxes = document.querySelectorAll('.pat-item input[type="checkbox"]');
    const patPassed = Array.from(patCheckboxes).filter(cb => cb.checked).length;

    document.getElementById('pat-score').textContent = `${patPassed}/10`;

    // Count tasks from training
    const taskCheckboxes = document.querySelectorAll('#skill-alert, #skill-dpt, #skill-grounding, #skill-nightmare, #skill-crowd, #skill-watch, #skill-medication');
    const tasksPassed = Array.from(taskCheckboxes).filter(cb => cb.checked).length;

    document.getElementById('task-count').textContent = `${tasksPassed}/3`;

    // Count documentation
    const docCheckboxes = document.querySelectorAll('.doc-item input[type="checkbox"]');
    const docComplete = Array.from(docCheckboxes).filter(cb => cb.checked).length;

    document.getElementById('medical-complete').textContent = `${docComplete}/5`;

    // Calculate training hours from sessions
    const sessions = AppState.training?.sessions || [];
    const totalHours = Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60);

    document.getElementById('training-hours').textContent = totalHours;

    // Calculate overall percentage
    const total = patPassed + Math.min(tasksPassed, 3) + docComplete + Math.min(totalHours / 120, 1) * 10;
    const percentage = Math.round((total / 28) * 100);

    document.getElementById('cert-percentage').textContent = `${percentage}%`;

    // Update progress ring
    const circle = document.getElementById('cert-progress-ring');
    if (circle) {
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }

    // Update status
    const status = document.getElementById('cert-status');
    if (percentage >= 90) {
        status.textContent = 'Ready for Certification!';
        status.style.color = 'var(--success)';
    } else if (percentage >= 70) {
        status.textContent = 'Almost Ready - Keep Training!';
        status.style.color = 'var(--warning)';
    } else {
        status.textContent = 'Not Ready for Certification';
        status.style.color = 'var(--danger)';
    }

    saveCertificationData();
}

function saveCertificationData() {
    const cert = {
        patItems: {},
        docItems: {},
        milestones: {}
    };

    // Save PAT data
    document.querySelectorAll('.pat-item input[type="checkbox"]').forEach(cb => {
        cert.patItems[cb.id] = cb.checked;
    });

    // Save doc data
    document.querySelectorAll('.doc-item input[type="checkbox"]').forEach(cb => {
        cert.docItems[cb.id] = cb.checked;
    });

    // Save milestones
    document.querySelectorAll('.milestone input[type="checkbox"]').forEach(cb => {
        cert.milestones[cb.id] = cb.checked;
    });

    Storage.save('certification', cert);
}

function loadCertificationData() {
    const saved = Storage.load('certification');
    if (!saved) return;

    // Load PAT data
    Object.entries(saved.patItems || {}).forEach(([id, checked]) => {
        const cb = document.getElementById(id);
        if (cb) cb.checked = checked;
    });

    // Load doc data
    Object.entries(saved.docItems || {}).forEach(([id, checked]) => {
        const cb = document.getElementById(id);
        if (cb) cb.checked = checked;
    });

    // Load milestones
    Object.entries(saved.milestones || {}).forEach(([id, checked]) => {
        const cb = document.getElementById(id);
        if (cb) cb.checked = checked;
    });

    updateCertificationProgress();
}

// ========================================
// Initialize Enhanced Modules on Page Load
// ========================================

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnhancements);
    } else {
        initializeEnhancements();
    }
}

function initializeEnhancements() {
    setupMedicalHub();
    setupBehaviorAnalysis();
    setupCertificationModule();
}
