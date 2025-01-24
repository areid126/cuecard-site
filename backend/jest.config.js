require('dotenv').config();

// Set the configuration based on enviromental variables
const config = {
    verbose: (process.env.VERBOSE) ? true : false,
    maxWorkers: 1, // Run tests inBand
    testTimeout: (process.env.TIMEOUT) ? parseInt(process.env.TIMEOUT) : 5000,
    collectCoverage: (process.env.COVERAGE) ? true : false,
};

module.exports = config;