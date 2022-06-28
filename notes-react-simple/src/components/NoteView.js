import React, { Component } from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';
import nl2br from 'react-newline-to-break';

import { getDefaultSession } from '@inrupt/solid-client-authn-browser'

const {
    deleteSolidDataset,
    getSolidDataset,
    getThing,
    getStringNoLocale,
    access
} = require("@inrupt/solid-client");

const {
    RDF,
    SCHEMA_INRUPT
} = require("@inrupt/vocab-common-rdf");

var axios = require('axios')


class NoteView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { redirect: false };

        this.deleteNote = this.deleteNote.bind(this);
        this.editNote = this.editNote.bind(this);
        this.revokeAccess = this.revokeAccess.bind(this);

        this.readAuthCode = this.readAuthCode.bind(this);
        this.readAuthCode().then(ret => {
            this.userAuth = ret
            console.log(ret)
        }).catch(e => {
            console.log("READING CODE ############# error")
            console.log(e);
        });
    }

    async readAuthCode() {
        let session = getDefaultSession();
        const code_url = "https://pod.inrupt.com/pulkit/notesAuth/code"

        let authCodeDataset = await getSolidDataset(
            code_url,
            { fetch: session.fetch }
          );

          let codeThing = getThing(
            authCodeDataset,
            code_url + "#code"
        );

        let code = getStringNoLocale(codeThing, SCHEMA_INRUPT.accessCode);

        console.log("READING CODE ############# ", code)

        return code
    }


    async deleteNoteAsync(note) {
        console.log("delte note ", note.title);
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
        console.log("edit note ", this.props.note.title);
        this.deleteNoteAsync(this.props.note).then(ret => {

        }).catch(e => {
            console.log(e);
        });
    }

    editNote(event) {
        event.preventDefault();

        this.props.editNote(this.props.note.id);
        this.editNoteAsync(this.props.note);
    }

    async revokeAccessAsync(){
        let session = getDefaultSession();
        const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/"
        await access.setAgentAccess(
            notes_url + this.props.note.title,
            'https://pod.inrupt.com/' + this.userWebId + '/profile/card#me',
            { read: false, write: false, append: false },
            { fetch: session.fetch },
        );

    }

    revokeAccess(event){
        event.preventDefault();
        this.revokeAccessAsync().then(ret => {
            let note_ref = {
                user_card: "https://pod.inrupt.com/pulkit/profile/card#me",
                user_name: "pulkit",
                friendWebID: this.userWebId.value,
                noteURL: "https://pod.inrupt.com/pulkit/Notesdump/" + this.props.note.title,
                title: this.props.note.title,
                auth: this.userAuth
            }
    
            // call the backend to remove reference of shared note
            axios
                .post('http://localhost:4444/revokeFriendAccess', note_ref)
                .then(() => console.log('note shared'))
                .catch(err => {
                    console.log(err);
                });
            
        }).catch(e => {
            console.log(e);
        });

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

                    <input className="form-control" ref={userWebId => this.userWebId = userWebId}
                                defaultValue={this.props.note.userWebId}
                                placeholder="enter user WebId" />
                    <button onClick={this.revokeAccess} className="btn btn-danger">Revoke Access</button>
                </div>
            </div>
        )
    }
}

export default NoteView;