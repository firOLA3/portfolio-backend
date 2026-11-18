const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const connectDB = require('./config/db');
const projectRoutes = require('./routes/projects');
const noteRoutes = require('./routes/notes');
const contactRoutes = require('./routes/contact');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL?.replace(/\/+$/, '') || '*';

app.use(cors({ origin: clientUrl }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.use(errorHandler);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
