// ! SERVER.JS

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const morgan = require("morgan")


// ? REQUIRE MODEL
const Moss = require('./models/moss')
const port = process.env.PORT || 3000
const app = express()
const path = require("path")
const session = require("express-session")
const authController = require("./controllers/auth.js")
const MongoStore = require("connect-mongo");

mongoose.connect(process.env.MONGODB_URI)

app.use(methodOverride("_method"))
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")))

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);

app.use(express.urlencoded({ extended: false}))

app.use("/auth", authController);

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
  });


app.get('/', (req, res) => {
    res.render('home.ejs', {
    })
})

app.get('/mosses', async (req, res) => {
    const allMoss = await Moss.find()
    res.render('index.ejs', {
        allMoss: allMoss
    })

})

app.get('/mosses/:id', async (req, res) => {
    const id = req.params.id
    const moss = await Moss.findById(id)

    res.render('show.ejs', {
        moss
    })
})


app.get('/post', (req, res) => {
    res.render('post.ejs', {
        user: req.session.user
    })
})

app.get('/users', async (req, res) => {
    res.render('users.ejs', {
        user: req.session.user
    })
})

app.use(express.json())

app.post('/mosses', async (req, res) => {
    try {
        if (!req.body.commonName.trim()) {
            throw new Error("'Common Name' cannot be empty!")
        }
        if (!req.body.latinName.trim()) {
            throw new Error("'Latin Name' cannot be empty!")
        }
        if (!req.body.division.trim()) {
            throw new Error("'Division' cannot be empty!")
        }
        if (!req.body.growthForm.trim()) {
            throw new Error("'Growth Form' cannot be empty!")
        }
        const newMoss = await Moss.create(req.body)
        res.redirect(`/mosses/${newMoss._id}`)
    } catch (err) {
        console.log(err.message)
        res.render('post.ejs', {
            errorMessage: err.message
        })
    }
})


app.delete('/mosses/:mossId', async (req, res) => {

    // ? DELETE USING MONGOOSE
    const deletedMoss = await Moss.findByIdAndDelete(req.params.mossId)

    // ? SEND
    res.redirect('/mosses/')

})

app.put('/mosses/:mossId', async (req, res) => {

    // ? ONE STEP
    // ! below: { new: true } will render updated element
    const updatedMoss = await Moss.findByIdAndUpdate(req.params.mossId, req.body, { new: true })
    

    res.redirect(`${req.params.mossId}`)
})


app.get('/mosses/:mossId/edit', async (req, res) => {
    const foundMoss = await Moss.findById(req.params.mossId)
    res.render('edit.ejs', {
        moss: foundMoss,
    })
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    
})