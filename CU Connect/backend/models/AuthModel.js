const sql = require('mssql');
const bcrypt = require("bcrypt");
const validator = require("validator");
require('dotenv').config();

// Database configuration
const config = {
    user: process.env.DATABASE_CONFIG_USERNAME,
    password: process.env.DATABASE_CONFIG_PASSWORD, 
    server: process.env.DATABASE_CONFIG_SERVER,
    database: process.env.DATABASE_CONFIG_DATABASE, 
    options: {
        trustServerCertificate: true, 
    },
};

// Function to establish a connection to the database
async function Connection() {
    await sql.connect(config);
    console.log('Connected to SQL Server!');
}

// Function to check if a user already exists by email
async function CheckIfUserAlreadyExists(email) {
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT COUNT(*) AS NumOfUsers FROM users WHERE Email = '${email.toLowerCase()}'`);
        if(result.recordset[0].NumOfUsers !== 0){
            throw new Error("Email is already in use");
        }
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

// Function to create a new user
async function CreateUser(name, userType, email, password) {
    try {
        // Validate inputs
        if (!name || !userType || !email || !password) {
            throw new Error("All fields must be filled");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Email not valid");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password too weak");
        }
        // Check email domain for CUFE Students and Teachers
        if (!email.endsWith("@eng-st.cu.edu.eg") && !email.endsWith("@cu.edu.eg")) {
            throw new Error("You must enter a CUFE mail");
        }
        if (email.endsWith("@eng-st.cu.edu.eg") && userType !== "student") {
            userType = "student";
        } else if (email.endsWith("@cu.edu.eg") && userType !== "teacherDoctor") {
            userType = "teacherDoctor";
        }

        await CheckIfUserAlreadyExists(email);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // console.log(userType)
        const result = await sql.query(`
            INSERT INTO users (Name, UserType, Email, Password, CreatedAt, UpdatedAt)
            OUTPUT INSERTED.UserId, INSERTED.Name, INSERTED.UserType, INSERTED.Email, INSERTED.CreatedAt, INSERTED.UpdatedAt
            VALUES ('${name}', '${userType}', '${email.toLowerCase()}', '${hash}', GETDATE(), GETDATE());
        `);

        // Clean up UsersWithOTP table if OTP exists for the same email
        await sql.query(`DELETE FROM UsersWithOTP WHERE email = '${email.toLowerCase()}'`);

        return result.recordset[0];
    } catch (error) {
        console.log('Error Creating User: ', error);
        throw error;
    }
}

// Function to authenticate user login
async function LoginUserAuth(email, password) {
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM users WHERE Email = '${email}'`);
        if (!result.recordset[0]) {
            throw new Error("Incorrect Email or Password");
        }
        const match = await bcrypt.compare(password, result.recordset[0].Password);
        if (!match) {
            throw new Error("Incorrect Email or Password");
        }
        const user = result.recordset[0];
        delete user.Password; // Remove password from the returned user object

        return user;
    } catch (error) {
        console.log('Error Logging in: ', error);
        throw error;
    }
}

// Function to get user by ID
async function GetUser(id) {
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM users WHERE UserId = ${id}`);
        return result.recordset[0];
    } catch (err) {
        console.error('Error fetching Users:', err.message);
        throw err;
    }
}

// Function to check if a user already has a verification code
async function CheckIfUserAlreadyHasVerificationCodeDeleteIt(email) {
    try {
        await sql.connect(config);
        const result = await sql.query(`SELECT COUNT(*) AS NumOfUsers FROM UsersWithOTP WHERE Email = '${email.toLowerCase()}'`);
        if(result.recordset[0].NumOfUsers !== 0){
            // Delete any existing OTP entry for the email
            await sql.query(`DELETE FROM UsersWithOTP WHERE email='${email.toLowerCase()}'`);
        }
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

// Function to save a new OTP for user verification
async function SaveVerificationCode(email, OTP) {
    try {
        await CheckIfUserAlreadyExists(email);
        await CheckIfUserAlreadyHasVerificationCodeDeleteIt(email);

        if (!email || !OTP) {
            throw new Error("All fields must be filled");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(OTP.toString(), salt);
        await sql.connect(config);
        await sql.query(`INSERT INTO UsersWithOTP (email, OTP) VALUES ('${email.toLowerCase()}', '${hashedOTP}')`);
    } catch (error) {
        console.log('Error: ', error.message);
        throw error;
    }
}

// Function to verify OTP for user verification
async function VerifyOTP(email, OTP) {
    try {
        if (!email || !OTP) {
            throw new Error("All fields must be filled");
        }

        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM UsersWithOTP WHERE email = '${email.toLowerCase()}'`);

        if (result.recordset.length === 0) {
            throw new Error("No user found with this email");
        }

        const user = result.recordset[0];
        const expirationDate = new Date(user.expiration_date);
        const now = new Date();

        if (expirationDate < now) {
            throw new Error("The OTP has expired.");
        }

        const match = await bcrypt.compare(OTP, user.OTP);
        if (!match) {
            throw new Error("Incorrect OTP");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}

Connection();

module.exports = { CreateUser, LoginUserAuth, GetUser, SaveVerificationCode, VerifyOTP };

// Code before Formatting just leaving it for refrence in case i made anything wrong while cleaning the code

// const sql = require('mssql');
// const bcrypt = require("bcrypt")
// const validator = require("validator")
// require('dotenv').config()

// const config = {
//     user: process.env.DATABASE_CONFIG_USERNAME,
//     password: process.env.DATABASE_CONFIG_PASSWORD, 
//     server: process.env.DATABASE_CONFIG_SERVER,
//     database: process.env.DATABASE_CONFIG_DATABASE, 
//     options: {
//         trustServerCertificate: true, 
//     },
// };

// async function Connection(){
    
//     sql.connect(config);

//     console.log('Connected to SQL Server!');
// }

// async function CheckIfUserAlreadyExists(email) {
//     try {
//         await sql.connect(config);
//         const result = await sql.query(`SELECT COUNT(*) AS NumOfUsers FROM users WHERE Email = '${email.toLowerCase()}'`);
//         console.log(result)
//         if(result.recordset[0].NumOfUsers != 0){
//             throw new Error("Email is Already in use");
//         }
//         console.log(result.recordset[0].NumOfUsers)
//     } catch (error) {
//         console.log('Error: ', error);
//         throw error;
//     }
// }
// async function CreateUser(name, userType, email, password) {
//     try {
//         if(!name || !userType || !email || !password){
//             throw new Error("All fields must be filled");
//         }
//         if(!validator.isEmail(email)){
//             throw new Error("Email not valid");
//         }
//         if(!validator.isStrongPassword(password)){
//             throw new Error("Password too weak");
//         }
//         if(!email.endsWith("@eng-st.cu.edu.eg") && !email.endsWith("@cu.edu.eg")){
//             throw new Error("You must enter a CUFE mail");
//         }
//         if(email.endsWith("@eng-st.cu.edu.eg") && userType != "student"){
//             userType = "student"
//         }
//         else if(email.endsWith("@cu.edu.eg") && userType != "teacher"){
//             userType = "teacher"
//         }

//         await CheckIfUserAlreadyExists(email)
//         await sql.connect(config);
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password , salt);

//         const result = await sql.query(`
//             INSERT INTO users (Name, UserType, Email, Password, CreatedAt, UpdatedAt)
//             OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.UserType, INSERTED.Email, INSERTED.CreatedAt, INSERTED.UpdatedAt
//             VALUES ('${name}', '${userType.toLowerCase()}', '${email.toLowerCase()}', '${hash}', GETDATE(), GETDATE());
//             `)

//         await sql.query(`DELETE FROM UsersWithOTP WHERE email = '${email.toLowerCase()}'`)
            
//         return result.recordset[0]
//     } catch (error) {
//         console.log('Error Creating User: ', error);
//         throw error;
//     }
// }

// async function LoginUserAuth(email , password) {
//     if(!email || !password){
//         throw new Error("All fields must be filled");
//     }
//     try {
//         await sql.connect(config);
//         const result = await sql.query(`SELECT * FROM users WHERE Email = '${email}'`);
//         if(!result.recordset[0]){
//             throw new Error("Incorrect Email or Password");
//         }
//         const match = await bcrypt.compare(password , result.recordset[0].Password);
//         if(!match){
//             throw new Error("Incorrect Email or Password");
//         }
//         // console.log(result.recordset[0])
//         const user = result.recordset[0];
//         delete user.Password; 

//         console.log(user); 
//         return user;
//     } catch (error) {
//         console.log('Error Logging in: ', error);
//         throw error;
//     }
// }
// // LoginUserAuth("johndoek@exdddadmpddle.com" , "Hazemyasser-123")
// // CreateUser("hazem" , "admin" , "hazemysdassdser6@gmil.com" , "hazem")
// async function GetUser(id) {
//     try {
//         await sql.connect(config);
//         const result = await sql.query(`SELECT * FROM users WHERE Id = ${id}`);
//         console.log(result.recordset[0])
//         return result.recordset[0];
//     } catch (err) {
//         console.error('Error fetching Users:', err.message);
//         throw err;
//     }   
// }

// async function CheckIfUserAlreadyHasVerificationCodeDeleteIt(email) {
//     try {
//         await sql.connect(config);
//         const result = await sql.query(`SELECT COUNT(*) AS NumOfUsers FROM UsersWithOTP WHERE Email = '${email.toLowerCase()}'`);
//         // console.log(result)
//         if(result.recordset[0].NumOfUsers != 0){
//             // throw new Error("Email is Already in use");
//             const DeleteUserOTP = await sql.query(`DELETE FROM UsersWithOTP WHERE email='${email}'`);
            
//         }
//         console.log(result.recordset[0].NumOfUsers)
//     } catch (error) {
//         console.log('Error: ', error);
//         throw error;
//     }
// }

// async function SaveVerificationCode(email , OTP) {
//     try {
//         await CheckIfUserAlreadyExists(email)
//         await CheckIfUserAlreadyHasVerificationCodeDeleteIt(email)
//         if(!email || !OTP){
//             throw new Error("All field must be filled");
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashedOTP = await bcrypt.hash(OTP.toString() , salt)
//         await sql.connect(config);
//         const result = await sql.query(`INSERT INTO UsersWithOTP (email , OTP) VALUES ('${email.toLowerCase()}' , '${hashedOTP}')`);
//         console.log(OTP)
//         // console.log(result)
//     } catch (error) {
//         console.log('Error: ', error.message);
//         throw error
        
//     }
// }

// async function VerifyOTP(email , OTP) {
//     try {
//         if(!email || !OTP){
//             throw new Error("All field must be filled");
//         }
//         // console.log(email , OTP)
//         await sql.connect(config);

//         const result = await sql.query(`SELECT * FROM UsersWithOTP WHERE email = '${email}'`);

//         if (result.recordset.length === 0) {
//             // console.log("No user found with this email.");
//             throw new Error("No user found with this email");
//         }

//         const user = result.recordset[0];

//         const expirationDate = new Date(user.expiration_date);
//         const now = new Date();

//         // console.log(user)

//         if (expirationDate > now) {
//             // console.log("The OTP is still valid.");
//         } else {
//             // console.log("The OTP has expired.");
//             throw new Error("The OTP has expired.");
//         }
//         const match = await bcrypt.compare(OTP , result.recordset[0].OTP);
//         if(!match){
//             throw new Error("Incorrect OTP");
//         }
//         // console.log("success")
//     } catch (error) {
//         console.error("An error occurred:", error);
//         throw error;
//     }
// }

// Connection();

// // VerifyOTP("hazem.hassan04@eng-st.cu.edu.eg" , "654406")

// module.exports = {CreateUser , LoginUserAuth , GetUser , SaveVerificationCode , VerifyOTP}