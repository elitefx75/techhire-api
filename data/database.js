const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const { MongoClient } = require('mongodb');

let database;

const readLocalEnvFile = () => {
    const envPath = path.join(__dirname, '..', '.env');

    try {
        if (!fs.existsSync(envPath)) {
            return {};
        }

        return dotenv.parse(fs.readFileSync(envPath));
    } catch (error) {
        if (error && error.code !== 'ENOENT') {
            console.warn('Unable to read local .env file:', error.message);
        }
        return {};
    }
};

const getEnvValue = (key) => {
    if (process.env[key] !== undefined && process.env[key] !== '') {
        return process.env[key];
    }

    const localEnv = readLocalEnvFile();
    return localEnv[key];
};

const getDbName = () => {
    const configuredDbName = getEnvValue('DB_NAME');
    if (configuredDbName && configuredDbName.trim()) {
        return configuredDbName.trim();
    }

    return 'project2';
};

const initDb = async (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }

    const mongoUrl = getEnvValue('MONGODB_URL');
    if (!mongoUrl) {
        return callback(new Error('MONGODB_URL is not defined'));
    }

    try {
        const client = await MongoClient.connect(mongoUrl);
        const dbName = getDbName();
        database = client.db(dbName);
        callback(null, database);
    } catch (err) {
        callback(err);
    }
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};