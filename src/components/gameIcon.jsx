import React, { Component } from "react";
import { GameType } from "../enums";

class GameIcon extends Component {
    render() {
        const { type } = this.props;
        const img = "/" + (type === GameType.GolemVsGolem ? "golem" : "player") + ".png";
        return <img style={{ width: "20px", height: "20px" }} src={img} alt="game type" />;
    }
}

export default GameIcon;
