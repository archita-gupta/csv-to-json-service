const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const routes = require('./routes/api.routes');
const database = require('./common/db/db.service');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Error 💥:', err);
  const response = {
    status: 'error',
    msg: 'Something went wrong!',
    error: err.message
  };
  res.status(500).json(response);
});

// Start server
const server = app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
 }); 


/*********************************************************
          Global error handlers for server 
 * *****************************************************/


process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error('Trace:', error);
    // Exit process with failure
    process.exit(1);
});
  
process.on('unhandledRejection', (error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error('Trace:', error.stack);
    // Gracefully shutdown server before exiting
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown handlers
const gracefulShutdown = async () => {
    console.log('🔄 Initiating graceful shutdown...');
    try {
        // Close database connections
        await database.disconnect();
        console.log('✅ Database connections closed');
        // Close HTTP server
        if (server) {
            server.close();
            process.exit(0);
        }
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

