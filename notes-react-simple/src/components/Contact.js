import {FaTimes} from 'react-icons/fa'
import React from "react"

const Contact = ({contact, onDelete}) => {
    return (
        <div className="contact">
            <h3>
                {contact.name}{'   '}
                <FaTimes style={{color:'red', cursor:'pointer'}} onClick={()=>onDelete(contact.id)}/>
            </h3>
        </div>
    )
}

export default Contact