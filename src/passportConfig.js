//passportConfig.js
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./dao/models/user');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username });
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
                user = new User({
                    githubId: profile.id,
                    username: profile.username,
                    email: profile.emails[0].value
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
    ));

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
};