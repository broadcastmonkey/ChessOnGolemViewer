import jwtDecode from "jwt-decode";

import socket from "./socketService";
import { v4 as uuidv4 } from "uuid";

import crypto from "crypto";

const tokenKey = "token";
const localtokenKey = "lc_chess";

//http.setJwt(getJwt());

export function login(login, password) {
    //  console.log("loging in");
    socket.emit("loginUser", { login, password });
}

export function getLocalToken() {
    let localToken = localStorage.getItem(localtokenKey);
    if (localToken !== null) return localToken;
    localToken = uuidv4();
    localStorage.setItem(localtokenKey, localToken);
    return localToken;
}
export function loginSucceful(jwt) {
    localStorage.setItem(tokenKey, jwt);
}
export function registerUser(login) {
    //  console.log("registering");
    socket.emit("registerUser", { login });
}
export function getAuthToken() {
    const user = getCurrentUser();
    if (user == null) {
        return { auth_type: "local", token: getLocalToken() };
    }
    return { auth_type: "server", token: localStorage.getItem(tokenKey) };
}
export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function logout() {
    localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        if (jwt === null) return null;
        const user = jwtDecode(jwt);
        return user;
    } catch (ex) {
        return null;
    }
}
export function isClientOwnerOfGame(playerLogin, secret) {
    if (playerLogin === undefined || playerLogin === "") return false;
    const token = localStorage.getItem(tokenKey);
    const localToken = localStorage.getItem(localtokenKey);
    if (token === null && localToken === null) return false;
    if (token !== null) {
        const user = jwtDecode(token);
        return user.login === playerLogin;
    }
    console.log(localToken);
    console.log(crypto.createHash("sha256").update(localToken).digest("hex"));
    return secret === crypto.createHash("sha256").update(localToken).digest("hex");
}
export function getJwt() {
    return localStorage.getItem(tokenKey);
}

const Auth = {
    login,
    getAuthToken,
    getLocalToken,
    loginSucceful,
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt,
    registerUser,
    isClientOwnerOfGame,
};
export default Auth;
