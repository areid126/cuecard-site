const { openMongoose, getHexID } = require("../utils/mongo");

// Create a schema for folder objects
const folderSchema = new openMongoose().Schema({
    title: String,
    user: String,
    sets: {type: [String]}
}, { id: false });

// Configure how the toObject function acts on folder objects
folderSchema.options.toObject = {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
};

// Create the folder object model
const Folder = openMongoose().model("Folder", folderSchema, "Folders");

async function createFolder(title, userID) {

    // Check that the folder and the user are defined
    if (title && userID) { 
        const newFolder = new Folder({
            title: title,
            user: userID,
            sets: [] // When a folder is first created the cards are empty
        });

        // Create the new folder
        await newFolder.save();

        // Return the created folder
        return newFolder.toObject();
    }

    // If there was an error creating the folder return undefined
    return undefined;
}

async function getFolder(id) {
    const folders = (await Folder.find({ _id: getHexID(id) })).map(folder => folder.toObject());

    // Return the first folder
    return folders[0];
}

async function getFolders(userID) {
    const folders = (await Folder.find({ user: userID })).map(folder => folder.toObject());
    return folders;
}

async function deleteFolder(id) {
    // Delete the folder
    await Folder.findOneAndDelete({ _id: getHexID(id) });
}

async function deleteFolders(userID) {
    // Delete all the sets all at once
    await Folder.deleteMany({ user: userID });
}

async function addSet(folderID, setID) {

    const folder = await Folder.findOneAndUpdate(
        { _id: getHexID(folderID) },
        // Only add the set if it is not already in the folder
        { $addToSet: { sets: setID } },
        { new: true }
    );

    if (folder) return folder.toObject();
    return undefined;
}

async function removeSet(folderID, setID) {

    const folder = await Folder.findOneAndUpdate(
        { _id: getHexID(folderID) },
        { $pull: { sets: setID } }, // Remove the set from the folder
        { new: true } // Return the updated document
    );

    if (folder) return folder.toObject();
    // Return undefined if the folder does not exist
    return undefined;
}

async function changeTitle(id, title) {

    // Make sure there is a provided title
    if (title) {

        const folder = (await Folder.findByIdAndUpdate(getHexID(id),
            { $set: { title: title } },
            { new: true }
        ));

        if (folder) return folder.toObject();
    }

    // If the update fails return undefined
    return undefined;
}

// Export functions for use in other files
module.exports = {
    createFolder,
    deleteFolder,
    getFolder,
    getFolders,
    deleteFolders,
    addSet,
    removeSet,
    changeTitle
}