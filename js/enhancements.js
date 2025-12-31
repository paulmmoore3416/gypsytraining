/**
 * Gypsy Training - Advanced Enhancements
 * Certificate Generation + 8 Premium Features
 */

// =================================
// ENHANCEMENT 1: CERTIFICATE SYSTEM
// =================================

const CertificateSystem = {
    currentNumber: 3416,

    async generateCertificate() {
        const handlerName = document.getElementById('cert-handler-name').value || 'Paul Moore';
        const dogName = document.getElementById('cert-dog-name').value || 'Gypsy';
        const dogBreed = document.getElementById('cert-dog-breed').value || 'Blue Nose American Pitbull Terrier';
        const certType = document.getElementById('cert-type').value || 'Service Animal Training';
        const issueDate = document.getElementById('cert-issue-date').value || new Date().toISOString().split('T')[0];
        const completionDate = document.getElementById('cert-completion-date').value || new Date().toISOString().split('T')[0];
        const trainingHours = document.getElementById('cert-training-hours').value || '500';
        const instructorName = document.getElementById('cert-instructor').value || 'Self-Trained with VA Support';

        // Get next certificate number
        const certNumber = this.currentNumber++;
        localStorage.setItem('lastCertificateNumber', this.currentNumber);

        // Generate certificate HTML
        const certificateHTML = this.createCertificateHTML({
            certNumber,
            handlerName,
            dogName,
            dogBreed,
            certType,
            issueDate,
            completionDate,
            trainingHours,
            instructorName
        });

        // Save to database
        this.saveCertificate({
            certificate_number: certNumber,
            handler_name: handlerName,
            dog_name: dogName,
            dog_breed: dogBreed,
            certification_type: certType,
            issue_date: issueDate,
            completion_date: completionDate,
            training_hours: trainingHours,
            instructor_name: instructorName,
            notes: 'Generated via Gypsy Training App'
        });

        // Display certificate
        document.getElementById('certificate-output').innerHTML = certificateHTML;
        document.getElementById('certificate-output').style.display = 'block';

        // Show download button
        document.getElementById('download-cert-btn').style.display = 'inline-block';
    },

    createCertificateHTML(data) {
        return `
        <div id="printable-certificate" style="
            width: 11in;
            height: 8.5in;
            margin: 0 auto;
            background: linear-gradient(135deg, #24292e 0%, #1a1f24 50%, #24292e 100%);
            border: 20px solid #2d5a4a;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 0 100px rgba(45,90,74,0.1);
            padding: 60px;
            font-family: 'Georgia', serif;
            position: relative;
            overflow: hidden;
        ">
            <!-- Background Pattern -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image:
                    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(45,90,74,0.03) 35px, rgba(45,90,74,0.03) 70px),
                    repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(74,124,158,0.03) 35px, rgba(74,124,158,0.03) 70px);
                pointer-events: none;
            "></div>

            <!-- Pacific NW Mountain Silhouette -->
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 150px;
                background: linear-gradient(to top, rgba(26,58,46,0.3) 0%, transparent 100%);
                clip-path: polygon(0% 100%, 0% 60%, 15% 70%, 30% 50%, 45% 65%, 60% 45%, 75% 60%, 90% 55%, 100% 70%, 100% 100%);
            "></div>

            <!-- Header Badge -->
            <div style="text-align: center; position: relative; z-index: 10;">
                <div style="
                    display: inline-block;
                    background: linear-gradient(135deg, #2d5a4a, #3d7561);
                    padding: 15px 40px;
                    border-radius: 50px;
                    box-shadow: 0 10px 30px rgba(45,90,74,0.4);
                    margin-bottom: 20px;
                ">
                    <div style="color: #c9a961; font-size: 14px; letter-spacing: 4px; font-weight: bold;">🇺🇸 UNITED STATES OF AMERICA 🇺🇸</div>
                    <div style="color: #fff; font-size: 20px; letter-spacing: 6px; font-weight: bold; margin-top: 5px;">VETERAN SERVICE ANIMAL</div>
                </div>
            </div>

            <!-- Certificate Title -->
            <div style="text-align: center; margin: 30px 0; position: relative; z-index: 10;">
                <h1 style="
                    font-size: 56px;
                    color: #fff;
                    margin: 0;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.7);
                    letter-spacing: 6px;
                    font-weight: 300;
                ">CERTIFICATE</h1>
                <div style="
                    font-size: 20px;
                    color: #c9a961;
                    letter-spacing: 12px;
                    margin-top: 10px;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                ">OF COMPLETION</div>
            </div>

            <!-- Certificate Body -->
            <div style="
                background: rgba(255,255,255,0.95);
                padding: 40px;
                border-radius: 20px;
                margin: 30px 0;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                position: relative;
                z-index: 10;
                border: 3px solid #2d5a4a;
            ">
                <div style="text-align: center; font-size: 18px; line-height: 2; color: #24292e;">
                    <p style="margin: 15px 0;">This certifies that</p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        color: #1a3a2e;
                        margin: 20px 0;
                        padding: 15px;
                        border-bottom: 3px solid #2d5a4a;
                        display: inline-block;
                        min-width: 400px;
                    ">${data.handlerName}</div>

                    <p style="margin: 20px 0;">has successfully completed comprehensive service animal training with</p>

                    <div style="
                        font-size: 36px;
                        font-weight: bold;
                        color: #2d5a4a;
                        margin: 20px 0;
                        text-shadow: 0 2px 4px rgba(45,90,74,0.2);
                    ">${data.dogName}</div>

                    <div style="
                        font-size: 16px;
                        color: #666;
                        font-style: italic;
                        margin-bottom: 20px;
                    ">(${data.dogBreed})</div>

                    <div style="margin: 30px 0; padding: 20px; background: #f6f8fa; border-radius: 10px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; font-size: 14px;">
                            <div><strong>Certification Type:</strong> ${data.certType}</div>
                            <div><strong>Training Hours:</strong> ${data.trainingHours}</div>
                            <div><strong>Start Date:</strong> ${new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div><strong>Completion Date:</strong> ${new Date(data.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                        This training program encompasses Foundation Obedience, PTSD Service Tasks,<br>
                        Public Access Training, and Personal Protection Work
                    </p>
                </div>
            </div>

            <!-- Footer Signatures -->
            <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-top: 40px;
                position: relative;
                z-index: 10;
            ">
                <div style="text-align: center;">
                    <div style="
                        border-top: 2px solid #fff;
                        padding-top: 10px;
                        color: #fff;
                        font-size: 16px;
                    ">
                        <div style="font-weight: bold;">${data.instructorName}</div>
                        <div style="font-size: 12px; color: #c9a961; margin-top: 5px;">Training Coordinator</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="
                        border-top: 2px solid #fff;
                        padding-top: 10px;
                        color: #fff;
                        font-size: 16px;
                    ">
                        <div style="font-weight: bold;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div style="font-size: 12px; color: #c9a961; margin-top: 5px;">Date of Issue</div>
                    </div>
                </div>
            </div>

            <!-- Certificate Number & QR Code -->
            <div style="
                position: absolute;
                bottom: 30px;
                left: 0;
                right: 0;
                text-align: center;
                z-index: 10;
            ">
                <div style="
                    display: inline-block;
                    background: rgba(45,90,74,0.9);
                    padding: 10px 30px;
                    border-radius: 30px;
                    color: #fff;
                    font-size: 14px;
                    letter-spacing: 3px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                ">
                    CERTIFICATE NO. <strong>${String(data.certNumber).padStart(6, '0')}</strong>
                </div>
            </div>

            <!-- USMC Emblem -->
            <div style="
                position: absolute;
                top: 40px;
                right: 40px;
                color: #c9a961;
                font-size: 48px;
                opacity: 0.3;
                text-shadow: 0 0 20px rgba(201,169,97,0.5);
            ">🎖️</div>

            <!-- Service Dog Paw -->
            <div style="
                position: absolute;
                top: 40px;
                left: 40px;
                color: #c9a961;
                font-size: 48px;
                opacity: 0.3;
                text-shadow: 0 0 20px rgba(201,169,97,0.5);
            ">🐾</div>
        </div>
        `;
    },

    saveCertificate(data) {
        const certificates = JSON.parse(localStorage.getItem('gypsy_certificates') || '[]');
        certificates.push({
            ...data,
            id: Date.now(),
            created_at: new Date().toISOString()
        });
        localStorage.setItem('gypsy_certificates', JSON.stringify(certificates));
    },

    downloadPDF() {
        window.print();
    },

    init() {
        // Load last certificate number
        const lastNumber = localStorage.getItem('lastCertificateNumber');
        if (lastNumber) {
            this.currentNumber = parseInt(lastNumber);
        }

        // Set default values
        document.getElementById('cert-handler-name').value = 'Paul Moore';
        document.getElementById('cert-dog-name').value = 'Gypsy';
        document.getElementById('cert-dog-breed').value = 'Blue Nose American Pitbull Terrier';
        document.getElementById('cert-type').value = 'PTSD Service Animal Training';
        document.getElementById('cert-issue-date').value = '2024-01-01';
        document.getElementById('cert-completion-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('cert-training-hours').value = '500';
        document.getElementById('cert-instructor').value = 'Self-Trained with VA Support';
    }
};

// =================================
// ENHANCEMENT 2: VIDEO TRAINING LIBRARY
// =================================

const VideoLibrary = {
    videos: [],

    uploadVideo(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const video = {
                id: Date.now(),
                name: file.name,
                data: e.target.result,
                uploadDate: new Date().toISOString(),
                duration: 0,
                category: 'training'
            };
            this.videos.push(video);
            this.save();
            this.renderVideoGallery();
        };
        reader.readAsDataURL(file);
    },

    renderVideoGallery() {
        const container = document.getElementById('video-gallery');
        if (!container) return;

        container.innerHTML = this.videos.map(video => `
            <div class="video-card">
                <video controls style="width: 100%; border-radius: 8px;">
                    <source src="${video.data}" type="video/mp4">
                </video>
                <div class="video-info">
                    <h4>${video.name}</h4>
                    <p>${new Date(video.uploadDate).toLocaleDateString()}</p>
                    <button onclick="VideoLibrary.deleteVideo(${video.id})">Delete</button>
                </div>
            </div>
        `).join('');
    },

    deleteVideo(id) {
        this.videos = this.videos.filter(v => v.id !== id);
        this.save();
        this.renderVideoGallery();
    },

    save() {
        localStorage.setItem('gypsy_videos', JSON.stringify(this.videos));
    },

    load() {
        const saved = localStorage.getItem('gypsy_videos');
        if (saved) {
            this.videos = JSON.parse(saved);
            this.renderVideoGallery();
        }
    }
};

// =================================
// ENHANCEMENT 3: PROGRESS ANALYTICS
// =================================

const ProgressAnalytics = {
    generateCharts() {
        const trainingData = JSON.parse(localStorage.getItem('gypsy_training') || '{}');
        const sessions = trainingData.sessions || [];

        // Training sessions over time
        const sessionsByMonth = {};
        sessions.forEach(session => {
            const month = session.date.substring(0, 7);
            sessionsByMonth[month] = (sessionsByMonth[month] || 0) + 1;
        });

        // Skills mastered by phase
        const progress = trainingData.progress || {};
        const phaseProgress = {
            'Phase 1': 0,
            'Phase 2': 0,
            'Phase 3': 0,
            'Phase 4': 0
        };

        Object.keys(progress).forEach(skill => {
            if (progress[skill].completed) {
                const phase = progress[skill].phase || 1;
                phaseProgress[`Phase ${phase}`]++;
            }
        });

        this.renderCharts({ sessionsByMonth, phaseProgress });
    },

    renderCharts(data) {
        const container = document.getElementById('analytics-charts');
        if (!container) return;

        container.innerHTML = `
            <div class="charts-grid">
                <div class="chart-card">
                    <h3>Training Sessions Over Time</h3>
                    <div class="bar-chart">
                        ${Object.entries(data.sessionsByMonth).map(([month, count]) => `
                            <div class="bar-item">
                                <div class="bar" style="height: ${count * 20}px; background: #2d5a4a;"></div>
                                <div class="bar-label">${month}</div>
                                <div class="bar-value">${count}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="chart-card">
                    <h3>Skills Mastered by Phase</h3>
                    <div class="pie-chart">
                        ${Object.entries(data.phaseProgress).map(([phase, count]) => `
                            <div class="phase-bar">
                                <span>${phase}: ${count} skills</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${count * 10}%; background: #4a7c9e;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

// =================================
// ENHANCEMENT 4: PRINTABLE TRAINING LOGS
// =================================

const PrintableReports = {
    generateTrainingLog() {
        const trainingData = JSON.parse(localStorage.getItem('gypsy_training') || '{}');
        const sessions = (trainingData.sessions || []).sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        const reportHTML = `
            <div class="printable-report" style="padding: 40px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #1a3a2e;">Gypsy's Training Log</h1>
                    <p style="color: #666;">Generated: ${new Date().toLocaleDateString()}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #2d5a4a; color: white;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Date</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Phase</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Skill</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Duration</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Rating</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sessions.map((session, index) => `
                            <tr style="background: ${index % 2 === 0 ? '#f6f8fa' : 'white'};">
                                <td style="padding: 10px; border: 1px solid #ddd;">${session.date}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">Phase ${session.phase}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${session.skill}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${session.duration} min</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${'⭐'.repeat(session.rating || 0)}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${session.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="margin-top: 40px; padding: 20px; background: #f6f8fa; border-radius: 8px;">
                    <h3>Summary Statistics</h3>
                    <p><strong>Total Sessions:</strong> ${sessions.length}</p>
                    <p><strong>Total Training Hours:</strong> ${sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60} hours</p>
                    <p><strong>Average Session Rating:</strong> ${(sessions.reduce((sum, s) => sum + (s.rating || 0), 0) / sessions.length).toFixed(1)} / 5</p>
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.print();
    }
};

// =================================
// ENHANCEMENT 5: COMMAND AUDIO PRONUNCIATION
// =================================

const CommandAudio = {
    commands: {
        'sit': 'SIT',
        'down': 'DOWN',
        'stay': 'STAY',
        'come': 'COME',
        'heel': 'HEEL',
        'place': 'PLACE',
        'leave it': 'LEAVE IT',
        'wait': 'WAIT',
        'off': 'OFF',
        'release': 'RELEASE'
    },

    speak(command) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.commands[command] || command);
            utterance.rate = 0.8;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    },

    addAudioButtons() {
        document.querySelectorAll('.command-card').forEach(card => {
            const commandName = card.dataset.command;
            if (commandName) {
                const audioBtn = document.createElement('button');
                audioBtn.innerHTML = '🔊 Hear Command';
                audioBtn.className = 'audio-btn';
                audioBtn.onclick = () => this.speak(commandName);
                card.appendChild(audioBtn);
            }
        });
    }
};

// =================================
// ENHANCEMENT 6: TRAINING CALENDAR & REMINDERS
// =================================

const TrainingCalendar = {
    events: [],

    addReminder(title, date, time) {
        const reminder = {
            id: Date.now(),
            title,
            date,
            time,
            completed: false
        };
        this.events.push(reminder);
        this.save();
        this.renderCalendar();
        this.scheduleNotification(reminder);
    },

    scheduleNotification(reminder) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
            const now = new Date();
            const delay = reminderDate - now;

            if (delay > 0) {
                setTimeout(() => {
                    new Notification('Gypsy Training Reminder', {
                        body: reminder.title,
                        icon: 'assets/icons/logo.svg'
                    });
                }, delay);
            }
        }
    },

    renderCalendar() {
        const container = document.getElementById('training-calendar');
        if (!container) return;

        const upcomingEvents = this.events
            .filter(e => !e.completed && new Date(`${e.date}T${e.time}`) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        container.innerHTML = `
            <div class="calendar-view">
                <h3>Upcoming Training Sessions</h3>
                ${upcomingEvents.length === 0 ? '<p>No upcoming sessions scheduled</p>' : ''}
                ${upcomingEvents.map(event => `
                    <div class="calendar-event">
                        <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
                        <div class="event-time">${event.time}</div>
                        <div class="event-title">${event.title}</div>
                        <button onclick="TrainingCalendar.completeEvent(${event.id})">✓ Complete</button>
                        <button onclick="TrainingCalendar.deleteEvent(${event.id})">✗ Delete</button>
                    </div>
                `).join('')}
            </div>
        `;
    },

    completeEvent(id) {
        const event = this.events.find(e => e.id === id);
        if (event) {
            event.completed = true;
            this.save();
            this.renderCalendar();
        }
    },

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.save();
        this.renderCalendar();
    },

    save() {
        localStorage.setItem('gypsy_calendar', JSON.stringify(this.events));
    },

    load() {
        const saved = localStorage.getItem('gypsy_calendar');
        if (saved) {
            this.events = JSON.parse(saved);
            this.renderCalendar();
        }
    },

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
};

// =================================
// ENHANCEMENT 7: PDF EXPORT FUNCTIONALITY
// =================================

const PDFExport = {
    async exportJournalToPDF() {
        const journal = JSON.parse(localStorage.getItem('gypsy_journal') || '[]');

        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Gypsy's Training Journal</title>
                <style>
                    body { font-family: Georgia, serif; padding: 40px; }
                    h1 { color: #1a3a2e; border-bottom: 3px solid #2d5a4a; padding-bottom: 10px; }
                    .entry { margin: 30px 0; padding: 20px; background: #f6f8fa; border-radius: 8px; }
                    .entry-header { font-weight: bold; color: #2d5a4a; margin-bottom: 10px; }
                    .entry-date { color: #666; font-size: 14px; }
                    @media print { .entry { page-break-inside: avoid; } }
                </style>
            </head>
            <body>
                <h1>🐕 Gypsy's Training Journal</h1>
                <p><strong>Handler:</strong> Paul Moore | <strong>Dog:</strong> Gypsy | <strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>

                ${journal.map(entry => `
                    <div class="entry">
                        <div class="entry-header">${entry.title || 'Untitled Entry'}</div>
                        <div class="entry-date">📅 ${entry.date} | Mood: ${entry.mood || 'N/A'} | Category: ${entry.category || 'General'}</div>
                        <div class="entry-content" style="margin-top: 15px; line-height: 1.6;">
                            ${entry.content || ''}
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        printWindow.print();
    }
};

// =================================
// ENHANCEMENT 8: BEHAVIOR TRACKING HEATMAP
// =================================

const BehaviorHeatmap = {
    behaviors: {},

    trackBehavior(behavior, intensity, notes) {
        const dateKey = new Date().toISOString().split('T')[0];

        if (!this.behaviors[dateKey]) {
            this.behaviors[dateKey] = [];
        }

        this.behaviors[dateKey].push({
            behavior,
            intensity,
            notes,
            timestamp: new Date().toISOString()
        });

        this.save();
        this.renderHeatmap();
    },

    renderHeatmap() {
        const container = document.getElementById('behavior-heatmap');
        if (!container) return;

        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last30Days.push(date.toISOString().split('T')[0]);
        }

        const heatmapHTML = `
            <div class="heatmap-grid">
                ${last30Days.map(date => {
                    const dayData = this.behaviors[date] || [];
                    const avgIntensity = dayData.length > 0
                        ? dayData.reduce((sum, b) => sum + b.intensity, 0) / dayData.length
                        : 0;

                    let color = '#e8f1ef';
                    if (avgIntensity > 7) color = '#d97642';
                    else if (avgIntensity > 4) color = '#c9a961';
                    else if (avgIntensity > 0) color = '#4a7c9e';

                    return `
                        <div class="heatmap-cell" style="background: ${color};" title="${date}: ${dayData.length} entries">
                            <div class="cell-date">${new Date(date).getDate()}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="heatmap-legend">
                <span>Less</span>
                <div style="background: #e8f1ef;"></div>
                <div style="background: #4a7c9e;"></div>
                <div style="background: #c9a961;"></div>
                <div style="background: #d97642;"></div>
                <span>More</span>
            </div>
        `;

        container.innerHTML = heatmapHTML;
    },

    save() {
        localStorage.setItem('gypsy_behaviors', JSON.stringify(this.behaviors));
    },

    load() {
        const saved = localStorage.getItem('gypsy_behaviors');
        if (saved) {
            this.behaviors = JSON.parse(saved);
            this.renderHeatmap();
        }
    }
};

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    CertificateSystem.init();
    VideoLibrary.load();
    TrainingCalendar.load();
    TrainingCalendar.requestNotificationPermission();
    BehaviorHeatmap.load();
    CommandAudio.addAudioButtons();
});
