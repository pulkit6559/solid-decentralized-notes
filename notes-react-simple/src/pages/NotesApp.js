import React, {Component} from 'react';
import moment from 'moment';
import NoteForm from '../components/NoteForm';
import NoteView from '../components/NoteView';
import NotesListMenu from '../components/NotesListMenu';
var axios = require('axios')
import {
    Route,
    Link
} from 'react-router-dom';

const {
    getSolidDataset,
    getThingAll,
    getThing,
    getUrl,
    getStringNoLocale,
    getStringWithLocale,
    getStringByLocaleAll,
    getUrlAll
  } = require("@inrupt/solid-client");

const{
FOAF,
VCARD,
RDF,
SCHEMA_INRUPT
}=require("@inrupt/vocab-common-rdf");

import {getDefaultSession, Session, getSessionFromStorage } from '@inrupt/solid-client-authn-browser'


async function format_request() {
    // const res = await axios.get('http://localhost:4444/readNote');
    
    let session = getDefaultSession();
    const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/"
    const myDataset = await getSolidDataset(
        notes_url,
        { fetch: session.fetch }          // fetch from authenticated session
    );


    let def = myDataset['graphs']['default'];

    let result = {};
    let name_description = {}

    for (var key in def) {
        if (key=="https://pod.inrupt.com/pulkit/Notesdump/"){
            console.log("Skip");
        }
        else{
            console.log(key);
            let dataset = await getSolidDataset(
            key,
            { fetch: session.fetch }          // fetch from authenticated session
            );
            let arr_ = key.split("/");
            let Name = arr_[arr_.length-1];
            let thingName = key+"#"+Name;
            console.log("THING: ", thingName);
            try {
            let profile = getThing(
                dataset,
                thingName
            );
            // console.log(profile);
            let description = getStringNoLocale(profile, SCHEMA_INRUPT.description);
            // let name = getStringNoLocale(profile, SCHEMA_INRUPT.name)
            console.log("****** ", Name, " ", description);
            result[key] = profile;
            name_description[Name] = description;
            }
            catch (e){
            console.log(e)
            continue;
            }
        }
    }
    console.log("$$$$$$$$$$$$$$$$$$$: ", name_description);
    
    let res = name_description;
    let all_notes = []
    let id = 1;

    for (var title in res){
        all_notes.push(
            {
                'id':id,
                'title':title,
                'description': res[title],
                'date': "2022-05-30T09:33:56.543Z"
            }
        )
        id = id + 1;
    }
    return all_notes
}

class NotesApp extends Component {
    constructor(props) {
        super(props);

        let all_notes = [];
        
        format_request().then(ret => {
            all_notes = ret;
            console.log("Type of : localstorage",JSON.parse(localStorage.getItem('notes')));
            console.log("Type of : all_notes", all_notes);
            this.setState({notes: all_notes})
        }).catch(e => {
            console.log(e);
        });
        
        // let notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
        let notes = all_notes;
        console.log(notes);
        this.state = {
            notes: notes,
            selectedNote: null,
            editMode: false
        };

        this.getNotesNextId = this.getNotesNextId.bind(this);
        this.addNote = this.addNote.bind(this);
        this.viewNote = this.viewNote.bind(this);
        this.openEditNote = this.openEditNote.bind(this);
        this.saveEditedNote = this.saveEditedNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }

    getNotesNextId() {
        return this.state.notes.length > 0 ? this.state.notes[this.state.notes.length - 1].id + 1 : 0;
    }

    persistNotes(notes) {
        // localStorage.setItem('notes', JSON.stringify(notes));
        this.setState({notes: notes});
    }

    addNote(note) {
        note.id = this.getNotesNextId();
        note.date = moment();
        const notes = this.state.notes;

        notes.push(note);

        this.persistNotes(notes);
        this.setState({selectedNote: null, editMode: false});
    }

    viewNote(id) {
        const notePosition = this.state.notes.findIndex((n) => n.id === id);
        if (notePosition >= 0) {
            this.setState({selectedNote: this.state.notes[notePosition], editMode: false});
        } else {
            console.warn('note with id ' + id + ' not found when trying to edit it');
        }
    }

    openEditNote(id) {
        const notePosition = this.state.notes.findIndex((n) => n.id === id);
        if (notePosition >= 0) {
            this.setState({selectedNote: this.state.notes[notePosition], editMode: true});
        } else {
            console.warn('note with id ' + id + ' not found when trying to open for edit');
        }
    }

    saveEditedNote(note) {
        const notes = this.state.notes;
        const notePosition = notes.findIndex((n)=> n.id === note.id);

        if (notePosition >= 0) {
            note.date = moment();
            notes[notePosition] = note;
            this.persistNotes(notes);
        } else {
            console.warn('note with id ' + note.id + ' not found when trying to save the edited note');
        }
        this.setState({selectedNote: note, editMode: false});
    }

    deleteNote(id) {
        const notes = this.state.notes;
        const notePosition = notes.findIndex((n)=> n.id === id);
        if (notePosition >= 0) {
            if (window.confirm('Are you sure you want to delete this note?')) {
                notes.splice(notePosition, 1);
                this.persistNotes(notes);
                this.setState({selectedNote: null, editMode: false});
            }
        } else {
            console.warn('note with id ' + id + ' not found when trying to delete it');
        }
    }

    getEmptyNote() {
        return {
            title: "",
            description: ""
        };
    }

    renderLeftMenu () {
        return (
            <div className="card">
                {this.renderHeader()}
                <div className="card-body">
                    <NotesListMenu notes={this.state.notes} viewNote={this.viewNote}/>
                </div>
            </div>
        )
    }

    renderHeader() {
        return (
            <div className="card-header">
                <Route exact path="/notes/note"
                       render={routeProps => <Link to="/notes"><button type="button" className="btn btn-danger">Close Add Note Form</button></Link>}/>
                {["/notes", "/notes/note/:id"].map(path =>
                        <Route key={path} exact path={path}
                               render={routeProps => <Link to="/notes/note"><button type="button" className="btn btn-success">Add Note</button></Link>}/>
                )}
            </div>
        )
    }

    setMainAreaRoutes() {
        const editMode = this.state.editMode;
        return (<div>
            {editMode ? (
                <Route  path="/notes/note/:id"
                       render={routeProps =>  <NoteForm persistNote={this.saveEditedNote} deleteNote={this.deleteNote} note={this.state.selectedNote}/>}
                    />
            ) : (
                <Route path="/notes/note/:id"
                       render={routeProps =>  <NoteView editNote={this.openEditNote} deleteNote={this.deleteNote} note={this.state.selectedNote}/>}
                    />
            )}
            <Route exact path="/notes/note"
                   render={routeProps =>  <NoteForm persistNote={this.addNote} note={this.getEmptyNote()}/>}
                />
        </div>)
    }

    render() {
        return (
            <div className="notesApp container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        {this.renderLeftMenu()}
                    </div>
                    <div className="col-md-9">
                        {this.setMainAreaRoutes()}
                    </div>
                </div>
            </div>
        );
    }
}

export default NotesApp;