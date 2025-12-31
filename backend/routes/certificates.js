const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { runQuery, getQuery, allQuery } = require('../database/init');

const router = express.Router();
router.use(authenticateToken);

// Get next certificate number
router.get('/next-number', async (req, res) => {
  try {
    const counter = await getQuery('SELECT current_number FROM certificate_counter WHERE id = 1');
    res.json({ success: true, nextNumber: counter.current_number });
  } catch (error) {
    console.error('Error getting certificate number:', error);
    res.status(500).json({ error: 'Failed to get certificate number' });
  }
});

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await allQuery(
      'SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get single certificate
router.get('/:id', async (req, res) => {
  try {
    const certificate = await getQuery(
      'SELECT * FROM certificates WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// Create certificate
router.post('/', async (req, res) => {
  try {
    const {
      handler_name,
      dog_name,
      dog_breed,
      certification_type,
      issue_date,
      completion_date,
      training_hours,
      skills_mastered,
      instructor_name,
      notes
    } = req.body;

    // Get and increment certificate number
    const counter = await getQuery('SELECT current_number FROM certificate_counter WHERE id = 1');
    const certificateNumber = counter.current_number;

    // Create certificate
    const result = await runQuery(
      `INSERT INTO certificates (
        certificate_number, user_id, handler_name, dog_name, dog_breed,
        certification_type, issue_date, completion_date, training_hours,
        skills_mastered, instructor_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        certificateNumber, req.user.id, handler_name, dog_name, dog_breed,
        certification_type, issue_date, completion_date, training_hours,
        skills_mastered, instructor_name, notes
      ]
    );

    // Increment counter
    await runQuery('UPDATE certificate_counter SET current_number = current_number + 1 WHERE id = 1');

    res.json({
      success: true,
      id: result.id,
      certificateNumber
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

// Update certificate
router.put('/:id', async (req, res) => {
  try {
    const {
      handler_name,
      dog_name,
      dog_breed,
      certification_type,
      issue_date,
      completion_date,
      training_hours,
      skills_mastered,
      instructor_name,
      notes
    } = req.body;

    await runQuery(
      `UPDATE certificates SET
        handler_name = ?, dog_name = ?, dog_breed = ?,
        certification_type = ?, issue_date = ?, completion_date = ?,
        training_hours = ?, skills_mastered = ?, instructor_name = ?,
        notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [
        handler_name, dog_name, dog_breed, certification_type, issue_date,
        completion_date, training_hours, skills_mastered, instructor_name,
        notes, req.params.id, req.user.id
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    await runQuery(
      'DELETE FROM certificates WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

module.exports = router;
