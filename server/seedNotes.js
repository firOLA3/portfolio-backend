const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Note = require('./models/Note');

const seedNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Note.deleteMany({});

    const notes = [
      {
        title: 'Building a Windows 11 Portfolio with React',
        content: `# Building a Windows 11 Portfolio with React

## Introduction
This project demonstrates how to build a modern, interactive portfolio styled after Windows 11. It combines glassmorphism design patterns with smooth animations to create an immersive user experience.

## Key Features
- **Authentic Windows 11 Design**: Recreated the iconic Windows 11 UI elements including the Start Menu, Taskbar, and window chrome
- **Interactive Windows**: Draggable, resizable windows with snap layouts
- **Dark/Light Theme Support**: Toggle between light and dark themes with CSS variables
- **Smooth Animations**: Framer Motion powers all transitions and micro-interactions

## Technology Stack
- React 19 + Vite
- Framer Motion for animations
- Zustand for state management
- Tailwind CSS for styling
- Flowbite React components

## Challenges Overcome
1. **Window Z-Index Management**: Implemented dynamic z-index stacking for window layering
2. **Smooth Drag & Resize**: Used pointer events for consistent cross-browser dragging
3. **Glass Morphism Effect**: Layered semi-transparent backgrounds with backdrop blur

## Future Enhancements
- Add actual project cards fetched from GitHub API
- Implement note-taking capabilities with markdown support
- Add theme persistence with localStorage
- Create mobile-responsive version`,
        createdAt: new Date('2024-11-15'),
      },
      {
        title: 'Mastering React Hooks',
        content: `# Mastering React Hooks

## What Are Hooks?
React Hooks are functions that let you "hook into" React features from functional components. They allow you to use state and other React features without writing a class.

## Common Hooks

### useState
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`
Manages local component state in a simple, declarative way.

### useEffect
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`
Handles side effects like data fetching, DOM updates, and subscriptions.

### useContext
Share state across multiple components without prop drilling.

## Best Practices
1. Only call hooks at the top level of functions
2. Don't call hooks conditionally
3. Use the ESLint plugin to enforce hook rules
4. Create custom hooks for reusable logic

## Performance Tips
- Use \`useCallback\` to memoize functions passed to child components
- Use \`useMemo\` for expensive computations
- Implement \`React.memo\` for component memoization`,
        createdAt: new Date('2024-11-10'),
      },
      {
        title: 'MongoDB Schema Design Best Practices',
        content: `# MongoDB Schema Design

## Document Structure
MongoDB uses flexible schemas, but good design is crucial for performance and maintainability.

## Embedding vs Referencing

### When to Embed
- One-to-one relationships
- One-to-many with limited items
- Frequently accessed together

### When to Reference
- Many-to-many relationships
- Frequently changing subdocuments
- Large nested arrays

## Anti-Patterns to Avoid

### 1. Unbounded Arrays
\`\`\`javascript
// ❌ Bad - array grows indefinitely
{ postId: 1, comments: [...] }

// ✅ Good - use separate collection with pagination
\`\`\`

### 2. Duplicate Data
Avoid storing the same data in multiple places unless absolutely necessary for performance.

## Indexing Strategy
- Index fields used in queries and sorts
- Use compound indexes for multi-field queries
- Monitor index size and usage

## Conclusion
Good schema design requires understanding your access patterns and trade-offs between flexibility, performance, and storage.`,
        createdAt: new Date('2024-11-05'),
      },
      {
        title: 'Cover_Letter.md',
        content: `# Hey there! 👋

I'm a passionate full-stack developer who loves building beautiful, interactive web experiences—just like this OS portfolio you are exploring right now.

## Why hire me?
- **Attention to Detail:** I believe great software is indistinguishable from magic. I focus on micro-interactions, responsive design, and robust state management.
- **Fast Learner:** I adapt quickly to new tech stacks and thrive in environments where I can learn and grow.
- **Problem Solver:** From backend API logic to complex React hooks, I enjoy breaking down hard problems into clean, testable code.

I'm currently looking for a full-time role. If you are hiring, I would love to chat! Head over to the **Contact** app or drop me an email.`,
        createdAt: new Date()
      },
      {
        title: 'My_Journey.md',
        content: `# My Developer Journey 🚀

Every developer has a story. Here's a brief look at how I got here.

### The Beginning
I wrote my first lines of code out of curiosity. What started as building simple static HTML/CSS pages quickly evolved into a fascination with JavaScript and how it makes the web come alive.

### The Middle
I dove deep into modern frameworks. React became my tool of choice. I learned how to manage complex state with Zustand, handle animations with Framer Motion, and build robust backend APIs with Node.js and MongoDB.

### The Now
I built this Windows 11 inspired portfolio to showcase not just what I know, but *how* I build. It's a testament to my dedication to user experience and clean code architecture.

The journey never really ends. I'm excited for the next chapter and the new technologies I'll master along the way!`,
        createdAt: new Date(Date.now() - 86400000)
      }
    ];

    await Note.insertMany(notes);
    console.log('✅ Seeded notes successfully');
  } catch (error) {
    console.error('❌ Error seeding notes:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedNotes();
