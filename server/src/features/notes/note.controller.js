const Note = require('./note.model')
const { body, validationResult } = require('express-validator')

// Create a new Nodte

exports.createNote = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be string'),
    body('content').notEmpty().withMessage('Content is required').isString().withMessage('Content must be string')
], async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Fetch all notes 

exports.getNotes = async (req, res) => {
    try {

        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note note found" })
        }
        res.json(note)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}


exports.deleteNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        // attempt to dfind and delete note by ID
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' })
        }

        return res.status(200).json({ message: 'Note deleted successfully' })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', err })

    }
}


exports.updateNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updateNote = await Note.findByIdAndUpdate(id, updatedData, { new: true })

        if (!updateNote) {
            return res.status(404).json({ message: 'Note not found' })
        }

        return res.status(200).json(updateNote)
    } catch (err) {
        return res.status(500).json({ message: 'Server error', err })

    }
}