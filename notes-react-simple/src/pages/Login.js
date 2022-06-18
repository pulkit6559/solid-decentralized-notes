import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import NotesApp from './NotesApp';
import Home from './Home';
var axios = require('axios')

// import {Store, useGlobalState} from 'state-pool';

const {
    getSolidDataset,
    getThingAll,
    getThing,
    getUrl,
    getStringNoLocale,
    getStringWithLocale,
    getStringByLocaleAll,
    getUrlAll,
    createContainerAt,
    access,
    getResourceInfoWithAcl,
    saveSolidDatasetAt,
    createThing,
    buildThing,
    setThing,
    createSolidDataset,
  } = require("@inrupt/solid-client");

  const{
    FOAF,
    VCARD,
    RDF,
    SCHEMA_INRUPT
  }=require("@inrupt/vocab-common-rdf");



import { handleIncomingRedirect, login, fetch, getDefaultSession, Session, getSessionFromStorage } from '@inrupt/solid-client-authn-browser'

async function loginAndFetch() {
    // 1. Call the handleIncomingRedirect() function to complete the authentication process.
    //   If the page is being loaded after the redirect from the Solid Identity Provider
    //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
    //      the login process is complete. That is, a session is logged in 
    //      only after it handles the incoming redirect from the Solid Identity Provider.
    //   If the page is not being loaded after a redirect from the Solid Identity Provider, 
    //      nothing happens.
    await handleIncomingRedirect();
    const session = new Session();
    // window.session_var = session;
    // sessionStorage.setItem("session", session);
    // Store.setState("session", session);

  
    // 2. Start the Login Process if not already logged in.
    if (!getDefaultSession().info.isLoggedIn) {
      // The `login()` redirects the user to their identity provider;
      // i.e., moves the user away from the current page.
      await session.login({
        // Specify the URL of the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com" or "https://inrupt.net"
        oidcIssuer: "https://broker.pod.inrupt.com",
        // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
        // e.g., the current page for a single-page app.
        redirectUrl: window.location.href,
        // Pick an application name that will be shown when asked 
        // to approve the application's access to the requested data.
        clientName: "Demo app"
      });
    }
  }

async function create_auth_container(session){
  // create folder notes_auth or check if it exists
  // await createContainerAt("https://pod.inrupt.com/pulkit/notesAuth",
  // { fetch: session.fetch });
  // assign leslie write access

  let auth_url = "https://pod.inrupt.com/pulkit/notesAuth"

  let dataset = createSolidDataset();
  const code_thing = buildThing(createThing({ name: 'code'}))
  .addStringNoLocale(SCHEMA_INRUPT.accessCode, 'xxxx')
  .build();
  dataset = setThing(dataset, code_thing);
  const savedSolidDataset = await saveSolidDatasetAt(
    auth_url+"/code",
    dataset,
    { fetch: session.fetch }             // fetch from authenticated Session
  );

  await access.setAgentAccess(
    auth_url+"/code",
    "https://pod.inrupt.com/leslie/profile/card#me",
    { read: true, write:true, append:true },
    { fetch: session.fetch },
  );
  // let acl = await getResourceInfoWithAcl(
  //   "https://pod.inrupt.com/pulkit/notesAuth",
  //   { fetch: session.fetch },
  // )
  // return acl
  // send request to server to write code
} 

function get_auth_code(session){
  let web_id = session.info.webId
  console.log(session.info.webId)
  let user_data = {
    webID: web_id
  }

  axios
  .post('http://localhost:4444/writeUserAuth', user_data)
  .then(() => console.log('Auth code written'))
  .catch(err => {
    console.error(err);
  });
}

async function get_session () { 
    loginAndFetch();
    // let session = sessionStorage.getItem("session");
    let session = getDefaultSession();
    // let session = getSessionFromStorage(sessionID);
    return session;
};

export class LoginComponent extends Component {

  render() {
    // let session_f = 
    // navigate = useNavigate();

    if (!getDefaultSession().info.isLoggedIn) {
        get_session().then(session => {
            // got value here
            console.log(session);
        }).catch(e => {
            // error
            console.log(e);
        });

        create_auth_container(getDefaultSession()).then(session => {
          // got value here
          console.log(session)
          console.log("SUCCESS in creating empty auth folder")
        }).catch(e => {
          console.log(e);
          console.log('Auth folder exists')
        });

    }
    else{
        let session = getDefaultSession();
        console.log(session);
        create_auth_container(getDefaultSession()).then(session => {
          // got value here
          console.log(session)
          console.log("SUCCESS in creating empty auth folder")
        }).catch(e => {
          console.log(e);
          console.log('Auth folder exists')
        });
    }

    // make server write the code
    try{
      get_auth_code(getDefaultSession());
    } catch (error) {
      console.log(error)
    }

    return(
        <Redirect to="/home"/>
        // <Route path="/" component={Home}/>

    )
  }

}

export default LoginComponent;