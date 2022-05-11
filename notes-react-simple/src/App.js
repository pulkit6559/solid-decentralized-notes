import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NotesApp from './pages/NotesApp';
import Team from './pages/Team';
import Navbar from './components/Navbar';
import ContactsPage from './pages/ContactsPage';

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
                        <Navbar/>
                        <br/>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/notes" component={NotesApp}/>
                            <Route path="/contacts" component={ContactsPage}/>
                            <Route path="/about" component={Team}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        </div>
    );
  }
}

export default App;