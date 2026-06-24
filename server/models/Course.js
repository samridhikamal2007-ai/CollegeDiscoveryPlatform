const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  degree: { type: String, required: true }, // e.g., B.Tech, MBA, B.Sc
  durationYears: { type: Number, required: true },
  description: { type: String },
  careerOpportunities: [{ type: String }],
  averageSalary: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
