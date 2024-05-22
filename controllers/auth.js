// Express.route : handle different files with different requests
// Rather than having 1 big file with all endpoints, we should separate routes
// e.g. if it's 'auth' use 'X', if it's 'Mosses' use 'Y'

const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const bcrypt = require("bcrypt")


router.get("/sign-up", (req, res) => {
    res.render('auth/sign-up.ejs');
})


// ? Define a route

router.post("/sign-up", async (req, res) => {
    // user will send:
    // username, passsword & password confirmation
    // - check for unique username
    const userInDatabase = await User.findOne( { username: req.body.username });
    if(userInDatabase) {
        return res.send("Username already taken.")
    }
    // - check is password and confirmation are the same
    if(req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords do not match.")
    }
    // - password validation (x chars long, special symbol, etc.)
    
    // ! REGEXP for at least one Uppercase
    const hasUpperCase = /[A-Z]/.test(req.body.password);
    if(!hasUpperCase) {
        return res.send("Password must contain at least one uppercase letter.")
    }
    if(req.body.password.length < 8) {
        return res.send("Password must be at leasts 8 characters long.")
    }

    // ? USE BCRYPT -- the number 10 is the 'SALTING'
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    
    req.body.password = hashedPassword;

    const user = await User.create(req.body)

    res.redirect('/')

})


router.get('/sign-in', (req, res) => {
    res.render("auth/sign-in.ejs")
})


router.post("/sign-in", async (req, res) => {
    
    // User will send username and password

    // Check for existing user
    const userInDatabase = await User.findOne({ username: req.body.username });
    // If user doesn't exist, send generic failure message
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.")
    }
    // The user exists in our DB, check password against stored hash
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)

    if(!validPassword) {
        return res.send("Login failed. Please try again.")
    }

    req.session.user = {
        username: userInDatabase.username,
        userId: userInDatabase._id
    }

    res.redirect('/')
})

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})





module.exports = router; // we need to import into server.js