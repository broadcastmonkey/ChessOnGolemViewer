import { Button, Dropdown } from "react-bootstrap";
import React from "react";
import { Card } from "react-bootstrap";
import Auth from "../../services/authService";
import socket from "../../services/socketService";
import Form from "./../common/forms/form";
import Joi from "joi-browser";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./historyCard.css";

class HistoryCard extends Form {
    state = {
        data: { login: "", passphrase: "" },
        dataReRegister: { login: "", password: "" },
        nick: "",
        loginVisible: 1,
        registrationInfo: "",
        loginInfo: "",
        difficultyLevel: "beginner",
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
        // console.log("user");
        // console.log(user);
        if (user !== null) this.setState({ nick: user.login });
    };
    componentWillUnmount() {
        socket.removeListener("registerUser", this.handleRegisterUser);
        socket.removeListener("loginUser", this.handleLoginUser);
    }
    handleRegisterUser = (data) => {
        const { status, login } = data;
        if (status === 201) {
            Auth.loginSucceful(data.jwt);
            this.setState({ registrationInfo: "registration succesful" });
            const user = Auth.getCurrentUser();
            // console.log("user");
            //  console.log(user);
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
    renderDifficultyDropDown = () => {
        return (
            <Dropdown style={{ float: "right" }}>
                <Dropdown.Toggle variant="secondary" id="difficulty-level">
                    {this.state.difficultyLevel}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.setState({ difficultyLevel: "beginner" })}>
                        beginner
                    </Dropdown.Item>
                    <Dropdown.Item
                        /*style={{ backgroundColor: "red" }}*/
                        onClick={() => this.setState({ difficultyLevel: "casual player" })}
                    >
                        casual player
                    </Dropdown.Item>{" "}
                    <Dropdown.Item
                        onClick={() => this.setState({ difficultyLevel: "experienced" })}
                    >
                        experienced
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => this.setState({ difficultyLevel: "chess master" })}
                    >
                        chess master
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => this.setState({ difficultyLevel: "grandmaster" })}
                    >
                        grandmaster
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };
    getDepth = () => {
        switch (this.state.difficultyLevel) {
            case "beginner":
                return 1;
            case "casual player":
                return 4;
            case "experienced":
                return 8;
            case "chess master":
                return 12;
            case "grandmaster":
                return 18;
            default:
                return 1;
        }
    };
    renderPlayButton = () => {
        return (
            <React.Fragment>
                {" "}
                {this.renderDifficultyDropDown()}
                <Link style={{ float: "right" }} to={"/game/new/" + this.getDepth()}>
                    <Button variant="primary">Start new game against golem </Button>
                </Link>{" "}
            </React.Fragment>
        );
    };
    renderPlayGuestButton = () => {
        return (
            <React.Fragment>
                <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 40, marginBottom: 10 }}
                >
                    <b>or set difficulty level</b>
                </div>{" "}
                <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 10, marginBottom: 10 }}
                >
                    {this.renderDifficultyDropDown()}
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: 20, marginBottom: 40 }}
                >
                    <Link to={"/game/new/" + this.getDepth()}>
                        <Button variant="primary">and start game as a guest</Button>
                    </Link>{" "}
                </div>
            </React.Fragment>
        );
    };

    renderNotLoggedIn = () => {
        return (
            <Card bg="light" text="dark" className="mb-2 mt-2 ml-2">
                <Card.Header>
                    <h2>Play against golem</h2>{" "}
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <h4>
                            For best experience{" "}
                            <button
                                className="as-link btn-link"
                                onClick={() => {
                                    this.setState({ loginVisible: 1 });
                                }}
                            >
                                log in
                            </button>{" "}
                            or{" "}
                            <button
                                className="as-link btn-link"
                                onClick={() => {
                                    this.setState({ loginVisible: 2 });
                                }}
                            >
                                claim nick
                            </button>
                        </h4>
                    </Card.Title>

                    {this.state.loginVisible === 1 && this.renderLoginControls()}
                    {this.state.loginVisible === 2 && this.renderRegisterControls()}
                    {this.state.loginVisible === 3 && this.renderPlayGuestButton()}

                    {this.state.loginVisible !== 3 && (
                        <div>
                            <hr />
                            <h6 style={{ float: "right" }}>
                                You can also
                                <button
                                    className="as-link btn-link"
                                    onClick={() => {
                                        this.setState({ loginVisible: 3 });
                                    }}
                                >
                                    play as guest
                                </button>
                            </h6>
                        </div>
                    )}
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
                                <Dropdown.Toggle variant="info" id="dropdown-basic">
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
                            {this.renderPlayButton()}
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
