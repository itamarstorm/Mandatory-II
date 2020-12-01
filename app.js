const express = require("express")
const app = express()

const port  = process.env.PORT || 8080;

const fs = require('fs')

require("dotenv").config()

const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

const loggedInHeader = fs.readFileSync(__dirname +"/public/header/loggedinHeader.html").toString()
const header = fs.readFileSync(__dirname + "/public/header/header.html").toString()
const footer = fs.readFileSync(__dirname + "/public/footer/footer.html").toString()
const index = fs.readFileSync(__dirname + "/public/index/index.html").toString()
const authentication = fs.readFileSync(__dirname + "/public/secure/authentication.html")
const authorization = fs.readFileSync(__dirname + "/public/secure/authorization.html")

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const loginRoutes = require("./rotues/loginRoutes")
const sessionsRoutes = require("./rotues/sessionRoutes")
app.use(loginRoutes)
app.use(sessionsRoutes)

app.get("/", (req, res) => {
    if(req.session.loggedin){
        return res.send(loggedInHeader + index + footer)
    }else{
        return res.send(header + index + footer)
    }
})

app.get("/authorization", (req, res) => {
    console.log(req.session.loggedin)
    if(req.session.role === "admin") {
        res.send( loggedInHeader + authorization + footer)
    } else {
        res.status(403).sendFile(__dirname + "/public/unauthorized/unauthorized.html")
    }
})

app.get("/authentication", (req, res) => {
    if(req.session.role === "user" || req.session.role === "admin") {
        res.send( loggedInHeader + authentication + footer)
    } else {
        res.status(401).sendFile(__dirname + "/public/unauthorized/unauthorized.html")
    }
})

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start: ", error);
    }
    console.log("Server started on: ", port)
})
