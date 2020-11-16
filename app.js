const express = require("express")
const app = express()
const session = require('express-session');
const fs = require('fs')


require("dotenv").config()
const port  = process.env.PORT || 8080;

const loggedInHeader = fs.readFileSync(__dirname +"/public/header/loggedinHeader.html").toString()
const header = fs.readFileSync(__dirname + "/public/header/header.html").toString()
const index = fs.readFileSync(__dirname + "/public/index/index.html").toString()

const notLoggedIn = header + index
const loggedIn = loggedInHeader + index

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))


const loginRoutes = require("./rotues/loginRoutes")
const sessionsRoutes = require("./rotues/sessionRoutes")
app.use(loginRoutes)
app.use(sessionsRoutes)

app.get("/", (req, res) => {
    if(req.session.loggedin){
        return res.send(loggedIn)
    }else{
        return res.send(notLoggedIn)
    }
})

app.get("/secure", (req, res) => {
    console.log(req.session.loggedin)
    if(req.session.role === "admin") {
        res.sendFile(__dirname + "/public/secure/secure.html")
    } else {
        res.status(403).send("fejl")
    }

})

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start: ", error);
    }
    console.log("Server started on: ", port)
})
