import { Button } from "react-bootstrap";
import React, { Component } from "react";
import { Card } from "react-bootstrap";

//import "./golemStatusBar.css";

class NewGame extends Component {
    render() {
        const { onClick, disabled } = this.props;

        return (
            <Card bg="light" text="dark" style={{ width: "64" }} className="mb-2 mt-2">
                <Card.Header>
                    <h2>Play againt Golem!</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>
                            <Button variant="outline-primary" disabled={disabled} onClick={onClick}>
                                Start New Game
                            </Button>
                        </b>
                    </Card.Title>
                    <Card.Text>
                        Currently there are 0 games running.
                        <br />
                        256 games played against golem.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default NewGame;
