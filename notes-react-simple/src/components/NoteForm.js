import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {getDefaultSession} from '@inrupt/solid-client-authn-browser'

const{
    saveSolidDatasetAt,
    createThing,
    buildThing,
    setThing,
    createSolidDataset
}=require("@inrupt/solid-client");

const{
    RDF,
    SCHEMA_INRUPT
}=require("@inrupt/vocab-common-rdf");

var axios = require('axios')

const divStyle = {
    display: 'none'
};

class NoteForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {redirect: false};

        this.saveNote = this.saveNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.shareNote=this.shareNote.bind(this);
    }

    async addNote(note){
        let session = getDefaultSession();
        const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/"
        let courseSolidDataset = createSolidDataset();

        const newBookThing1 = buildThing(createThing({ name: note.title }))
            .addStringNoLocale(SCHEMA_INRUPT.name, "react generated note")
            .addStringNoLocale(SCHEMA_INRUPT.description, note.description)
            .addStringNoLocale(SCHEMA_INRUPT.text, note.description)
            .addUrl(RDF.type, "https://schema.org/TextDigitalDocument")
            .build();

        courseSolidDataset = setThing(courseSolidDataset, newBookThing1);

        const savedSolidDataset = await saveSolidDatasetAt(
            "https://pod.inrupt.com/pulkit/Notesdump/" + note.title,
            courseSolidDataset,
            { fetch: session.fetch }             // fetch from authenticated Session
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
                description: this.description.value
            }

            this.addNote(note).then(ret=>{

            }).catch(e => {
                console.log(e);
            });
            // axios
            // .post('http://localhost:4444/reactNote', note)
            // .then(() => console.log('Book Created'))
            // .catch(err => {
            //   console.error(err);
            // });

            this.props.persistNote(note);
            this.setState({redirect: true});
        }
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
          description: this.description.value
        }
        axios
          .post('http://localhost:4444/storetoPublicPod', note)
          .then(() => console.log('node shared'))
          .catch(err => {
            console.error(err);
          });
        this.props.persistNote(note);
      }
      this.saveNote(event);
    }

    deleteNote(event) {
        console.log('deleteNote');
        event.preventDefault();
        this.props.deleteNote(this.props.note.id);
    }

    renderFormTitleAction() {
        return (this.props.note.id !== undefined) ? "Edit Note" : "Add Note";
    }

    renderFormButtons() {
        if (this.props.note.id !== undefined) {
            return (<div>
                {/* <button type="makePublic" className="btn btn-success float-right">Save Note (Public)</button> */}
                <button type="submit" onClick={this.saveNote} className="btn btn-success float-right">Save Note</button>
                <button onClick={this.deleteNote} className="btn btn-danger">Delete Note</button>
            </div>);
        }
        return (
            <div>
              <button type="makePublic" onClick={this.shareNote} className="btn btn-success float-left">Save Note (Public)</button>
            <button type="submit" onClick={this.saveNote} className="btn btn-success float-right">Save Note</button>
            </div>
        );
    }

    render() {
        if (this.state.redirect) {
            if (!this.props.note) {
                return <Redirect exact to="/notes/"/>;
            }
            
            return <Redirect to={`/home`}/>;
            
            // return <Redirect push to={`/notes/`}/>;
        }
        return (
            <div className="card">
                <div className="card-header">
                    {this.renderFormTitleAction()}
                </div>
                <div className="card-body">

                    <form ref="noteForm" onSubmit={this.saveNote}>
                        <div className="form-group">
                            <p><input className="form-control" style={divStyle} disabled ref={id => this.id = id}
                                      defaultValue={this.props.note.id}/></p>

                            <p><input className="form-control" ref={title => this.title = title}
                                      defaultValue={this.props.note.title}
                                      placeholder="enter title"/></p>
                            <p><input className="form-control" ref={userWebId => this.userWebId = userWebId}
                                defaultValue={this.props.note.userWebId}
                                placeholder="enter user WebId"/></p>

                            <p><textarea className="form-control" rows="10"
                                         ref={description => this.description = description}
                                         defaultValue={this.props.note.description} placeholder="enter description"/>
                            </p>

                        </div>
                        {this.renderFormButtons()}
                    </form>
                </div>

            </div>
        )
    }
}

export default NoteForm;