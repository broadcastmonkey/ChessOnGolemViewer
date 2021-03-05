import React, { Component } from "react";
import { Card } from "react-bootstrap";

//import "./golemStatusBar.css";

class LandingPage extends Component {
    render() {
        return (
            <Card bg="light" text="dark" style={{ width: "64" }} className="mb-2 mt-2">
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
        );
    }
}

export default LandingPage;
