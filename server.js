const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// DB Config
const db = require('./config/database').mongoURI
//DECLARE ROUTES
const items = require('./routes/api/items');
const path = require('path');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.set('useNewUrlParser', true);
mongoose
  .connect(db, { useUnifiedTopology:true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// @route   GET /
// @desc    /
// @access  Public
app.get('/', (req, res) => res.json({ msg: 'Mernstack backend' }));

//USE ROUTES
app.use('/api/Items', items);

// Serve static assets if in production
if(process.env.NODE_ENV == 'production') {
  //Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Config Port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
