const express = require("express")
const router = express.Router();
const {LoginUser , SignupUser , VerifyUser} = require("../controllers/AuthController")

router.post("/login" , LoginUser)

router.post("/signup" , SignupUser)

router.post("/verify" , VerifyUser);

// router.post("/reciveverifydata" , VerifyUser_InsertData);

module.exports = router