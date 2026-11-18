const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
const Message = require('../models/Message');

const router = express.Router();
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact requests from this IP, please try again later.',
});

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

      let emailSent = false;
      if (!resend || !process.env.RESEND_FROM || !process.env.EMAIL_USER) {
        console.error(
          'Email notification not sent: RESEND_API_KEY, RESEND_FROM, and EMAIL_USER must be configured.'
        );
      } else {
        try {
          const { error } = await resend.emails.send({
            from: process.env.RESEND_FROM,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Contact: ${subject}`,
            text: `New message from ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
          });

          if (error) {
            console.error('Resend email send error:', error);
          } else {
            emailSent = true;
          }
        } catch (emailError) {
          console.error('Resend email send error:', emailError);
        }
      }

      res.json({
        success: true,
        emailSent,
        message: emailSent
          ? 'Message received! I\'ll get back to you soon ✔'
          : 'Your message was saved, but its email notification could not be sent. Please try another contact method if you need a timely response.',
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
