import React, { Component } from "react";
import { GameType } from "../enums";

class GameIcon extends Component {
    render() {
        const { type } = this.props;
        const img = "/" + (type === GameType.GolemVsGolem ? "golem" : "player") + ".png";
        return <img style={{ width: "5%", height: "5%" }} src={img} alt="game type" />;
    }
}

export default GameIcon;
