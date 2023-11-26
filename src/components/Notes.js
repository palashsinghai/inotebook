import React, { useContext, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from '../context/notes/noteContext'
import { AddNote } from './AddNote'
import { NoteItem } from './NoteItem'
export const Notes = (props) => {
  let navigate = useNavigate()
  const [note, setNote] = useState({id: "", etitle: "", edescription: "", etag: ""})
  const context = useContext(noteContext)
  const { notes, getNote, editNote } = context
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNote()
    }
    else{
      navigate("/login")
    }
    
  })
  const ref = useRef(null)
  const refClose = useRef(null)
  const updateNote = (currentNote) => {
    ref.current.click()
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
    
  }
  const handleclick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click()
    props.showAlert("Updated Successfully", "success")
}

const onchange = (e) => {
    setNote({...note, [e.target.name]: e.target.value})
}
  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} aria-describedby="emailHelp" onChange={onchange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onchange} minLength={5} required/>
        </div>
        <div className="mb-3">
        <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onchange}/>
        </div>
        
      </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleclick}>Update Changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className='row my-3'>
        <h1>Your Notes</h1>
        <div className="container">
        {notes.length === 0 && 'No Notes to display'}
        </div>
        {notes.map((note) => { return <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} /> })}
      </div>
    </>
  )
}
