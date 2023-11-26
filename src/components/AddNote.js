import React, {useContext} from 'react'
import { useState } from 'react'
import noteContext from '../context/notes/noteContext'

export const AddNote = (props) => {
    const context = useContext(noteContext)
    const {addNote} = context
    const [note, setNote] = useState({title: "", description: "", tag: ""})
    const handleClick = (e) => {
        e.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({title: "", description: "", tag: ""})
        props.showAlert("Note Added Successfully", "success")
    }

    const onchange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
    <div>
        <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" value={note.title} className="form-control" id="title" name='title' aria-describedby="emailHelp" onChange={onchange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" value={note.description} className="form-control" id="description" name='description' onChange={onchange} minLength={5} required/>
        </div>
        <div className="mb-3">
        <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" value={note.tag} className="form-control" id="tag" name='tag' onChange={onchange}/>
        </div>
        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
      </form>
    </div>
  )
}
