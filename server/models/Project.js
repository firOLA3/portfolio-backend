const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  category: {
    type: String,
    enum: ['Web App', 'Mobile', 'Open Source', 'Experiment'],
    default: 'Web App',
  },
  thumbnail: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Archived'],
    default: 'Completed',
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
