const express = require('express');
const { getCards, starCard, studyCard, newGetCards } = require('../models/cardDatabase');
const { getSets, getSet } = require('../models/setDatabase');
const { getFolder } = require('../models/folderDatabase');
const router = express.Router();

// Get cards. Has parameters s(set), f(filter), sm(smart) and l(limit)
router.get("/", async (req, res) => {

    // Get the user
    const user = await verifyUser(req.token);
    
    // If there is a user get the cards for that user
    if(user) {

        let sets;
        
        // If it is a folder get all the cards in all the sets in the folder
        if(req.query.f && !req.query.s) {
            const folder = await getFolder(req.query.f);
            if(folder.user === user.id) sets = (await getFolder(req.query.f)).sets;
            else return res.status(403).send();
        } 
        
        // If it is a set get all the cards in the set
        else if (req.query.s && !req.query.f) {
            const set = await getSet(req.query.s);
            if(set.user === user.id) sets = [req.query.s];
            else return res.status(403).send();
        }
        
        // If it neither a set nor a folder get all the cards
        else if (!req.query.s && !req.query.f) sets = (await getSets({user: user.id})).map(set => set.id);

        // If it both a set and a folder send an error
        else return res.status(400).send();

        if(sets) res.json(await newGetCards({sets: sets, smart: req.query.sm}));
        else res.status(404).send();
    }
    else res.status(401).send();
});

// Update the status of multiple cards at once
router.patch("/", async (req, res) => {
    
    // Get the user
    const user = await verifyUser(req.token);
    if(user && req.body && req.body.cards && req.body.cards.length > 0) {

        // Update the details of every card
        for(let i = 0; i < req.body.cards.length; i++) {
            const set = await getSet(req.body.cards[i].set);
            // Check the user is allowed to access the cards they are trying to update
            if(set.user === user.id) {
                // -1 = updated to unstarred, 0 = not updated, 1 = updated starred
                if(req.body.cards[i].starred) await starCard(req.body.cards[i].id, starred === 1); // Update whether the card was starred
                // -1 = not known, 0 = skipped, 1 = known
                if(req.body.cards[i].known) await studyCard(req.body.cards[i].id, known === 1); // Update when the card was last studied
            }
            else return res.status(403).send();
        }

        res.status(200).send(); // Inform the user the update was successful
    }
    else if(!user) res.status(401).send(); // Send a 401 if the user is not logged in
    else res.status(400).send(); // Send a 400 if the request is invalid
});



module.exports = router;