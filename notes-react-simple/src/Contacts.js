import React, {Component} from 'react';

class Contacts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>Adding a Contact</h3>
                <div>
                    <span>Provide WebId</span>
                    <input>WebId</input>
                    <button>Add</button>
                </div>
            </div>
        );
    }
}

export default Contacts;