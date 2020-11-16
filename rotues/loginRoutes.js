const router = require("express").Router()
const db = require ("../db")
const path = require("path")
const bcrypt = require("bcrypt")

router.post("/login", (req, res) => {
    console.log(req.body.username)
    db.query('SELECT * FROM accounts WHERE username = ?', [req.body.username],   async(error, result) => {
        if(result.length === 0) {
            //ph
            return res.redirect("/")
        }
        try {
            if(await bcrypt.compare(req.body.password, result[0].password)) {
                req.session.loggedin = true
                req.session.role = result[0].role
                req.session.username = req.body.username
                return res.redirect("/")
            } else {
                res.status(400).redirect("/")
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

router.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const account = {username: req.body.username, role: "user", password: hashedPassword}
        db.query('INSERT INTO accounts SET ?', account, (error, result) => {
            if (error && error.code === "ER_DUP_ENTRY") {
                return res.status(400).send("fejl")
            }else{
                req.session.loggedin = true
                req.session.username = req.body.username
                return res.redirect("/")
            }
        })
    } catch {
        return res.status(500)
    }
})

module.exports = router