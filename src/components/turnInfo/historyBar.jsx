import React, { Component } from "react";

import "./../landingPage/historyCard.css";
class HistoryBar extends Component {
    render() {
        const {
            moveNumber,
            totalMovesCount,
            move,
            prevBtnClick,
            nextBtnClick,
            hideHistoryClick,
        } = this.props;
        let txt = "It's Golem's turn";
        let className = "bg-warning";

        txt = `move ${moveNumber + 1} / ${totalMovesCount}`;

        return (
            <div>
                <div
                    className={"d-flex mt-3  mb-2 " + className}
                    style={{ width: 512, flexWrap: "wrap" }}
                >
                    <div class="mt-3">
                        <button
                            onClick={prevBtnClick}
                            style={{ position: "absolute" }}
                            className="btn as-link"
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={nextBtnClick}
                            style={{ position: "absolute", left: 460 }}
                            className="btn as-link"
                        >
                            &gt;&gt;
                        </button>
                    </div>
                    <div className={"d-flex justify-content-center "} style={{ width: 512 }}>
                        <h4>{txt}</h4>
                    </div>{" "}
                    <div className={"d-flex justify-content-center"} style={{ width: 512 }}>
                        <h5>{move}</h5>
                    </div>
                </div>{" "}
                <button
                    onClick={hideHistoryClick}
                    className="btn btn-secondary"
                    style={{ width: 512 }}
                >
                    Return to most recent move
                </button>
            </div>
        );
    }
}

export default HistoryBar;
