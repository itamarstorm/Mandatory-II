const router = require("express").Router()
const db = require ("../db")
const path = require("path")

router.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, result) => {
        console.log(result.length)
        if(result.length === 0){
            return res.redirect("/")
        }else{
            console.log("true")
            req.session.loggedin = true
            req.session.username = username
        }
        return res.redirect("/")
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    return res.redirect("/")
})

router.post("/signup", (req, res) => {
    account = {username: req.body.username, password: req.body.password}
    db.query('INSERT INTO accounts SET ?', account, (error, result) => {
        if(error && error.code === "ER_DUP_ENTRY") {
            res.status(400)
            return res.send("fejl")
        }
        return res.redirect("/")
    })

})


module.exports = router