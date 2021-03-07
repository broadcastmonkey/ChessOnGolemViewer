import React, { Component } from "react";
import GenericTable from "./common/table/genericTable";

import { Link } from "react-router-dom";
class GamesTable extends Component {
    columns = [
        {
            path: "_id",

            visible: false,
        },
        {
            path: "gameId",
            label: "id",
            key: "gameId",
            content: (game) => (
                <Link key={game} to={"/game/" + game.gameId}>
                    {game.gameId}
                </Link>
            ),
        },
        { path: "gameType", label: "type" },
        {
            path: "isGameFinished",
            label: "finished ?",
            content: (game) => (game.isGameFinished ? "true" : "false"),
        },
    ];

    render() {
        const { games, rowClick } = this.props;
        games.forEach((x) => (x._id = x.gameId));

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
