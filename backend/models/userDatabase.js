const jwt = require("jsonwebtoken");
const { deleteSets } = require("./setDatabase");
const { openMongoose } = require("../utils/mongo");
const { deleteFolders } = require("./folderDatabase");


// Create a schema for user objects
const userSchema = new openMongoose().Schema({
    username: String,
    password: String
}, { id: false });

// Configure how the toObject function acts on user objects
userSchema.options.toObject = {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
};

// Create the user object model
const User = openMongoose().model("User", userSchema, "Users");

async function createUser(user) {

    // Check that the user is in the correct format
    if (user && user.username && user.password) {

        // Check if that username already exists
        const res = await User.find({ username: user.username });

        if (res.length === 0) {
            const newUser = new User({
                username: user.username,
                password: user.password,
            });

            await newUser.save();
            return newUser.toObject();
        }
    }

    // If there was an error creating the user return undefined
    return undefined;
}

async function getUser(username) {
    const users = (await User.find({ username: username })).map(user => user.toObject());
    return users[0];
}

async function getUsers() {
    return (await User.find({})).map(user => user.toObject());
}

async function deleteUser(username) {
    const user = await getUser(username);
    if (user) {
        // Find the user and remove them if they exist
        await User.findOneAndDelete({ username: username });

        // Delete all the data stored for the user
        await deleteSets(username);
        await deleteFolders(username);
    }
}

async function updateUser(username, newUsername, newPassword) {

    // If the new password and username are provided and the username does not already exist or is not being changed
    if (newUsername && newPassword && (username === newUsername || (await User.find({ username: newUsername })).length === 0)) {

        // Find and update the user
        const user = (await User.findOneAndUpdate({ username: username }, {
            $set: {
                username: newUsername,
                password: newPassword,
            }
        }, { new: true }));

        if (user) return user.toObject();
    }

    // If the update fails return undefined
    return undefined;
}

async function verifyUser(token) {
    try {
        // Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Get the user associated with the decoded token
        return await getUser(decodedToken.username);
    } catch {
        return undefined;
    }
}

// Export functions for use in other files
module.exports = {
    getUsers,
    createUser,
    deleteUser,
    getUser,
    verifyUser,
    updateUser
}