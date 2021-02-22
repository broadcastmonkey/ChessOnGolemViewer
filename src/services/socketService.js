import io from "socket.io-client";

const NAME = process.env.REACT_APP_NAME;
const ENDPOINT = process.env.REACT_APP_SOCKET_SERVER_URL;
console.log(NAME + " // end point : " + ENDPOINT);
console.log(process.env);
console.log(process.env.NODE_ENV);
const socket = io(ENDPOINT);

export default socket;
