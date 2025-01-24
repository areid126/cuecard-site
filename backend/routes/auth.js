const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUser, verifyUser } = require('../models/userDatabase');
const router = express.Router();
const config = require("../utils/config");


// End point for users to login
router.post("/login", async (req, res) => {

    const oldUser = await verifyUser(req.token);

    // Check the request body is valid
    if (!oldUser && req.body && req.body.username && req.body.password) {

        // Get the users details from the request body
        const user = await getUser(req.body.username);

        // If the user has a username and password then verify if they exist
        if (user && await bcrypt.compare(req.body.password, user.password)) {

            // Generate the user a new token
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });

            // Set the login cookie
            res.cookie("token", token, config.COOKIE_PERMISSIONS);
            res.json({ token: token, username: user.username, id: user.id });
        }

        // If the username or password are not valid send 401
        else res.status(401).send();
    }
    // Give the user the details they are already logged in as 
    else if (oldUser) {
        // Set the login cookie for the old user
        res.cookie("token", req.token, config.COOKIE_PERMISSIONS);
        res.json({ token: req.token, username: oldUser.username, id: oldUser.id });
    }
    // Send 400 if the request is malformed
    else res.status(400).send();

});

// End point to logout
router.get("/logout", async (req, res) => {
    // Remove the cookie
    res.cookie("token", "undefined", config.COOKIE_PERMISSIONS);
    res.status(201).send(); // End the request
});

// End point to register a new user account
router.post("/register", async (req, res) => {

    const oldUser = await verifyUser(req.token);

    // If the req body has a valid username and password then create the user
    if (!oldUser && req.body && req.body.username && req.body.password && !/\W/.test(req.body.username) && req.body.password.length > 8
        // Validate that the password is strong
        && /[a-z]+/.test(req.body.password) && /[A-Z]+/.test(req.body.password) && /\d/.test(req.body.password)
        && /\W/.test(req.body.password)) {

        // Encrypt the password
        const password = await bcrypt.hash(req.body.password, 10);

        // Try and create a new user with those credentials
        const user = await createUser({ username: req.body.username, password: password });

        // If the user is successfully created, create a token for the user and send it back
        if (user) {
            // Generate the user a new token
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
            // Set the login cookie
            res.cookie("token", token, config.COOKIE_PERMISSIONS);
            res.json({ token: token, username: user.username, id: user.id });
        }
        else res.status(409).send(); // Return 409 conflict if the username is already taken
    }
    // Give the user the details they are already logged in as 
    else if (oldUser) {
        res.cookie("token", req.token, config.COOKIE_PERMISSIONS);
        res.json({ token: req.token, username: oldUser.username, id: oldUser.id });
    }
    // If there are any issues return status code 400
    else res.status(400).send();
});

// End point to verify logged in users
router.get("/verify", async (req, res) => {

    // Get the user associated with the token
    const user = await verifyUser(req.token);
    if (user) {
        // Set the login cookie
        res.cookie("token", req.token, config.COOKIE_PERMISSIONS);
        return res.json({ token: req.token, username: user.username, id: user.id });
    }
    // If the user is not logged in then send 401
    else res.status(401).send();
});

module.exports = router;