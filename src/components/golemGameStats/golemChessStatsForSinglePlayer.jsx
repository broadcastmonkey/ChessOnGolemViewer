import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { PlayerEnum } from "../../enums";

class GolemChessStatsForSinglePlayer extends Component {
    render() {
        const { player, stats } = this.props;

        return (
            <Card
                bg={player === PlayerEnum.white ? "light" : "dark"}
                text={player === PlayerEnum.white ? "dark" : "light"}
                style={{ width: "512" }}
                className="mb-2 mt-2"
            >
                <Card.Header>
                    <center>
                        <b>{player === PlayerEnum.white ? "WHITE" : "BLACK"}</b>{" "}
                    </center>
                </Card.Header>
                <Card.Body>
                    <Card.Title>Statistics: </Card.Title>
                    <Card.Text>
                        <i>total moves:</i> <b>{stats.total_moves}</b>
                        <br />
                        <i>avg depth:</i> <b>{stats.avg_depth}</b>
                        <br />
                        <i>total vm time:</i> <b>{stats.total_vm_time}s</b>
                        <br />
                        <i>avg vm time:</i> <b>{stats.avg_vm_time}s</b>
                        <br />
                        <i>total golem time:</i> <b>{stats.total_time}s</b>
                        <br />
                        <i>avg golem time:</i> <b>{stats.avg_golem_time}s</b>
                        <br />
                        <i>best golem time:</i> <b>{stats.best_golem_time}s</b>
                        <br />
                        <i>total golem cost:</i> <b>{stats.total_cost}</b>
                        <br />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default GolemChessStatsForSinglePlayer;
