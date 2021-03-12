import React, { Component } from "react";
import { Card } from "react-bootstrap";

//import "./golemStatusBar.css";

class ChessStatusBar extends Component {
    render() {
        const {
            turn,
            moveNumber,

            secondsComputing,
            difficulty,

            playerType,
        } = this.props;

        return (
            <Card bg="info" text="light" style={{ width: "512" }} className="mb-2">
                <Card.Header>
                    <h2>Game state</h2>
                </Card.Header>
                <Card.Body>
                    {difficulty && (
                        <Card.Title>
                            <b className="ml-1">Difficulty: {difficulty}</b> <br />
                        </Card.Title>
                    )}
                    <Card.Text>
                        <b className="ml-1">Turn: {turn}</b>
                        <br />
                        <b className="ml-1">Player type: {playerType}</b> <br />
                        <b className="ml-1">Move number: {moveNumber}</b> <br />
                        <b className="ml-1">Computation time: {secondsComputing}s</b>
                        <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default ChessStatusBar;
