const express = require('express');
const { verifyUser } = require('../models/userDatabase');
const { getSet } = require('../models/setDatabase');
const { getFolder, deleteFolder, createFolder, getFolders, changeTitle, addSet, removeSet } = require('../models/folderDatabase');
const router = express.Router();

// Get end point that gets all folders by a specific user
router.get("/", async (req, res) => {

    // Verify if the user is logged in
    const user = await verifyUser(req.token);
    // If the user is logged in get their folders
    if (user) {
        const folders = await getFolders(user.id);

        // Apply pagination if applicable
        let limit, offset;
        if (req.query.offset && parseInt(req.query.offset)) {
            offset = parseInt(req.query.offset);
            offset = Math.max(0, offset); // Make sure the offset is positive
        }
        else offset = 0; // Set the offset to 0 by default
        if (req.query.limit && parseInt(req.query.limit)) {
            limit = parseInt(req.query.limit);
            if (limit < 0) limit = folders.length; // Make sure the limit is positive
        }
        else limit = folders.length; // Set the limit to the length by default

        // Check if the offset is out of length
        if (offset >= folders.length) return res.json([]);

        // Apply the limit and offset to the returned sets
        return res.json(folders.slice(offset, Math.min(offset + limit, folders.length)));
    }
    // If the user is not logged in then send a 401
    res.status(401).send();
});

// Post end point for creating folders
router.post("/", async (req, res) => {

    // Get the user
    const user = await verifyUser(req.token);
    if (user && req.body && req.body.title) {
        const folder = await createFolder(req.body.title, user.id);

        // Return the folder
        return res.json(folder);
    }
    // Send 401 if the user is not logged in
    else if (!user) res.status(401).send();
    // Send 400 if there is no request body
    res.status(400).send();
});

// Delete end point for deleting folder
router.delete("/:id", async (req, res) => {

    // Get the set and the user
    const folder = await getFolder(req.params.id);
    const user = await verifyUser(req.token);

    // If the user making the request is the user that created the set
    if (user && folder && user.id === folder.user) {
        await deleteFolder(folder.id);
        res.status(204).send();
    }

    // Send appropriate error code depending on error
    else if (!user) res.status(401).send();
    // Send 204 if the folder does not exist as it has technically already been deleted
    else if (!folder) res.status(204).send(); 
    else res.status(403).send();
});

// Patch end point for updating folders. Can change title or add a set
router.patch("/:id", async (req, res) => {

    // Get the set and the user
    const folder = await getFolder(req.params.id);
    const user = await verifyUser(req.token);

    // If the user making the request is the user that created the set
    if (user && folder && user.id === folder.user) {

        let newFolder;

        // Add to the sets if the sets have been added to
        if (req.body.set) {
            const set = await getSet(req.body.set);

            // Make sure this a valid set to add before adding it
            if (set && set.user === user.id)
                newFolder = await addSet(folder.id, req.body.set);
        }
        // Change the title if the title has been updated
        if (req.body.title) newFolder = await changeTitle(folder.id, req.body.title);

        // Return the new folder if it was updated
        if (newFolder) return res.json(newFolder);
    }

    // Send appropriate error code depending on error
    else if (!folder) return res.status(404).send(); // If the Folder doesnt exist
    else if (!user) return res.status(401).send(); // If the user is not logged in
    else return res.status(403).send(); // If the user did not create the folder
    res.status(400).send(); // Return 400 if the request was invalid
});

// Delete endpoint for removing a set from a folder
router.delete("/:folder/:set", async (req, res) => {
    const user = await verifyUser(req.token);
    const folder = await getFolder(req.params.folder);
    const set = await getSet(req.params.set);

    // Delete the set if the set, folder and user exist
    if (user && folder && set && user.id === folder.user) {
        const newFolder = await removeSet(folder.id, set.id);
        return res.json(newFolder);
    }
    // Send an appropriate error code to the user if the request is invalid
    else if (!user) return res.status(401).send();
    else if (folder && user.id !== folder.user) return res.status(403).send();
    else res.status(404).send(); // Send 404 if either the folder or the set is not valid
});

module.exports = router;