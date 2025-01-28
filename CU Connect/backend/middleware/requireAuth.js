const jwt = require("jsonwebtoken")
const {GetUser} = require("../models/AuthModel")
require('dotenv').config()

const requireAuth = async (req , res , next) => {
    const {authorization} = req.headers
    
    if(!authorization){
        return res.status(401).json({error : "Authorization token required"})
    }

    const token = authorization.split(" ")[1]

    try {
        const {id} = jwt.verify(token , process.env.JWT_SECRET)
        req.user = await GetUser(id);
        next();
    } catch (error) {
        console.log(error.message)
        res.status(401).json({error : "request not authorized"})
    }
}

module.exports = {requireAuth}