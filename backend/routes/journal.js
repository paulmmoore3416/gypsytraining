const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, allQuery } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const entries = await allQuery(
      'SELECT * FROM journal_entries WHERE user_id = ? AND deleted = 0 ORDER BY date DESC',
      [req.user.id]
    );
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title, content, date, mood, category, word_count } = req.body;
    const entryId = id || uuidv4();

    await runQuery(
      `INSERT OR REPLACE INTO journal_entries (id, user_id, title, content, date, mood, category, word_count, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [entryId, req.user.id, title, content, date, mood, category, word_count]
    );

    res.json({ success: true, id: entryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

module.exports = router;
