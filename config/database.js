import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Database connection details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres', 
});

// Connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
