const express = require("express");
const router = require("express").Router();
const { getCurrentProfile, addProfile, deleteProfile,
        addexperince,deleteExperience,addEducation,deleteEducation,
        addProjects,getProjects,deletePrject, 
        getallProfile,
        getMatchedProfiles} = 
        require("../controllers/profileController");

const userAuth = require("../middleware/auth");

//Get Profile Data for Login user
router.get("/get-profile", userAuth, getCurrentProfile);
//add or Update Profile
router.post("/add-profile",userAuth,addProfile);
//Delete Profile
router.delete("/delete-profile",userAuth,deleteProfile);

//add Experince in Profile
router.put("/profile/add-experince",userAuth,addexperince);
//Delete Experince 
router.delete("/profile/delete-experience/:id",userAuth,deleteExperience);

//Add education
router.put("/profile/add-education",userAuth,addEducation);
//Delete education
router.delete("/porfile/delete-education/:id",userAuth,deleteEducation);

//Get All projects
router.get("/profile/projects",userAuth,getProjects)
//Add Projcrs
router.put("/profile/add-project",userAuth,addProjects);
//Delete Porject
router.delete("/profile/delete-project/:id",userAuth,deletePrject);

//Show all Profiles
//show matched skill profiles
router.get("/profile/all",getallProfile);
//show matched skill profiles
router.get("/profile/matchedprofile",getMatchedProfiles)
module.exports = router