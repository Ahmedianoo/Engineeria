const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { CreateUser, LoginUserAuth, SaveVerificationCode, VerifyOTP } = require("../models/AuthModel");
const { SendVerificationEmail } = require("../emails/AuthEmail");

// Function to create a JWT token
const CreateToken = (id) => {
    return jwt.sign({ id } , process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Login user
const LoginUser = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        // Attempt to login using the provided email and password
        const result = await LoginUserAuth(Email, Password);
        // console.log(result)
        const token = CreateToken(result.UserId); // Create a token for the logged-in user
        res.status(200).json({ user: result, token }); // Send the user and token in the response
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error message if login fails
    }
}

// Signup user
const SignupUser = async (req, res) => {
    const { Name, UserType, Email, Password, OTP } = req.body;

    // Check if all required fields are provided
    if (!Email || !Name || !Password || !OTP) {
        return res.status(400).json({ error: "All fields must be provided" });
    }

    try {
        // Verify OTP before user creation
        await VerifyOTP(Email, OTP.toString());

        // Insert new user into the database
        const result = await CreateUser(Name, UserType, Email, Password);

        const token = CreateToken(result.Id); // Generate token for the new user
        res.status(201).json({ user: result, token }); // Respond with the new user and token
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error message if signup fails
    }
}

// Verify user email
const VerifyUser = async (req, res) => {
    const { email } = req.body;

    // Ensure email is provided
    if (!email) {
        return res.status(400).json({ error: "Email must be provided" });
    }

    try {
        // Generate a random OTP and save it
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        await SaveVerificationCode(email, randomDigits); // Save OTP to database
        await SendVerificationEmail(email, randomDigits); // Send OTP to user's email
        console.log(randomDigits)
        res.json({ "success": "OTP has been sent to your email" }); // Success message
    } catch (error) {
        console.log(error.message); // Log error message
        res.status(400).json({ error: error.message }); // Return error message if email verification fails
    }
}

module.exports = { LoginUser, SignupUser, VerifyUser };



// Code before Formatting just leaving it for refrence in case i made anything wrong while cleaning the code

// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
// const {CreateUser , LoginUserAuth , SaveVerificationCode , VerifyOTP} = require("../models/AuthModel")
// const {SendVerificationEmail} = require("../emails/AuthEmail")

// const CreateToken = (id) => {
//     return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn: '7d'} )
// }

// //login
// const LoginUser = async (req , res) => {
//     const {Email , Password} = req.body
//     try {
//         const result = await LoginUserAuth(Email , Password);
//         const token = CreateToken(result.id)
//         res.status(200).json({user : result , token})
//     } catch (error) {
//         res.status(400).json({error : error.message})
//     }
// }

// //signup
// const SignupUser = async (req , res) => {
//     const {Name , UserType , Email , Password , OTP} = req.body
//     if(!Email || !Name || !Password || !OTP){
//         return res.status(400).json({error : "All fields must be provided"})
//     }
//     try {
//         console.log(Name , UserType , Email , Password , OTP)
//         // check otp
//         await VerifyOTP(Email , OTP.toString())

//         // insert user
//         const result = await CreateUser(Name , UserType , Email , Password)

//         const token = CreateToken(result.Id);
//         res.status(201).json({user : result , token});
//     } catch (error) {
//         res.status(400).json({error : error.message})
//     }
// }

// //verify user Email
// const VerifyUser = async (req , res) => {
//     const {email} = req.body
//     if(!email){
//         return res.status(400).json({error : "Email must be provided"})
//     }
//     try {
//         const randomDigits = Math.floor(100000 + Math.random() * 900000);
//         // console.log(randomDigits);
//         await SaveVerificationCode(email ,randomDigits)
//         await SendVerificationEmail(email , randomDigits)
//         res.json({"sucess" : "OTP has been sent to you email"})
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).json({error : error.message})
//     }
// }

// const VerifyUser_InsertData = async (req , res) => {
//     const {Name , Email , Password , OTP} = req.body
//     if(!Email || !Name || !Password || !OTP){
//         return res.status(400).json({error : "All fields must be provided"})
//     }
//     try {
//         await SaveVerificationCode(email ,randomDigits)
//         await SendVerificationEmail(email , randomDigits)
//         res.json({"sucess" : "OTP has been sent to you email"})
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).json({error : error.message})
//     }
// }

// module.exports = {LoginUser , SignupUser , VerifyUser , VerifyUser_InsertData}