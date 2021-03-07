import { Button } from "react-bootstrap";
import React, { Component } from "react";
import { Card } from "react-bootstrap";

import { GameType } from "./../../enums";
import GameIcon from "./../gameIcon";
import { Link } from "react-router-dom";

class StatsCard extends Component {
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
                At the moment no golem vs golem game is happening...
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
            <Card bg="light" text="dark" className="mb-2 mt-2">
                <Card.Header>
                    <h2>Quick stats</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b></b>
                    </Card.Title>
                    <Card.Text>
                        Currently there are {activeGamesCount} games running.
                        <hr />
                        {totalGamesCount} games played in total
                        <br />- {golemVsGolemGamesCount} <i>golem vs golem</i> games{" "}
                        <GameIcon type={GameType.GolemVsGolem} />
                        <br />- {playerVsGolemGamesCount} <i>human vs golem</i> games{" "}
                        <GameIcon type={GameType.PlayerVsGolem} />
                        <hr />
                        {this.renderGolemVsGolemInfo(isGolemVsGolemActive, golemVsGolemGameId)}
                        <br />
                        <hr />
                        <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default StatsCard;
