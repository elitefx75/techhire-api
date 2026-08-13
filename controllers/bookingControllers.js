const Booking = require("../models/booking");


// GET BOOKINGS

exports.getBookings = async (req, res) => {

    try {


        const bookings = await Booking.find()
            .populate("equipment");


        res.status(200).json(bookings);



    } catch (error) {


        res.status(500).json({
            message: error.message
        });


    }

};




// CREATE BOOKING


exports.createBooking = async (req, res) => {


    try {


        const booking = await Booking.create(req.body);


        res.status(201).json(booking);



    } catch (error) {


        res.status(400).json({
            message: error.message
        });


    }

};




// UPDATE BOOKING


exports.updateBooking = async (req, res) => {


    try {


        const booking = await Booking.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );



        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        res.status(200).json(booking);



    } catch (error) {


        res.status(400).json({
            message: error.message
        });


    }

};




// DELETE BOOKING


exports.deleteBooking = async (req, res) => {


    try {


        const booking = await Booking.findByIdAndDelete(
            req.params.id
        );



        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }



        res.status(200).json({

            message: "Booking deleted"

        });



    } catch (error) {


        res.status(500).json({
            message: error.message
        });


    }


};