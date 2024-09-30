const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Conexión a la base de datos
const dbPath = path.resolve(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Obtener todos los usuarios
router.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los usuarios.' });
        }
        res.render('users', { users: rows }); // Renderiza la vista con la lista de usuarios
    });
});

// Mostrar formulario para crear un nuevo usuario
router.get('/users/new', (req, res) => {
    res.render('newUser');
});

// Crear un nuevo usuario
router.post('/users', (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el usuario.' });
        }
        res.redirect('/users');
    });
});

// Mostrar formulario para editar un usuario
router.get('/users/:id/edit', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el usuario.' });
        }
        res.render('editUser', { user: row });
    });
});

// Actualizar un usuario
router.post('/users/:id/update', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el usuario.' });
        }
        res.redirect('/users');
    });
});

// Eliminar un usuario
router.post('/users/:id/delete', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el usuario.' });
        }
        res.redirect('/users');
    });
});

module.exports = router;