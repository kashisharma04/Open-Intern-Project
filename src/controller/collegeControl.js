const collegeModel = require ('../models/collegeModel');
const internModel = require('../models/internModel')
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidString = function (input) {
    return /^[a-zA-Z0-9\s\-\.,']+$/u.test(input);
  };

const axios = require('axios');

const createCollege = async function(req,res){
    try{
    let input  = req.body;
    const {name , fullName, logoLink} = input;
    if(!name || !fullName || !logoLink){
        return res.status(400).send({status : false, message:"Please provide manadatory details!!"})
    }
    try{
    const response = await axios.get(logoLink);
    if (response.status < 200 && response.status > 299 ) {
        return res.status(400).send({ status: false, message: "LogoLink is not active" });
    }   
    } catch(err) { return res.status(400).send({status : false, message : "Please provide valid link"}) }

    const isName = await collegeModel.findOne({ name: name });
    if (isName) {
      return res.status(400).send({ status: false, message: "College already registered" });
    }

    const isName1 = await collegeModel.findOne({ fullName: fullName });
    if (isName1) {
      return res.status(400).send({ status: false, message: "College already registered" });
    }

    let collegeCreated = await collegeModel.create(input)
    return res.status(201).send({ status: true, data: collegeCreated })
    }
    catch(err){ return res.status(500).send({status : false, message : err.message});}
}
//=========================== GET API ============================================
   let collegeDetails = async (req, res) => {
  try{
    let query = req.query.collegeName;
    if(!isValid(query)){
      return res.status(400).send({status: false,message:"Please provide Valid College details"});
    }
    if(!isValidString(query)){
      return res.status(400).send({status: false,message:"Please provide Valid College name details"});
    }

    let getCollege = await collegeModel.findOne({ name: query });
    if (!getCollege) {
      return res.status(400).send({ status: false, message: "No college exists with that name" });
    }

    let id = getCollege._id;

    let interns = await internModel.find({ collegeId: id, isDeleted: false }).select('_id name email mobile')    

    let data = {
      name: getCollege.name,
      fullName: getCollege.fullName,
      logoLink: getCollege.logoLink,
      interns: interns, //array in intern
    };
    return res.status(200).send({ status: true, data: data });
  }catch(error){
    return res.status(500).send({ status: false, message: err.message });
  }
}

module.exports.createCollege=createCollege;
module.exports.collegeDetails=collegeDetails;
