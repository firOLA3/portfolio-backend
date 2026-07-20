const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

const verifyAdmin = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'];
  if (passcode === process.env.ADMIN_PASSCODE) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Invalid Admin Passcode' });
  }
};

router.get('/', async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (featured === 'true') {
      filters.featured = true;
    }

    const projects = await Project.find(filters).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyAdmin, async (req, res, next) => {
  try {
    const {
      title, description, longDescription, techStack, category,
      thumbnail, githubUrl, liveUrl, status, featured
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = new Project({
      title, description, longDescription, techStack, category,
      thumbnail, githubUrl, liveUrl, status, featured
    });

    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyAdmin, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const fields = [
      'title', 'description', 'longDescription', 'techStack',
      'category', 'thumbnail', 'githubUrl', 'liveUrl', 'status', 'featured'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', verifyAdmin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
