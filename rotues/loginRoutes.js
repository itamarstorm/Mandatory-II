const router = require("express").Router()
const db = require ("../util/db")
const path = require("path")
const bcrypt = require("bcrypt")
const fs = require('fs')
const mail = require("../util/nodemailer")


const rateLimit = require("express-rate-limit")
const loginLimiter = rateLimit({
    windowsMs : 10 * 60 * 1000, //10 min
    max: 5,
    message : "Try again later"
})

router.use("/user", loginLimiter)

const wrongcredentials =  fs.readFileSync(__dirname + "/../public/unauthorized/wrongcredentials.html").toString()
const usernameinuse = fs.readFileSync(__dirname + "/../public/unauthorized/usernameinuse.html").toString()


router.post("/user/login", (req, res) => {
    db.query('SELECT * FROM accounts WHERE username = ?', [req.body.username],   async(error, result) => {
        if(result.length === 0) {
            return res.status(404).send(wrongcredentials)
        }
        try {
            if(await bcrypt.compare(req.body.password, result[0].password)) {
                req.session.loggedin = true
                req.session.role = result[0].role
                req.session.username = req.body.username
                return res.redirect("/")
            } else {
                res.status(401).send(wrongcredentials)
            }
        } catch {
            res.status(500)
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    return res.redirect("/")
})

router.post("/user/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const account = {username: req.body.username, role: "user", password: hashedPassword, email: req.body.email}
        db.query('INSERT INTO accounts SET ?', account, (error, result) => {
            if (error && error.code === "ER_DUP_ENTRY") {
                return res.status(400).send(usernameinuse)
            }else{
                mail.sendMail(account.email, "Comfirmation", "A new user has been created with the email")
                req.session.loggedin = true
                req.session.username = account.username
                return res.redirect("/")
            }
        })
    } catch {
        return res.status(500)
    }
})

module.exports = router