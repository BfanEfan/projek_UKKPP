const express = require('express');
const router = express.Router();
const database = require('../config/db');
const bcrypt = require("bcrypt");
const { data } = require('autoprefixer');

function isLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}


// ================= LOGIN =================
router.get('/login', (req, res) => {
  res.render('index', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  database.query('SELECT * FROM admin WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send("Error server");

    if (results.length === 0) {
      return res.render('index', { error: 'Username tidak ditemukan' });
    }

    const user = results[0];

    try {
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.render('index', { error: 'Password salah' });
      }

      req.session.user = {
        id_admin: user.id_admin,
        username: user.username,
        role: user.role
      };

      res.redirect('/dashboard');

    } catch (error) {
      return res.status(500).send("Error server");
    }
  });
});

// ================= REGISTER =================
router.get('/register', (req, res) => {
  // Menggunakan template 'register.ejs' (pastikan file sudah ada di folder views)
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  const checkSql = "SELECT * FROM admin WHERE username = ?";

  database.query(checkSql, [username], async (err, result) => {
    if (err) return res.send("Error");

    if (result.length > 0) {
      return res.render('register', { error: 'Username sudah digunakan' });
    }

    const hash = await bcrypt.hash(password, 10);

    const insertSql = "INSERT INTO admin (username, password, role) VALUES (?, ?, ?)";

    database.query(insertSql, [username, hash, role], (err) => {
      if (err) return res.send("Gagal daftar");

      res.redirect('/login');
    });
  });
});

// ================= LOGOUT =================
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});


// ================= DASHBOARD =================
router.get('/dashboard', (req, res) => {

  database.query("SELECT COUNT(*) AS total FROM m_siswa", (err, result1) => {
    if (err) return res.status(500).send("Error server");

    const totalSiswa = result1[0].total;

    database.query(
      "SELECT COUNT(*) AS karma FROM v_total_poin WHERE total_poin > 0",
      (err, result2) => {
        if (err) return res.status(500).send("Error server");

        const topel = result2[0].karma;

        database.query(
          "SELECT COUNT(*) AS rilis FROM v_total_poin WHERE total_poin >= 100",
          (err, result3) => {
            if (err) return res.status(500).send("Error server");

            const tori = result3[0].rilis;

            res.render('dashboard', { totalSiswa, topel, tori });
          }
        );
      }
    );
  });
});


// ================= DAFTAR SISWA =================
router.get('/dasis', (req, res) => {
  const keyword = req.query.keyword || '';

  let sql = "SELECT * FROM v_total_poin";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE nipd LIKE ? OR nama_siswa LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  database.query(sql, params, (err, siswa) => {
    if (err) return res.status(500).send("Error server");

    res.render('dasis', {
      siswa,
      keyword
    });
  });
});


// ================= DETAIL SISWA =================
router.get('/siswa/:nipd', (req, res) => {
  const nipd = req.params.nipd;

  const sqlSiswa = `
    SELECT s.*, j.jurusan AS nama_jurusan
    FROM m_siswa s
    JOIN m_jurusan j ON s.jurusan = j.jurusan
    WHERE s.nipd = ?
  `;

  const sqlPelanggaran = `
    SELECT p.deskripsi, p.poin, ps.tanggal
    FROM pelanggaran_siswa ps
    JOIN m_pelanggaran p ON ps.id_pelanggaran = p.id_pelanggaran
    WHERE ps.nipd = ?
    ORDER BY ps.tanggal ASC
  `;

  const sqlTotal = `
    SELECT total_poin 
    FROM v_total_poin 
    WHERE nipd = ?
  `;

  const sqlMaster = `
    SELECT id_pelanggaran, deskripsi, poin 
    FROM m_pelanggaran
  `;

  // 1. siswa
  database.query(sqlSiswa, [nipd], (err, siswaResult) => {
    if (err) return res.send("Error siswa");
    if (siswaResult.length === 0) return res.send("Siswa tidak ditemukan");

    // 2. pelanggaran
    database.query(sqlPelanggaran, [nipd], (err, pelResult) => {
      if (err) return res.send("Error pelanggaran");

      // 3. total poin
      database.query(sqlTotal, [nipd], (err, totalResult) => {
        if (err) return res.send("Error total");

        const total = totalResult[0]?.total_poin || 0;

        //master pelanggaran
        database.query(sqlMaster, (err, masterResult) => {
          if (err) return res.send("Error master pelanggaran");

          //FINAL RENDER (SEMUA DATA ADA DI SINI)
          res.render('detsis', {
            siswa: siswaResult[0],
            pelanggaran: pelResult,
            total_poin: total,
            masterPelanggaran: masterResult
          });
        });
      });
    });
  });
});


// ================= DAFTAR PELANGGARAN =================
router.get('/detailpel', (req, res) => {
  const keyword = req.query.keyword || '';

  let sql = "SELECT * FROM m_pelanggaran";
  let params = [];

  if (keyword.trim() !== '') {
    sql += " WHERE kode_pelanggaran LIKE ? OR jenis LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  database.query(sql, params, (err, results) => {
    if (err) return res.status(500).send("Error server");

    res.render('detailpel', {
      pelanggaran: results,
      keyword
    });
  });
});


// ================= HAPUS SISWA =================
router.post('/dasis/delete/:nipd', (req, res) => {
  const nipd = req.params.nipd;

  database.query("DELETE FROM m_siswa WHERE nipd = ?", [nipd], (err) => {
    if (err) return res.status(500).send("Error server");

    res.redirect('/dasis');
  });
});


// ================= FORM INPUT PELANGGARAN =================
router.get('/pahalapoin', (req, res) => {

  const sqlSiswa = "SELECT * FROM m_siswa";
  const sqlPelanggaran = "SELECT * FROM m_pelanggaran";

  database.query(sqlSiswa, (err, siswa) => {
    if (err) return res.send("Error siswa");

    database.query(sqlPelanggaran, (err, pelanggaran) => {
      if (err) return res.send("Error pelanggaran");

      res.render('pahalapoin', {
        siswa,
        pelanggaran
      });
    });
  });
});


// ================= INSERT PELANGGARAN KE SISWA =================
router.post('/pahalapoin/update/:nipd', isLogin, (req, res) => {
  const nipd = req.params.nipd;
  const id_pelanggaran = req.body.id_pelanggaran;
  const tanggalManual = req.body.tanggal; // <--- Ambil tanggal dari form
  const userId = req.session.user.id_admin;

  // Pastikan data tidak kosong
  if (!id_pelanggaran || !tanggalManual) {
    return res.send("<script>alert('Pilih pelanggaran dan tanggal!'); window.history.back();</script>");
  }

  // 🔥 1. CEK TOTAL POIN DULU
  const cekPoin = "SELECT total_poin FROM v_total_poin WHERE nipd = ?";

  database.query(cekPoin, [nipd], (err, result) => {
    if (err) return res.send("Error cek poin");

    const total = result[0]?.total_poin || 0;

    // ❌ JIKA SUDAH 100 ATAU LEBIH → TOLAK
    if (total >= 100) {
      return res.send(`
        <script>
          alert('Poin siswa sudah mencapai 100! Tidak bisa ditambah lagi.');
          window.location.href = '/siswa/${nipd}';
        </script>
      `);
    }

    // ✅ 2. LANJUT INSERT (Ganti CURDATE() menjadi ?)
    const sql = `
      INSERT INTO pelanggaran_siswa (nipd, id_pelanggaran, created_by, tanggal)
      VALUES (?, ?, ?, ?)
    `;

    // Kirim 4 parameter: nipd, id_pelanggaran, userId, tanggalManual
    database.query(sql, [nipd, id_pelanggaran, userId, tanggalManual], (err) => {
      if (err) {
        console.error("Gagal Simpan:", err);
        return res.status(500).send("Gagal simpan: " + err.message);
      }

      // Berhasil! Balik ke halaman detail siswa
      res.redirect('/siswa/' + nipd);
    });
  });
});

// ================= INSERT SISWA =================
router.post('/insertdata', (req, res) => {
  const { nipd, nama_siswa, kelas_siswa, jurusan } = req.body;

  const sql = `
    INSERT INTO m_siswa (nipd, nama_siswa, kelas, jurusan)
    VALUES (?, ?, ?, ?)
  `;

  database.query(sql, [nipd, nama_siswa, kelas_siswa, jurusan], (err) => {
    if (err) return res.send("Gagal: " + err.message);

    res.redirect('/dasis');
  });
});


// ================= FORM INSERT =================
router.get('/insertdata', (req, res) => {

  const sqlJurusan = "SELECT * FROM m_jurusan";

  database.query(sqlJurusan, (err, jurusan) => {
    if (err) return res.send("Error jurusan");

    res.render('insertdata', { jurusan });
  });
});


// ================= INSERT MASTER PELANGGARAN =================
router.get('/insertPel', (req, res) => {
  res.render('insertPel');
});

router.post('/insertPel', (req, res) => {
  const { kode_pelanggaran, jenis, deskripsi, sanksi, poin } = req.body;

  const sql = `
    INSERT INTO m_pelanggaran 
    (kode_pelanggaran, jenis, deskripsi, sanksi, poin)
    VALUES (?, ?, ?, ?, ?)
  `;

  database.query(sql, [kode_pelanggaran, jenis, deskripsi, sanksi, poin], (err) => {
    if (err) return res.send("Gagal: " + err.message);

    res.redirect('/detailpel');
  });
});

// ================= rekap =================
router.get('/rekap', (req, res) => {
  const query = `SELECT * FROM v_detail_pelanggaran ORDER BY tanggal ASC`;

  database.query(query, (err, results) => {
    if (err) throw err;

    res.render('rekap', { data: results });
  });
});

// ================= user =================
router.get('/datse', (req, res) => {

  const sql = "SELECT * FROM admin";

  database.query(sql, (err, results) => {
    if (err) return res.send("Error ambil user");

    res.render('datse', {
      users: results   
    });
  });

});

module.exports = router;

