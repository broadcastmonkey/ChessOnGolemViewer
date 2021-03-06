import React, { Component } from "react";

import { GameType } from "./../../enums";

class TurnInfo extends Component {
    render() {
        const { currentPlayer, gameType, playerColor, winner, winnerType } = this.props;
        let txt = "It's Golem's turn";
        let className = "bg-warning";
        if (winnerType !== "") {
            className = "text-white bg-success";
            if (winner !== "") {
                txt = `Checkmate! ${winner} player wins!`;
            } else {
                txt = "DRAW";
            }
        } else if (gameType === GameType.GolemVsGolem) {
            txt = "Golem is playing against itself";
            className = "text-white bg-info";
        } else if (playerColor === currentPlayer) {
            txt = "It's your turn";
            className = "text-white bg-info";
        }

        return (
            <div
                className={"mt-3 d-flex justify-content-center p-3 mb-2 " + className}
                style={{ width: 512 }}
            >
                <h2>{txt}</h2>
            </div>
        );
    }
}

export default TurnInfo;
