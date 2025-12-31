const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, allQuery } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const logs = await allQuery(
      'SELECT * FROM nutrition_logs WHERE user_id = ? AND deleted = 0 ORDER BY date DESC',
      [req.user.id]
    );
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, date, meal_type, food_item, calories, protein, notes } = req.body;
    const logId = id || uuidv4();

    await runQuery(
      `INSERT OR REPLACE INTO nutrition_logs (id, user_id, date, meal_type, food_item, calories, protein, notes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [logId, req.user.id, date, meal_type, food_item, calories, protein, notes]
    );

    res.json({ success: true, id: logId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save nutrition log' });
  }
});

module.exports = router;
