const mongoose = require('mongoose')

const arrhythmiasSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   
})

module.exports = mongoose.model('Arrhythmias', arrhythmiasSchema)