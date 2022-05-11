import React from 'react'

function AddContact() {

  const addContact = (event) => {
    console.log('Contact Added')
  }

  return (
    <div>
        <br/>
        <form onSubmit={addContact}>
            <div className="form-group">
                <p><input className="form-control" ref={title => title = title}
                            placeholder="enter contact name"/></p>

                <p><input className="form-control"
                                ref={description => description = description}
                                placeholder="enter WebId"/>
                </p>

            </div>
            <div>
                <button type="submit" className="btn btn-success float-right">Add Contact</button>
            </div>
        </form>
        <span/>
    </div>
  );
}

export default AddContact
