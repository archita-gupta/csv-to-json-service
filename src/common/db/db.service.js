const { Sequelize } = require('sequelize');

class DatabaseService {
  constructor() {
    this.client = new Sequelize({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'postgres',
      schema: 'public',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    this.isConnected = false;
    this.connect();
  }

  async connect() {
    try {
      if (!this.isConnected) {
        await this.client.authenticate();
        this.isConnected = true;
        console.log('Database connected successfully');
      }
      return this.client;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await this.client.close();
        this.isConnected = false;
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }
}

// Initialize database instance
const dbService = new DatabaseService();
module.exports = dbService;

