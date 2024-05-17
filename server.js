// ! SERVER.JS

require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
// ? REQUIRE MODEL
const Moss = require('./models/moss')
const port = 3000
const app = express()
const path = require("path");




mongoose.connect(process.env.MONGODB_URI)


app.use(express.static(path.join(__dirname, "public")));



// * PAGE RENDER ---------------------------------

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


app.use(express.json())

// * ---------------------------------------------
app.use(express.urlencoded({ extended: false}))
// * ---------------------------------------------


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
    res.send(deletedMoss)

})


app.put('/mosses/:mossId', async (req, res) => {

    // ? ONE STEP
    // ! < -- NEW: TRUE will render updated element in Postman
    const updatedMoss = await Moss.findByIdAndUpdate(req.params.mossId, req.body, { new: true })

    res.send(updatedMoss)
})




app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    
})