const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../middleware/auth");
const controller = require("../controllers/equipmentControllers");

router.get("/", controller.getEquipment);


router.get("/:id",
    controller.getEquipmentById);



router.post("/", ensureAuthenticated, controller.createEquipment);



router.put("/:id", ensureAuthenticated, controller.updateEquipment);



router.delete("/:id", ensureAuthenticated, controller.deleteEquipment);



module.exports = router;