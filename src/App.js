import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";


import LogIn from "./components/LogIn/LogIn";
import NotesApp from "./components/NotesApp/NotesApp";

const App = () => (

        <Router>
            <Route path="/" exact component={LogIn} />
            <Route path="/notes" exact component={NotesApp} />
        </Router>

);

export default App;