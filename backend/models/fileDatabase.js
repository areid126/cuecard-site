const { openMongoose, getHexID } = require("../utils/mongo");
const config = require("../utils/config");

// Whether the gridfs has been configured
let configured = false;
let gfs;

async function setup() {
    return new Promise((resolve) => {

        // If it has already been configured return it
        if (configured) return resolve(gfs);

        // Otherwise connect to the database
        else {
            const conn = openMongoose().createConnection(config.MONGODB_URL);

            const createBucket = () => {
                // Create an uploads bucket
                gfs = new (openMongoose().mongo).GridFSBucket(conn.db, {
                    bucketName: "images"
                });

                // Resolve the promise once the connection is established
                configured = true;
                resolve(gfs);
            }
            conn.once("open", createBucket);
        }
    });
}

async function getFile(id) {
    const gfs = await setup();
    const files = await gfs.find({ _id: getHexID(id) });
    // Get the first file in the cursor
    const file = await files.next();
    if (file) return file;
    return undefined;
}

async function deleteFile(id) {
    const gfs = await setup();
    try {
        await gfs.delete(getHexID(id));
    } catch {
        // File does not exist
    }
}

// Export functions for use in other files
module.exports = {
    getFile,
    setup,
    deleteFile
}
