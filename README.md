# Team1

## Name
Solid Model Project: Sovereign Data Exchange Lab 2022 

## Description
This repository contains the Solid Model Project in the Sovereign Data Exchange Lab Course of the SS2022 at the RWTH Aachen. 
Solid is a model that enables users to store their data in decentralized Pods, that are like personal web servers that can store data. Here any type of information can be saved within a Solid Pod, access control can be edited and the user has access at all times. 
In this project, a base Solid model including servers and pods will be implemented and tested with a use case.


## Getting a Solid Pod
In order for the frontend to work, the connection to a Solid Pod is needed. As it is the decentralized data storage, the user needs to setup an own pod that will get connected to the prototype of this repository. There are multiple ways to set up a Solid Pod, we would suggest however to setup a Pod the same way the development team of this project did, in order to avoid any complications along the way. 
A user can get a Solid Pod from an authenticated Pod Provider on [this website.](https://solidproject.org/users/get-a-pod#get-a-pod-from-a-pod-provider) We suggest getting a Pod from [Inrupt Pod Spaces.](https://signup.pod.inrupt.com). The credentials, username and password, that are defined during the set up, are important for logging on to the Pod and is needed for the usage for the frontend. 

## Installation
In order to run the code an installment of Node.js as well as npm is needed. Node.js can be downloaded [here](https://nodejs.org/en/download/). Further instructions on how to install Node.js as well as npm is explained on [this website.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) Node.js version 12.20.0 is required for this project to run smoothly.

## Running Code
1. Running the server
```
* cd "Login Workflow"
* npm install
* npm start

Now that the server is running, authenticate the server pod

* Open localhost:4444 in a browser
* A prompt will ask for login credentials, use the ones provided below

username: leslie
password: 123qweASD

The server pod is now authenticated

```

2. Running the Frontend
```
cd notes-react-simple
npm install
npm start

Now that the frontend is running authenticate the session with your login credentials

* Open localhost:3000 in a browser (either use a different browser than the server or a private session)
* A prompt will ask for login credentials, use the credentials of your own pod (to test the functionalities, you can also use the credentials provided below)

username: pulkit
password: Pulkit123@

* Click on 'login' to register the user with the server (to authenticate fututre requests this user makes)
```

Once both are running go to `localhost:3000` to access the application.


## Using the Frontend
Motivation: Allow users to make notes collaboratively
What can our system do:
1. Allows a user to create a note
    * Click on 'Add Note' in the Notes page
    * Enter note details
    * Click on 'Save Note'
2. Allow a user to share his notes with another user (read/edit privileges)
    * Click on 'Add Note' in the Notes page
    * Enter note details
    * Enter the user's webID 
    * Check appropriate privileges
    * Click on 'Save Note'
3. Public sharing of notes
    * Click on 'Add Note' in the Notes page
    * Enter note details
    * Click on 'Save Note (public)'
4. Display all notes for user
    * All notes thet the user can read/write are displayed in the Notes page
5. Revoke access for a user
    * In the Notes page, Click on note you want to revoke access for
    * Enter the user's webID 
    * Click on 'Revoke Access'
6. Revoke access for a user
    * In the Notes page, Click on note you want to revoke access for
    * Enter the keyword 'public' in the text box  
    * Click on 'Revoke Access'



## Methods
Here are all methods that work within the Solid framework and are the basis of the project: 
- Personal data management
    * Add note
    * Edit note
    * Delete note
- Sharing
    * Create a public note
    * Share a note with a different user (friend sharing)
- Control
    * Revoke public access to a note
    * Revoke a friend’s access to a note
- Collaboration
    * Edit a shared writable note


## Functionalities of the frontend
A decentralized data exchange application should contain the following functionalities:
It provides an interface that allows fetching user data from a decentralized data store. It supports following functionalities:
1. Within application between different user’s pods: User X can be allowed to view User Y’s info when given the appropriate permissions
    - 1.1 Add Write/Read Access
        - 1.1.1 Write access means that a shared note can be edited by User X
        - 1.1.2 Read access means that a note is unchangable by any befriended user and can only be viewed
2. Revoke friend access: User X isn't allowed to view User Y's info any longer
3. Public sharing: A user can decide to make the data available for public usage
4. Revoke public sharing: A created note by a user is being deleted from the public space and can't be viewed any more
5. Edit notes: A User is able to change the description of a note that he created (or as already explained in (1.1.1) a note that has been shared with him with the "Write"-access authority)

## Website pages and its contents
1. Login: 
    This will ensure and check whether the frontend has access to the Pod of the logged in user. Asks user to allow access to the data. A new login to the user's pod might be needed
2. Home:
    This is the home page
3. Notes:
    Here the note creating and editing, access management page
4. Contacts
    Adding Contacts to the user's friend list
5. About
    Information about the developers


## Future possible work
1. (*) Associate notes with tags, eg (private and public) and also with specific tags (Mathematics, physics, screenplay) 
2. (*) Functionality for users to give edit suggestions to public “read-only” notes
3. (*) Link ideas -> create a knowledge graph (a sentence/phrase in note X can be linked-to note Y) 
4. (*) Tentative functionalities, not to be included in the POC. Included in a complex data exchange scenario


## Already Accomplished
- Adding access only to certain users with the WebId. 
- Adding friend UI
- README.md
- Readfile
- Policy framework
- Revoking access for shared and public notes and adding this to the frontend
- Frontend, list all own notes, all readable shared notes and all public notes
- Added functionality of "Edit Button"
- Added checkboxes for reading/writing access
- Revoke Access for notes that are shared with friends 
- Final presentation
- Final poster


## Roadmap
Currently working on open issues: 
- Writing/Maintaining README.md
- Cleanup of the repository
- Cleanup of the code


## Current Issues
- It is as of now impossible to update date while editing note


## Authors and acknowledgment
This project is being worked on by Timothy Clemens Borrell, Pulkit Arora, Haihua Yang and Omar Mahmoud.


## Project status
Post Final stage of lab (now in week 13 of the lab)
Currently finished the lab. Final presentation, the demonstration of the prototype and poster have been presented to the professor on July 6th 2022. Final changes and tweaks to the Repository and the code are being done until end of July.