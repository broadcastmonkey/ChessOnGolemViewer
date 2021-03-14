import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { GameTableType } from "../../enums";
import GamesTable from "../gamesTable";

class ActiveGamesCard extends Component {
    render() {
        const { games, rowClick } = this.props;

        return (
            <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                <Card.Header>
                    <h2>Top games</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b></b>
                    </Card.Title>

                    <GamesTable games={games} rowClick={rowClick} type={GameTableType.TOP_GAMES} />
                </Card.Body>
            </Card>
        );
    }
}

export default ActiveGamesCard;
