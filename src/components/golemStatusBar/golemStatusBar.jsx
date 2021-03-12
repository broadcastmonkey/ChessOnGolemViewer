import React, { Component } from "react";
import { Card } from "react-bootstrap";

import "./golemStatusBar.css";

class GolemStatusBar extends Component {
    getTextColor(variant) {
        if (variant === "light" || variant === "warning") return "dark";
        return "light";
    }
    renderElements(arr) {
        return arr.map((x) => (
            <React.Fragment key={x.id}>
                <b className={x.type}>
                    {x.value !== undefined ? x.text + " (" + x.value + ")" : x.text}
                </b>
                <br />
            </React.Fragment>
        ));
    }

    render() {
        const { statusLines } = this.props;
        var first = statusLines.slice(0, statusLines.length / 2);
        var second = statusLines.slice(statusLines.length / 2 + 1);

        return (
            <Card bg="light" text="dark" style={{ width: "512" }} className="mb-2">
                <Card.Header>
                    <h2>Golem status</h2>
                </Card.Header>
                <Card.Body>
                    {/* <Card.Title>
                        <b>{status} </b>
                    </Card.Title> */}

                    <div style={{ width: "100%" }}>
                        <div style={{ float: "left" }}>{this.renderElements(first)}</div>
                        <div style={{ float: "right" }}>{this.renderElements(second)}</div>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export default GolemStatusBar;
