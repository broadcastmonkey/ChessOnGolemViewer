import React, { Component } from "react";
import { Card } from "react-bootstrap";

//import "./golemStatusBar.css";

class ChessStatusBar extends Component {
    render() {
        const { turn, moveNumber, depth, secondsComputing, taskId } = this.props;

        return (
            <Card bg="info" text="light" style={{ width: "512" }} className="mb-2 mt-2">
                <Card.Header>
                    <h2>Game state</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>
                            {" "}
                            <b>Turn: {turn}</b>
                        </b>
                    </Card.Title>
                    <Card.Text>
                        <b className="ml-1">Move number: {moveNumber}</b> <br />
                        <b className="ml-1">Algorithm Depth: {depth}</b>
                        <br />
                        <b className="ml-1"> {secondsComputing}s</b>
                        <br />
                        <b className="ml-1"> task id: {taskId}</b>
                        <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default ChessStatusBar;
