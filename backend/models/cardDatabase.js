const { openMongoose, getHexID } = require("../utils/mongo");
const { deleteFile } = require("./fileDatabase");


// Create a schema for card objects
const cardSchema = new openMongoose().Schema({
    term: { file: Boolean, content: String },
    definition: { file: Boolean, content: String },
    set: String,
    known: Number, // How well the user knows the card
    lastStudied: Date, // When the card was last studies by the user 
    starred: Boolean, // Whether the card has been marked as important
    next: Date // The date when this card is to be next studied
}, { id: false });

// Configure how the toObject function acts on card objects
cardSchema.options.toObject = {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
};

// Create the card object model
const Card = openMongoose().model("Card", cardSchema, "Cards");

async function createCard(card, setID) {

    // Check that the card is in the correct format
    if (card && card.term && card.definition && card.term.content && card.definition.content && setID) {

        const newCard = new Card({
            term: card.term,
            definition: card.definition,
            set: setID,
            known: 0,
            lastStudied: new Date(),
            starred: false,
            next: new Date()
        });

        await newCard.save();
        return newCard.toObject();
    }

    // If there was an error creating the card return undefined
    return undefined;
}

async function createCards(cards, setID) {
    const createdCards = [];
    // If there are cards create them
    if (cards && cards.length > 0 && setID) {
        // Create all the cards in the set
        for (let card of cards) {
            let newCard = await createCard(card, setID);
            if (newCard) createdCards.push(newCard);
        }
    }
    return createdCards;
}

async function getCards(setID) {
    const cards = (await Card.find({ set: setID })).map(card => card.toObject());
    return cards;
}

// New version of the getCards function that takes more arguments
async function newGetCards(query) {
    let filters = {};

    // If the user wants to smart study then apply the smart study filter
    if(query.smart) filters = {$or: [{known: {$lt: 4}}, {next : {$lt: new Date()}}]}

    // Get only the specific sets of cards
    filters.set = {$in: query.sets};

    // Get the cards
    const cards = (await Card.find(filters)).map(card => card.toObject());
    return cards;
}

async function deleteCards(setID) {
    // Get all the cards this operation will delete
    const cards = await getCards(setID);
    await Card.deleteMany({ set: setID });
    // Delete all data related to the cards
    await Promise.all(cards.map(async card => {
        // Delete any related files
        if (card.term.file) await deleteFile(card.term.content);
        if (card.definition.file) await deleteFile(card.definition.content);
    }));
}

async function getCard(id) {
    const cards = (await Card.find({ _id: getHexID(id) })).map(card => card.toObject());
    return cards[0];
}

async function deleteCard(id) {
    const card = await getCard(id);
    if (card) {
        await Card.findOneAndDelete({ _id: getHexID(id) });
        // Delete images related to the card
        if (card.term.file) await deleteFile(card.term.content);
        if (card.definition.file) await deleteFile(card.definition.content);
    }
}

async function getImageCard(fileID) {
    const card = await Card.findOne({ $or: [{ "term.file": true, "term.content": fileID }, { "definition.file": true, "definition.content": fileID }] });

    if (card) return card.toObject();
    return undefined;
}

async function updateCard(id, newCard) {

    // Make sure the id is the correct length
    if (newCard && newCard.term && newCard.definition) {

        const card = await Card.findByIdAndUpdate(getHexID(id), {
            $set: {
                term: newCard.term,
                definition: newCard.definition
            }
        }, { new: true })

        // If the card is defined return it
        if (card) return card.toObject();
    }

    // If the update fails return undefined
    return undefined;
}

// Function to call when a user studies a card
async function studyCard(id, known) {

    // Get the card
    const card = await Card.findOne(getHexID(id));

    if (card) {
        // Update the known value
        if(known && card.known < 30) card.known++;
        else if (!known && card.known > 0 && card.known < 4) card.known--;
        else if (!known && card.known > 3) card.known = 2;

        // Update the date last studied
        card.lastStudied = new Date();

        // Update the date when it next needs to be studied
        const next = new Date();
        if (card.known > 3) next.setDate(date.getDate() + card.known); // Update the next studied date
        card.next = next;

        // Save the changes
        card.save();

        return card.toObject();
    }

    // If the update fails return undefined
    return undefined;
}

// Function to call when a user stars a card
async function starCard(id, starred) {
    // Get the card
    const card = await Card.findOne(getHexID(id));

    if(card) {
        // Update the known value
        if(starred) card.starred = true;
        else card.starred = false;

        // Save the changes
        card.save();
        
        return card.toObject();
    }


    // If the update fails return undefined
    return undefined;
}

// Export functions for use in other files
module.exports = {
    createCard,
    createCards,
    deleteCard,
    deleteCards,
    updateCard,
    getCard,
    getCards,
    getImageCard,
    starCard,
    studyCard,
    newGetCards
}