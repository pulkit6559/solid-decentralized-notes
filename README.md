# Team1

## Name
Solid Model Project: Sovereign Data Exchange Lab 2022 

## Description
This repository contains the Solid Model Project in the Sovereign Data Exchange Lab Course of the SS2022 at the RWTH Aachen. 
Solid is a model that enables users to store their data in decentralized Pods, that are like personal web servers that can store data. Here any type of information can be saved within a Solid Pod, access control can be edited and the user has access at all times. 
In this project, a base Solid model including servers and pods will be implemented and tested with a use case.

## Methods
Here are all methods that work within the Solid framework and are the basis of the project: 
- "CreateNotes"
    - Being able to create notes, adding a title and description
- "StoretoPublicPod"
    - Saving a Note to the public pod, which is then accessible to all users that have access to the public pod
- "GiveAccessTo"
    - Give access to friend to private Note. Other users won't be able to access such note.
- "readNote"
    - Read the contents of all accessable nodes.



## Requirements
A decentralized data exchange application should contain the following functionalities:
It provides an interface that allows fetching user data from a decentralized data store. It allows sharing and modifications in one of the following scenarios
1. Within application b/w diff user’s pods: User X can be allowed to view User Y’s info when given the appropriate permissions
2. Public sharing: A user can decide to make the data available for public usage
3. With other data applications: eg, a blog stored in a users pod as a social media posts
             

## Installation
In order to run the code an installment of Node.js as well as npm is needed. Node.js can be downloaded [here](https://nodejs.org/en/download/). Further instructions on how to install Node.js as well as npm is explained on [this website.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). Node.js version 12.20.0 is required for this project to run smoothly.

## Running Code
1. Running the server
```
cd "Login Workflow"
npm install
npm start
```

2. Running the Frontend
```
cd notes-react-simple
npm install
npm start
```

Once both are running go to `localhost:3000` to access the application.

## Current Use Case Scenario
Motivation: Allow users to make notes collaboratively
What can our system do:
1. Allows a user to create a note
2. Allow a user to share his notes with another user (read/edit privileges)
3. Public sharing of notes
4. Display all notes for user
5. Add friends and share notes with them

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


## Roadmap
Currently working on open issues: 
- Writing/Maintaining README.md
- Frontend, list all notes created by the user
- Cleanup of the repository
- Cleanup of the code


## Current Issues
- n/a

## To-dos
- Revoke Access for notes that are shared with friends 
- Create final presentation
- Create final poster
- Clean code
- Finalise model and use case scenario


## Authors and acknowledgment
This project is being worked on by Timothy Clemens Borrell, Pulkit Arora, Haihua Yang and Omar Mahmoud.


## Project status
Final stage of lab (now in week 11 of the lab)
Currently in Milestone 3 of the lab. Preparations of final presentation and poster are taking place.


