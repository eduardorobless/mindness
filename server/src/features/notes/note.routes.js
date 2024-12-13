const express = require('express');
const router = express.Router();

const noteController = require('./note.controller')



// Define routes 
router.post('/', noteController.createNote)
router.get('/', noteController.getNotes)
router.get('/:id', noteController.getNoteById)
router.delete('/:id', noteController.deleteNoteById)


module.exports = router;
