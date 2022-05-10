import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Contacts from './Contacts';
import NotesApp from './NotesApp';
import Team from './Team';

class App extends Component {
  render() {
    return (
        <div>
            <div className="container-fluid bg-dark">
                <h1 className="text-center display-1 text-white">Notes App</h1>
                <hr/>
            </div>
            <p></p>
            <div className="container-fluid">
                <BrowserRouter>
                    <div>
                        <nav>
                            <ul>
                                <li><Link to={'/'}> Home </Link></li>
                                <li><Link to={'/NotesApp'}> Notes </Link></li>
                                <li><Link to={'/Contacts'}>contacts</Link></li>
                                <li><Link to={'/Team'}>Team</Link></li>
                            </ul>
                        </nav>
                        <hr />
                    
                        <Switch>
                            <Route path="/" component={Home}/>
                            <Route path="/NotesApp" component={NotesApp}/>
                            <Route path="/Contacts" component={Contacts}/>
                            <Route path="/Team" component={Team}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </div>
    );
  }
}

export default App;