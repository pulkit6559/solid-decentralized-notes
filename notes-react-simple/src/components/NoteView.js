import React, { Component } from "react";
import { Redirect } from "react-router";
import moment from "moment";
import nl2br from "react-newline-to-break";
const {
  getSolidDataset,
  getThing,
  deleteSolidDataset,
  getStringNoLocale,
  access,
} = require("@inrupt/solid-client");

import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
var axios = require("axios");

class NoteView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { redirect: false };

    this.deleteNote = this.deleteNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.revokeAccess = this.revokeAccess.bind(this);
    this.baseUrl = getDefaultSession().info.webId.substring(
      0,
      getDefaultSession().info.webId.indexOf("/profile/card#me")
    );
    this.username = this.baseUrl.substring(this.baseUrl.lastIndexOf("/") + 1);

    this.readAuthCode = this.readAuthCode.bind(this);

    console.log("#### baseurl = ", this.baseUrl);
    console.log("#### userName = ", this.username);
    this.readAuthCode()
      .then((ret) => {
        this.userAuth = ret;
        console.log(ret);
      })
      .catch((e) => {
        console.log("READING CODE ############# error");
        console.log(e);
      });
  }

  async readAuthCode() {
    let session = getDefaultSession();
    const code_url = this.baseUrl + "/notesAuth/code";

    let authCodeDataset = await getSolidDataset(code_url, {
      fetch: session.fetch,
    });

    let codeThing = getThing(authCodeDataset, code_url + "#code");

    let code = getStringNoLocale(codeThing, SCHEMA_INRUPT.accessCode);

    console.log("READING CODE ############# ", code);

    return code;
  }

  async deleteNoteAsync(note) {
    console.log("delete note ", note.title);
    let session = getDefaultSession();
    const notes_url = this.baseUrl + "/Notesdump/";

    const savedSolidDataset = await deleteSolidDataset(
      notes_url + note.title,
      { fetch: session.fetch } // fetch from authenticated Session
    );
  }

  deleteNote(event) {
    console.log("deleteNote");
    this.deleteNoteAsync(this.props.note)
      .then((ret) => {})
      .catch((e) => {
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
    // this.editNoteAsync(this.props.note);
  }

  async revokeAccessAsync() {
    let session = getDefaultSession();
    const notes_url = this.baseUrl + "/Notesdump/";
    await access.setAgentAccess(
      notes_url + this.props.note.title,
      'https://pod.inrupt.com/' + this.userWebId + '/profile/card#me',
      { read: false, write: false, append: false },
      { fetch: session.fetch }
    );
  }

  revokeAccess(event) {
    this.revokeAccessAsync()
      .then((ret) => {
        let note_ref = {
          user_card: this.baseUrl + "/profile/card#me",
          user_name: this.username,
          friendWebID: this.userWebId.value,
          noteURL: this.baseUrl + "/Notesdump/" + this.props.note.title,
          title: this.props.note.title,
          auth: this.userAuth,
        };

        if(this.userWebId.value=="public")
        {
          axios.post("http://localhost:4444/revokePublicAccess",note_ref)
        }
        else {
          // call the backend to remove reference of shared note
          axios
            .post("http://localhost:4444/revokeFriendAccess", note_ref)
            .then(() => console.log("note shared"))
            .catch((err) => {
              console.log(err);
            });
        }

        
        
        // call the backend to remove reference of shared note
        // axios
        //   .post("http://localhost:4444/revokeFriendAccess", note_ref)
        //   .then(() => console.log("note shared"))
        //   .catch((err) => {
        //     console.log(err);
        //   });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  renderFormattedDate() {
    return (
      "Last edited:" +
      moment(this.props.note.date).format("DD MMM YYYY [at] HH:mm")
    );
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
          <p className="text-center font-weight-light small text-muted">
            {this.renderFormattedDate()}
          </p>
          <p className="card-text">{nl2br(this.props.note.description)}</p>
          <button onClick={this.deleteNote} className="btn btn-danger">
            Delete Note
          </button>
          <button
            onClick={this.editNote}
            className="btn btn-success float-right"
          >
            Edit Note
          </button>

          <input
            className="form-control"
            ref={(userWebId) => (this.userWebId = userWebId)}
            defaultValue={this.props.note.userWebId}
            placeholder="enter user WebId"
          />
          <button onClick={this.revokeAccess} className="btn btn-danger">
            Revoke Access
          </button>
        </div>
      </div>
    );
  }
}

export default NoteView;
