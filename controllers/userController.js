const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar");


const registerUser = async(req,res)=>{
    try {
        const {username,email,password} =  req.body;
        if(!username ||!email || !password){
            return res.status(400).json({
                message:"All field required"
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already Exist"
            });
        }
       
        const avatar =gravatar.url(email,{
            s:"200",
            r:"pg",
            d:"mm"
        });

        const hashPassword = await bcrypt.hash(password,10);
        
        await User.create({
            username,
            email,
            avatar,
            password:hashPassword
        });
       
        return res.status(200).json({
            message:"User Registure successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
}

const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Please enter Email or Password"
            });
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({
                message:"User Not Registure: Enter correct Email Address"
            });
        }

        const compare = await bcrypt.compare(password,existingUser.password);
        if(!compare){
            return res.status(400).json({
                message:"Password Incorrect"
            });
        }

        const jsonwebtoken = jwt.sign({
            id:existingUser.id,
            username:existingUser.username,
            email:existingUser.email
        },
        process.env.JWT_SECRET,{expiresIn:"5d"});

        return res.status(200).json({
            message:"User Login Successfully",
            jsonwebtoken,
            existingUser
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
}
module.exports = {registerUser,loginUser}
