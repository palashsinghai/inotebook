import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:3000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)
    
    const getNote = async () => {
        
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token'),
            },
            // body: JSON.stringify({title, description, tag}), 
          });
          
        const json = await response.json()
        setNotes(json)
    }

    const addNote = async (title, description, tag) => {
        
        const response = await fetch(`${host}/api/notes/addNote`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token'),
            },
            body: JSON.stringify({title, description, tag}), 
          });
          const note = await response.json()
          console.log(response)
      
        setNotes(notes.concat(note))
    }
    const deleteNote = async (id) => {
        console.log("deleted" + id)

        const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token'),
          }
        });
        const json = await response.json();
        console.log(json)
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
    }
    const editNote = async (id, title, description ,tag) => {
        
        const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token'),
            },
            body: JSON.stringify({title, description, tag}), 
          });
          const json = await response.json(); 
          console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < notes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
              newNotes[index].title = title
              newNotes[index].description = description
              newNotes[index].tag = tag
                break
            }
            
        }
        setNotes(newNotes)
    }

    return (
        <noteContext.Provider value={{notes, addNote, deleteNote, editNote, getNote}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;