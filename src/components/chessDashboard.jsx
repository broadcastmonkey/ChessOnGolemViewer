import React, { Component } from 'react';
import Chessboard from "chessboardjsx";
import socket from "./../services/socketService";
import { toast } from "react-toastify";
class ChessDashboard extends Component {


   

    componentDidMount() {
        
        socket.on("positionEvent", this.handlePositionEvent);
        socket.on("moveEvent", this.handleMoveEvent);
      }
      handlePositionEvent = (params) => {
        console.log("position event...");
        console.log(params);          
        const {fen}=params;
        console.log("chess pos", fen);
        this.setState({ fen });
      };
      handleMoveEvent = ({move}) => {
        console.log("move event...");
        console.log(move);          
        if(move!=="test")
        toast.info("move : "+move)
      };
    state = { fen: "start" };
    render() { 
        return ( <div><Chessboard
            width={1024}
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