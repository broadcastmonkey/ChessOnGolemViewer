import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import socket from "./../services/socketService";
import { toast } from "react-toastify";
import { getMockMoves } from "../services/mockMovesService";
import MovesTable from "./movesTable";
import "./chessDashboard.css";
import { Card } from "react-bootstrap";

class ChessDashboard extends Component {
  state = {
    fen: "start",
    statusBar: "",
    turn: "white",
    statusColor: "info",
    moveNumber: 14,
    depth: 7,
    status: "searching for offer",
    statusStats: "stats",
    taskId: "",
    gameId: "",
    intervalEnabled: false,
    secondsComputing: 0,
    intervalId: 0,
    moves: getMockMoves(22),
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
    socket.on("movesRefreshed", this.handleMovesRefreshed);
  }
  handleGameFinished = (params) => {
    // const { winner, type } = params;
  };

  handleMovesRefreshed = (incoming) => {
    let moves = [];
    for (const [key, value] of Object.entries(incoming)) {
      moves.push(value);
    }

    console.log("moves");
    console.log(moves);
    this.setState({ moves });
  };

  handleOffersReceived = (params) => {
    const { offersCount, taskId } = params;
    if (this.state.taskId !== taskId) return;
    if (this.status === this.StatusEnum.searching) {
      this.setState({
        statusStats: `${offersCount} proposals received...`,
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
      status: "searching for best offer...",
      statusStats: "offer is in the market...",
    });
    console.log("current turn event");
    console.log(params);
    this.resetTimer();
    this.startTimer();
  };
  handleComputationStarted = (params) => {
    const { taskId } = params;
    if (this.state.taskId !== taskId) return;
    this.status = this.StatusEnum.searching;
    this.setState({
      statusStats: "search started...",
    });
  };
  handleComputationFinished = (params) => {
    console.log("computation finished !! ");
    console.log(params);
    const { taskId, time } = params;
    //if (this.state.taskId !== taskId) return;
    let timeInSec = Math.round(time / 1000);
    toast.info(
      `computation with task_id: ${taskId} finished in : ${time} + ms  (~ ${timeInSec}s )`
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
      toast.info("move : " + move + "depth : " + depth + "\ntime: " + time);
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

    return <MovesTable users={moves} />;
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
  getTextColor() {
    let variant = this.state.statusColor;
    if (variant === "light" || variant === "warning") return "dark";
    return "light";
  }
  renderHeader = () => {
    let variant = this.state.statusColor;
    return (
      <Card
        bg={variant.toLowerCase()}
        text={this.getTextColor()}
        style={{ width: "512" }}
        className="mb-2 mt-2"
      >
        <Card.Header>
          <b>Turn: {this.state.turn.toUpperCase()}</b>
          <b className="ml-5">Move number: {this.state.moveNumber}</b>
          <b className="ml-5">Algorithm Depth: {this.state.depth}</b>

          <b className="ml-5"> {this.state.secondsComputing}s</b>
          <b className="ml-5"> task id: {this.state.taskId}</b>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.state.status} </Card.Title>
          <Card.Text>{this.state.statusStats}</Card.Text>
        </Card.Body>
      </Card>
    );
  };
  render() {
    return (
      <div>
        <div>{this.renderHeader()}</div>
        <div className="chess-wrapper">
          <div className="chess-board">{this.renderChessBoard()}</div>
          <div className="chess-table">{this.renderTable()}</div>
        </div>
      </div>
    );
  }
}

export default ChessDashboard;
