const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, rqeuired: true },
    createdAt: { type: Date, default: Date.now },
})


const Note = mongoose.model('Note', noteSchema);


module.exports = Note; 