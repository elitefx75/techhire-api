const express = require("express");

const router = express.Router();


const controller = require("../controllers/equipmentControllers");



router.get("/", controller.getEquipment);


router.get("/:id",
    controller.getEquipmentById);



router.post("/",
    controller.createEquipment);



router.put("/:id",
    controller.updateEquipment);



router.delete("/:id",
    controller.deleteEquipment);



module.exports = router;