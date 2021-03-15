import React, { Component } from "react";
import GenericTable from "./common/table/genericTable";
import { GetTimeDifference } from "./golemStatusBar/helpers";

class MovesTable extends Component {
    columns = [
        {
            path: "stepId",
            label: "nr",
            key: "stepId",
            /*content: (user) => (
                <Link key={user} onClick={() => toast.error("clicked: " + user.stepId)} to="">
                    {user.stepId}
                </Link>
            ),*/
        },
        { path: "turn", label: "turn" },
        { path: "move", label: "move" },
        { path: "depth", label: "depth" },
        { path: "time", label: "time", content: (game) => GetTimeDifference(game.time) },

        {
            path: "worker",
            label: "worker",
            //content: (worker) => toast.error("worker info: " + worker),
        },
        { path: "failed_times", label: "fails" },
        { path: "vm_time", label: "vm time [s]", format: { precision: 3, division: 1000 } },
        { path: "total_time", label: "total time [s]", format: { precision: 3, division: 1000 } },
        { path: "offers_count", label: "proposals" },
        { path: "cost", label: "cost [glm]", format: { precision: 8, division: 1 } },
    ];

    render() {
        const { moves, rowClick } = this.props;
        moves.forEach((x) => (x._id = x.stepId));
        return (
            <GenericTable
                columns={this.columns}
                data={moves}
                rowOnClick={rowClick}
                //sortColumn={sortColumn}
                //onSort={onSort}
            />
        );
    }
}

export default MovesTable;
