const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const User = require('./dao/models/user');

// Configuración de la estrategia local
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Nombre de usuario incorrecto.' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Configuración de la estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: 'Ov23li31qsvuAIwApVBn',
    clientSecret: '4f7312f871a383a78edbfbc9948e6ea3f4fb4d45',
    callbackURL: 'http://localhost:8080/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({ githubId: profile.id, username: profile.username });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});