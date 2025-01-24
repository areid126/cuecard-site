const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser, updateUser, verifyUser, deleteUser } = require('../models/userDatabase');
const router = express.Router();
const config = require("../utils/config");

// Delete a specific user's account
router.delete("/", async (req, res) => {

    // Get the curernt user
    const user = await verifyUser(req.token);

    // If the user is logged in delete their account
    if (user) {
        await deleteUser(user.username);
        // Log the user out
        res.cookie("token", "undefined", config.COOKIE_PERMISSIONS);
        return res.status(204).send(); // Send 204 to confirm success
    }

    else res.status(401).send(); // Send 401 if the user is not logged in
});

// Patch a specific user's details
router.patch("/", async (req, res) => {

    // Get the curernt user
    const user = await verifyUser(req.token);

    // If the usee is logged in and the body is in the correct format
    if (user && req.body && (req.body.password || req.body.username )) {

        let username = user.username;
        let password = user.password;

        // Change the requested fields if they are valid
        if (req.body.password && req.body.password.length > 8 && /[a-z]+/.test(req.body.password) && /[A-Z]+/.test(req.body.password)
            && /\d/.test(req.body.password) && /\W/.test(req.body.password)) password = await bcrypt.hash(req.body.password, 10);
        if (req.body.username && /\w/.test(req.body.username)) username = req.body.username;

        // Return if there is going to be a conflict from the update
        if (username != user.username && await getUser(req.body.username)) return res.status(409).send();
        // If the update details were invalid return 400
        if (username === user.username && password === user.password ) return res.status(400).send();

        // Update the user's details in the database
        const newUser = await updateUser(user.username, username, password);

        const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

        // Set the login cookie
        res.cookie("token", token, config.COOKIE_PERMISSIONS);

        // Send the user the updated details
        res.json({ token: token, username: newUser.username });
    }
    else if (user) res.status(400).send(); // Send 400 if the request is invalid
    else res.status(401).send(); // Send 401 if the user is not logged in 
});

module.exports = router;