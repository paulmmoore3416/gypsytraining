/**
 * Gypsy's Training Journey - Main Application JavaScript
 * Handles all interactive features for the service animal training web app
 */

// ========================================
// Application State Management
// ========================================

const AppState = {
    training: {
        sessions: [],
        startDate: null,
        skills: {}
    },
    journal: {
        entries: [],
        currentEntry: null
    },
    photos: {
        albums: []
    },
    nutrition: {
        entries: []
    }
};

// ========================================
// Local Storage Management
// ========================================

const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(`gypsy_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(`gypsy_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(`gypsy_${key}`);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('gypsy_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// ========================================
// Navigation
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupNavigation();
    setupTrainingModule();
    setupJournalModule();
    setupPhotoModule();
    setupNutritionModule();
    loadAppData();
});

function initializeApp() {
    console.log('Initializing Gypsy\'s Training Journey...');

    // Set default date for training start if not set
    if (!AppState.training.startDate) {
        AppState.training.startDate = new Date().toISOString().split('T')[0];
        Storage.save('training', AppState.training);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Hamburger menu toggle (for mobile)
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.content-section, .hero');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// Training Module
// ========================================

function setupTrainingModule() {
    // Setup skill checkboxes
    const skillCheckboxes = document.querySelectorAll('.skill-item input[type="checkbox"]');
    skillCheckboxes.forEach(checkbox => {
        const skillId = checkbox.dataset.skill;

        // Load saved state
        const saved = Storage.load('training');
        if (saved && saved.skills && saved.skills[skillId]) {
            checkbox.checked = saved.skills[skillId].completed;
        }

        checkbox.addEventListener('change', (e) => {
            handleSkillToggle(skillId, e.target.checked);
            updateTrainingProgress();
        });
    });

    // Setup session logging buttons
    const logButtons = document.querySelectorAll('.log-session');
    logButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const skillId = button.dataset.skill;
            openSessionLogger(skillId);
        });
    });

    // Setup session logger modal
    setupSessionLogger();

    // Update progress on load
    updateTrainingProgress();
}

function handleSkillToggle(skillId, completed) {
    if (!AppState.training.skills) {
        AppState.training.skills = {};
    }

    AppState.training.skills[skillId] = {
        completed,
        completedDate: completed ? new Date().toISOString() : null
    };

    Storage.save('training', AppState.training);
}

function updateTrainingProgress() {
    const allCheckboxes = document.querySelectorAll('.skill-item input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('.skill-item input[type="checkbox"]:checked');

    const totalSkills = allCheckboxes.length;
    const completedSkills = checkedBoxes.length;
    const percentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

    // Update progress bar
    const progressFill = document.getElementById('overall-progress');
    const progressText = document.getElementById('overall-progress-text');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }

    // Update skills mastered stat
    const skillsMastered = document.getElementById('skills-mastered');
    if (skillsMastered) {
        skillsMastered.textContent = completedSkills;
    }

    // Calculate days training
    const startDate = new Date(AppState.training.startDate || new Date());
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    const daysTraining = document.getElementById('days-training');
    if (daysTraining) {
        daysTraining.textContent = daysDiff;
    }

    // Update sessions completed
    const sessionsCompleted = document.getElementById('sessions-completed');
    if (sessionsCompleted) {
        const sessions = AppState.training.sessions || [];
        sessionsCompleted.textContent = sessions.length;
    }
}

function setupSessionLogger() {
    const sessionLogger = document.getElementById('session-logger');
    const sessionForm = document.getElementById('session-form');
    const closeButtons = document.querySelectorAll('.close-logger');
    const loggerOverlay = document.querySelector('.logger-overlay');

    // Set default date to today
    const dateInput = document.getElementById('session-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Close modal handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeSessionLogger();
        });
    });

    if (loggerOverlay) {
        loggerOverlay.addEventListener('click', () => {
            closeSessionLogger();
        });
    }

    // Form submission
    if (sessionForm) {
        sessionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveTrainingSession();
        });
    }
}

function openSessionLogger(skillId) {
    const sessionLogger = document.getElementById('session-logger');
    const skillInput = document.getElementById('session-skill');
    const loggerHeader = document.querySelector('.logger-header h3');

    if (sessionLogger && skillInput) {
        skillInput.value = skillId;

        // Update modal title with skill name
        const skillLabel = document.querySelector(`#skill-${skillId}`)?.nextElementSibling?.querySelector('strong')?.textContent;
        if (loggerHeader && skillLabel) {
            loggerHeader.textContent = `Log Training Session - ${skillLabel}`;
        }

        // Reset form
        document.getElementById('session-form').reset();
        document.getElementById('session-date').value = new Date().toISOString().split('T')[0];

        sessionLogger.style.display = 'block';
    }
}

function closeSessionLogger() {
    const sessionLogger = document.getElementById('session-logger');
    if (sessionLogger) {
        sessionLogger.style.display = 'none';
    }
}

function saveTrainingSession() {
    const formData = {
        skill: document.getElementById('session-skill').value,
        date: document.getElementById('session-date').value,
        duration: parseInt(document.getElementById('session-duration').value),
        rating: parseInt(document.querySelector('input[name="rating"]:checked')?.value || 0),
        notes: document.getElementById('session-notes').value,
        timestamp: new Date().toISOString()
    };

    if (!formData.skill || !formData.date || !formData.duration || !formData.rating) {
        alert('Please fill in all required fields');
        return;
    }

    if (!AppState.training.sessions) {
        AppState.training.sessions = [];
    }

    AppState.training.sessions.push(formData);
    Storage.save('training', AppState.training);

    updateTrainingProgress();
    closeSessionLogger();

    alert('Training session logged successfully!');
}

// ========================================
// Journal Module
// ========================================

function setupJournalModule() {
    const newEntryBtn = document.getElementById('new-entry');
    const saveEntryBtn = document.getElementById('save-entry');
    const saveAsEntryBtn = document.getElementById('save-as-entry');
    const loadEntryBtn = document.getElementById('load-entry');
    const exportJournalBtn = document.getElementById('export-journal');
    const importJournalBtn = document.getElementById('import-journal');

    const entryContent = document.getElementById('entry-content');
    const wordCount = document.getElementById('word-count');

    // New entry
    if (newEntryBtn) {
        newEntryBtn.addEventListener('click', createNewJournalEntry);
    }

    // Save entry
    if (saveEntryBtn) {
        saveEntryBtn.addEventListener('click', saveJournalEntry);
    }

    // Save as
    if (saveAsEntryBtn) {
        saveAsEntryBtn.addEventListener('click', saveAsJournalEntry);
    }

    // Load entry
    if (loadEntryBtn) {
        loadEntryBtn.addEventListener('click', showLoadJournalDialog);
    }

    // Export all
    if (exportJournalBtn) {
        exportJournalBtn.addEventListener('click', exportJournal);
    }

    // Import
    if (importJournalBtn) {
        importJournalBtn.addEventListener('click', importJournal);
    }

    // Word count
    if (entryContent && wordCount) {
        entryContent.addEventListener('input', () => {
            const words = entryContent.value.trim().split(/\s+/).filter(w => w.length > 0);
            wordCount.textContent = words.length;
        });
    }

    // Auto-save every 30 seconds
    setInterval(autoSaveJournal, 30000);

    // Load journal entries into sidebar
    loadJournalEntries();
}

function createNewJournalEntry() {
    AppState.journal.currentEntry = {
        id: Date.now(),
        title: '',
        date: new Date().toISOString().split('T')[0],
        mood: '',
        category: '',
        content: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };

    displayJournalEntry(AppState.journal.currentEntry);
}

function displayJournalEntry(entry) {
    document.getElementById('entry-title').value = entry.title || '';
    document.getElementById('entry-date').value = entry.date || '';
    document.getElementById('entry-mood').value = entry.mood || '';
    document.getElementById('entry-category').value = entry.category || '';
    document.getElementById('entry-content').value = entry.content || '';

    // Update word count
    const words = (entry.content || '').trim().split(/\s+/).filter(w => w.length > 0);
    document.getElementById('word-count').textContent = words.length;
}

function saveJournalEntry() {
    if (!AppState.journal.currentEntry) {
        createNewJournalEntry();
    }

    const entry = AppState.journal.currentEntry;
    entry.title = document.getElementById('entry-title').value || 'Untitled Entry';
    entry.date = document.getElementById('entry-date').value;
    entry.mood = document.getElementById('entry-mood').value;
    entry.category = document.getElementById('entry-category').value;
    entry.content = document.getElementById('entry-content').value;
    entry.modified = new Date().toISOString();

    // Find and update or add new
    const existingIndex = AppState.journal.entries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
        AppState.journal.entries[existingIndex] = entry;
    } else {
        AppState.journal.entries.push(entry);
    }

    Storage.save('journal', AppState.journal);
    loadJournalEntries();

    // Show save confirmation
    const saveStatus = document.getElementById('auto-save-status');
    if (saveStatus) {
        saveStatus.textContent = 'Saved!';
        setTimeout(() => {
            saveStatus.textContent = '';
        }, 2000);
    }
}

function saveAsJournalEntry() {
    // Create a copy with new ID
    const currentContent = {
        title: document.getElementById('entry-title').value,
        date: document.getElementById('entry-date').value,
        mood: document.getElementById('entry-mood').value,
        category: document.getElementById('entry-category').value,
        content: document.getElementById('entry-content').value
    };

    const newTitle = prompt('Enter a name for this entry:', currentContent.title || 'New Entry');
    if (!newTitle) return;

    const newEntry = {
        id: Date.now(),
        ...currentContent,
        title: newTitle,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };

    AppState.journal.entries.push(newEntry);
    AppState.journal.currentEntry = newEntry;

    Storage.save('journal', AppState.journal);
    loadJournalEntries();

    alert('Entry saved as new!');
}

function loadJournalEntries() {
    const journalList = document.getElementById('journal-list');
    if (!journalList) return;

    const entries = AppState.journal.entries || [];

    if (entries.length === 0) {
        journalList.innerHTML = '<p class="empty-state">No journal entries yet. Click "New Entry" to start.</p>';
        return;
    }

    // Sort by date, newest first
    entries.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    journalList.innerHTML = entries.map(entry => `
        <div class="entry-item ${AppState.journal.currentEntry?.id === entry.id ? 'active' : ''}"
             data-entry-id="${entry.id}">
            <div class="entry-item-title">${entry.title || 'Untitled'}</div>
            <div class="entry-item-date">${formatDate(entry.date)}</div>
        </div>
    `).join('');

    // Add click handlers
    journalList.querySelectorAll('.entry-item').forEach(item => {
        item.addEventListener('click', () => {
            const entryId = parseInt(item.dataset.entryId);
            const entry = entries.find(e => e.id === entryId);
            if (entry) {
                AppState.journal.currentEntry = entry;
                displayJournalEntry(entry);
                loadJournalEntries(); // Refresh to update active state
            }
        });
    });
}

function showLoadJournalDialog() {
    if (AppState.journal.entries.length === 0) {
        alert('No saved entries to load.');
        return;
    }

    const entryTitles = AppState.journal.entries.map((e, i) =>
        `${i + 1}. ${e.title || 'Untitled'} (${formatDate(e.date)})`
    ).join('\n');

    const selection = prompt(`Select an entry to load:\n\n${entryTitles}\n\nEnter the number:`);

    if (selection) {
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < AppState.journal.entries.length) {
            AppState.journal.currentEntry = AppState.journal.entries[index];
            displayJournalEntry(AppState.journal.currentEntry);
            loadJournalEntries();
        } else {
            alert('Invalid selection');
        }
    }
}

function autoSaveJournal() {
    if (AppState.journal.currentEntry && document.getElementById('entry-content').value.trim()) {
        saveJournalEntry();

        const saveStatus = document.getElementById('auto-save-status');
        if (saveStatus) {
            saveStatus.textContent = 'Auto-saved';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        }
    }
}

function exportJournal() {
    if (AppState.journal.entries.length === 0) {
        alert('No journal entries to export.');
        return;
    }

    const dataStr = JSON.stringify(AppState.journal, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `gypsy-journal-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

function importJournal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported.entries && Array.isArray(imported.entries)) {
                    AppState.journal = imported;
                    Storage.save('journal', AppState.journal);
                    loadJournalEntries();
                    alert('Journal imported successfully!');
                } else {
                    alert('Invalid journal file format.');
                }
            } catch (error) {
                alert('Error importing journal: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ========================================
// Photo Album Module
// ========================================

function setupPhotoModule() {
    const createAlbumBtn = document.getElementById('create-album');
    const uploadPhotosBtn = document.getElementById('upload-photos');
    const photoUpload = document.getElementById('photo-upload');
    const albumViewer = document.getElementById('album-viewer');
    const closeModal = albumViewer?.querySelector('.close-modal');
    const modalOverlay = albumViewer?.querySelector('.modal-overlay');

    if (createAlbumBtn) {
        createAlbumBtn.addEventListener('click', createNewAlbum);
    }

    if (uploadPhotosBtn && photoUpload) {
        uploadPhotosBtn.addEventListener('click', () => {
            if (AppState.photos.albums.length === 0) {
                alert('Please create an album first.');
                return;
            }
            photoUpload.click();
        });

        photoUpload.addEventListener('change', handlePhotoUpload);
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            albumViewer.style.display = 'none';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            albumViewer.style.display = 'none';
        });
    }

    loadPhotoAlbums();
}

function createNewAlbum() {
    const albumName = prompt('Enter album name (e.g., "Week 1-4"):', `Weeks ${AppState.photos.albums.length * 4 + 1}-${AppState.photos.albums.length * 4 + 4}`);

    if (!albumName) return;

    const newAlbum = {
        id: Date.now(),
        name: albumName,
        created: new Date().toISOString(),
        photos: []
    };

    AppState.photos.albums.push(newAlbum);
    Storage.save('photos', AppState.photos);
    loadPhotoAlbums();
}

function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Get the most recent album
    const currentAlbum = AppState.photos.albums[AppState.photos.albums.length - 1];
    if (!currentAlbum) {
        alert('Please create an album first.');
        return;
    }

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const photo = {
                id: Date.now() + Math.random(),
                data: event.target.result,
                filename: file.name,
                uploaded: new Date().toISOString()
            };

            currentAlbum.photos.push(photo);
            Storage.save('photos', AppState.photos);
            loadPhotoAlbums();
        };
        reader.readAsDataURL(file);
    });
}

function loadPhotoAlbums() {
    const albumsGrid = document.getElementById('albums-grid');
    if (!albumsGrid) return;

    const albums = AppState.photos.albums || [];

    if (albums.length === 0) {
        albumsGrid.innerHTML = `
            <div class="album-placeholder">
                <p>No albums yet. Click "Create New 4-Week Album" to start documenting progress.</p>
            </div>
        `;
        return;
    }

    albumsGrid.innerHTML = albums.map(album => {
        const coverPhoto = album.photos[0]?.data || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%237fa99b" width="400" height="300"/><text fill="white" font-size="24" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">No Photos Yet</text></svg>';

        return `
            <div class="album-card" data-album-id="${album.id}">
                <img src="${coverPhoto}" alt="${album.name}" class="album-cover">
                <div class="album-info">
                    <h3>${album.name}</h3>
                    <p>${album.photos.length} photos • Created ${formatDate(album.created.split('T')[0])}</p>
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers
    albumsGrid.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('click', () => {
            const albumId = parseInt(card.dataset.albumId);
            const album = albums.find(a => a.id === albumId);
            if (album) {
                openAlbumViewer(album);
            }
        });
    });
}

function openAlbumViewer(album) {
    const albumViewer = document.getElementById('album-viewer');
    const albumTitle = document.getElementById('album-title');
    const albumPhotos = document.getElementById('album-photos');

    if (!albumViewer || !albumTitle || !albumPhotos) return;

    albumTitle.textContent = album.name;

    if (album.photos.length === 0) {
        albumPhotos.innerHTML = '<p class="empty-state">No photos in this album yet.</p>';
    } else {
        albumPhotos.innerHTML = album.photos.map(photo => `
            <div class="photo-item">
                <img src="${photo.data}" alt="${photo.filename}">
            </div>
        `).join('');
    }

    albumViewer.style.display = 'block';
}

// ========================================
// Nutrition Module
// ========================================

function setupNutritionModule() {
    const addNutritionBtn = document.getElementById('add-nutrition-entry');

    if (addNutritionBtn) {
        addNutritionBtn.addEventListener('click', addNutritionEntry);
    }

    loadNutritionEntries();
}

function addNutritionEntry() {
    const week = prompt('Week number:');
    if (!week) return;

    const weight = prompt('Weight (lbs):');
    if (!weight) return;

    const bodyCondition = prompt('Body Condition Score (1-9):');
    if (!bodyCondition) return;

    const foodAmount = prompt('Food amount per day (cups):');
    if (!foodAmount) return;

    const energyLevel = prompt('Energy level (Low/Medium/High):');
    if (!energyLevel) return;

    const notes = prompt('Notes (optional):') || '';

    const entry = {
        id: Date.now(),
        week,
        weight,
        bodyCondition,
        foodAmount,
        energyLevel,
        notes,
        date: new Date().toISOString()
    };

    AppState.nutrition.entries.push(entry);
    Storage.save('nutrition', AppState.nutrition);
    loadNutritionEntries();
}

function loadNutritionEntries() {
    const nutritionLog = document.getElementById('nutrition-log');
    if (!nutritionLog) return;

    const entries = AppState.nutrition.entries || [];

    if (entries.length === 0) {
        nutritionLog.innerHTML = '<tr><td colspan="6" class="empty-state">No nutrition entries yet. Start logging to track optimal feeding.</td></tr>';
        return;
    }

    nutritionLog.innerHTML = entries.map(entry => `
        <tr>
            <td>Week ${entry.week}</td>
            <td>${entry.weight}</td>
            <td>${entry.bodyCondition}/9</td>
            <td>${entry.foodAmount} cups</td>
            <td>${entry.energyLevel}</td>
            <td>${entry.notes}</td>
        </tr>
    `).join('');
}

// ========================================
// Data Loading
// ========================================

function loadAppData() {
    // Load training data
    const savedTraining = Storage.load('training');
    if (savedTraining) {
        AppState.training = savedTraining;
        updateTrainingProgress();
    }

    // Load journal data
    const savedJournal = Storage.load('journal');
    if (savedJournal) {
        AppState.journal = savedJournal;
        loadJournalEntries();
    }

    // Load photos data
    const savedPhotos = Storage.load('photos');
    if (savedPhotos) {
        AppState.photos = savedPhotos;
        loadPhotoAlbums();
    }

    // Load nutrition data
    const savedNutrition = Storage.load('nutrition');
    if (savedNutrition) {
        AppState.nutrition = savedNutrition;
        loadNutritionEntries();
    }
}

// ========================================
// Utility Functions
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function downloadJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

// ========================================
// Export for testing/debugging
// ========================================

if (typeof window !== 'undefined') {
    window.GypsyApp = {
        AppState,
        Storage,
        exportAllData: () => {
            const allData = {
                training: AppState.training,
                journal: AppState.journal,
                photos: AppState.photos,
                nutrition: AppState.nutrition,
                exportDate: new Date().toISOString()
            };
            downloadJSON(allData, `gypsy-complete-backup-${new Date().toISOString().split('T')[0]}.json`);
        }
    };
}
