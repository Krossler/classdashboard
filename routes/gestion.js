const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
};

// Ejemplo de ruta GET
router.get('/alumnos', (req, res, next) => {
    const query = 'SELECT * FROM items';
    db.all(query, [], (err, rows) => {
        if (err) {
            return next(err); // Llama al middleware de errores
        }
        res.json({ data: rows });
    });
});

// Ruta para agregar un nuevo ítem
router.post('/add-item', (req, res, next) => {
    const { name, price } = req.body; // Asegúrate de que envías un nombre y un precio
    db.run(`INSERT INTO items (name, price) VALUES (?, ?)`, [name, price], function(err) {
        if (err) {
            return next(err); // Llama al middleware de errores
        }
        res.status(201).json({ id: this.lastID, name, price }); // Corrige aquí
    });
});

// Middleware para manejar errores
router.use(errorHandler);

module.exports = router;