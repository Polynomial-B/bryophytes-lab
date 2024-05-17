// ! SCHEMA GOES HERE

const mongoose = require('mongoose')

const mossSchema = new mongoose.Schema({
    
    commonName: { type: String, required: true },
    latinName: { type: String, required: true },
    division: { type: String, required: true },
    growthForm: { type: String, required: true },
    image: { type: String, required: false },

})

module.exports = mongoose.model('Moss', mossSchema)