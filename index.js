import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/database.js';
import { initDB } from './models/index.js';
import Routes from './server/routes/index.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', Routes);

connectDB();
initDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
