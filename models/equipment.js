const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    pricePerDay: {
        type: Number,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model("equipment", equipmentSchema);