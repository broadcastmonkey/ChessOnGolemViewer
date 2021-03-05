import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Redirect, Switch } from "react-router-dom";
import NavBar from "./components/navBar";

// import logo from "./logo.svg";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/notFound";

import ChessGame from "./components/chessGame/chessGame";
import LandingPage from "./components/landingPage/landingPage";

class App extends Component {
    state = {};

    componentDidMount() {}
    render() {
        let speedway = "container-fluid";
        //speedway += document.location.pathname.includes("speedway") ? "2" : "";

        return (
            <React.Fragment>
                <ToastContainer />

                <main className={speedway}>
                    <NavBar />{" "}
                    <Switch>
                        {/* <Route path="/register" component={RegisterForm} /> */}

                        <Route path="/not-found" component={NotFound} />
                        <Route path="/game/:gameId" exact component={ChessGame} />
                        <Route path="/" exact component={LandingPage} />
                        <Redirect to="/not-found" />
                    </Switch>
                </main>
            </React.Fragment>
        );
    }
}

export default App;
