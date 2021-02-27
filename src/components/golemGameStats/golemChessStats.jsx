import React, { Component } from "react";

import { PlayerEnum } from "../../enums";
import GolemChessStatsForSinglePlayer from "./golemChessStatsForSinglePlayer";
class GolemChessStats extends Component {
    render() {
        const { stats_white, stats_black } = this.props;

        return (
            <div>
                <div className="card-left">
                    <GolemChessStatsForSinglePlayer player={PlayerEnum.white} stats={stats_white} />
                </div>
                <div className="card-right">
                    <GolemChessStatsForSinglePlayer player={PlayerEnum.black} stats={stats_black} />
                </div>
            </div>
        );
    }
}

export default GolemChessStats;
