const bcrypt = require("bcrypt");
const database = require("../config/db");

const updatingPassword = () => {
    const sqlQuery = "SELECT username, password FROM admin WHERE password NOT LIKE '$2a$%'";
    database.query(sqlQuery, (err, users) => {
        if (err){
            console.error("Ada kesalahan saat mengambil data");
            return;
        }
        users.forEach(user => {
            bcrypt.hash(user.password, 10, (err, hashedPassword) =>{
                if (err){
                    console.error("Gagal melakukan hashing password", err);
                    return;
                }
                const updateData = "UPDATE admin SET password = ? WHERE username = ?";
                database.query(updateData, [hashedPassword, user.username], (err, result) => {
                    if (err){
                        console.error("Ada kesalahan saat memperbarui password:", err);
                        return;
                    }
                    console.log(`Password untuk username ${user.username} berhasil di update.`);
                })
            })
        })
    })
}

updatingPassword();