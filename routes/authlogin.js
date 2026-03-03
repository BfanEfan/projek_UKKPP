const express = require('express');
const router = express.Router();
const database = require('../config/db');

// LOGIN
router.get('/login', (req, res) => {
  res.render('index', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE username = ?';
  database.query(sql, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.render('index', { error: 'Username tidak ditemukan' });
    const user = results[0];
    if (password !== user.password) return res.render('index', { error: 'Password salah' });

    req.session.user = { id: user.id, username: user.username };
    res.redirect('/dashboard');
  });
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// DASHBOARD
router.get('/dashboard', (req, res) => {
  database.query("SELECT COUNT(*) AS total FROM siswa", (err, result1) => {
    if (err) return res.status(500).send("Error server");
    const totalSiswa = result1[0].total;

    database.query("SELECT COUNT(*) AS karma FROM pelanggaran", (err, result2) => {
      if (err) return res.status(500).send("Error server");
      const topel = result2[0].karma;

      res.render('dashboard', { totalSiswa, topel });
    });
  });
});

// DAFTAR SISWA (satu route)
router.get('/dasis', (req, res) => {
  const keyword = req.query.keyword || '';
  let sql = "SELECT * FROM siswa";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE nama_siswa LIKE ? OR nipd LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  database.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Error server");
    res.render('dasis', { siswa: results, keyword });
  });
});

// HAPUS SISWA
router.post('/dasis/delete/:nipd', (req, res) => {
  const nipd = req.params.nipd;

  database.query("DELETE FROM siswa WHERE nipd = ?", [nipd], (err, result) => {
    if (err) {
      console.error("Error hapus siswa:", err);
      return res.status(500).send("Terjadi kesalahan server");
    }
    res.redirect('/dasis');
  });
});

router.get('/pahalapoin', (req, res) => {

  const sql = "SELECT * FROM siswa";

  database.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Terjadi kesalahan");
    }

    res.render('pahalapoin', {
      siswa: results
    });

  });

});

//pahala dan dosa update
router.post('/pahalapoin/update/:nipd', (req, res) => {

  const nipd = req.params.nipd;
  const jumlah = parseInt(req.body.jumlah) || 1;
  const aksi = req.body.aksi;

  let sql;

  if (jumlah <= 0) {
  return res.redirect('/dasis');
}

  if (aksi === "tambah") {
    sql = `
      UPDATE siswa 
      SET total_poin = total_poin + ? 
      WHERE nipd = ?
    `;
  } else {
    sql = `
      UPDATE siswa 
      SET total_poin = GREATEST(total_poin - ?, 0) 
      WHERE nipd = ?
    `;
  }

  database.query(sql, [jumlah, nipd], (err) => {
    if (err) return res.status(500).send("Terjadi kesalahan server");

    res.redirect('/dasis');
  });

});

module.exports = router;