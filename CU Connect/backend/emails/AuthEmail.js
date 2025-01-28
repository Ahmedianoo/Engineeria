require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const SendVerificationEmail = (email , randomDigits) =>{
    // console.log(email )
    console.log(randomDigits )
    const msg = {
        to: email, 
        from: 'hazemyasser6@gmail.com', 
        subject: 'Verification mail for CUconnect',
        text: `Enter this OTP in the brower : ${randomDigits}`,
    }
    sgMail
    .send(msg)
    .then(() => {
        // console.log('Email sent')
    })
    .catch((error) => {
        console.log(error)
        throw new Error(error)
    })
}

module.exports = {SendVerificationEmail}