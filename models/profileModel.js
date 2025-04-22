const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      String
    },
    website: {
      String
    },
    bio: {
      String
    },
    skills: [
      String
    ],
    social: {
      linkdin: {
        String
      },
      facebook: {
        String
      },
      github: {
        String
      },
      insagram: {
        String
      },
    },
    experience: [  
      {
        title: { 
          type: String, required: true 
        },
        company: { 
          type: String, required: true 
        },
        location: { 
          type: String, required: true 
        },
        from: { 
          type: Date, required: true 
        },
        to: { 
          type: Date 
        },
        current: { 
          type: Boolean, default: false
         },
        description: {
          String
        }
      }
    ],
    education: [
      {
        school: {
          type: String,
          required: true
        },
        degree: {
          type: String,
          required: true
        },
        fieldofstudy: {
          type: String,
          required: true
        },
        from: {
          type: Date,
          required: true
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        }
      }
    ],
    projects:[{
      title:{
        type:String,
        require:true
      },
      description:{
        type:String,
      },
      technologies:[String],
      livelink:{type:String},
      githublink:{type:String},
      date:{
        type: Date,
        default:Date.now}
    }] 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
