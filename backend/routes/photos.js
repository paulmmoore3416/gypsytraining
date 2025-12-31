const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, allQuery } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(authenticateToken);

router.get('/albums', async (req, res) => {
  try {
    const albums = await allQuery(
      'SELECT * FROM photo_albums WHERE user_id = ? AND deleted = 0',
      [req.user.id]
    );
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

router.get('/album/:albumId', async (req, res) => {
  try {
    const photos = await allQuery(
      'SELECT * FROM photos WHERE album_id = ? AND user_id = ? AND deleted = 0',
      [req.params.albumId, req.user.id]
    );
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

router.post('/album', async (req, res) => {
  try {
    const { id, name, start_date, end_date } = req.body;
    const albumId = id || uuidv4();

    await runQuery(
      `INSERT OR REPLACE INTO photo_albums (id, user_id, name, start_date, end_date, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [albumId, req.user.id, name, start_date, end_date]
    );

    res.json({ success: true, id: albumId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

router.post('/photo', async (req, res) => {
  try {
    const { id, album_id, file_name, file_data, caption, upload_date } = req.body;
    const photoId = id || uuidv4();

    await runQuery(
      `INSERT OR REPLACE INTO photos (id, album_id, user_id, file_name, file_data, caption, upload_date, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [photoId, album_id, req.user.id, file_name, file_data, caption, upload_date]
    );

    res.json({ success: true, id: photoId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

module.exports = router;
