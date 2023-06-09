const mongoose = require('mongoose');
const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const { validateEmail, isValidNumber, isValid } = require('../utils/util.js')
const isValidMobile = function (input) {
            return /^[+]?[0-9]{1,3}?[-\s.]?[(]?\d{1,4}[)]?[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/.test(input);
            };


const createIntern = async function (req, res) {
    {
        try {
            let input = req.body;
            let { name, email, mobile, collegeName, isDeleted } = input;

            if (!name || !email || !mobile || !collegeName) {
                return res.status(400).send({ status: false, message: "Please provide manadatory details!" })
            }

            if (!isValid(email)) { return res.status(400).send({ status: false, message: " Invalid email" }) }

            if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Enter the valid email" }) }

            if (!isValidNumber) return res.status(400).send({ status: false, message: "Please provide correct Mobile number!" })

            const emailUsed = await internModel.findOne({ email: email });
            if (emailUsed) {
                return res.status(400).send({ status: false, message: "Email is already registered" });
            }

            const isMobile = await internModel.findOne({ mobile: mobile });
            if (isMobile) {
                return res.status(400).send({ status: false, message: "Mobile number already registered" });
            }
            if(!isValidMobile(mobile)){
            return res.status(400).send({status:false, message:"Please enter Valid Mobile number"})
            }
                        // collegeId = await collegeModel.findOne({ collegeId: collegeId });
            // if (!collegeId) return res.status(400).send({ status: false, message: "Student is not registered!" })

            const collegeCheck = await collegeModel.findOne({ name: collegeName });
            if (!collegeCheck) {
                return res.status(400).send({ status: false, message: "collegeName is not registered" });
            }

            //validation ends

            let collegeId = collegeCheck._id;
            const result = await internModel.create({ name, email, mobile, collegeId });
            const response = {
                isDeleted: result.isDeleted,
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                collegeId: result.collegeId
            }
            return res.status(201).send({ status: true, data: response });
        }
        catch (error) { return res.status(500).send({ status: false, message: error.message }) }

    }
}

module.exports.createIntern = createIntern;
