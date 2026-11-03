require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` QuizMaster Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(` API URL: http://localhost:${PORT}/api`);
      console.log(` Health:  http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const handleShutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
