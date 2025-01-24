const { createCards, deleteCards, getImageCard } = require("./cardDatabase");
const { openMongoose, getHexID } = require("../utils/mongo");


// Create a schema for set objects
const setSchema = new openMongoose().Schema({
    title: String,
    description: String,
    user: String
}, { id: false });

// Configure how the toObject function acts on set objects
setSchema.options.toObject = {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
};

// Create the set object model
const Set = openMongoose().model("Set", setSchema, "Sets");

async function createSet(set, userID) {

    // Check that the set is in the correct format
    if (set && set.title && set.cards && set.cards.length > 0 && userID) {  
        const newSet = new Set({
            title: set.title,
            description: set.description,
            user: userID,
        });

        // Create the new set
        await newSet.save();

        // Create cards for the set
        await createCards(set.cards, newSet._id.toString());

        // Return the created set
        return newSet.toObject();
    }

    // If there was an error creating the set return undefined
    return undefined;
}

async function getSet(id) {
    const sets = (await Set.find({ _id: getHexID(id) })).map(set => set.toObject());

    // If the set exists
    if (sets.length === 1) return sets[0];

    // Return undefined if there is no set
    return undefined;
}

async function getSets(query) {
    const filters = { user : query.user };

    // If there is a provided title then query specifically for sets with that title regardless of case sensitivity
    if (query && query.title) filters.title = { $regex: query.title, $options: "i" };

    // Get all the sets
    const sets = (await Set.find(filters)).map(set => set.toObject());
    return sets;
}

async function deleteSet(id) {
    // Delete the Set
    await Set.findOneAndDelete({ _id: getHexID(id) });

    // Delete the cards related to the set
    await deleteCards(id);
}


async function deleteSets(userID) {
    // Delete all the sets all at once
    await Set.deleteMany({ user: userID });
}

async function updateSet(id, newSet) {

    // Make sure the new set has the correct fields
    if (newSet && newSet.title && newSet.cards && newSet.cards.length > 0) {

        const update = {
            $set: {
                title: newSet.title,
                description: (newSet.description) ? newSet.description : undefined,
            }
        }

        // Delete the description field if it is not defined in the update
        if (newSet.description === undefined) update.$unset = { "description": "" };

        const set = (await Set.findByIdAndUpdate(getHexID(id), update, { new: true }));

        if (set) {
            // Update all the cards in the set
            await deleteCards(set._id);
            await createCards(newSet.cards, set._id);

            return set.toObject();
        }
    }

    // If the update fails return undefined
    return undefined;
}

async function getImageSet(fileID) {
    const card = await getImageCard(fileID);
    if (card) return await getSet(card.set);
    else return undefined;
}

// Export functions for use in other files
module.exports = {
    createSet,
    deleteSet,
    getSet,
    updateSet,
    getSets,
    deleteSets,
    getImageSet
}