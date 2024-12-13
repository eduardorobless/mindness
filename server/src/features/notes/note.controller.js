const Note = require('./note.model')



// Create a new Nodte

exports.createNote = async (req, res) => {
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
