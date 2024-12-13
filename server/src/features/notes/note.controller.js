const Note = require('./note.model')
const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose');

// Create a new Nodte

exports.createNote = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be string'),
    body('content').notEmpty().withMessage('Content is required').isString().withMessage('Content must be string'),

    async (req, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Note(req.body);

        try {
            await note.save();
            res.status(201).json(note);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
]

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
    const { id } = req.params
    // validate if the id is a valid ObjectId 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid note ID format' })
    }


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

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid note ID format' })
    }

    try {
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


exports.updateNoteById = [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('content').optional().isString().withMessage('Content must be a string'),
    body().custom((value, { req }) => {
        console.log('a')
        if (!req.body.title && !req.body.content) {

            return Promise.reject({
                errors: [
                    {
                        msg: 'At least one field (title or content) must be provided',
                        param: 'title or content',
                        location: 'body'
                    }
                ]
            })
        }
        return true;
    }),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        const { id } = req.params;
        const updatedData = req.body;

        console.log(id)
        try {
            const updateNote = await Note.findByIdAndUpdate(id, updatedData, { new: true })

            if (!updateNote) {
                return res.status(404).json({ message: 'Note not found' })
            }

            return res.status(200).json(updateNote)
        } catch (err) {
            return res.status(500).json({ message: 'Server error', err })

        }
    }
]