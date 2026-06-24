const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  level: { type: String, enum: ['UG', 'PG', 'Diploma'], required: true },
  description: { type: String },
  examDate: { type: Date },
  registrationDeadline: { type: Date },
  officialWebsite: { type: String },
  participatingColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
