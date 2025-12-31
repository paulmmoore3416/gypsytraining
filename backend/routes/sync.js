const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, allQuery } = require('../database/init');

const router = express.Router();
router.use(authenticateToken);

// Get all data for sync (full sync)
router.get('/full', async (req, res) => {
  try {
    const [trainingSessions, trainingProgress, journalEntries, photoAlbums, nutritionLogs] = await Promise.all([
      allQuery('SELECT * FROM training_sessions WHERE user_id = ? AND deleted = 0', [req.user.id]),
      allQuery('SELECT * FROM training_progress WHERE user_id = ? AND deleted = 0', [req.user.id]),
      allQuery('SELECT * FROM journal_entries WHERE user_id = ? AND deleted = 0', [req.user.id]),
      allQuery('SELECT * FROM photo_albums WHERE user_id = ? AND deleted = 0', [req.user.id]),
      allQuery('SELECT * FROM nutrition_logs WHERE user_id = ? AND deleted = 0', [req.user.id])
    ]);

    res.json({
      success: true,
      data: {
        trainingSessions,
        trainingProgress,
        journalEntries,
        photoAlbums,
        nutritionLogs,
        lastSync: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Full sync error:', error);
    res.status(500).json({ error: 'Failed to perform full sync' });
  }
});

// Get incremental changes since last sync
router.get('/incremental', async (req, res) => {
  try {
    const { since } = req.query;

    if (!since) {
      return res.status(400).json({ error: 'Missing "since" parameter' });
    }

    const [trainingSessions, trainingProgress, journalEntries, photoAlbums, nutritionLogs] = await Promise.all([
      allQuery('SELECT * FROM training_sessions WHERE user_id = ? AND updated_at > ?', [req.user.id, since]),
      allQuery('SELECT * FROM training_progress WHERE user_id = ? AND updated_at > ?', [req.user.id, since]),
      allQuery('SELECT * FROM journal_entries WHERE user_id = ? AND updated_at > ?', [req.user.id, since]),
      allQuery('SELECT * FROM photo_albums WHERE user_id = ? AND updated_at > ?', [req.user.id, since]),
      allQuery('SELECT * FROM nutrition_logs WHERE user_id = ? AND updated_at > ?', [req.user.id, since])
    ]);

    res.json({
      success: true,
      data: {
        trainingSessions,
        trainingProgress,
        journalEntries,
        photoAlbums,
        nutritionLogs,
        lastSync: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Incremental sync error:', error);
    res.status(500).json({ error: 'Failed to perform incremental sync' });
  }
});

// Record sync metadata
router.post('/metadata', async (req, res) => {
  try {
    const { device_id, sync_type } = req.body;

    await runQuery(
      'INSERT INTO sync_metadata (user_id, device_id, last_sync, sync_type) VALUES (?, ?, CURRENT_TIMESTAMP, ?)',
      [req.user.id, device_id, sync_type]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record sync metadata' });
  }
});

module.exports = router;
