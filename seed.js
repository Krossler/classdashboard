const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

// Conexión a la base de datos
const db = new sqlite3.Database('./db/database.sqlite');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Crear la tabla y el usuario
db.serialize(() => {
    // Crear la tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log("Tabla 'users' creada o ya existe.");
        }
    });

    // Insertar usuario admin si no existe
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking user:', err.message);
        }
        if (!row) { // Si no existe el usuario, lo insertamos
            db.run(query, ['admin', 'admin'], function(err) {
                if (err) {
                    console.error('Error inserting user:', err.message);
                } else {
                    console.log('Usuario admin insertado con éxito.');
                }
            });
        } else {
            console.log('El usuario admin ya existe.');
        }
    });
});

// Rutas
app.get('/', (req, res) => {
    res.render('login');
});

// Puerto
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});