const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact requests from this IP, please try again later.',
});

let emailTransporter;
try {
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
} catch (error) {
  console.warn('Email service not configured. Messages will be saved but not emailed.');
}

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      const newMessage = new Message({
        name,
        email,
        subject,
        message,
      });

      await newMessage.save();

      if (emailTransporter) {
        try {
          await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Contact: ${subject}`,
            html: `
              <h2>New Message from ${name}</h2>
              <p><strong>From:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `,
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
        }
      }

      res.json({ success: true, message: 'Message received! I\'ll get back to you soon ✔' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
