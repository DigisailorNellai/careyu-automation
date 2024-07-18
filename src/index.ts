import app from './app';
import dotenv from 'dotenv';
import path from 'path';
import connectDatabase from './config/database';
//import { Server } from 'http';


const envPath = path.resolve(__dirname, '../src/config/config.env');  // Adjusted path
//console.log(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });
//dotenv.config({ path: path.join(__dirname, '..src/config/config.env') });  // Connects the dotenv config

connectDatabase();

const server = app.listen(process.env.PORT,() => {
  console.log(`Server listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to unhandled rejection error');
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to uncaught exception error');
  server.close(() => {
    process.exit(1);
  });
});
