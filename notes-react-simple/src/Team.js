import React, {Component} from 'react';

class Team extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h3>Members</h3>
                <span>Omar</span>
                <span>Leslie</span>
                <span>Pulkit</span>
                <span>Tim</span>
            </div>
        );
    }
}

export default Team;