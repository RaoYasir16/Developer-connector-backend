const Profile = require("../models/profileModel");

//Get Profile only login user
const getCurrentProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await Profile.findOne({ user_id: userId }).populate("user_id", "username email");

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found for this User"
            });
        }

        return res.status(200).json({
            message: "Profile Get Successfully",
            profile
        });
    } 
  
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

//Add or Update Profile
//Ager profile ni ha to add kar da ga
//Ager ha to update kar da ga
const addProfile = async (req, res) => {
    try {
        // User ID get from Middleware
        const userId = req.user.id;

        // Get all fields from body or frontend
        const { location, website, bio, skills, social } = req.body;

        const profileFields = {
            user_id: userId,
            location,
            website,
            bio,
            skills: Array.isArray(skills) ? skills : skills?.split(",").map((skill) => skill.trim()),
            social
        };

        // Check if Profile already exists
        let profile = await Profile.findOne({ user_id: userId });

        if (profile) {
            // If already exists, update the profile
            profile = await Profile.findOneAndUpdate(
                { user_id: userId },
                { $set: profileFields },
                { new: true }
            );

            return res.status(200).json({
                message: "Profile updated successfully",
                profile
            });
        }

        // If not exists, create a new profile
        profile = new Profile(profileFields);
        await profile.save();

        return res.status(200).json({
            message: "Profile added successfully",
            profile
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

//@desc   Delete Profile if exist
//@route  DELETE delete-profile
//@access Private
const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id; 

      
        const existingProfile = await Profile.findOne({ user_id: userId });

        if (!existingProfile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        
        await Profile.findOneAndDelete({ user_id: userId });

        return res.status(200).json({
            message: "Profile deleted successfully",
            deletedProfile: existingProfile
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Add experience to profile
// @route   PUT profile/experience
// @access  Private
const addexperince = async (req, res) => {
    const { title, company, location, from, to, current, description } = req.body;
    const newexp = { title, company, location, from, to, current, description };

    try {
        const existingProfile = await Profile.findOne({ user_id: req.user.id });

        if (!existingProfile) {
            return res.status(404).json({
                message: "Profile not found. First Add your Profile"
            });
        }

        
        if (!Array.isArray(existingProfile.experience)) {
            existingProfile.experience = [];
        }

        existingProfile.experience.unshift(newexp);
        await existingProfile.save();

        return res.status(200).json({
            message: "Experience added successfully",
            existingProfile
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete experience to profile
// @route   DELETE profile/experience
// @access  Private
const deleteExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const expId = req.params.id;

        const existingProfile = await Profile.findOne({ user_id: userId });

        if (!existingProfile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        // Make sure experience exists
        const updatedExperiences = existingProfile.experience.filter(
            (exp) => exp._id.toString() !== expId
        );

        if (updatedExperiences.length === existingProfile.experience.length) {
            return res.status(404).json({
                message: "Experience not found"
            });
        }

        existingProfile.experience = updatedExperiences;
        await existingProfile.save();

        return res.status(200).json({
            message: "Experience deleted successfully",
            existingProfile
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// @desc    ADD Education to profile
// @route   PUT profile/education
// @access  Private
const addEducation = async (req, res) => {
    try {
        const { school, degree, fieldofstudy, from, to, current, description } = req.body;
        const newEdu = { school, degree, fieldofstudy, from, to, current, description };

        const existingProfile = await Profile.findOne({ user_id: req.user.id });

        if (!existingProfile) {
            return res.status(404).json({
                message: "Profile not found. First add profile."
            });
        }

       
        if (!Array.isArray(existingProfile.education)) {
            existingProfile.education = [];
        }

        
        existingProfile.education.unshift(newEdu);
        await existingProfile.save();

        return res.status(200).json({
            message: "Education added successfully",
            profile: existingProfile
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete Education to profile
// @route   Delete profile/education
// @access  Private
const deleteEducation = async(req,res)=>{
    try {
        const userId = req.user.id
        const eduId =req.params.id

        const existingProfile = await Profile.findOne({user_id:userId});
        if(!existingProfile){
            return res.status(404).json({
                message:"Profile not found"
            });
        }

        const updatedEducation = existingProfile.education.filter(
            (edu)=>edu._id.toString() !== eduId
        );

        if(existingProfile.education.length === updatedEducation.length){
            return res.status(404).json({
                message:"Education not found"
            });
        }

        existingProfile.education = updatedEducation;
        await existingProfile.save();
        return res.status(200).json({
            message:"Education Delete successfully",
            existingProfile
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Get Project in profile
// @route   GET profile/education
// @access  Private
const getProjects = async(req,res)=>{
    try {
        const existingProfile = await Profile.findOne({user_id:req.user.id});
        if(!existingProfile){
            return res.status(404).json({
                message:"Profile not Found. First add your Profile"
            });
        }

        const projects = existingProfile.projects
        return res.status(200).json({
            message:"Projects get successfully",
            projects
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Add Project in profile
// @route   Put profile/education
// @access  Private
const addProjects = async (req, res) => {
    try {
        const { title, description, technologies, liveLink, githubLink, date } = req.body;
        const newProject = { title, description, technologies, liveLink, githubLink, date };

        const existingProfile = await Profile.findOne({ user_id: req.user.id });

        if (!existingProfile) {
            return res.status(404).json({
                message: "Profile not found. Please create your profile first."
            });
        }

        // ✅ Check if 'projects' is an array
        if (!Array.isArray(existingProfile.projects)) {
            existingProfile.projects = [];
        }

        // ✅ Add project
        existingProfile.projects.unshift(newProject);
        await existingProfile.save();

        return res.status(200).json({
            message: "Project added successfully",
            projects:existingProfile.projects
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// @desc    Delete Project in profile
// @route   Delete profile/education
// @access  Private
const deletePrject = async(req,res)=>{
    try {
        const projectId = req.params.id
        const existingProfile = await Profile.findOne({user_id:req.user.id});
        if(!existingProfile){
            return res.status(404).json({
                message:"Profile not Exist.First add profile"
            });
        }
        
        const updateProjects = existingProfile.projects.filter(
            (pro)=>pro._id.toString() !== projectId);

            if(existingProfile.projects.length == updateProjects.length){
                return res.status(404).json({
                    messge:"Porject not found"
                });
            }

            existingProfile.projects = updateProjects
            await existingProfile.save();
            return res.status(200).json({
                message:"Project Delete Successfully",
                Profile:existingProfile.projects
            });

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Show all Deveper Profiles papulate with User 
// @route   GET profile/all
// @access  Public
const getallProfile = async(req,res)=>{
    try {
        const profile = await Profile.find().populate("user_id",['username','avatar']);
        return res.json({
            message:"All Profile fatched successfully",
            profile
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

// @desc    Show all Deveper Profiles base on {skill filtur} papulate with User 
// @route   GET profile/all
// @access  Public
const getMatchedProfiles = async (req, res) => {
    // URL se skill get karna (example: ?skill=node)
    const { skill } = req.query;
  
    try {
      let filter = {};
  
      // Agar skill query mein diya gaya ho to uska filter lagao
      if (skill) {
        filter.skills = {
          $in: [new RegExp(skill, 'i')] // case-insensitive search
        };
      }
  
      // Filter ke according Profile collection se data nikaalo
      const profiles = await Profile.find(filter).populate('user_id', ['name', 'avatar']);
  
      // Response bhejo
      res.status(200).json(profiles);
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  

module.exports = {getCurrentProfile,addProfile,deleteProfile,
                  addexperince,deleteExperience,addEducation,deleteEducation,
                  addProjects,getProjects,deletePrject,
                  getallProfile,getMatchedProfiles }