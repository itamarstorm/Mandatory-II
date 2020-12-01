require("dotenv").config()

const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.email,
        pass: process.env.emailPassword
    }
})

function sendMail(mail, subject, message) {
    const mailOptions = {
        from: process.env.email,
        to: mail,
        subject: subject,
        text: message
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error)
        }else{
            console.log("email sent" + info.response)
        }
    })
}

module.exports.sendMail = sendMail
