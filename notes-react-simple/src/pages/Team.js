import React, {Component} from 'react';

class Team extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <h3 className="card-header">Members</h3>
                <div className="card-body">
                    <span className="list-group-item">Omar Mahmoud</span>
                    <span className="list-group-item">Pulkit Arora</span>
                    <span className="list-group-item">Haihua yang</span>
                    <span className="list-group-item">Timothy Borrell</span>
                </div>
            </div>
        );
    }
}

export default Team;