const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authlogin');


const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // optional, untuk JSON
app.use(session({
  secret: 'ukk_secret',
  resave: false,
  saveUninitialized: false
}));

// EJS template
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Routes
app.use('/', authRoutes);

// Jalankan server
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
