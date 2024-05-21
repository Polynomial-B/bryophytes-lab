// ! SCHEMA GOES HERE

const mongoose = require('mongoose')

const mossSchema = new mongoose.Schema({
    
    commonName: { type: String, required: true, unique: true, trim: true },
    latinName: { type: String, required: true, unique: true, trim: true },
    division: { type: String, required: true, unique: false, trim: true },
    growthForm: { type: String, required: true, unique: false, trim: true },
    image: { type: String, required: false, unique: false, trim: true },

})

module.exports = mongoose.model('Moss', mossSchema)