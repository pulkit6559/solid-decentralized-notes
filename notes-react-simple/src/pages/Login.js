import React, { Component } from "react";
import { Redirect } from "react-router";

var axios = require("axios");

const {
  access,
  saveSolidDatasetAt,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
} = require("@inrupt/solid-client");

const { SCHEMA_INRUPT } = require("@inrupt/vocab-common-rdf");

import {
  handleIncomingRedirect,
  getDefaultSession,
  Session,
  fetch
} from "@inrupt/solid-client-authn-browser";

async function loginAndFetch() {
  // 1. Call the handleIncomingRedirect() function to complete the authentication process.
  //   If the page is being loaded after the redirect from the Solid Identity Provider
  //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
  //      the login process is complete. That is, a session is logged in
  //      only after it handles the incoming redirect from the Solid Identity Provider.
  //   If the page is not being loaded after a redirect from the Solid Identity Provider,
  //      nothing happens.
  await handleIncomingRedirect();
  let session = new Session();
  // window.session_var = session;
  // sessionStorage.setItem("session", session);
  // Store.setState("session", session);

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    // The `login()` redirects the user to their identity provider;
    // i.e., moves the user away from the current page.
    await session
      .login({
        // Specify the URL of the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com" or "https://inrupt.net"
        oidcIssuer: "https://broker.pod.inrupt.com",
        // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
        // e.g., the current page for a single-page app.
        redirectUrl: window.location.href,
        // Pick an application name that will be shown when asked
        // to approve the application's access to the requested data.
        clientName: "Demo app",
      })
      .then();
    
      console.log("Session 1: ", session)
  }
  else{
    session = getDefaultSession();
    console.log("Session 2: ", session)

  }

  return session;
}


async function save_auth(session, auth_url){

  let dataset = createSolidDataset();
    const code_thing = buildThing(createThing({ name: "code" }))
      .addStringNoLocale(SCHEMA_INRUPT.accessCode, "xxxx")
      .build();
    dataset = setThing(dataset, code_thing);
    const savedSolidDataset = await saveSolidDatasetAt(
      auth_url + "/code",
      dataset,
      { fetch: session.fetch } // fetch from authenticated Session
    );

}

async function set_access(session, auth_url){
  await access.setAgentAccess(
    auth_url + "/code",
    "https://pod.inrupt.com/leslie/profile/card#me",
    { read: true, write: true, append: true },
    { fetch: session.fetch }
  );
}

function create_auth_container(session) {
  // create folder notes_auth or check if it exists
  // await createContainerAt("https://pod.inrupt.com/pulkit/notesAuth",
  // { fetch: session.fetch });
  // assign leslie write access

  console.log("AUTH CONTAINER SESSION: ", session)
  // let INFO = "";
  // INFO = session.info;
  setTimeout(function(){
    // console.log("ZZZZZ INFO: ", INFO, INFO.webId)
    let baseUrl = session.info.webId.substring(
      0,
      session.info.webId.indexOf("/profile/card#me")
    );
    let auth_url = baseUrl + "/notesAuth";

    console.log("IN CREATE_AUTH_CONTAINER before adding folder")
    save_auth(session, auth_url).then(()=>{})
  
    set_access(session, auth_url).then(()=>{})
  }, 2000)

}

function get_auth_code(session_v) {
  let web_id = session_v.info.webId;
  console.log("IN GET_AUTH_CODE")
  console.log(session_v, session_v.info.webId);
  let user_data = {
    webID: web_id,
  };

  console.log(user_data);

  axios
    .post("http://localhost:4444/writeUserAuth", user_data)
    .then(() => console.log("Auth code written"))
    .catch((err) => {
      console.error(err);
    });
}

async function get_session() {
  let session = "";
  loginAndFetch().then((sess) => {session = sess});
  
  // let session = sessionStorage.getItem("session");
  // let session = getDefaultSession();
  // let session = getSessionFromStorage(sessionID);
  setTimeout(function(){
    console.log("GET_SESSION: ", session)
    return session;
  }, 3000)
  
}

export class LoginComponent extends Component {
  render() {
    // let session_f =
    // navigate = useNavigate();
    let main_session = {};

    if (!getDefaultSession().info.isLoggedIn) {
        get_session()
        .then((session) => {
          // got value here
          session = getDefaultSession();

          setTimeout(function(){
            console.log(session, "INITIAL");
          }, 2000)
        
          create_auth_container(session)
          // .then((session) => {
          //   // got value here
          //   console.log(session);
          //   console.log("SUCCESS in creating empty auth folder");
          //   // make server write the code
          //   // try {
          //   //   get_auth_code(main_session);
          //   // } catch (error) {
          //   //   console.log(error);
          //   // }
          // })
          // .catch((e) => {
          //   console.log(e);
          //   console.log("Auth folder exists");
          //   console.log(main_session, "Auth folder exists");
          //   // make server write the code
          //   // try {
          //   //   console.log('main session', main_session)
          //   //   get_auth_code(main_session);
          //   // } catch (error) {
          //   //   console.log(error);
          //   // }
          // });


          // try {
          //   get_auth_code(main_session);
          // } catch (error) {
          //   console.log(error);
          // }

        // })
        // .catch((e) => {
        //   // error
        //   console.log(e);
        // });
        })

    } else {
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
      try {
        get_auth_code(session);
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <Redirect to="/home" />
      // <Route path="/" component={Home}/>
    );
  }
}

export default LoginComponent;
