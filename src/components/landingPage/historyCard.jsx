import { Button } from "react-bootstrap";
import React, { Component } from "react";
import { Card } from "react-bootstrap";

import { GameType } from "../../enums";
import GameIcon from "../gameIcon";
import { Link } from "react-router-dom";

class HistoryCard extends Component {
    renderGolemVsGolemInfo = (isActive, gameId) => {
        if (isActive) {
            return (
                <React.Fragment>
                    Golem vs Golem game is happenig right now
                    <Link to={"/game/" + gameId}>
                        <Button className="ml-4" variant="primary">
                            Click here to see it
                        </Button>
                    </Link>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                Next Golem vs Golem game starts automatically in 20 sec.
                <Button className="ml-4" variant="primary">
                    Request it now
                </Button>
            </React.Fragment>
        );
    };
    render() {
        const {
            activeGamesCount,
            totalGamesCount,
            golemVsGolemGamesCount,
            playerVsGolemGamesCount,
            isGolemVsGolemActive,
            golemVsGolemGameId,
        } = this.props;

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
