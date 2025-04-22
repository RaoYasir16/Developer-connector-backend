const jwt = require("jsonwebtoken");

const validateUser = async(req , res , next)=>{
    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith("Bearer")){
            return res.status(401).json({
                message:"Unauthorized: User not Authorized"
            });
        }

        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded
        next();
    } catch (error) {
        return res.status(500).json({
            message:error.message
        });
    }
}

module.exports = validateUser