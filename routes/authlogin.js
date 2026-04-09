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

    database.query("SELECT COUNT(*) AS rilis FROM pelanggaran_to_siswa", (err, result3) => {
      if (err) return res.status(500).send("Error server");
      const tori = result3[0].rilis;

      res.render('dashboard', { totalSiswa, topel, tori});
      });
    });
  });
});

// DAFTAR SISWA (satu route)
router.get('/dasis', (req, res) => {
  const keyword = req.query.keyword || '';
  let sql = "SELECT * FROM siswa";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE nipd LIKE ? OR nama_siswa LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  database.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Error server");
    res.render('dasis', { siswa: results, keyword });
  });
});


// DAFTAR PELANGGARAN (satu route)
router.get('/detailpel', (req, res) => {
  const keyword = req.query.keyword || '';
  let sql = "SELECT * FROM pelanggaran";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE kode_pelanggaran LIKE ? OR jenis_pelanggaran LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  database.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Error server");
    res.render('detailpel', { pelanggaran: results, keyword });
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

// bagian pahalapoin
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

// simpan insertdata
router.post('/insertdata', (req, res) => {
    const { nipd, nama_siswa, kelas_siswa, jurusan, kode_pelanggaran } = req.body;

    console.log('Data diterima:', req.body);

    const total_poin = 0; // default

    const sql = `INSERT INTO siswa (nipd, nama_siswa, kelas_siswa, jurusan, kode_pelanggaran, total_poin) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    
    database.query(sql, [nipd, nama_siswa, kelas_siswa, jurusan, kode_pelanggaran, total_poin], (err, result) => {
        if (err) {
            console.log('Error INSERT:', err);
            return res.send("Gagal menyimpan data: " + err.message);
        }

        console.log("Insert berhasil:", result);
        res.redirect('/dasis'); // sementara jangan redirect dulu
    });
});

//insert data jurusan dan pelanggaran
router.get('/insertdata', (req, res) => {

    const sqlPelanggaran = "SELECT kode_pelanggaran FROM pelanggaran";
    const sqlJurusan = "SELECT * FROM jurusan";

    // ambil pelanggaran dulu
    database.query(sqlPelanggaran, (err, pelanggaran) => {
        if (err) {
            console.log(err);
            return res.send("Gagal mengambil data pelanggaran");
        }

        // lalu ambil jurusan
        database.query(sqlJurusan, (err, jurusan) => {
            if (err) {
                console.log(err);
                return res.send("Gagal mengambil data jurusan");
            }

            // kirim dua data ke EJS
            res.render('insertdata', {
                pelanggaran: pelanggaran,
                jurusan: jurusan
            });

        });
    });

});

// Route GET menampilkan form insertPel
router.get('/insertPel', (req, res) => {
    res.render('insertPel'); // insertPel.ejs di folder views
});

// Route POST menyimpan data form insertPel
router.post('/insertPel', (req, res) => {
    const { kode_pelanggaran, jenis_pelanggaran, deskripsi_pelanggaran, sanksi, poin } = req.body;

    console.log('Data diterima:', req.body);

    const sql = `INSERT INTO pelanggaran (kode_pelanggaran, jenis_pelanggaran, deskripsi_pelanggaran, sanksi, poin)
                 VALUES (?, ?, ?, ?, ?)`;
    
    database.query(sql, [kode_pelanggaran, jenis_pelanggaran, deskripsi_pelanggaran, sanksi, poin], (err, result) => {
        if (err) {
            console.log('Error INSERT:', err);
            return res.send('Gagal menyimpan data: ' + err.message);
        }
        res.redirect('/detailpel');
    });
});

module.exports = router;