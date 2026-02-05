const mysql = require('mysql2');

// Buat koneksi ke database
const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_ukkpp",
  port: 3306
});

// Cek koneksi
database.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
});

// Export koneksi supaya bisa dipakai di file lain
module.exports = database;
