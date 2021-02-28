import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import socket from "./../services/socketService";
import { toast } from "react-toastify";
/*import { getMockMoves } from "../services/mockMovesService";*/
import MovesTable from "./movesTable";
import "./chessDashboard.css";
import { CardGroup } from "react-bootstrap";
import { getMoveStats } from "../services/statsCalculator";
import GolemStatusBar from "./golemStatusBar/golemStatusBar";
import { createStatusLines, createDefaultStats } from "./golemStatusBar/helpers";
import ChessStatusBar from "./chessStatusBar/chessStatusBar";
import GolemChessStats from "./golemGameStats/golemChessStats";
import { StatusEnum, StatusBar } from "../enums";
class ChessDashboard extends Component {
    state = {
        fen: "start",
        statusBar: "",
        turn: "white",
        statusColor: "info",
        moveNumber: 1,
        depth: 1,
        status: "...",
        statusStats: "a..",
        taskId: "",
        gameId: 1,
        stepId: 0,
        intervalEnabled: false,
        secondsComputing: 0,
        intervalId: 0,
        moves: [],
        statusLines: createStatusLines(),
        white_stats: createDefaultStats(),
        black_stats: createDefaultStats(),
    };

    status = StatusEnum.none;
    confirmedWorkers = 0;
    resetTimer = () => {
        this.setState({ secondsComputing: 0 });
    };

    startTimer = () => {
        if (this.intervalId !== 0) this.stopTimer();
        var intervalId = setInterval(this.timerTick, 1000);
        this.setState({ intervalId, intervalEnabled: true });
    };

    stopTimer = () => {
        if (this.state.intervalId) clearInterval(this.state.intervalId);
        this.setState({ intervalEnabled: false });
    };

    timerTick = () => {
        let { secondsComputing, intervalEnabled } = this.state;
        if (!intervalEnabled) return this.stopTimer();
        secondsComputing++;
        this.setState({ secondsComputing });
    };

    componentDidMount() {
        socket.on("calculationRequested", this.handlecalculationRequested);
        socket.on("subscriptionCreated", this.handleSubscriptionCreated);
        socket.on("proposalsReceived", this.handleProposalsReceived);
        socket.on("offersReceived", this.handleOffersReceived);
        socket.on("agreementCreated", this.handleAgreementCreated);
        socket.on("agreementConfirmed", this.handleAgreementConfirmed);
        socket.on("scriptSent", this.handleScriptSent);
        socket.on("currentTurnEvent", this.handleCurrentTurnEvent);
        socket.on("computationStarted", this.handleComputationStarted);
        socket.on("providerFailed", this.handleProviderFailed);
        socket.on("computationFinished", this.handleComputationFinished);
        socket.on("positionEvent", this.handlePositionEvent);
        socket.on("gameFinished", this.handleGameFinished);
        socket.on("moveEvent", this.handleMoveEvent);
        socket.on("movesRefreshed", this.handleMovesRefreshed);
    }

    SetAllStatusLinesInactive() {
        const statusLines = this.state.statusLines.map((x) => {
            const y = { ...x };
            y.type = StatusBar.Inactive;
            y.value = undefined;
            return y;
        });

        console.log("s lines: ", statusLines);
        this.setState({ statusLines });
    }

    ChangeStatusLine(id, type, text, value) {
        const statusLines = this.state.statusLines.map((x) => {
            const y = { ...x };
            if (x.id === id) {
                if (type !== null) y.type = type;
                if (text !== null) y.text = text;
                if (value !== null) y.value = value;
            }

            return y;
        });

        this.setState({ statusLines });
    }

    handlecalculationRequested = (params) => {
        const { gameId, stepId } = params;
        //move somewhere else:
        this.SetAllStatusLinesInactive();
        this.ChangeStatusLine("calculationRequested", StatusBar.Active, null, null);
    };
    handleSubscriptionCreated = (params) => {
        const { gameId, stepId } = params;
        this.ChangeStatusLine("subscriptionCreated", StatusBar.Active, null, null);
    };

    handleProposalsReceived = (params) => {
        console.log("proposals:", params);
        const { proposalsCount, gameId, stepId, taskId } = params;
        // if (this.state.taskId !== taskId) return;
        this.ChangeStatusLine("proposalsReceived", StatusBar.Active, null, proposalsCount);
        /*if (this.status === StatusEnum.searching) {
            this.setState({
                statusStats: `${proposalsCount} proposals received...`,
            });
        }*/
    };
    handleOffersReceived = (params) => {
        const { offersCount, gameId, stepId, taskId } = params;
        this.ChangeStatusLine("offersReceived", StatusBar.Active, null, offersCount);
        /* if (this.state.taskId !== taskId) return;
        if (this.status === StatusEnum.searching) {
            this.setState({
                statusStats: `${offersCount} offers received...`,
            });
        }*/
    };
    handleAgreementCreated = (params) => {
        const { taskId, providerName, gameId, stepId } = params;
        //if (this.state.taskId !== taskId) return;
        this.ChangeStatusLine("agreementCreated", StatusBar.Active, null, providerName);
        /* console.log("agreement created...");
        console.log(params);
        this.setState({
            statusStats: "agreement created with provider: " + providerName,
        });*/
    };
    handleAgreementConfirmed = (params) => {
        const { taskId, providerName, gameId, stepId } = params;
        this.ChangeStatusLine("agreementConfirmed", StatusBar.Active, null, providerName);
        this.confirmedWorkers++;
        console.log("confirmed workers: " + this.confirmedWorkers);
        /*if (this.state.taskId !== taskId) return;*/
        this.status = StatusEnum.provider_confirmed;
        /*console.log("agreement confirmed...");
        console.log(params);*/
        /* this.setState({
            status: "provider: " + providerName,
            statusStats: "computing best move on provider's VM",
        });*/
    };
    handleScriptSent = (params) => {
        const { taskId, providerName, gameId, stepId } = params;
        this.ChangeStatusLine("scriptSent", StatusBar.Active, null, providerName);
    };
    handleComputationStarted = (params) => {
        console.log("started started started");
        const { taskId, gameId, stepId } = params;
        /* if (this.state.taskId !== taskId) return;*/
        this.status = StatusEnum.searching;
        /*this.setState({
            status: "searching for best offer...",
            statusStats: "offer is in the market...",
        });*/

        this.ChangeStatusLine("computationStarted", StatusBar.Active, null, null);
    };
    handleComputationFinished = (params) => {
        /*  console.log("computation finished !! ");
        console.log(params);*/
        const { taskId, time, gameId, stepId } = params;
        //if (this.state.taskId !== taskId) return;
        let timeInSec = Math.round(time / 1000);

        this.ChangeStatusLine("computationFinished", StatusBar.Active, null, timeInSec + "s");

        toast.info(
            `computation with task_id: ${taskId} \nfinished in : ${time} + ms  \n(~ ${timeInSec}s )`,
        );
    };
    handleGameFinished = (params) => {
        const { winner, type } = params;
        this.status = StatusEnum.game_end;
        this.setState({
            status: "Game Finished!",
            statusStats: type === "draw" ? "DRAW" : winner + " PLAYER WINS",
        });
    };

    handleMovesRefreshed = (incoming) => {
        let moves = [];
        for (const [, value] of Object.entries(incoming)) {
            moves.push(value);
        }

        this.setState({
            moves,
            black_stats: getMoveStats(moves, "black"),
            white_stats: getMoveStats(moves, "white"),
        });
    };

    handleCurrentTurnEvent = (params) => {
        const { taskId, gameStep: moveNumber, turnId, depth } = params;
        this.setState({
            taskId,
            moveNumber,
            turn: turnId === "w" ? "white" : "black",
            depth,
        });
        console.log("current turn event");
        console.log(params);
        this.resetTimer();
        this.startTimer();
    };

    handlePositionEvent = (params) => {
        console.log("position event...");
        console.log(params);
        const { fen } = params;
        console.log("chess pos", fen);
        this.setState({ fen });
    };
    handleMoveEvent = (bestmove) => {
        const { move, depth, time } = bestmove;
        console.log("move event...");
        console.log(move);
        if (move !== "test")
            toast.info("move : " + move + "\ndepth : " + depth + "\ntime: " + time);

        this.ChangeStatusLine("sendChessMove", StatusBar.Active, null, move);
    };
    handleProviderFailed = (provider) => {
        const { taskId, providerName } = provider;
        if (this.state.taskId !== taskId) return;
        console.log("provider failed...");
        console.log(provider);
        if (provider !== "test") toast.error("provider failed : " + providerName);
    };

    render() {
        return (
            <div>
                <div>
                    <CardGroup>
                        <ChessStatusBar
                            variant={this.state.statusColor}
                            statusColor={this.state.statusColor}
                            turn={this.state.turn.toUpperCase()}
                            moveNumber={this.state.moveNumber}
                            depth={this.state.depth}
                            secondsComputing={this.state.secondsComputing}
                            taskId={this.state.taskId}
                            status={this.state.status}
                            statusStats={this.state.statusStats}
                            statusLines={createStatusLines()}
                        />
                        <GolemStatusBar
                            variant={this.state.statusColor}
                            statusColor={this.state.statusColor}
                            turn={this.state.turn.toUpperCase()}
                            moveNumber={this.state.moveNumber}
                            depth={this.state.depth}
                            secondsComputing={this.state.secondsComputing}
                            taskId={this.state.taskId}
                            status={this.state.status}
                            statusStats={this.state.statusStats}
                            statusLines={this.state.statusLines}
                        />
                    </CardGroup>
                </div>
                <div className="chess-wrapper">
                    <div className="chess-board">
                        <div>
                            <Chessboard
                                width={512}
                                id="random"
                                position={this.state.fen}
                                transitionDuration={300}
                                boardStyle={{
                                    borderRadius: "5px",
                                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
                                }}
                            />
                        </div>
                        <div>
                            <GolemChessStats
                                stats_white={this.state.white_stats}
                                stats_black={this.state.black_stats}
                            />
                        </div>
                    </div>
                    <div className="chess-table">
                        <div>
                            <MovesTable moves={this.state.moves} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChessDashboard;
