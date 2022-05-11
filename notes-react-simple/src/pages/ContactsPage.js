import React, { useState } from 'react'
import AddContact from '../components/AddContact';
import Contacts from '../components/Contacts';
import Header from '../components/Header'

function ContactsPage() {
  const [contacts, setContacts] = useState(
    [
      {
        id:1,
        name:'Leisle',
        webId: '1'
      },
      {
        id:2,
        name:'Pulkit',
        webId: '2'
      },
      {
        id:3,
        name:'Tim',
        webId: '3'
      },
    ]
  )

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact)=> contact.id !== id));
  }

  return (
    <>
      <div className="container card"><AddContact/></div>
      <br/>
      <div className="container card">
        <div className="card-header"><Header title="My Contacts" buttonText="Add Contact"/></div>
        <div className="card-body"><Contacts contacts={contacts} onDelete={deleteContact}/></div>
      </div>
    </>
  );
}

export default ContactsPage;
