const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Conexión a la base de datos SQLite
const dbPath = path.resolve(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica las credenciales en la base de datos
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la base de datos.' });
        }
        if (row) {
            // Credenciales válidas: establece la sesión
            req.session.isAuthenticated = true;
            req.session.user = row; // Puedes almacenar más datos si es necesario
            
            // Redirige a la página protegida "modules"
            return res.redirect('/modules');
        } else {
            // Credenciales inválidas
            return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
        }
    });
});

module.exports = router;