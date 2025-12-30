const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi Database Laragon
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'db_pendaftaran'
});

//ADMIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Query ke tabel users
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            res.json({ success: true, message: "Login Berhasil", user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Username/Password Salah" });
        }
    });
});

// UPDATE
app.put('/api/peserta/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Diterima' atau 'Ditolak'
    const sql = "UPDATE participants SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Status Berhasil Diperbarui" });
    });
});

// 1. API: Simpan Pendaftaran (Create)
app.post('/api/daftar', (req, res) => {
    const { nama, email, hp, kegiatan } = req.body;
    const sql = "INSERT INTO participants (nama_lengkap, email, nomor_hp, pilihan_kegiatan) VALUES (?,?,?,?)";
    db.query(sql, [nama, email, hp, kegiatan], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Pendaftaran Berhasil Terkirim!" });
    });
});

// 2. API: Ambil Semua Data (Read)
app.get('/api/peserta', (req, res) => {
    const sql = "SELECT * FROM participants ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result); // Mengirim data ke React
    });
});

// 3. API: Hapus Peserta (Delete)
app.delete('/api/peserta/:id', (req, res) => {
    const { id } = req.params;
    // JANGAN gunakan '${id}' di dalam string SQL
    const sql = "DELETE FROM participants WHERE id = ?"; 
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Berhasil dihapus" });
    });
});

app.listen(5000, () => console.log("Server berjalan di port 5000"));