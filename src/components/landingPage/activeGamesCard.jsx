import React, { Component } from "react";
import { Card } from "react-bootstrap";

class ActiveGamesCard extends Component {
    render() {
        const { totalGamesCount, activeGamesCount } = this.props;
        return (
            <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                <Card.Header>
                    <h2>Active games</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b></b>
                    </Card.Title>
                    <Card.Text>
                        Currently there are {activeGamesCount} unfinished games.
                        <br />
                        {totalGamesCount} games played against golem.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default ActiveGamesCard;
