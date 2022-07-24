const {
  getSolidDataset,
  getThingAll,
  getThing,
  getUrl,
  getStringNoLocale,
  getStringWithLocale,
  getStringByLocaleAll,
  setStringNoLocale,
  getUrlAll
} = require("@inrupt/solid-client");

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('config/app.properties');

const express = require('express');
const cookieSession = require("cookie-session");

const {
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session
} = require("@inrupt/solid-client-authn-node");
const{
  saveSolidDatasetAt,
  createThing,
  buildThing,
  setThing,
  createSolidDataset,
  deleteSolidDataset,
  access
}=require("@inrupt/solid-client");
const{
  FOAF,
  VCARD,
  RDF,
  SCHEMA_INRUPT
}=require("@inrupt/vocab-common-rdf");
var app = express();
app.use(express.logger());

var cors = require('cors');
const { graph } = require('rdflib');
app.use(cors());


app.use(express.urlencoded())
app.use(express.json())

app.use(
  cookieSession({
    name: "session",
    // These keys are required by cookie-session to sign the cookies.
    keys: [
      "Required, but value not relevant for this demo - key1",
      "Required, but value not relevant for this demo - key2",
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: false
  })
);

app.locals.accesCodes = [];
app.locals.userCodeStore = {};


app.get('/', async function(req, res)
{
  // if( session.isLoggedIn ) { response.send('Hello World!');}
  // else {response.send('No World!');}
  const session = new Session();
  req.session.sessionId = session.info.sessionId;
  const redirectToSolidIdentityProvider = (url) => {
    // Since we use Express in this example, we can call `res.redirect` to send the user to the
    // given URL, but the specific method of redirection depend on your app's particular setup.
    // For example, if you are writing a command line app, this might simply display a prompt for
    // the user to visit the given URL in their browser.
    res.redirect(url);
    // res.redirect(url);
  };
  // 2. Start the login process; redirect handler will handle sending the user to their
  //    Solid Identity Provider.
  await session.login({
    // After login, the Solid Identity Provider will send the user back to the following
    // URL, with the data necessary to complete the authentication process
    // appended as query parameters:
    redirectUrl: `http://localhost:${properties.get("port")}/afterLogin`,
    // Set to the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com"
    oidcIssuer: "https://broker.pod.inrupt.com",
    // Pick an application name that will be shown when asked
    // to approve the application's access to the requested data.
    clientName: "Demo app",
    handleRedirect: redirectToSolidIdentityProvider,
  });

});
var port = process.env.PORT || properties.get("port");
app.get("/afterLogin", async (req, res) => {
  // 3. If the user is sent back to the `redirectUrl` provided in step 2,
  //    it means that the login has been initiated and can be completed. In
  //    particular, initiating the login stores the session in storage,
  //    which means it can be retrieved as follows.

  // 4. With your session back from storage, you are now able to
  //    complete the login process using the data appended to it as query
  //    parameters in req.url by the Solid Identity Provider:
  const session = await getSessionFromStorage(req.session.sessionId);
  await session.handleIncomingRedirect(`http://localhost:${port}${req.url}`);
  app.locals.session = session;


  // courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
  // const savedSolidDataset = await saveSolidDatasetAt(
  //   "https://pod.inrupt.com/pulkit/public/newNote7",
  //   courseSolidDataset,
  //   { fetch: fetch }             // fetch from authenticated Session
  // );


  // 5. `session` now contains an authenticated Session instance.
  if (session.info.isLoggedIn) {
    res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
    // res.redirect("http://localhost:3000/");
  }
  else{
    // res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
    res.redirect("SESSION AUTH FAILED");
  }
});


app.post("/revokePublicAccess",async (req,res)=>
{
    console.log(req.body)
   const note_ref_url="https://pod.inrupt.com/leslie/publicSolidPodFile/"+req.body.title;
  const session = app.locals.session;
  const savedSolidDataset = await deleteSolidDataset(
    note_ref_url,
    { fetch: session.fetch }
  );
})


app.post("/storetoPublicPod", async (req, res) => {

  // verify the user
  console.log(req.body.user_card, app.locals.userCodeStore[req.body.user_name])
  if (app.locals.userCodeStore[req.body.user_card] == req.body.auth){
    console.log("Request Authenticated for user: ", req.body.user_name)
  }
  else{
    console.log("Not authenticated")
    return res.status(400).send({
      message: 'Invalid Auth Code!'
   });
  }

  const session = app.locals.session;
  let courseSolidDataset = createSolidDataset();
  //req tansfer the name of the file and its id. the prefix should be decided accourding to different user
  const newBookThing1 = buildThing(createThing({ name: req.body.title }))
    .addStringNoLocale(SCHEMA_INRUPT.text, "https://pod.inrupt.com/pulkit/Notesdump/" + req.body.title)
    .build();

  courseSolidDataset = setThing(courseSolidDataset, newBookThing1);

  const savedSolidDataset = await saveSolidDatasetAt(
    "https://pod.inrupt.com/leslie/publicSolidPodFile/" + req.body.title,
    courseSolidDataset,
    { fetch: session.fetch }             // fetch from authenticated Session
  );


  // add read access to everyone
  await access.setPublicAccess(
    "https://pod.inrupt.com/leslie/publicSolidPodFile/" + req.body.title,
    { read: true, write:false, append:false },
    { fetch: session.fetch },
  );

  // add write access to note owner
  await access.setAccessFor(
    "https://pod.inrupt.com/leslie/publicSolidPodFile/" + req.body.title,
    "agent",
    { read: true, write:true, append:false },
    req.body.user_card,
    { fetch: session.fetch },
  );
  
  console.log("Here! Done ")
  res.send(`store data to solidpublicpod`);
});



app.post("/shareWithWebID", async (req, res) => {

  // verify the user
  if (app.locals.userCodeStore[req.body.user_card] == req.body.auth){
    console.log("Request Authenticated for user: ", req.body.user_name)
  }
  else{
    console.log("Not authenticated")
    return res.status(400).send({
      message: 'Invalid Auth Code!'
    });
  }

  const session = app.locals.session;
  console.log("SHARING: ", req.body)

  // ************** this call should be moved to frontend *****************
  // set access of the note 'test' as 'write' for leslie's webID (need user's session)
  // await access.setAgentAccess(
  //   "https://pod.inrupt.com/pulkit/Notesdump/" + 'test',
  //   'https://pod.inrupt.com/leslie/profile/card#me',
  //   { read: true, write:true, append:false },
  //   { fetch: session.fetch },
  // );
  let courseSolidDataset = createSolidDataset();

  // ********* the URL of note should be provided in the request of this endpoint *********
  //  create thing object AppPod/Leslie/author_test_ref with URL of note
  const newBookThing1 = buildThing(createThing({ name: req.body.user_name + "_" + req.body.title+"_ref" }))
  .addStringNoLocale(SCHEMA_INRUPT.text, req.body.noteURL)
  .build();
  courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
  const savedSolidDataset = await saveSolidDatasetAt(
    "https://pod.inrupt.com/leslie/Users/" + req.body.friend_name + "/" + req.body.user_name + "_" + req.body.title+"_ref",
    courseSolidDataset,
    { fetch: session.fetch }             // fetch from authenticated Session
  );

  console.log("https://pod.inrupt.com/leslie/Users/" + req.body.friend_name + "/" + req.body.user_name + "_" + req.body.title+"_ref")
  // ****************** need AppPod's session here ********************
  // set access of AppPod/Users/Leslie/author_test_ref as 'read' 
  // for leslie and 'write' for  pulkit (need AppPod's session)

  await access.setAgentAccess(
    "https://pod.inrupt.com/leslie/Users/" + req.body.friend_name + "/" + req.body.user_name + "_" +req.body.title+"_ref",
    req.body.user_card,
    { read: true, write:true, append:true },
    { fetch: session.fetch },
  );
  console.log("SHARING COMPLETE")

  res.send("Added access to file for leslie")
});

app.post("/revokeFriendAccess", async (req, res) => {

  // verify the user
  if (app.locals.userCodeStore[req.body.user_card] == req.body.auth){
    console.log("Request Authenticated for user: ", req.body.user_name)
  }
  else{
    console.log("Not authenticated")
    return res.status(400).send({
      message: 'Invalid Auth Code!'
    });
  }

  note_data = req.body;

  const session = app.locals.session;

  let reference_title = note_data.user_name + '_' + note_data.title + '_ref';

  const note_ref_url = "https://pod.inrupt.com/leslie/Users/" + 
                        note_data.friendWebID + "/" + reference_title;
  

  let sharedNoteDataset = await getSolidDataset(
      note_ref_url,
      { fetch: session.fetch }
    );

  let sharedNoteThing = getThing(
    sharedNoteDataset,
    note_ref_url + "#" + reference_title
  );

  let noteURL = getStringNoLocale(sharedNoteThing, SCHEMA_INRUPT.text);

  if (noteURL.includes(note_data.user_name)){
    const savedSolidDataset = await deleteSolidDataset(
      note_ref_url,
      { fetch: session.fetch }       
    );
    console.log("Reference succesfully deleted")
  }
  else{
    console.log("The reference does not belong to the current user")
  }

})


// this reads the content of the note
app.get("/readNote", async (req, res) => {
  console.log("Here, I'm trying to read!");
  const session = app.locals.session;
  const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/"
  const myDataset = await getSolidDataset(
      notes_url,
      { fetch: session.fetch }          // fetch from authenticated session
    );
  

  let def = myDataset['graphs']['default'];

  let result = {};
  name_description = {}

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
      thingName = key+"#"+Name;
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
        continue;
      }
    }
  }

  res.send(name_description);
  console.log("Done reading_3");
});

function getUniqueAccessCode(){
  var numStr = 0
  while (true){
    var num = Math.floor(Math.random() * 1000) + 9999
    numStr = num.toString()
    if (!app.locals.accesCodes.includes(numStr)){
      break
    }
  }

  return numStr
}

function updateUserCode(webID, code){
  app.locals.userCodeStore[webID] = code
  app.locals.accesCodes.push(code)
}

app.post("/writeUserAuth", async (req, res) => {
    const session = app.locals.session;

    let webID = req.body.webID;
    console.log(req.body, webID)
    
    let pod_url = webID.replace("/profile/card#me", "");
    let auth_url = pod_url + '/notesAuth';
    let resourceURL = auth_url+'/code';

    let authCodeDataset = await getSolidDataset(
      resourceURL,
      { fetch: session.fetch }
    );
    
    console.log(authCodeDataset);
    
    let accCode = getUniqueAccessCode();
    updateUserCode(webID, accCode)
    console.log("USER CODES: ", app.locals.userCodeStore)
    let authThing = getThing(authCodeDataset, resourceURL + '#code');
    authThing = setStringNoLocale(authThing, SCHEMA_INRUPT.accessCode, accCode);
    authCodeDataset = setThing(authCodeDataset, authThing);

    const savedSolidDataset = await saveSolidDatasetAt(
      resourceURL,
      authCodeDataset,
      { fetch: session.fetch }             // fetch from authenticated Session
    );

    // let dataset = createSolidDataset();

    // const code_thing = buildThing(createThing({ name: req.body.user_name + "_" + req.body.title+"_ref" }))
    // .addStringNoLocale(SCHEMA_INRUPT.accessCode, '4444')
    // .build();
    // dataset = setThing(dataset, code_thing);
    // const savedSolidDataset = await saveSolidDatasetAt(
    //   auth_url+"/code",
    //   dataset,
    //   { fetch: session.fetch }             // fetch from authenticated Session
    // );
})


app.listen(port, function()
{
  console.log("Listening on " + port);
});


// redundant endpoints

// app.post("/reactNote", async (req, res) => {
//   console.log("Here!")
//   const session = app.locals.session;
//   console.log(req.body)
//   let courseSolidDataset = createSolidDataset();
//   const newBookThing1 = buildThing(createThing({ name: req.body.title }))
//     .addStringNoLocale(SCHEMA_INRUPT.name, "react generated note")
//     .addStringNoLocale(SCHEMA_INRUPT.description, req.body.description)
//     .addStringNoLocale(SCHEMA_INRUPT.text, req.body.description)
//     .addUrl(RDF.type, "https://schema.org/TextDigitalDocument")
//     .build();


//   courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
//   // courseSolidDataset2 = setThing(courseSolidDataset2, newTextThing2);

//   const savedSolidDataset = await saveSolidDatasetAt(
//     "https://pod.inrupt.com/pulkit/Notesdump/" + req.body.title,
//     courseSolidDataset,
//     { fetch: session.fetch }             // fetch from authenticated Session
//   );
//   console.log("Here! Done writing")
//   res.send(`sent data to pod`);
// });


// app.get("/readAllNotes", async (req, res) => {

//   const notes_url = "https://pod.inrupt.com/pulkit/Notesdump/";
//   const myDataset = await getSolidDataset(
//     "https://pod.inrupt.com/pulkit/Notesdump/",
//     { fetch: fetch }          // fetch from authenticated session
//   );

//   // console.log(myDataset)
//   console.log(myDataset.graphs.default)

//   notesFolder = myDataset.graphs.default

//   for (const entry of Object.entries(notesFolder)) {
//     if (entry[0]=="https://pod.inrupt.com/pulkit/Notesdump/"){
//       console.log("USELESS");
//     }
//     else{
//     console.log(entry);
//     }
//   }

//   res.send(myDataset.graphs.default);
  
// });

// app.get("/giveAccessTo", async (req, res) => {
//   const session = app.locals.session;
//   await access.setAgentAccess(
//     "https://pod.inrupt.com/pulkit/Notesdump/" + 'test',
//     'https://pod.inrupt.com/leslie/profile/card#me',
//     { read: true, write:true, append:false },
//     { fetch: session.fetch },
//   );
//   res.send("Added access to file for leslie")
// });
