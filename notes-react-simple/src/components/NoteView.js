import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import nl2br from 'react-newline-to-break';
const {
    getSolidDataset,
    getThing,
    setStringNoLocale,
    deleteSolidDataset,
    setThing,
    saveSolidDatasetAt,
    addStringNoLocale
} = require("@inrupt/solid-client");

import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';


class NoteView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { redirect: false };

        this.deleteNote = this.deleteNote.bind(this);
        this.editNote = this.editNote.bind(this);
    }

    async deleteNoteAsync(note) {
        console.log("delete note ", note.title);
        let session = getDefaultSession();
        const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/"

        const savedSolidDataset = await deleteSolidDataset(
            "https://pod.inrupt.com/pulkit/Notesdump/" + note.title,
            { fetch: session.fetch }             // fetch from authenticated Session
        );
    }

    deleteNote(event) {
        console.log('deleteNote');
        this.deleteNoteAsync(this.props.note).then(ret => {

        }).catch(e => {
            console.log(e);
        });
        this.props.deleteNote(this.props.note.id);
    }

    async editNoteAsync(note) {


        //this.deleteNoteAsync(this.props.note).then(ret => {

        //}).catch(e => {
        //    console.log(e);
        //});


    }

    editNote(event) {
        event.preventDefault();

        this.props.editNote(this.props.note.id);
        //this.editNoteAsync(this.props.note);
    }


    renderFormattedDate() {
        return 'Last edited:' + moment(this.props.note.date).format("DD MMM YYYY [at] HH:mm");
    }

    render() {
        if (this.state.redirect || !this.props.note) {
            return <Redirect to="/notes" />;
        }

        // if (this.state.redirect) {
        //     if (!this.props.note) {
        //         return <Redirect push to="/notes/"/>;
        //     }
        //     return <Redirect push to={`/note/${this.props.note.id}`}/>;
        //     // return <Redirect push to={`/notes/`}/>;
        // }

        return (
            <div className="card">
                <div className="card-header">
                    <h4>{this.props.note.title}</h4>
                </div>
                <div className="card-body">
                    <p className="text-center font-weight-light small text-muted">{this.renderFormattedDate()}</p>
                    <p className="card-text">{nl2br(this.props.note.description)}</p>
                    <button onClick={this.deleteNote} className="btn btn-danger">Delete Note</button>
                    <button onClick={this.editNote} className="btn btn-success float-right">Edit Note</button>
                </div>
            </div>
        )
    }
}

export default NoteView;