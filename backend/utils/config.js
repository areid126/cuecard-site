require('dotenv').config();
// Get the crypto module to generate a random name for a test database (so tests can run multiple times concurrently and not error)
const crypto = require("node:crypto");

const JWT_SECRET = process.env.JWT_SECRET;

// Connect to a different database for testing
const MONGODB_URL = process.env.NODE_ENV === "test" ?
    // Give the database a random name during testing
    process.env.TEST_MONGODB_URL_START + crypto.randomBytes(10).toString('hex') + process.env.TEST_MONGODB_URL_END :
    process.env.MONGODB_URL; // The url for normal execution

const MODE = process.env.NODE_ENV; // Get the environment that it is being loaded in

// Connect to a unique database for the final project
const FRONTEND_URL = process.env.FRONTEND_URL;


const CORS_ACCESS = { credentials: true, origin: process.env.FRONTEND_URL };
const COOKIE_PERMISSIONS = process.env.NODE_ENV === "production" ? { httpOnly: true, sameSite: "none", secure: true, partitioned: true } : { httpOnly: true };

module.exports = {
    MONGODB_URL,
    JWT_SECRET,
    FRONTEND_URL,
    MODE, 
    CORS_ACCESS,
    COOKIE_PERMISSIONS
};