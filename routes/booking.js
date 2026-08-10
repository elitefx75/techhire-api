const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../middleware/auth");
const controller = require("../controllers/bookingControllers");

router.get("/", controller.getBookings);



router.post("/", ensureAuthenticated, controller.createBooking);



router.put("/:id", ensureAuthenticated, controller.updateBooking);



router.delete("/:id", ensureAuthenticated, controller.deleteBooking);



module.exports = router;