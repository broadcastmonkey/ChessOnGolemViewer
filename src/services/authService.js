//import http from "./httpService";

import jwtDecode from "jwt-decode";

//const apiEndpoint = "/auth";
import socket from "./socketService";

const tokenKey = "token";

//http.setJwt(getJwt());

export async function login(login, password) {
    console.log("loging in");
    socket.emit("loginUser", { login, password });
    // try {
    /* const { data: jwt } = await http.post(apiEndpoint, { login, password });
    console.log("data : ", jwt);
    localStorage.setItem(tokenKey, jwt);*/
    // } catch (ex) {
    //   if (ex.response && ex.response.status) {
    //   }
    // }
}
export function loginSucceful(jwt) {
    localStorage.setItem(tokenKey, jwt);
}
export async function registerUser(login) {
    console.log("registering");
    socket.emit("registerUser", { login });
    // try {
    // const { data: jwt } = await http.post(apiEndpoint, { login, password });
    //  console.log("data : ", jwt);
    //  localStorage.setItem(tokenKey, jwt);
    // } catch (ex) {
    //   if (ex.response && ex.response.status) {
    //   }
    // }
}
export async function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function logout() {
    localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        if (jwt === null || jwt === undefined) return null;
        const user = jwtDecode(jwt);
        return user;
    } catch (ex) {
        return null;
    }
}
export function getJwt() {
    return localStorage.getItem(tokenKey);
}
export default {
    login,
    loginSucceful,
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt,
    registerUser,
};
