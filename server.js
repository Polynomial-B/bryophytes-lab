// ! SERVER.JS

require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const morgan = require("morgan")


// ? REQUIRE MODEL
const Moss = require('./models/moss')
const port = 3000
const app = express()
const path = require("path");


app.use(methodOverride("_method"));
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.MONGODB_URI)


app.use(express.static(path.join(__dirname, "public")));



// * PAGE RENDER -----------------------------------------

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/mosses', async (req, res) => {
    const allMoss = await Moss.find()
    res.render('index.ejs', {
        allMoss: allMoss,
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
    res.render('post.ejs')
})


app.get('/mosses/:id/edit', async (req, res) => {
    const id = req.params.id
    const moss = await Moss.findById(id)

    res.render(id/'edit.ejs', {
        moss
    })
})







app.use(express.json())

// * ----------------------------------------------------
app.use(express.urlencoded({ extended: false}))
// * ----------------------------------------------------


// ! POST USING FORM

app.post('/mosses', async (req, res) => {

    // ? CREATE USING MONGOOSE
    const newMoss = await Moss.create(req.body)

    res.redirect(`/mosses/${newMoss._id}`)


})


app.delete('/mosses/:mossId', async (req, res) => {

    // ? DELETE USING MONGOOSE
    const deletedMoss = await Moss.findByIdAndDelete(req.params.mossId)

    // ? SEND
    res.redirect('/mosses/')

})


app.put('/mosses/:mossId', async (req, res) => {

    // ? ONE STEP
    // ! below.. NEW: TRUE will render updated element
    const updatedMoss = await Moss.findByIdAndUpdate(req.params.mossId, req.body, { new: true })

    res.send(updatedMoss)
})


app.get('mosses/:mossId/edit', async (req, res) => {
    const foundMoss = await Moss.findById(req.params.mossId)
    res.render('/edit/', {
        moss: foundMoss,
    })
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    
})