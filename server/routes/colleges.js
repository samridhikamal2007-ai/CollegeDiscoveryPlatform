const express = require('express');
const router = express.Router();
const College = require('../models/College');

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const { featured, search } = req.query;
    let query = {};
    if (featured) query.featured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    const colleges = await College.find(query);
    res.json({ success: true, data: colleges });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get a single college
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate('coursesOffered');
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.json({ success: true, data: college });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
