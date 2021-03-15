import React, { Component } from "react";
import GenericTable from "./common/table/genericTable";

import { GameTableType, GameType } from "./../enums";
import GameIcon from "./gameIcon";
import { GetTimeDifference } from "./golemStatusBar/helpers";

class GamesTable extends Component {
    columns = [
        {
            path: "_id",

            visible: false,
        },

        { path: "gameType", label: "type", content: (game) => <GameIcon type={game.gameType} /> },
        { path: "nick", label: "nick" },
        {
            path: "lastMoveTime",
            label: "last activity",
            content: (game) => GetTimeDifference(game.lastMoveTime),
        },
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
        let { games, rowClick, type, playerNick } = this.props;

        if (type === undefined) {
            games = games.sort((a, b) => (a.lastMoveTime < b.lastMoveTime ? 1 : -1));
        } else if (type === GameTableType.PLAYER_GAMES) {
            this.columns = this.columns.filter((x) => !["gameType", "nick"].includes(x.path));
            games = games
                .filter((x) => x.playerLogin === playerNick)
                .sort((a, b) => (a.lastMoveTime < b.lastMoveTime ? 1 : -1));

            const arrSize = 5;
            if (arrSize > 5) games = games.slice(0, arrSize);
        } else if (type === GameTableType.TOP_GAMES) {
            this.columns = this.columns.filter((x) => !["gameType"].includes(x.path));
            games = games.filter((x) => x.gameType === GameType.PlayerVsGolem);
            games = games.sort((a, b) => {
                // a wins with checkmate and b not
                if (
                    a.winnerType === "checkmate" &&
                    a.winner === "white" &&
                    !(b.winnerType === "checkmate" && b.winner === "white")
                )
                    return -1;

                if (
                    b.winnerType === "checkmate" &&
                    b.winner === "white" &&
                    !(a.winnerType === "checkmate" && a.winner === "white")
                )
                    return 1;

                //todo: add sort condition for difficulty level

                if (a.winnerType === "draw" && b.winnerType !== "draw") return -1;
                if (b.winnerType === "draw" && a.winnerType !== "draw") return 1;

                return a.movesCount >= b.movesCount ? -1 : 1;

                // < b.lastMoveTime ? 1 : -1;
            });
            const arrSize = 5;
            if (arrSize > 5) games = games.slice(0, arrSize);
        }

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
