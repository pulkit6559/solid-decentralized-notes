const express = require('express');
const cookieSession = require("cookie-session");

const {
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session
} = require("@inrupt/solid-client-authn-node");
const{
  getSolidDataset,
  getThing,
  saveSolidDatasetAt,
  createThing,
  buildThing,
  setThing,
  createSolidDataset
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
  })
);


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
  };
  // 2. Start the login process; redirect handler will handle sending the user to their
  //    Solid Identity Provider.
  await session.login({
    // After login, the Solid Identity Provider will send the user back to the following
    // URL, with the data necessary to complete the authentication process
    // appended as query parameters:
    redirectUrl: `http://localhost:${5000}/afterLogin`,
    // Set to the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com"
    oidcIssuer: "https://broker.pod.inrupt.com",
    // Pick an application name that will be shown when asked
    // to approve the application's access to the requested data.
    clientName: "Demo app",
    handleRedirect: redirectToSolidIdentityProvider,
  });

});
var port = process.env.PORT || 5000;
app.get("/afterLogin", async (req, res) => {
  // 3. If the user is sent back to the `redirectUrl` provided in step 2,
  //    it means that the login has been initiated and can be completed. In
  //    particular, initiating the login stores the session in storage,
  //    which means it can be retrieved as follows.
  const session = await getSessionFromStorage(req.session.sessionId);

  // 4. With your session back from storage, you are now able to
  //    complete the login process using the data appended to it as query
  //    parameters in req.url by the Solid Identity Provider:
  // await session.handleIncomingRedirect(`http://localhost:${port}${req.url}`);



  courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
  const savedSolidDataset = await saveSolidDatasetAt(
    "https://pod.inrupt.com/pulkit6559/public/newNote7",
    courseSolidDataset,
    { fetch: fetch }             // fetch from authenticated Session
  );


  // 5. `session` now contains an authenticated Session instance.
  if (session.info.isLoggedIn) {
    res.send(`<p>Logged in with the WebID ${session.info.webId}.</p>`)
  }
  else{
    res.send(`<p>NOT Logged in with the WebID ${session.info.webId}.</p>`)
  }
});

app.post("/reactNote", async (req, res) => {
  console.log("Here!")
  console.log(req.body)
  let courseSolidDataset = createSolidDataset();
  const newBookThing1 = buildThing(createThing({ name: req.body.title }))
    .addStringNoLocale(SCHEMA_INRUPT.name, "react generated note")
    .addStringNoLocale(SCHEMA_INRUPT.description, req.body.description)
    .addStringNoLocale(SCHEMA_INRUPT.text, req.body.description)
    .addUrl(RDF.type, "https://schema.org/TextDigitalDocument")
    .build();


  courseSolidDataset = setThing(courseSolidDataset, newBookThing1);
  // courseSolidDataset2 = setThing(courseSolidDataset2, newTextThing2);

  const savedSolidDataset = await saveSolidDatasetAt(
    "https://pod.inrupt.com/pulkit6559/public/reactNote"+req.body.id,
    courseSolidDataset,
    { fetch: fetch }             // fetch from authenticated Session
  );
  console.log("Here! Done writing")
  res.send(`sent data to pod`);

});




app.listen(port, function()
{
  console.log("Listening on " + port);
});
