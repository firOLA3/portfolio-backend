const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find().select('_id title createdAt').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

const verifyAdmin = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'];
  if (passcode === process.env.ADMIN_PASSCODE) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Invalid Admin Passcode' });
  }
};

router.post('/', verifyAdmin, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const note = new Note({ title, content });
    await note.save();
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyAdmin, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    note.updatedAt = Date.now();
    await note.save();
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', verifyAdmin, async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
