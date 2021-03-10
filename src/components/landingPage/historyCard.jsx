import { Button, Dropdown } from "react-bootstrap";
import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Auth, { login } from "../../services/authService";
import socket from "../../services/socketService";
import { Link } from "react-router-dom";
import Form from "./../common/forms/form";
import Joi from "joi-browser";
import { Modal } from "react-bootstrap";
class HistoryCard extends Form {
    state = {
        data: { login: "", passphrase: "" },
        dataReRegister: { login: "", password: "" },
        nick: "",
        loginVisible: true,
        registrationInfo: "",
        loginInfo: "",
        errors: {},
        showModal: false,
    };
    schema = {
        login: Joi.string().min(2).max(8).required().label("Nick"),
        passphrase: Joi.optional(),
    };

    componentDidMount = () => {
        socket.on("registerUser", this.handleRegisterUser);
        socket.on("loginUser", this.handleLoginUser);

        const user = Auth.getCurrentUser();
        console.log("user");
        console.log(user);
        if (user !== null) this.setState({ nick: user.login });
    };
    componentWillUnmount() {
        socket.removeListener("registerUser", this.handleRegisterUser);
        socket.removeListener("loginUser", this.handleLoginUser);
    }
    handleRegisterUser = (data) => {
        const { status, msg, jwt, login } = data;
        if (status === 201) {
            Auth.loginSucceful(data.jwt);
            this.setState({ registrationInfo: "registration succesful" });
            const user = Auth.getCurrentUser();
            console.log("user");
            console.log(user);
            if (user !== null) this.setState({ nick: user.login });
        } else if (status === 409) {
            this.setState({
                registrationInfo:
                    login + " - this nick is already claimed, please choose different one",
            });
        }
    };

    handleLoginUser = (data) => {
        const { status, jwt } = data;
        if (status === 200) {
            Auth.loginSucceful(jwt);
            this.setState({ registrationInfo: "login succesful" });
            const user = Auth.getCurrentUser();
            console.log("user");
            console.log(user);
            if (user !== null) this.setState({ nick: user.login });
        } else if (status === 401) {
            this.setState({
                loginInfo: "login (and/or) passphrase are wrong",
            });
        }
    };

    renderLoginControls = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmitLogin}>
                    {this.renderInput("login", "Your nick")}
                    {this.renderInput("passphrase", "Your passphrase")}{" "}
                    <h5>{this.state.loginInfo}</h5>
                    {this.renderButton("Login")}
                </form>
            </div>
        );
    };
    handleRegisterUserClick = () => {
        Auth.registerUser(this.state.data.login);
    };
    handleLogin = () => {
        Auth.login(this.state.data.login, this.state.data.passphrase);
    };
    handleSubmitLogin = (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.handleLogin();
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;

        this.handleRegisterUserClick();
    };

    renderRegisterControls = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("login", "Your nick")} <h5>{this.state.registrationInfo}</h5>
                    {this.renderButton("Claim nick")}
                </form>
            </div>
        );
    };
    renderNotLoggedIn = () => {
        return (
            <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                <Card.Header>
                    <h2>
                        Play against golem
                        <Link to="/game/new">
                            <Button style={{ float: "right" }} variant="primary">
                                Start game as a guest
                            </Button>
                        </Link>
                    </h2>{" "}
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <b>
                            For best experience{" "}
                            <Link
                                onClick={() => {
                                    this.setState({ loginVisible: true });
                                }}
                            >
                                log in
                            </Link>{" "}
                            or{" "}
                            <Link
                                onClick={() => {
                                    this.setState({ loginVisible: false });
                                }}
                            >
                                claim nick
                            </Link>
                        </b>
                    </Card.Title>
                    <Card.Text>
                        {this.state.loginVisible === true
                            ? this.renderLoginControls()
                            : this.renderRegisterControls()}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    };
    handleLogout = () => {
        Auth.logout();
        this.setState({ nick: "", isLoggedIn: false });
    };
    showModal = () => {
        this.setState({ showModal: true });
    };
    hideModal = () => {
        this.setState({ showModal: false });
    };

    renderLoggedIn = () => {
        return (
            <React.Fragment>
                <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                    <Card.Header>
                        <h2>
                            <Dropdown style={{ width: 200, float: "left" }}>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {this.state.nick}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={this.handleLogout}>
                                        Logout
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        style={{ color: "red" }}
                                        onClick={this.showModal}
                                    >
                                        Remove account and all associated games
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Link style={{ width: 100, height: 20 }} to="/game/new">
                                <Button style={{ float: "right" }} variant="primary">
                                    Play against golem
                                </Button>
                            </Link>
                        </h2>{" "}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <b>History of your games against golem:</b>
                        </Card.Title>
                        <Card.Text>yet to be implemented</Card.Text>
                    </Card.Body>
                </Card>{" "}
                <Modal show={this.state.showModal} onHide={this.showModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete your account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        This action is irreversible. <br />
                        <br />
                        Are you sure?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={this.hideModal}>
                            Delete account
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    };
    render() {
        const user = Auth.getCurrentUser();
        const isLoggedIn = user !== null;
        console.log(isLoggedIn);
        if (isLoggedIn === true) return this.renderLoggedIn();
        else return this.renderNotLoggedIn();
    }
}

export default HistoryCard;
