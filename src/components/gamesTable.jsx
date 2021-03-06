import React, { Component } from "react";
import GenericTable from "./common/table/genericTable";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
class GamesTable extends Component {
    columns = [
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
        const { games } = this.props;

        return (
            <GenericTable
                columns={this.columns}
                data={games}
                //sortColumn={sortColumn}
                //onSort={onSort}
            />
        );
    }
}

export default GamesTable;
