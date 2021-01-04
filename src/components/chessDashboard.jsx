import React, { Component } from 'react';
import Chessboard from "chessboardjsx";
import socket from "./../services/socketService";
import { toast } from "react-toastify";
class ChessDashboard extends Component {

    state = { fen: "start", statusBar:"" };
   

    componentDidMount() {
        
        socket.on("positionEvent", this.handlePositionEvent);
        socket.on("moveEvent", this.handleMoveEvent);
        socket.on("workerFailed", this.handleWorkerFailed);
        socket.on("agreementCreated", this.handleAgreementCreated);
        socket.on("agreementConfirmed", this.handleAgreementConfirmed);
        socket.on("computationFinished", this.handleComputationFinished);
      };
      handleComputationFinished = (params) => {
        const {taskId,time} = params;
        let timeInSec = Math.round(time/1000);
        toast.info("computation finished in : "+time+"ms  (~ "+timeInSec+"s )");
      }; 
      handleAgreementConfirmed = (params) => {
        const {taskId,workerName} = params;
        console.log("agreement confirmed...");
        console.log(params);          
        this.setState({ statusBar:"agreement confirmed taskId: " + taskId + " / worker: "+workerName });
      }; handleAgreementCreated = (params) => {
        const {taskId,workerName} = params;
        console.log("agreement created...");
        console.log(params);          
        this.setState({ statusBar:"agreement created taskId: " + taskId + " / worker: "+workerName });
      };
      handlePositionEvent = (params) => {
        console.log("position event...");
        console.log(params);          
        const {fen}=params;
        console.log("chess pos", fen);
        this.setState({ fen });
      };
      handleMoveEvent = (bestmove) => {
          const {move,depth,time}=bestmove;
        console.log("move event...");
        console.log(move);          
        if(move!=="test")
        toast.info("move : "+move +"\ntime: "+time);
      };
      handleWorkerFailed = (worker) => {
        console.log("worker failed...");
        console.log(worker);          
        if(worker!=="test")
        toast.error("worker failed : "+worker.workerName);
      };
   
    render() { 
        return ( <div><h1>{this.state.statusBar}</h1><Chessboard
            width={512}
            id="random"
            position={this.state.fen}
            transitionDuration={300}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
          /></div> );

    }
}
 
export default ChessDashboard;