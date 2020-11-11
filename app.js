const express = require("express")
const app = express()
require("dotenv").config()
const session = require('express-session');

const port  = process.env.PORT || 8080;

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
app.use(loginRoutes)

app.get("/", (req, res) => {
    return res.sendFile( __dirname + "/public/index" )
})

app.get("/secure", (req, res) => {
    console.log(req.session.loggedin)
    if(req.session.loggedin){
        res.send("logged in")
    }else{
        res.send("not logged in")
    }

})

app.listen(port, (error) => {
    if (error) {
        console.log("Server couldn't start: ", error);
    }
    console.log("Server started on: ", port)
})
