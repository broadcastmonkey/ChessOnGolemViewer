import React, { Component } from "react";
import { Card } from "react-bootstrap";
import socket from "../../services/socketService";
import GamesTable from "../gamesTable";
//import "./golemStatusBar.css";

class LandingPage extends Component {
    state = {
        allGames: [],
    };
    componentDidMount() {
        socket.on("gamesData", this.handleGamesData);
        if (socket.connected) {
            socket.emit("getGames");
            console.log("connected and get games");
        } else
            socket.on("connect", (data) => {
                socket.emit("getGames");
                console.log("emit get games");
            });
    }
    componentWillUnmount() {
        socket.removeListener("gamesData", this.handleGamesData);
    }
    handleGamesData = (data) => {
        console.log(data);
        this.setState({ allGames: data.games });
        console.log(`allgames`);
        console.log(this.state.allGames);
    };
    render() {
        return (
            <div>
                <Card bg="light" text="dark" className="mb-2 mt-2">
                    <Card.Header>
                        <h2>Play against Golem!</h2>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <b></b>
                        </Card.Title>
                        <Card.Text>
                            Currently there are 0 games running.
                            <br />
                            256 games played against golem.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card bg="light" text="dark" className="mb-2 mt-2">
                    <Card.Header>
                        <h2>All games</h2>
                    </Card.Header>
                    <Card.Body>
                        <GamesTable games={this.state.allGames} />
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default LandingPage;
