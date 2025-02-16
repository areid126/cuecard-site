const express = require('express');
const { verifyUser } = require('../models/userDatabase');
const { getSet, createSet, deleteSet, updateSet, getSets } = require('../models/setDatabase');
const router = express.Router();

// Get end point that gets all sets
// Parameters: title, limit, offset
router.get("/", async (req, res) => {

    // Verify if the user is logged in
    const user = await verifyUser(req.token);

    // Get the sets based on the query parameters
    if (user) {
        let filters = {};
        filters.user = user.id;
        if (req.query.title) filters.title = decodeURIComponent(req.query.title);

        let sets = await getSets(filters);

        // Apply pagination if applicable
        let limit, offset;
        if (req.query.offset && parseInt(req.query.offset)) {
            offset = parseInt(req.query.offset);
            offset = Math.max(0, offset); // Make sure the offset is positive
        }
        else offset = 0; // Set the offset to 0 by default
        if (req.query.limit && parseInt(req.query.limit)) {
            limit = parseInt(req.query.limit);
            if (limit < 0) limit = sets.length; // Make sure the limit is positive
        }
        else limit = sets.length; // Set the limit to the length by default

        // Check if the offset is out of length
        if (offset >= sets.length) return res.json([]);

        // Apply the limit and offset to the returned sets
        sets = sets.slice(offset, Math.min(offset + limit, sets.length));

        // Respond with the resulting set
        res.json(sets);
    } 
    else res.status(401).send();
});

// Get endpoint for getting the details of a specific set
router.get("/:id", async (req, res) => {

    const user = await verifyUser(req.token);
    const set = await getSet(req.params.id);

    if(user && set && user.id == set.user) res.json(set);
    else if(!user) res.status(401).send();
    else if(!set) res.status(404).send();
    else res.status(403).send();
});

// Post end point for creating sets
router.post("/", async (req, res) => {

    // Get the user
    const user = await verifyUser(req.token);
    if (user && req.body) {
        const set = await createSet(req.body, user.id);

        // If the set is created return it otherwise send 400 bad request
        if (set) return res.json(set);
    }
    // Send 401 if the user is not logged in
    else if (!user) res.status(401).send();
    // Send 400 if there is no request body
    res.status(400).send();
});

// Delete end point for deleting sets
router.delete("/:id", async (req, res) => {

    // Get the set and the user
    const user = await verifyUser(req.token);
    const set = await getSet(req.params.id);

    // If the user making the request is the user that created the set
    if (user && set && user.id === set.user) {
        await deleteSet(set.id);
        res.status(204).send();
    }

    // Send appropriate error code depending on error
    else if (!user) res.status(401).send();
    // Send 204 if the set does not exist as it has technically already been deleted
    else if (!set) res.status(204).send(); 
    else res.status(403).send();
});

// Put end point for updating sets
router.put("/:id", async (req, res) => {

    // Get the set and the user
    const set = await getSet(req.params.id);
    const user = await verifyUser(req.token);

    // If the user making the request is the user that created the set
    if (user && set && user.id == set.user) {
        const newSet = await updateSet(set.id, req.body);
        if (newSet) return res.json(newSet);
    }

    // Send appropriate error code depending on error
    else if (!set) return res.status(404).send(); // If the set doesnt exist
    else if (!user) return res.status(401).send(); // If the user is not logged in
    else if (user.id !== set.user) return res.status(403).send(); // If the user did not create the set
    res.status(400).send();
});

module.exports = router;