    const dotenv = require("dotenv").config()
    const express = require("express");
    const mongoose = require("mongoose");

    const DB = require("./config/db");
    const userRoute = require("./routes/userRoute");
    const profileRoute = require("./routes/userProfileRoute");
   


    const app = express();
    app.use(express.json());

    app.use("/",userRoute);
    app.use("/",profileRoute);

    const port = process.env.PORT || 3000
    app.listen(port,()=>{
        console.log("Server Started", port);
        DB();
    })