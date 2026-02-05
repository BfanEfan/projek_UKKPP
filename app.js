const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authlogin'); // import auth routes
const router = express.Router();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'ukk_secret',
  resave: false,
  saveUninitialized: false
}));

// EJS template
app.set('view engine', 'ejs');

// Gunakan auth routes
app.use('/', authRoutes); // semua route di auth.js aktif

app.get('/bayhaqiSSS',(req, res)=> {
  res.send('Ini adalah halaman rahasia untuk bayhaqiSSS');
})
// Jalankan server
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});

app.use(express.static('public'));