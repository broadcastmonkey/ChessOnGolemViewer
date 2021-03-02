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
import { StatusEnum, StatusBar, PlayerEnum } from "../enums";
import NewGame from "./newGame/newGame";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import { GameType } from "./../enums";
import TurnInfo from "./turnInfo/turnInfo";
const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
        [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        ...(history.length && {
            [sourceSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
        }),
        ...(history.length && {
            [targetSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
        }),
    };
};
class ChessDashboard extends Component {
    state = {
        fen: "start",
        statusBar: "",
        turn: PlayerEnum.white,
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
        isNewGameButtononDisabled: false,
        // square styles for active drop square
        dropSquareStyle: {},
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: "",
        // array of past game moves
        history: [],
        playerColor: PlayerEnum.white,
        gameType: GameType.GolemVsGolem,
    };

    status = StatusEnum.none;
    confirmedWorkers = 0;
    resetTimer = () => {
        this.setState({ secondsComputing: 0 });
    };
    resetState = (newGameId, gameType) => {
        this.setState({
            fen: "start",
            statusBar: "",
            turn: PlayerEnum.white,
            moveNumber: 1,
            depth: 1,
            status: "...",
            statusStats: "a..",
            taskId: "",
            gameId: newGameId,
            stepId: 0,
            intervalEnabled: false,
            secondsComputing: 0,
            intervalId: 0,
            moves: [],
            statusLines: createStatusLines(),
            white_stats: createDefaultStats(),
            black_stats: createDefaultStats(),
            isNewGameButtononDisabled: false,
            // square styles for active drop square
            dropSquareStyle: {},
            // custom square styles
            squareStyles: {},
            // square with the currently clicked piece
            pieceSquare: "",
            // currently clicked square
            square: "",
            // array of past game moves
            history: [],
            playerColor: PlayerEnum.white,
            gameType: gameType,
        });
        console.log("state reseted");
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
        this.game = new Chess();
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
        socket.on("newGameCreated", this.handleNewGameCreated);
    }
    handleNewGameCreated = (data) => {
        const { gameId } = data;

        console.log("new game created: " + gameId);
        this.resetState(gameId, GameType.PlayerVsGolem);
    };

    SetAllStatusLinesInactive = () => {
        const statusLines = this.state.statusLines.map((x) => {
            const y = { ...x };
            y.type = StatusBar.Inactive;
            y.value = undefined;
            return y;
        });

        console.log("s lines: ", statusLines);
        this.setState({ statusLines });
    };

    ChangeStatusLine = (id, type, text, value) => {
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
    };

    handlecalculationRequested = (params) => {
        const { gameId, stepId } = params;
        if (gameId !== this.state.gameId) return;
        //move somewhere else:
        this.SetAllStatusLinesInactive();
        this.ChangeStatusLine("calculationRequested", StatusBar.Active, null, null);
    };
    handleSubscriptionCreated = (params) => {
        const { gameId, stepId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("subscriptionCreated", StatusBar.Active, null, null);
    };

    handleProposalsReceived = (params) => {
        console.log("proposals:", params);
        const { proposalsCount, gameId, stepId, taskId } = params;
        if (gameId !== this.state.gameId) return;
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
        if (gameId !== this.state.gameId) return;
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
        if (gameId !== this.state.gameId) return;
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
        if (gameId !== this.state.gameId) return;
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
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("scriptSent", StatusBar.Active, null, providerName);
    };
    handleComputationStarted = (params) => {
        console.log("started started started");
        const { taskId, gameId, stepId } = params;
        if (gameId !== this.state.gameId) return;
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
        if (gameId !== this.state.gameId) return;
        //if (this.state.taskId !== taskId) return;
        let timeInSec = Math.round(time / 1000);

        this.ChangeStatusLine("computationFinished", StatusBar.Active, null, timeInSec + "s");

        /*  toast.info(
            `computation with task_id: ${taskId} \nfinished in : ${time} + ms  \n(~ ${timeInSec}s )`,
        );*/
    };
    handleGameFinished = (params) => {
        const { winner, type, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.status = StatusEnum.game_end;
        this.setState({
            status: "Game Finished!",
            statusStats: type === "draw" ? "DRAW" : winner + " PLAYER WINS",
        });
    };

    handleMovesRefreshed = (incoming) => {
        const { gameId, movesData } = incoming;
        if (gameId !== this.state.gameId) return;
        let moves = [];
        for (const [, value] of Object.entries(movesData)) {
            moves.push(value);
        }

        this.setState({
            moves,
            black_stats: getMoveStats(moves, PlayerEnum.black),
            white_stats: getMoveStats(moves, PlayerEnum.white),
        });
    };

    handleCurrentTurnEvent = (params) => {
        const { taskId, gameStep: moveNumber, turnId, depth, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.setState({
            taskId,
            moveNumber,
            turn: turnId,
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
        const { position, gameId } = params;
        if (gameId !== this.state.gameId) return;

        console.log("chess pos", position);
        this.setState({ fen: position });
    };
    handleMoveEvent = (moveData) => {
        const { move, gameId } = moveData; //depth, time
        if (gameId !== this.state.gameId) return;
        console.log("move event...");
        console.log(move);
        /*  if (move !== "test")
            toast.info("move : " + move + "\ndepth : " + depth + "\ntime: " + time);
*/

        this.ChangeStatusLine("sendChessMove", StatusBar.Active, null, move);
    };
    handleProviderFailed = (provider) => {
        const { taskId, providerName } = provider;

        if (this.state.taskId !== taskId) return;
        console.log("provider failed...");
        console.log(provider);
        if (provider !== "test") toast.error("provider failed : " + providerName);
    };

    handleNewGameRequest = () => {
        console.log("creating new game ... ");
    };

    handleNewGameClick = () => {
        console.log("disabling button");
        socket.emit("newGameRequest", this.handleNewGameRequest);

        this.setState({ isNewGameButtononDisabled: true });
    };
    removeHighlightSquare = () => {
        this.setState(({ pieceSquare, history }) => ({
            squareStyles: squareStyling({ pieceSquare, history }),
        }));
    };
    highlightSquare = (sourceSquare, squaresToHighlight) => {
        const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce((a, c) => {
            return {
                ...a,
                ...{
                    [c]: {
                        background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
                        borderRadius: "50%",
                    },
                },
                ...squareStyling({
                    history: this.state.history,
                    pieceSquare: this.state.pieceSquare,
                }),
            };
        }, {});

        this.setState(({ squareStyles }) => ({
            squareStyles: { ...squareStyles, ...highlightStyles },
        }));
    };
    onDrop = ({ sourceSquare, targetSquare }) => {
        if (!this.isPlayerAllowedToMove()) return;
        // see if the move is legal
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        };
        let move = this.game.move(moveData);

        // illegal move
        if (move === null) return;
        this.setState(({ history, pieceSquare }) => ({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            squareStyles: squareStyling({ pieceSquare, history }),
        }));
        socket.emit("newMove", { gameId: this.state.gameId, fen: this.game.fen(), move: moveData });
        // send move to server
    };
    onMouseOverSquare = (square) => {
        // get list of possible moves for this square
        let moves = this.game.moves({
            square: square,
            verbose: true,
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        let squaresToHighlight = [];
        for (var i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to);
        }

        this.highlightSquare(square, squaresToHighlight);
    };
    onMouseOutSquare = (square) => this.removeHighlightSquare(square);
    onDragOverSquare = (square) => {
        this.setState({
            dropSquareStyle:
                square === "e4" || square === "d4" || square === "e5" || square === "d5"
                    ? { backgroundColor: "cornFlowerBlue" }
                    : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" },
        });
    };

    onSquareClick = (square) => {
        if (!this.isPlayerAllowedToMove()) return;
        this.setState(({ history }) => ({
            squareStyles: squareStyling({ pieceSquare: square, history }),
            pieceSquare: square,
        }));

        let move = this.game.move({
            from: this.state.pieceSquare,
            to: square,
            promotion: "q", // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.setState({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            pieceSquare: "",
        });
    };

    onSquareRightClick = (square) =>
        this.setState({
            squareStyles: { [square]: { backgroundColor: "deepPink" } },
        });

    isPlayerAllowedToMove = () => {
        return (
            this.state.gameType === GameType.PlayerVsGolem &&
            this.state.playerColor === this.state.turn
        );
    };
    render() {
        return (
            <div>
                <h1>{this.state.fen}</h1>
                <div>
                    <CardGroup>
                        <NewGame
                            disabled={this.state.isNewGameButtononDisabled}
                            onClick={this.handleNewGameClick}
                        />
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
                                onDrop={this.onDrop}
                                onMouseOverSquare={this.onMouseOverSquare}
                                onMouseOutSquare={this.onMouseOutSquare}
                                squareStyles={this.squareStyles}
                                dropSquareStyle={this.dropSquareStyle}
                                onDragOverSquare={this.onDragOverSquare}
                                onSquareClick={this.onSquareClick}
                                onSquareRightClick={this.onSquareRightClick}
                            />
                        </div>
                        <div>
                            <TurnInfo
                                currentPlayer={this.state.turn}
                                gameType={this.state.gameType}
                                playerColor={this.state.playerColor}
                            />
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
