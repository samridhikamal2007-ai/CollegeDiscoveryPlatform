const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  ranking: { type: Number },
  description: { type: String },
  establishedYear: { type: Number },
  type: { type: String, enum: ['Private', 'Public', 'Deemed'], default: 'Private' },
  coursesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  logoUrl: { type: String },
  facilities: [{ type: String }],
  averageFees: { type: Number },
  placementRate: { type: Number },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
