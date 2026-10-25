const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` SEO Vision Backend Engine Running                   `);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}     `);
  console.log(` URL:  http://localhost:${PORT}                      `);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections — shut down gracefully so host can restart
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
  server.close(() => {
    console.error('[Server] Shutting down due to unhandled promise rejection');
    process.exit(1);
  });
});

module.exports = server;
