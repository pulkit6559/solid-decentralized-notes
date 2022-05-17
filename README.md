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
- "ReactNote"
    - XXX
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
In order to run the code an installment of Node.js as well as npm is needed. Node.js can be downloaded [here](https://nodejs.org/en/download/). Further instructions on how to install Node.js as well as npm is explained on [this website.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

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

Once both are running go to `localhost:5000` to access the application

## Current Use Case Scenario
Motivation: Allow users to make notes collaboratively
What can our system do:
1. Allows a user to create a note
2. Allow a user to share his notes with another user (read/edit privileges)
3. Public sharing of notes
4. (*) Associate notes with tags, eg (private and public) and also with specific tags (Mathematics, physics, screenplay) 
5. (*) Functionality for users to give edit suggestions to public “read-only” notes
6. (*) Link ideas -> create a knowledge graph (a sentence/phrase in note X can be linked-to note Y) 
(*) Tentative functionalities, not to be included in the POC. Included in a complex data exchange scenario


## Already Accomplished
- Adding access only to certain users with the WebId. 
- Adding friend UI
- working on making public shared note to be private
- readme
- readfile
- policy framework


## Roadmap
Currently working on fixing open issues: 
- Allow user to change access of a public note to private again
- Add friend UI
- Writing/Maintaining README.md
- Frontend, list all notes created by the user
Soon the use case will be implemented and used on the create Solid model

## Current Issues
- SaveFileInContainer: “append” access

## To-dos
- Implementing the policies for the public deletion of note
- Implementing the policies for User-User sharing



## Authors and acknowledgment
This project is being worked on by Timothy Borrell, Pulkit Arora, Haihua Yang and Omar Mahmoud


## Project status
Ongoing (now in week 5 of the lab)
Currently in Milestone 1 of the lab. (This will be updated)


