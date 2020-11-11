const router = require("express").Router()
const db = require ("../db")
const path = require("path")

router.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, result) => {
        if(result == 0){
            //placeholder send html i stedet
            console.log("Wrong")
        }else{
            console.log("true")
            req.session.loggedin = true
            req.session.username = username
        }
        //placeholder send html i stedet
        return res.send("bla")
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    //placeholder send html i stedet
    return res.send("logged out")
})

router.get("/signup", (req, res) => {
    if(req.session.loggedin){
        //placeholder send html i stedet
        res.send("already logged in")
    }else{
        res.sendFile(path.join(__dirname + "/../public/signup.html"))
    }
})

router.post("/signup", (req, res) => {
    account = {username: req.body.username, password: req.body.password}

    db.query('INSERT INTO accounts SET ?', account, (error, result) => {
        if (error) throw error
        console.log(result)
        return res.send("signup")
    })
})


module.exports = router