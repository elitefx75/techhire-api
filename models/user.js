const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        },
        displayName: String,
        email: {
            type: String,
            required: false
        },
        avatar: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
