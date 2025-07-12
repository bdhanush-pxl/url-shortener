const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database file if it doesn't exist
async function initDb() {
    try {
        await fs.access(DB_FILE);
    } catch (err) {
        await fs.writeFile(DB_FILE, JSON.stringify({ urls: [] }, null, 2));
    }
}

// Read from database
async function readDb() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write to database
async function writeDb(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    initDb,
    readDb,
    writeDb
};
