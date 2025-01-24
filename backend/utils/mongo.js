// File to set up one mongoose connection that all files work based on
const mongoose = require("mongoose");
const config = require("../utils/config");

// Connection string
let open = false
let url = config.MONGODB_URL;

function openMongoose() {
    if (!open) {
        // Connect to the database
        mongoose.set('strictQuery', false);
        mongoose.connect(url);
        open = true;
    }
    return mongoose;
}

async function closeMongoose() {
    if (config.MODE === "test") {
        // Delete the database and then disconnect
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
        open = false;
    }
}

async function dropDatabase() {
    if (config.MODE === "test") {
        if (mongoose && mongoose.connection && mongoose.connection.db) {
            const collections = await mongoose.connection.db.collections();
            await Promise.all(collections.map(collection => collection.drop()));
        }
    }
}

const getHexID = (id) => {
    try {
        return mongoose.Types.ObjectId.createFromHexString(id);
    } catch {
        // If the string is not a defined hexstring then return undefined
        return undefined;
    }
}

// Export functions for use in other files
module.exports = {
    openMongoose,
    closeMongoose,
    getHexID,
    dropDatabase
}
