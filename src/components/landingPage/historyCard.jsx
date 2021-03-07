import { Button } from "react-bootstrap";
import React, { Component } from "react";
import { Card } from "react-bootstrap";

import { Link } from "react-router-dom";

class HistoryCard extends Component {
    render() {
        return (
            <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                <Card.Header>
                    <h2>
                        Your games{" "}
                        <Link to="/game/new">
                            <Button style={{ float: "right" }} variant="primary">
                                Play against golem
                            </Button>
                        </Link>
                    </h2>{" "}
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>History of your games against golem:</b>
                    </Card.Title>
                    <Card.Text>yet to be implemented</Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default HistoryCard;
