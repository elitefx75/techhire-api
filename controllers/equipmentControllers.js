const Equipment = require("../models/equipment");


// GET ALL EQUIPMENT

exports.getEquipment = async (req, res) => {

    try {

        const equipment = await Equipment.find();

        res.status(200).json(equipment);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};




// GET SINGLE EQUIPMENT

exports.getEquipmentById = async (req, res) => {

    try {

        const equipment = await Equipment.findById(req.params.id);


        if (!equipment) {

            return res.status(404).json({
                message: "Equipment not found"
            });

        }


        res.status(200).json(equipment);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};




// CREATE EQUIPMENT

exports.createEquipment = async (req, res) => {

    try {

        const equipment = await Equipment.create(req.body);


        res.status(201).json(equipment);


    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};




// UPDATE EQUIPMENT

exports.updateEquipment = async (req, res) => {

    try {


        const equipment = await Equipment.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );


        if (!equipment) {

            return res.status(404).json({
                message: "Equipment not found"
            });

        }


        res.status(200).json(equipment);



    } catch (error) {


        res.status(400).json({
            message: error.message
        });


    }

};




// DELETE EQUIPMENT

exports.deleteEquipment = async (req, res) => {


    try {


        const equipment = await Equipment.findByIdAndDelete(
            req.params.id
        );



        if (!equipment) {

            return res.status(404).json({
                message: "Equipment not found"
            });

        }


        res.status(200).json({

            message: "Equipment deleted successfully"

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });


    }


};