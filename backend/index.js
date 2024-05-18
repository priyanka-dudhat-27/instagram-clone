const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/userModel');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log('Error connecting to MongoDB', err);
  process.exit(1);
});

// Routes
app.use('/', require('./routes/index'));

// Serve frontend from the React app
app.use(express.static(path.join(__dirname, './frontend/build')));

// The "*" route serves the React app for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server:', err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
