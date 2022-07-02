import React, { Component } from "react";
import { Redirect } from "react-router";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

const {
  saveSolidDatasetAt,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
  getSolidDataset,
  getThing,
  getStringNoLocale,
  setStringNoLocale,
  access,
} = require("@inrupt/solid-client");

const { RDF, SCHEMA_INRUPT } = require("@inrupt/vocab-common-rdf");

var axios = require("axios");

const divStyle = {
  display: "none",
};

class NoteForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { redirect: false };
    this.baseUrl = getDefaultSession().info.webId.substring(
      0,
      getDefaultSession().info.webId.indexOf("/profile/card#me")
    );
    this.username = this.baseUrl.substring(this.baseUrl.lastIndexOf("/") + 1);

    this.saveNote = this.saveNote.bind(this);
    this.shareNote = this.shareNote.bind(this);
    this.readAuthCode = this.readAuthCode.bind(this);
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

  async addNote(note) {
    let session = getDefaultSession();
    const notes_url = this.baseUrl + "/Notesdump/";
    let courseSolidDataset = createSolidDataset();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    const newBookThing1 = buildThing(createThing({ name: note.title }))
      .addStringNoLocale(SCHEMA_INRUPT.name, "react generated note")
      .addStringNoLocale(SCHEMA_INRUPT.description, note.description)
      .addStringNoLocale(SCHEMA_INRUPT.text, note.description)
      .addStringNoLocale(SCHEMA_INRUPT.endDate, today)
      .addUrl(RDF.type, "https://schema.org/TextDigitalDocument")
      .build();

    courseSolidDataset = setThing(courseSolidDataset, newBookThing1);

    const savedSolidDataset = await saveSolidDatasetAt(
      this.baseUrl + "/Notesdump/" + note.title,
      courseSolidDataset,
      { fetch: session.fetch } // fetch from authenticated Session
    );
  }

  async shareWithFriend(note, friendWebID, friendName) {
    let session = getDefaultSession();
    await access.setAgentAccess(
      this.baseUrl + "/Notesdump/" + note.title,
      friendWebID,
      { read: true, write: false, append: false },
      { fetch: session.fetch }
    );

    let req_data = {
      user_card: this.baseUrl + "/profile/card#me",
      user_name: this.username,
      friend_card: friendWebID,
      friend_name: friendName,
      noteURL: this.baseUrl + "/Notesdump/" + note.title,
      title: note.title,
      auth: this.userAuth,
    };

    axios
      .post("http://localhost:4444/shareWithWebID", req_data)
      .then(() => console.log("note shared"))
      .catch((err) => {
        console.error(err);
      });
  }

  async edit_note(note) {
    let session = getDefaultSession();
    console.log("edit note ", this.props.note.title);
    let resourceURL = this.baseUrl + "/Notesdump/";
    let editedDataset = await getSolidDataset(
      resourceURL + this.props.note.title + "#" + this.props.note.title,
      { fetch: session.fetch }
    );
    console.log("EditedDataset is ", editedDataset);
    let editThing = getThing(
      editedDataset,
      resourceURL + this.props.note.title + "#" + this.props.note.title
    );
    console.log("EditThing is this", editThing);
    editThing = setStringNoLocale(
      editThing,
      SCHEMA_INRUPT.description,
      note.description
    );
    editedDataset = setThing(editedDataset, editThing);

    const savedSolidDataset = saveSolidDatasetAt(
      resourceURL + this.props.note.title,
      editedDataset,
      { fetch: session.fetch } // fetch from authenticated Session
    );
  }

  saveNote(event) {
    event.preventDefault();
    if (this.title.value === "") {
      alert("Title is needed");
    } else {
      this.id.value = this.id.value + 1;
      const note = {
        id: Number(this.id.value),
        title: this.title.value,
        userWebId: this.userWebId.value,
        description: this.description.value,
      };

      this.addNote(note)
        .then((ret) => {
          if (!(note.userWebId === "")) {
            console.log("SHARING WITH USER");
            this.shareWithFriend(
              note,
              "https://pod.inrupt.com/" + note.userWebId + "/profile/card#me",
              note.userWebId
            )
              .then((ret) => {})
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((e) => {
          this.edit_note(note);
        });

      // axios
      // .post('http://localhost:4444/reactNote', note)
      // .then(() => console.log('Book Created'))
      // .catch(err => {
      //   console.error(err);
      // });

      this.props.persistNote(note);
      this.setState({ redirect: true });
    }
  }

  async shareNoteAsync(note) {
    let session = getDefaultSession();
    const notes_url = this.baseUrl + "/Notesdump/";
    let courseSolidDataset = createSolidDataset();

    const newBookThing1 = buildThing(createThing({ name: note.title }))
      .addStringNoLocale(SCHEMA_INRUPT.name, "react generated note")
      .addStringNoLocale(SCHEMA_INRUPT.description, note.description)
      .addStringNoLocale(SCHEMA_INRUPT.text, note.description)
      .addUrl(RDF.type, "https://schema.org/TextDigitalDocument")
      .build();

    courseSolidDataset = setThing(courseSolidDataset, newBookThing1);

    const savedSolidDataset = await saveSolidDatasetAt(
      this.baseUrl + "/Notesdump/" + note.title,
      courseSolidDataset,
      { fetch: session.fetch } // fetch from authenticated Session
    );

    await access.setPublicAccess(
      this.baseUrl + "/Notesdump/" + note.title,
      { read: true, write: false, append: false },
      { fetch: session.fetch }
    );
  }

  shareNote(event) {
    event.preventDefault();
    if (this.title.value === "") {
      alert("Title is needed");
    } else {
      this.id.value = this.id.value + 1;
      const note = {
        id: Number(this.id.value),
        title: this.title.value,
        description: this.description.value,
      };

      this.shareNoteAsync(note)
        .then((ret) => {})
        .catch((e) => {
          console.log(e);
        });

      let note_ref = {
        user_card: this.baseUrl + "/profile/card#me",
        user_name: this.username,
        noteURL: this.baseUrl + "/Notesdump/" + note.title,
        title: note.title,
        auth: this.userAuth,
      };
      // call the backend to save reference to public note
      axios
        .post("http://localhost:4444/storetoPublicPod", note_ref)
        .then(() => console.log("node shared"))
        .catch((err) => {
          console.error(err);
        });
      this.props.persistNote(note);
    }
  }

  renderFormTitleAction() {
    return this.props.note.id !== undefined ? "Edit Note" : "Add Note";
  }

  renderFormButtons() {
    if (this.props.note.id !== undefined) {
      return (
        <div>
          {/* <button type="makePublic" className="btn btn-success float-right">Save Note (Public)</button> */}
          <button
            type="submit"
            onClick={this.saveNote}
            className="btn btn-success float-right"
          >
            Save Note
          </button>
          <button onClick={this.deleteNote} className="btn btn-danger">
            Delete Note
          </button>
        </div>
      );
    }
    return (
      <div>
        <button
          type="makePublic"
          onClick={this.shareNote}
          className="btn btn-success float-left"
        >
          Save Note (Public)
        </button>
        <button
          type="submit"
          onClick={this.saveNote}
          className="btn btn-success float-right"
        >
          Save Note
        </button>
      </div>
    );
  }

  render() {
    if (this.state.redirect) {
      if (!this.props.note) {
        return <Redirect exact to="/notes/" />;
      }

      return <Redirect to={`/home`} />;

      // return <Redirect push to={`/notes/`}/>;
    }
    return (
      <div className="card">
        <div className="card-header">{this.renderFormTitleAction()}</div>
        <div className="card-body">
          <form ref="noteForm" onSubmit={this.saveNote}>
            <div className="form-group">
              <p>
                <input
                  className="form-control"
                  style={divStyle}
                  disabled
                  ref={(id) => (this.id = id)}
                  defaultValue={this.props.note.id}
                />
              </p>

              <p>
                <input
                  className="form-control"
                  ref={(title) => (this.title = title)}
                  defaultValue={this.props.note.title}
                  placeholder="enter title"
                />
              </p>
              <p>
                <input
                  className="form-control"
                  ref={(userWebId) => (this.userWebId = userWebId)}
                  defaultValue={this.props.note.userWebId}
                  placeholder="enter user WebId"
                />
              </p>

              <p>
                <textarea
                  className="form-control"
                  rows="10"
                  ref={(description) => (this.description = description)}
                  defaultValue={this.props.note.description}
                  placeholder="enter description"
                />
              </p>
            </div>
            {this.renderFormButtons()}
          </form>
        </div>
      </div>
    );
  }
}

export default NoteForm;
