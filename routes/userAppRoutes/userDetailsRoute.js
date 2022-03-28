const express = require("express");
const { body } = require("express-validator");
const usersController = require("../../controllers/userAppController/userDetails");

const router = express.Router();
//register kid
router.post(
    "/register",
    [
        body("firstName", "Guardian first name is require").notEmpty(),
        body("telephone", "Telephone number is require").notEmpty(),
        body("kidNo", "Number of kids reqister is require").notEmpty(),
        body("kidDetails", "KidDetails must be an array").isArray(),
        body("firstName", "Guardian first name Must be greater than two characters").trim().isLength({ min: 2 }),
        body("email", "Invalid email format").isEmail().optional({ nullable: true }),
        body("kidNo", "Number of kids must be i   n numeric format only no decimal").trim().isInt(),
        body("otherName", "Guardian other name Must be greater than two character").trim().isLength({ min: 2 }).optional({ nullable: true }),
        body("telephone", "Wrong Telephone number format").custom((val) => /^[0]\d{10}$/g.test(val)),
        body("kidDetails.*.kidName", "Kid name cannot be empty").notEmpty(),
        body("kidDetails.*.kidName", "Kid name must be a string ").isString(),
        body("kidDetails.*.kidSex", "Kid sex cannot be empty").notEmpty(),
        body("kidDetails.*.kidSex", "Kid sex must be a string ").isString(),
        body("kidDetails.*.hasKidImmu", "Kid Immunisation question cannot be empty").notEmpty(),
        body("kidDetails.*.hasKidImmu", "Have the kid been immunised must be a boolean").isBoolean(),
        body("kidDetails.*.noImmu", "No Immunisation require cannot be empty").notEmpty(),
        body("kidDetails.*.noImmu", "No Immunisation must in a numeric format only").isInt(),
    ],
    usersController.addUsers 
);

/*
parentDetails:
email: "mmekutmfonedet@gmail.com"
firstName: "Mmekut-mfon"
kidNo: 1
otherName: "othrtt"
*/
module.exports = router;
