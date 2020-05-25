const express = require('express');
const mongoose = require('mongoose');
// DB Config
const db = require('./config/database').mongoURI;
//DECLARE ROUTES
const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
//DECLARE PATH
const path = require('path');

const app = express();
//Express body parser
app.use(express.json());

// Connect to MongoDB
mongoose.set('useNewUrlParser', true);
mongoose
  .connect(db, { useUnifiedTopology:true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//USE ROUTES
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Config Port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

