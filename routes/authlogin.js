const express = require('express');
const router = express.Router();
const database = require('../config/db');

// GET /login
router.get('/login', (req, res) => {
  res.render('index', { error: null });
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM admin WHERE username = ?';
  database.query(sql, [username], (err, results) => {
    if (err) throw err;

    // Username tidak ditemukan
    if (results.length === 0) {
      return res.render('index', {
        error: 'Username dan tidak ditemukan'
      });
    }

    const user = results[0];

    // Password salah (plaintext sementara)
    if (password !== user.password) {
      return res.render('index', {
        error: 'Password salah'
      });
    }

    // Login berhasil → simpan session
    req.session.user = {
      id: user.id,
      username: user.username
    };

    res.redirect('/dashboard');
  });
});

// GET /dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.render('dashboard', { user: req.session.user });
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

//untuk masuk ke dasis
// GET /data-siswa
// router.get('/dasis', (req, res) => {
//   // proteksi halaman (harus login)
//   const keyword = req.query.keyword || '';
//   if (!req.session.user) return res.redirect('/login');

//   const sql = 'SELECT * FROM siswa';

//   database.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.send('Terjadi kesalahan saat mengambil data siswa');
//     }

//     res.render('dasis', {
//       user: req.session.user,
//       siswa: results, keyword
//     });
//   });
// });

//punya search bar
router.get('/dasis', (req, res) => {
  const keyword = req.query.keyword || '';

  let sql = "SELECT * FROM siswa";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE nama_siswa LIKE ? OR nipd LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  console.log('KEYWORD:', keyword);
  console.log('SQL:', sql);
  console.log('PARAMS:', params);

  database.query(sql, params, (err, results) => {
    if (err) throw err;
    res.render('dasis', { siswa: results, keyword });
  });
});

module.exports = router;
