import React, { Component } from "react";
import moment from "moment";
import NoteForm from "../components/NoteForm";
import NoteView from "../components/NoteView";
import NotesListMenu from "../components/NotesListMenu";
var axios = require("axios");
import { Route, Link } from "react-router-dom";

const {
  getSolidDataset,
  getThingAll,
  getThing,
  getUrl,
  getStringNoLocale,
  getStringWithLocale,
  getStringByLocaleAll,
  getUrlAll,
} = require("@inrupt/solid-client");

const { FOAF, VCARD, RDF, SCHEMA_INRUPT } = require("@inrupt/vocab-common-rdf");

import {
  getDefaultSession,
  Session,
  getSessionFromStorage,
} from "@inrupt/solid-client-authn-browser";

async function format_request() {
  // const res = await axios.get('http://localhost:4444/readNote');

  let session = getDefaultSession();
  let baseUrl = getDefaultSession().info.webId.substring(
    0,
    getDefaultSession().info.webId.indexOf("/profile/card#me")
  );
  const notes_url = baseUrl + "/Notesdump/";
  const myDataset = await getSolidDataset(
    notes_url,
    { fetch: session.fetch } // fetch from authenticated session
  );

  let def = myDataset["graphs"]["default"];

  let result = {};
  let name_description = {};
  let dates = {};

  for (var key in def) {
    if (key == baseUrl + " /Notesdump/") {
      console.log("Skip");
    } else {
      try {
        console.log(key);
        let dataset = await getSolidDataset(
          key,
          { fetch: session.fetch } // fetch from authenticated session
        );
        let arr_ = key.split("/");
        let Name = arr_[arr_.length - 1];
        let thingName = key + "#" + Name;
        let normal_date = "2022-05-30T09:33:56.543Z";
        console.log("THING: ", thingName);

        let profile = getThing(dataset, thingName);
        console.log(profile);
        let date = getStringNoLocale(profile, SCHEMA_INRUPT.endDate);
        let description = getStringNoLocale(profile, SCHEMA_INRUPT.description);
        //let name = getStringNoLocale(profile, SCHEMA_INRUPT.name);
        console.log("****** ", Name, " ", description);
        result[key] = profile;
        name_description[Name] = description;
        if (date == null) {
          dates[Name] = normal_date;
        } else {
          dates[Name] = date;
        }
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }
  console.log("$$$$$$$$$$$$$$$$$$$: ", name_description);

  let res = name_description;
  let all_notes = [];
  let id = 1;

  let normal_date = "2022-05-30T09:33:56.543Z";
  for (var title in res) {
    all_notes.push({
      id: id,
      title: title,
      description: res[title],
      date: dates[title],
    });
    id = id + 1;
  }
  return all_notes;
}

async function public_note() {
  // const res = await axios.get('http://localhost:4444/readNote');

  let session = getDefaultSession();
  const notes_url = "https://pod.inrupt.com/leslie/publicSolidPodFile/";
  const myDataset = await getSolidDataset(
    notes_url,
    { fetch: session.fetch } // fetch from authenticated session
  );

  let def = myDataset["graphs"]["default"];

  let result = {};
  let name_description = {};
  let all_notes = [];
  let id = 1;

  for (var key in def) {
    if (key == "https://pod.inrupt.com/leslie/publicSolidPodFile/") {
      console.log("Skip");
    } else {
      // console.log(key);
      let dataset = await getSolidDataset(
        key,
        { fetch: session.fetch } // fetch from authenticated session
      );
      let arr_ = key.split("/");
      let Name = arr_[arr_.length - 1];
      let thingName = key + "#" + Name;
      // console.log("THING: ", thingName);
      try {
        let profile = getThing(dataset, thingName);
        // console.log(profile);
        let url = getStringNoLocale(profile, SCHEMA_INRUPT.text);
        let date = getStringNoLocale(profile, SCHEMA_INRUPT.endDate);
        let title = getStringNoLocale(profile, SCHEMA_INRUPT.description);
        let name = getStringNoLocale(profile, SCHEMA_INRUPT.name);
        // console.log(" ", url);

        let dataSet = undefined;
        try {
          dataSet = await getSolidDataset(
            url,
            { fetch: session.fetch } // fetch from authenticated session
          );
        } catch (e) {
          continue;
        }
        // console.log("get the data", dataSet);
        try {
          let normal_date = "2022-05-29T09:33:56.543Z";
          let arr_ = url.split("/");
          let Name = arr_[arr_.length - 1];
          let thingName = url + "#" + Name;

          let profile = getThing(dataSet, thingName);
          // console.log("thing", profile);
          let description = getStringNoLocale(
            profile,
            SCHEMA_INRUPT.description
          );
          let date = getStringNoLocale(profile, SCHEMA_INRUPT.endDate);
          // console.log("description", description);

          if (date == null) {
            date = normal_date;
          }

          all_notes.push({
            id: id,
            title: Name,
            description: description,
            date: date,
          });
          id += 1;
        } catch (e) {
          console.log("something is wrong");
          continue;
        }

        // console.log("shared note", myDataset);
        result[key] = profile;
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }
  // console.log("all_notes", all_notes);
  return all_notes;
}

async function friends_note() {
  let session = getDefaultSession();

  let baseUrl = getDefaultSession().info.webId.substring(
    0,
    getDefaultSession().info.webId.indexOf("/profile/card#me")
  );
  console.log("FRIENDS: ", baseUrl.split("/"))
  baseUrl = baseUrl.split("/");
  baseUrl = baseUrl[baseUrl.length - 1]

  let notes_url = "https://pod.inrupt.com/leslie/Users/"+baseUrl;
  let normal_date = "2022-05-31T09:33:56.543Z";

  console.log("READING SHARED NOTES")

  const myDataset = await getSolidDataset(
    notes_url,
    { fetch: session.fetch } // fetch from authenticated session
  );

  let def = myDataset["graphs"]["default"];

  console.log( myDataset["graphs"])

  let result = {};
  let name_description = {};
  let dates = {};

  for (var key in def) {
    if (key == notes_url) {
      console.log("Skip");
    } else {
      console.log(key);
      // let dataset = await getSolidDataset(
      //   key,
      //   { fetch: session.fetch } // fetch from authenticated session
      // );
      let arr_ = key.split("/");
      let Name = arr_[arr_.length - 1]; // name of shared reference pulkit_shared_omar_ref 
      let authorname = Name.split("_")[0];
      let noteName = Name.split("_").slice(1, -1).join("_")
      
      let thingName = "https://pod.inrupt.com/" + authorname + "/Notesdump/" + noteName + "#" + noteName;
      console.log("USERSHARE THING: ", thingName);




      try {

        let dataset = await getSolidDataset(
          "https://pod.inrupt.com/" + authorname + "/Notesdump/" + noteName,
          { fetch: session.fetch } // fetch from authenticated session
        );

        let profile = getThing(dataset, thingName);
        console.log("USERSHARE: ", profile);
        let description = getStringNoLocale(profile, SCHEMA_INRUPT.description);
        let date = getStringNoLocale(profile, SCHEMA_INRUPT.endDate);
        //let name = getStringNoLocale(profile, SCHEMA_INRUPT.name)
        console.log("****** ", Name, " ", description);
        result[key] = profile;
        name_description[authorname+"#"+noteName] = description;
        if (date == null) {
          dates[authorname+"#"+noteName] = normal_date;
        } else {
          dates[authorname+"#"+noteName] = date;
        }
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }
  console.log("$$$$$$$$$$$$$$$$$$$: ", name_description);

  let res = name_description;
  let friends_notes = [];
  let id = 1;

  for (var title in res) {
    friends_notes.push({
      id: id,
      title: title,
      description: res[title],
      date: dates[title],
    });
    id = id + 1;
  }
  return friends_notes;
}

class NotesApp extends Component {
  constructor(props) {
    super(props);

    let all_notes = [];
    let friend_notes = [];
    let public_notes = [];

    format_request()
      .then((ret) => {
        all_notes = ret;
        console.log(
          "Type of : localstorage",
          JSON.parse(localStorage.getItem("notes"))
        );
        console.log("Type of : all_notes", all_notes);
        this.setState({ notes: all_notes });
      })
      .catch((e) => {
        console.log(e);
      });

    friends_note()
      .then((ret) => {
        friend_notes = ret;
        console.log(
          "Type of : localstorage",
          JSON.parse(localStorage.getItem("notes"))
        );
        console.log("Type of : all_notes", friend_notes);
        this.setState({ friend_notes: friend_notes });
      })
      .catch((e) => {
        console.log(e);
      });

    public_note()
      .then((ret) => {
        public_notes = ret;
        console.log(
          "Type of : localstorage",
          JSON.parse(localStorage.getItem("notes"))
        );
        console.log("Type of : all_notes", public_notes);
        this.setState({ public_notes: public_notes });
      })
      .catch((e) => {
        console.log(e);
      });

    // let notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    let notes = [all_notes, friend_notes, public_notes];

    this.state = {
      notes: notes[0],
      friend_notes: notes[1],
      public_notes: notes[2],
      selectedNote: null,
      editMode: false,
      notetype: 'own'
    };

    this.getNotesNextId = this.getNotesNextId.bind(this);
    this.getfriendsNotesNextId = this.getfriendsNotesNextId.bind(this);
    this.addNote = this.addNote.bind(this);
    this.viewNote = this.viewNote.bind(this);
    this.viewNote_friendsnote = this.viewNote_friendsnote.bind(this);
    this.openEditNote = this.openEditNote.bind(this);
    this.saveEditedNote = this.saveEditedNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.viewNote_PublicNote = this.viewNote_PublicNote.bind(this);
  }

  getNotesNextId() {
    return this.state.notes.length > 0
      ? this.state.notes[this.state.notes.length - 1].id + 1
      : 0;
  }

  getfriendsNotesNextId() {
    return this.state.friend_notes.length > 0
      ? this.state.friend_notes[this.state.friend_notes.length - 1].id + 1
      : 0;
  }

  persistNotes(notes) {
    // localStorage.setItem('notes', JSON.stringify(notes));
    this.setState({ notes: notes });
  }

  addNote(note) {
    note.id = this.getNotesNextId();
    note.date = moment();
    const notes = this.state.notes;

    notes.push(note);

    this.persistNotes(notes);
    this.setState({ selectedNote: null, editMode: false });
  }

  viewNote(id) {
    const notePosition = this.state.notes.findIndex((n) => n.id === id);
    if (notePosition >= 0) {
      this.setState({
        selectedNote: this.state.notes[notePosition],
        editMode: false,
        notetype: 'own'
      });
    } else {
      console.warn("note with id " + id + " not found when trying to edit it");
    }
  }

  viewNote_friendsnote(id) {
    const notePosition = this.state.friend_notes.findIndex((n) => n.id == id);
    if (notePosition >= 0) {
      this.setState({
        selectedNote: this.state.friend_notes[notePosition],
        editMode: false,
        notetype: 'friend'
      });
    } else {
      console.warn("note with id " + id + " not found when trying to edit it");
    }
  }

  viewNote_PublicNote(id) {
    const notePosition = this.state.public_notes.findIndex((n) => n.id === id);
    if (notePosition >= 0) {
      this.setState({
        selectedNote: this.state.public_notes[notePosition],
        editMode: false,
        notetype: 'public'
      });
    } else {
      console.warn("note with id " + id + " not found when trying to edit it");
    }
  }

  openEditNote(id) {
    let notePosition = -1;
    if (this.state.notetype=='friend'){
      notePosition = this.state.friend_notes.findIndex((n) => n.id === id);
    } else {
      notePosition = this.state.notes.findIndex((n) => n.id === id);
    }
    if (notePosition >= 0) {
      if (this.state.notetype=='friend'){
        this.setState({
          selectedNote: this.state.friend_notes[notePosition],
          editMode: true,
        });
      } else {
        this.setState({
          selectedNote: this.state.notes[notePosition],
          editMode: true,
        });
      }
      // this.setState({
      //   selectedNote: this.state.notes[notePosition],
      //   editMode: true,
      // });
    } else {
      console.warn(
        "note with id " + id + " not found when trying to open for edit"
      );
    }
  }

  saveEditedNote(note) {
    const notes = this.state.notes;
    const notePosition = notes.findIndex((n) => n.id === note.id);

    if (notePosition >= 0) {
      note.date = moment();
      notes[notePosition] = note;
      this.persistNotes(notes);
    } else {
      console.warn(
        "note with id " +
          note.id +
          " not found when trying to save the edited note"
      );
    }
    this.setState({ selectedNote: note, editMode: false });
  }

  deleteNote(id) {
    const notes = this.state.notes;
    const notePosition = notes.findIndex((n) => n.id === id);
    if (notePosition >= 0) {
      if (window.confirm("Are you sure you want to delete this note?")) {
        notes.splice(notePosition, 1);
        this.persistNotes(notes);
        this.setState({ selectedNote: null, editMode: false });
      }
    } else {
      console.warn(
        "note with id " + id + " not found when trying to delete it"
      );
    }
  }

  getEmptyNote() {
    return {
      title: "",
      description: "",
    };
  }

  renderLeftMenu() {
    return (
      <div className="card">
        {this.renderHeader()}
        <div className="card-body">
          <NotesListMenu notes={this.state.notes} viewNote={this.viewNote} />
        </div>
      </div>
    );
  }

  renderHeader() {
    return (
      <div className="card-header">
        <Route
          exact
          path="/notes/note"
          render={(routeProps) => (
            <Link to="/notes">
              <button type="button" className="btn btn-danger">
                Close Add Note Form
              </button>
            </Link>
          )}
        />
        {["/notes", "/notes/note/:id"].map((path) => (
          <Route
            key={path}
            exact
            path={path}
            render={(routeProps) => (
              <Link to="/notes/note">
                <button type="button" className="btn btn-success">
                  Add Note
                </button>
              </Link>
            )}
          />
        ))}
      </div>
    );
  }

  renderRightMenu() {
    return (
      <div className="card">
        {this.renderFriendSharedNoteHeader()}
        <div className="card-body">
          <NotesListMenu
            notes={this.state.friend_notes}
            viewNote={this.viewNote_friendsnote}
          />
        </div>
      </div>
    );
  }

  renderPublicNotes() {
    return (
      <div className="card">
        {this.renderPublicNoteHeader()}
        <div className="card-body">
          <NotesListMenu
            notes={this.state.public_notes}
            viewNote={this.viewNote_PublicNote}
          />
        </div>
      </div>
    );
  }

  renderPublicNoteHeader() {
    return (
      <div className="card-header">
        <h5 class="card-title">Public Notes</h5>
      </div>
    );
  }

  renderFriendSharedNoteHeader() {
    return (
      <div className="card-header">
        <h5 class="card-title">Shared Notes by Friends</h5>
      </div>
    );
  }

  setMainAreaRoutes() {
    const editMode = this.state.editMode;
    return (
      <div>
        {editMode ? (
          <Route
            path="/notes/note/:id"
            render={(routeProps) => (
              <NoteForm
                persistNote={this.saveEditedNote}
                deleteNote={this.deleteNote}
                note={this.state.selectedNote}
              />
            )}
          />
        ) : (
          <Route
            path="/notes/note/:id"
            render={(routeProps) => (
              <NoteView
                editNote={this.openEditNote}
                deleteNote={this.deleteNote}
                note={this.state.selectedNote}
              />
            )}
          />
        )}
        <Route
          exact
          path="/notes/note"
          render={(routeProps) => (
            <NoteForm persistNote={this.addNote} note={this.getEmptyNote()} />
          )}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="notesApp container-fluid">
        <div className="row">
          <div className="col-md-3">{this.renderLeftMenu()}</div>

          <div className="col-md-3">{this.renderRightMenu()}</div>

          <div className="col-md-3">{this.renderPublicNotes()}</div>

          <div className="col-md-9">{this.setMainAreaRoutes()}</div>
        </div>
      </div>
    );
  }
}

export default NotesApp;
