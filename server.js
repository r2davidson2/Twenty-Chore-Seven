const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();
const db = mongoose.connection;
const app = express();

//___________________
// PORT
//___________________
const PORT = process.env.PORT || 3000;
// DATABASE
const CHORES_DB = process.env.CHORES_DB;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(CHORES_DB ,  { useNewUrlParser: true});

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', CHORES_DB));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.json());
app.use(express.static('public'));
app.use(session({
   secret: process.env.SECRET,
   resave: false,
   saveUninitialized: false
}));

//___________________
// AUTH ROUTE
//___________________
app.get('/app', (req, res) => {
   if(req.session.currentUser) {
      res.json(req.session.currentUser)
   } else {
      res.status(401).json({
         status: 401,
         message: 'not logged in'
      })
   }
});

const userController = require('./controllers/users.js')
app.use('/users', userController);

const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

const choresController = require('./controllers/chores.js');
app.use('/chores', choresController);

const extraPointsController = require('./controllers/extraPoints.js');
app.use('/extrapoints', extraPointsController);

const rewardsController = require('./controllers/rewards.js');
app.use('/rewards', rewardsController);

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
