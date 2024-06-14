//config.js
require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    mongoUri: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET
};