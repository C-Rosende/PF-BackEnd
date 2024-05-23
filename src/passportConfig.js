const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Mock de datos de usuario
const users = [
    { id: 1, username: 'admin', password: 'admin' }
];

// Configuración de Passport
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'Nombre de usuario incorrecto.' });
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false, { message: 'Contraseña incorrecta.' });
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

module.exports = passport;