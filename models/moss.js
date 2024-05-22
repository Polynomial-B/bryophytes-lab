// ! SCHEMA GOES HERE

const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    reviewer: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
}, {timestamps: true})


const mossSchema = new mongoose.Schema({
    
    commonName: { type: String, required: true, unique: true, trim: true },
    latinName: { type: String, required: true, unique: true, trim: true },
    division: { type: String, required: true, unique: false, trim: true },
    growthForm: { type: String, required: true, unique: false, trim: true },
    image: { type: String, required: false, unique: false, trim: true },
    creator: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    reviews: [reviewSchema],

})

module.exports = mongoose.model('Moss', mossSchema)