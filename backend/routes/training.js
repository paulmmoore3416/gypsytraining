const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, getQuery, allQuery } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all training sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await allQuery(
      'SELECT * FROM training_sessions WHERE user_id = ? AND deleted = 0 ORDER BY date DESC',
      [req.user.id]
    );
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// Get training progress
router.get('/progress', async (req, res) => {
  try {
    const progress = await allQuery(
      'SELECT * FROM training_progress WHERE user_id = ? AND deleted = 0',
      [req.user.id]
    );
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching training progress:', error);
    res.status(500).json({ error: 'Failed to fetch training progress' });
  }
});

// Create training session
router.post('/sessions', async (req, res) => {
  try {
    const { id, phase, skill_name, notes, rating, duration, date } = req.body;
    const sessionId = id || uuidv4();

    await runQuery(
      `INSERT INTO training_sessions (id, user_id, phase, skill_name, notes, rating, duration, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, req.user.id, phase, skill_name, notes, rating, duration, date]
    );

    res.json({ success: true, id: sessionId });
  } catch (error) {
    console.error('Error creating training session:', error);
    res.status(500).json({ error: 'Failed to create training session' });
  }
});

// Update training progress
router.post('/progress', async (req, res) => {
  try {
    const { id, phase, skill_name, completed } = req.body;
    const progressId = id || uuidv4();

    const existing = await getQuery(
      'SELECT id FROM training_progress WHERE id = ? AND user_id = ?',
      [progressId, req.user.id]
    );

    if (existing) {
      await runQuery(
        'UPDATE training_progress SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [completed, progressId, req.user.id]
      );
    } else {
      await runQuery(
        `INSERT INTO training_progress (id, user_id, phase, skill_name, completed)
         VALUES (?, ?, ?, ?, ?)`,
        [progressId, req.user.id, phase, skill_name, completed]
      );
    }

    res.json({ success: true, id: progressId });
  } catch (error) {
    console.error('Error updating training progress:', error);
    res.status(500).json({ error: 'Failed to update training progress' });
  }
});

// Sync training data (batch operations)
router.post('/sync', async (req, res) => {
  try {
    const { sessions, progress } = req.body;
    const results = { sessions: [], progress: [] };

    // Sync training sessions
    if (sessions && Array.isArray(sessions)) {
      for (const session of sessions) {
        const { id, phase, skill_name, notes, rating, duration, date, deleted } = session;
        const sessionId = id || uuidv4();

        const existing = await getQuery(
          'SELECT id FROM training_sessions WHERE id = ?',
          [sessionId]
        );

        if (existing) {
          await runQuery(
            `UPDATE training_sessions
             SET phase = ?, skill_name = ?, notes = ?, rating = ?, duration = ?, date = ?, deleted = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [phase, skill_name, notes, rating, duration, date, deleted || 0, sessionId, req.user.id]
          );
        } else {
          await runQuery(
            `INSERT INTO training_sessions (id, user_id, phase, skill_name, notes, rating, duration, date, deleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, req.user.id, phase, skill_name, notes, rating, duration, date, deleted || 0]
          );
        }

        results.sessions.push(sessionId);
      }
    }

    // Sync training progress
    if (progress && Array.isArray(progress)) {
      for (const item of progress) {
        const { id, phase, skill_name, completed, deleted } = item;
        const progressId = id || uuidv4();

        const existing = await getQuery(
          'SELECT id FROM training_progress WHERE id = ?',
          [progressId]
        );

        if (existing) {
          await runQuery(
            `UPDATE training_progress
             SET phase = ?, skill_name = ?, completed = ?, deleted = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [phase, skill_name, completed, deleted || 0, progressId, req.user.id]
          );
        } else {
          await runQuery(
            `INSERT INTO training_progress (id, user_id, phase, skill_name, completed, deleted)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [progressId, req.user.id, phase, skill_name, completed, deleted || 0]
          );
        }

        results.progress.push(progressId);
      }
    }

    res.json({ success: true, synced: results });
  } catch (error) {
    console.error('Error syncing training data:', error);
    res.status(500).json({ error: 'Failed to sync training data' });
  }
});

module.exports = router;
