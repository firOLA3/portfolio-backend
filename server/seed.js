const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sampleProjects = [
  {
    title: 'Windows 11 Portfolio',
    description: 'A polished developer portfolio with desktop and window interactions.',
    longDescription: 'A React + Tailwind desktop-inspired portfolio featuring taskbar, windows, and OS shell interactions.',
    techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web App',
    thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    githubUrl: 'https://github.com/example/portfolio',
    liveUrl: 'https://example.com',
    status: 'Completed',
    featured: true,
  },
  {
    title: 'Task Manager API',
    description: 'RESTful API for managing tasks with authentication and filtering.',
    longDescription: 'A Node.js backend with MongoDB for task workflows, category filters, and analytics-ready endpoints.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    category: 'Open Source',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    githubUrl: 'https://github.com/example/tasks-api',
    liveUrl: 'https://example.com/tasks',
    status: 'In Progress',
    featured: false,
  },
  {
    title: 'Mobile Expense Tracker',
    description: 'A mobile-first expense tracking app with charts and budgets.',
    longDescription: 'A React Native finance app focused on categorized expense tracking, summaries, and insights.',
    techStack: ['React Native', 'Expo', 'MongoDB'],
    category: 'Mobile',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    githubUrl: 'https://github.com/example/expense-tracker',
    liveUrl: 'https://example.com/mobile',
    status: 'Completed',
    featured: true,
  },
  {
    title: 'Color Lab Experiment',
    description: 'Interactive color palette generator for creative exploration.',
    longDescription: 'A small experiment app for building, exporting, and testing accessible color combinations.',
    techStack: ['JavaScript', 'Canvas', 'CSS'],
    category: 'Experiment',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    githubUrl: 'https://github.com/example/color-lab',
    liveUrl: 'https://example.com/lab',
    status: 'Archived',
    featured: false,
  },
];

async function seed() {
  await connectDB();
  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);
  console.log('Seed data inserted successfully.');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
