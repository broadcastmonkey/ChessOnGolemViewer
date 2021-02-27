import React, { Component } from "react";
import { Card } from "react-bootstrap";

import "./golemStatusBar.css";

class GolemStatusBar extends Component {
    getTextColor(variant) {
        if (variant === "light" || variant === "warning") return "dark";
        return "light";
    }

    render() {
        const { status, statusLines } = this.props;

        return (
            <Card bg="light" text="dark" style={{ width: "512" }} className="mb-2 mt-2">
                <Card.Header>
                    <h2>Golem status</h2>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>{status} </b>
                    </Card.Title>
                    <Card.Text>
                        {statusLines.map((x) => (
                            <React.Fragment key={x.id}>
                                <b className={x.type}>{x.text}</b>
                                <br />
                            </React.Fragment>
                        ))}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default GolemStatusBar;
