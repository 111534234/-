const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// TODO: Move this to a separate db connection file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/seoul-travel';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error', err));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
