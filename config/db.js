const mysql = require('mysql2');

const database = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_ukkpp_new",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi
database.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected");
    connection.release(); // penting!
  }
});

module.exports = database;