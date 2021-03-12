import React, { Component } from "react";
import GenericTable from "./common/table/genericTable";

import { GameType } from "./../enums";
import GameIcon from "./gameIcon";
class GamesTable extends Component {
    columns = [
        {
            path: "_id",

            visible: false,
        },

        { path: "gameType", label: "type", content: (game) => <GameIcon type={game.gameType} /> },
        { path: "nick", label: "nick" },
        {
            path: "movesCount",
            label: "moves count",
            content: (game) => (
                <p style={{ fontFamily: "'Courier New'", margin: 0, padding: 0 }}>
                    {" "}
                    {game.movesCount.toString().padStart(10, "\u00A0")}
                </p>
            ),
        },
        {
            path: "isGameFinished",
            label: "status",
            content: (game) => {
                if (game.isGameFinished === false) return "-";

                let result = game.winnerType;
                if (result === "draw") return result;

                result += " / " + game.winner + " wins";
                return result;
            },
        },
    ];

    render() {
        const { games, rowClick } = this.props;
        games.forEach((x) => (x._id = x.gameId));
        games.forEach((x) => {
            if (x.gameType === GameType.PlayerVsGolem) x.nick = x.playerLogin;
            else x.nick = "golem";
        });

        return (
            <GenericTable
                columns={this.columns}
                data={games}
                rowOnClick={rowClick}
                //sortColumn={sortColumn}
                //onSort={onSort}
            />
        );
    }
}

export default GamesTable;
