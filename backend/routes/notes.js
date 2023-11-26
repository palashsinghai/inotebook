const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator')

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try{    
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.post('/addNote', fetchUser, [
    body('title', 'Enter a valid title').isLength({min:3}),
    body('description', 'Description must be atleast 5 characters').isLength({min: 5})
],async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const{title, description, tag} = req.body
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.put('/updateNote/:id', fetchUser ,async (req, res) => {
    try{
        const {title, description, tag} = req.body
        const newNote = {}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}

        let note = await Notes.findById(req.params.id)
        if(!note){res.status(404).send("Not Found")}
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note})
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

router.delete('/deleteNote/:id', fetchUser ,async (req, res) => {
        try{
            
            let note = await Notes.findById(req.params.id)
            if(!note){res.status(404).send("Not Found")}
            if(note.user.toString() !== req.user.id){
                return res.status(401).send("Not Allowed")
            }
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({"Success": "Note has been deleted"})
        }
        catch(error){
            console.error(error.message)
        res.status(500).send("Internal server error")
        }
})

module.exports = router