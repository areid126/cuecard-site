const express = require('express');
const { verifyUser } = require('../models/userDatabase');
const { getImageSet } = require('../models/setDatabase');
const { upload } = require('../utils/fileUpload');
const { setup, getFile } = require('../models/fileDatabase');
const { getHexID } = require('../utils/mongo');
const router = express.Router();

// Get endpoint for individual images
router.get("/:id", async (req, res) => {
    // Get the file details from the database
    const file = await getFile(req.params.id);
    const set = await getImageSet(req.params.id);
    const user = await verifyUser(req.token);

    // If the file exists stream it to the user
    if (file && set && user && user.id === set.user) {

        const gfs = await setup();
        // Pipe the file stream from the database to the user
        const stream = await gfs.openDownloadStream(getHexID(req.params.id));

        // If the file exists pipe it to the user
        if (stream) return stream.pipe(res);
    }
    else if (!user) return res.status(401).send();
    else if (set && user.id !== set.user) return res.status(403).send();
    // If the file does not exist then return a 404
    res.status(404).send();
});

// Post endpoint for uploading files
router.post("/", upload.any(), async (req, res) => {

    // Get the file details from the database
    const user = await verifyUser(req.token);

    // Send back the id of the set if the upload was successful
    if (user && req.files && req.files[0]) res.json({ id: req.files[0].id.toString() })
    else if (!user) res.status(401).send();
    else res.status(400).send();
});


module.exports = router;