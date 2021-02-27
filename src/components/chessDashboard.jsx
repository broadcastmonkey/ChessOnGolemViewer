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
import { createStatusLines } from "./golemStatusBar/helpers";
import ChessStatusBar from "./chessStatusBar/chessStatusBar";
import GolemChessStats from "./golemGameStats/golemChessStats";
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
        gameId: "",
        intervalEnabled: false,
        secondsComputing: 0,
        intervalId: 0,
        moves: [] /*getMockMoves(22),*/,

        white_stats: {
            total_moves: 0,
            avg_depth: 0,
            total_vm_time: 0,
            avg_vm_time: 0,
            avg_golem_time: 0,
            best_golem_time: 0,
            total_time: 0,
            total_cost: 0,
        },
        black_stats: {
            total_moves: 0,
            avg_depth: 0,
            total_vm_time: 0,
            total_time: 0,
            total_cost: 0,
            avg_vm_time: 0,
            avg_golem_time: 0,
            best_golem_time: 0,
        },
    };

    StatusEnum = Object.freeze({
        none: 1,
        searching: 2,
        provider_confirmed: 3,
        finished: 4,
        game_end: 5,
        wednesday: 6,
    });
    status = this.StatusEnum.none;

    confirmedWorkers = 0;
    resetTimer = () => {
        this.setState({ secondsComputing: 0 });
    };

    startTimer = () => {
        if (this.intervalId !== 0) {
            this.stopTimer();
        }
        var intervalId = setInterval(this.timer, 1000);
        this.setState({
            intervalId,
            intervalEnabled: true,
        });
    };

    stopTimer = () => {
        if (this.state.intervalId) clearInterval(this.state.intervalId);
        this.setState({ intervalEnabled: false });
    };

    timer = () => {
        let { secondsComputing, intervalEnabled } = this.state;

        if (!intervalEnabled) return this.stopTimer();
        secondsComputing++;
        this.setState({
            secondsComputing,
        });
    };

    componentDidMount() {
        socket.on("currentTurnEvent", this.handleCurrentTurnEvent);
        socket.on("gameFinished", this.handleGameFinished);
        socket.on("positionEvent", this.handlePositionEvent);
        socket.on("moveEvent", this.handleMoveEvent);
        socket.on("providerFailed", this.handleProviderFailed);
        socket.on("agreementCreated", this.handleAgreementCreated);
        socket.on("agreementConfirmed", this.handleAgreementConfirmed);
        socket.on("computationStarted", this.handleComputationStarted);
        socket.on("computationFinished", this.handleComputationFinished);
        socket.on("offersReceived", this.handleOffersReceived);
        socket.on("proposalsReceived", this.handleProposalsReceived);
        socket.on("movesRefreshed", this.handleMovesRefreshed);
    }
    handleGameFinished = (params) => {
        const { winner, type } = params;
        this.status = this.StatusEnum.game_end;
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

    handleOffersReceived = (params) => {
        const { offersCount, taskId } = params;
        if (this.state.taskId !== taskId) return;
        if (this.status === this.StatusEnum.searching) {
            this.setState({
                statusStats: `${offersCount} offers received...`,
            });
        }
    };
    handleProposalsReceived = (params) => {
        const { proposalsCount, taskId } = params;
        if (this.state.taskId !== taskId) return;
        if (this.status === this.StatusEnum.searching) {
            this.setState({
                statusStats: `${proposalsCount} proposals received...`,
            });
        }
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
    handleComputationStarted = (params) => {
        console.log("started started started");
        const { taskId } = params;
        if (this.state.taskId !== taskId) return;
        this.status = this.StatusEnum.searching;
        this.setState({
            status: "searching for best offer...",
            statusStats: "offer is in the market...",
        });
    };
    handleComputationFinished = (params) => {
        console.log("computation finished !! ");
        console.log(params);
        const { taskId, time } = params;
        //if (this.state.taskId !== taskId) return;
        let timeInSec = Math.round(time / 1000);
        toast.info(
            `computation with task_id: ${taskId} \nfinished in : ${time} + ms  \n(~ ${timeInSec}s )`,
        );
    };
    handleAgreementConfirmed = (params) => {
        const { taskId, providerName } = params;
        this.confirmedWorkers++;
        console.log("confirmed workers: " + this.confirmedWorkers);
        if (this.state.taskId !== taskId) return;
        this.status = this.StatusEnum.provider_confirmed;
        console.log("agreement confirmed...");
        console.log(params);
        this.setState({
            status: "provider: " + providerName,
            statusStats: "computing best move on provider's VM",
        });
    };
    handleAgreementCreated = (params) => {
        const { taskId, providerName } = params;
        if (this.state.taskId !== taskId) return;
        console.log("agreement created...");
        console.log(params);
        this.setState({
            statusStats: "agreement created with provider: " + providerName,
        });
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
    };
    handleProviderFailed = (provider) => {
        const { taskId, providerName } = provider;
        if (this.state.taskId !== taskId) return;
        console.log("provider failed...");
        console.log(provider);
        if (provider !== "test") toast.error("provider failed : " + providerName);
    };

    renderTable = () => {
        let moves = this.state.moves;

        return <MovesTable moves={moves} />;
    };
    renderChessBoard = () => {
        return (
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
        );
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
                            statusLines={createStatusLines()}
                        />
                    </CardGroup>
                </div>
                <div className="chess-wrapper">
                    <div className="chess-board">
                        <div>{this.renderChessBoard()}</div>
                        <div>
                            <GolemChessStats
                                stats_white={this.state.white_stats}
                                stats_black={this.state.black_stats}
                            />
                        </div>
                    </div>
                    <div className="chess-table">
                        <div>{this.renderTable()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChessDashboard;
