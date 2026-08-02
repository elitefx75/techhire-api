const express = require("express");

const router = express.Router();


const controller = require("../controllers/bookingControllers");



router.get("/",
    controller.getBookings);



router.post("/",
    controller.createBooking);



router.put("/:id",
    controller.updateBooking);



router.delete("/:id",
    controller.deleteBooking);



module.exports = router;