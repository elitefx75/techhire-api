const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "equipment",
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });


module.exports = mongoose.model("Booking", bookingSchema);