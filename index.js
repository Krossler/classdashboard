const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/users');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 2000;

// Configura el motor de vistas como EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar las sesiones
app.use(session({
    secret: 'tuSecretoDeSesion',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Si usas HTTPS, pon esto en true
}));

// Middleware para manejar el body de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usa las rutas de login
app.use('/', loginRoutes);
app.use('/', userRoutes);

// Ruta para servir la vista login.ejs
app.get('/', (req, res) => {
    res.render('login');
});

// Ruta protegida para modules
app.get('/modules', (req, res) => {
    if (req.session.isAuthenticated) {
        // Si el usuario está autenticado, muestra la página modules
        res.render('modules');
    } else {
        // Si no está autenticado, redirige a la página de login
        res.redirect('/');
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
      if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.redirect('/modules'); // Si hay error, redirige de nuevo a la página de módulos
      }
      // Redirige al login una vez que la sesión haya sido destruida
      res.redirect('/');
  });
});

// Servir archivos estáticos
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});