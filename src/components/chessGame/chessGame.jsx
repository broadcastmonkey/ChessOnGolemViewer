import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import socket from "../../services/socketService";
import { toast } from "react-toastify";
import MovesTable from "../movesTable";
import "./chessGame.css";
import { CardGroup } from "react-bootstrap";
import { getMoveStats } from "../../services/statsCalculator";
import GolemStatusBar from "../golemStatusBar/golemStatusBar";
import { createStatusLines, createDefaultStats } from "../golemStatusBar/helpers";
import { squareStyling } from "./helpers";
import ChessStatusBar from "../chessStatusBar/chessStatusBar";
import GolemChessStats from "../golemGameStats/golemChessStats";
import { StatusEnum, StatusBar, PlayerEnum, GameType } from "../../enums";
import NewGame from "../newGame/newGame";
import Chess from "chess.js"; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import TurnInfo from "../turnInfo/turnInfo";

class ChessGame extends Component {
    getDefaultStateObject = (newGameId, gameType) => {
        return {
            loadingTitle: "",
            fen: "start",
            gameLoaded: false,
            turn: PlayerEnum.white,
            depth: 1,
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
        };
    };
    resetState = (newGameId, gameType) => {
        this.setState(this.getDefaultStateObject(newGameId, gameType));
        this.game = new Chess();
        console.log("state reseted");
    };

    state = this.getDefaultStateObject(1, GameType.GolemVsGolem);

    //    status = StatusEnum.none;
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
        let { gameId } = this.props.match.params;
        console.log("str id #" + gameId + "#");
        gameId = parseInt(gameId);
        this.setState({ gameId });

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
        socket.on("gameData", this.handleGameData);

        socket.on("connect", (data) => {
            socket.emit("getGameData", { gameId });
            console.log("emit " + gameId);
        });
        // setTimeout(() => {

        //}, 1000);
    }

    loadGame = (data) => {
        console.log("loading data:");
        console.log(data);
        this.setState({
            fen: data.fen,
            gameLoaded: true,
            turn: data.globalTurn,
            depth: 0,
            taskId: data.taskId,
            gameId: data.gameId,
            stepId: data.stepId,
            moves: data.moves,
            statusLines: createStatusLines(),
            white_stats: createDefaultStats(),
            black_stats: createDefaultStats(),
            isNewGameButtononDisabled: false,
            dropSquareStyle: {},
            squareStyles: {},
            pieceSquare: "",
            square: "",
            history: [],
            playerColor: data.playerColor,
            gameType: data.gameType,
        });
    };
    handleGameData = (data) => {
        const { status } = data;
        if (status === 404) {
            this.setState({ loadingTitle: "Can't find game with given id" });
        } else {
            this.loadGame(data.result);
        }

        console.log("load game: " + data.result.gameId);
    };
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
        const { gameId } = params;
        if (gameId !== this.state.gameId) return;
        //move somewhere else:
        this.SetAllStatusLinesInactive();
        this.ChangeStatusLine("calculationRequested", StatusBar.Active, null, null);
    };
    handleSubscriptionCreated = (params) => {
        const { gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("subscriptionCreated", StatusBar.Active, null, null);
    };

    handleProposalsReceived = (params) => {
        console.log("proposals:", params);
        const { proposalsCount, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("proposalsReceived", StatusBar.Active, null, proposalsCount);
    };
    handleOffersReceived = (params) => {
        const { offersCount, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("offersReceived", StatusBar.Active, null, offersCount);
    };
    handleAgreementCreated = (params) => {
        const { providerName, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("agreementCreated", StatusBar.Active, null, providerName);
    };
    handleAgreementConfirmed = (params) => {
        const { providerName, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("agreementConfirmed", StatusBar.Active, null, providerName);
        this.confirmedWorkers++;
        console.log("confirmed workers: " + this.confirmedWorkers);
        this.status = StatusEnum.provider_confirmed;
    };
    handleScriptSent = (params) => {
        const { providerName, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.ChangeStatusLine("scriptSent", StatusBar.Active, null, providerName);
    };
    handleComputationStarted = (params) => {
        console.log("started started started");
        const { gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.status = StatusEnum.searching;
        this.ChangeStatusLine("computationStarted", StatusBar.Active, null, null);
    };
    handleComputationFinished = (params) => {
        const { time, gameId } = params;
        if (gameId !== this.state.gameId) return;
        let timeInSec = Math.round(time / 1000);
        this.ChangeStatusLine("computationFinished", StatusBar.Active, null, timeInSec + "s");
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
        const { taskId, stepId, turnId, depth, gameId } = params;
        if (gameId !== this.state.gameId) return;
        this.setState({
            taskId,
            stepId,
            turn: turnId,
            depth,
        });
        this.resetTimer();
        this.startTimer();
    };

    handlePositionEvent = (params) => {
        const { position, gameId } = params;
        if (gameId !== this.state.gameId) return;

        this.game.load(position);
        this.setState({ fen: position });
    };
    handleMoveEvent = (moveData) => {
        const { move, gameId } = moveData; //depth, time
        if (gameId !== this.state.gameId) return;

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
        console.log("color:" + this.state.playerColor);
        console.log("turn:" + this.state.turn);
        console.log("game:" + this.state.gameType);
        const res =
            this.state.gameType === GameType.PlayerVsGolem &&
            this.state.playerColor === this.state.turn;
        console.log("eq: " + res);
        return res;
    };
    render() {
        return (
            <div>
                {this.state.gameLoaded && (
                    <div>
                        <div>
                            <CardGroup>
                                <NewGame
                                    disabled={this.state.isNewGameButtononDisabled}
                                    onClick={this.handleNewGameClick}
                                />
                                <ChessStatusBar
                                    turn={this.state.turn.toUpperCase()}
                                    moveNumber={this.state.stepId}
                                    depth={this.state.depth}
                                    secondsComputing={this.state.secondsComputing}
                                    gameId={this.state.gameId}
                                    taskId={this.state.taskId}
                                    statusLines={createStatusLines()}
                                />
                                <GolemStatusBar
                                    turn={this.state.turn.toUpperCase()}
                                    moveNumber={this.state.stepId}
                                    depth={this.state.depth}
                                    secondsComputing={this.state.secondsComputing}
                                    taskId={this.state.taskId}
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
                )}
                {!this.state.gameLoaded && (
                    <div>
                        <h1>loading game with id {this.state.gameId}</h1>
                        <h2>{this.state.loadingTitle}</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default ChessGame;
