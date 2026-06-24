const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Get all exams
router.get('/', async (req, res) => {
  try {
    const { featured, level } = req.query;
    let query = {};
    if (featured) query.featured = true;
    if (level) query.level = level;

    const exams = await Exam.find(query);
    res.json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get a single exam
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('participatingColleges');
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
