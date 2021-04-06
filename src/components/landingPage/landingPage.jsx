import React, { Component } from "react";
import { Card, CardGroup, Button } from "react-bootstrap";
import socket from "../../services/socketService";
import GamesTable from "../gamesTable";
import StatsCard from "./statsCard";
import { GameType } from "./../../enums";
import HistoryCard from "./historyCard";
import ActiveGamesCard from "./activeGamesCard";
import Pagination from "./../common/table/pagination";
import { paginate } from "./../common/table/paginate";

class LandingPage extends Component {
    state = {
        currentPage: 1,
        pageSize: 10,
        activeGamesCount: 0,
        totalGamesCount: 0,
        golemVsGolemGamesCount: 0,
        playerVsGolemGamesCount: 0,
        isGolemVsGolemActive: false,
        golemVsGolemGameId: false,
        totalMovesCount: 0,
        allGames: [],
    };
    componentDidMount() {
        socket.on("gamesData", this.handleGamesData);
        socket.on("newGolemVsGolemGame", this.handleNewGolemVsGolemGame);
        if (socket.connected) {
            socket.emit("getGames");
            //console.log("connected and get games");
        } else
            socket.on("connect", (data) => {
                socket.emit("getGames");
                //    console.log("emit get games");
            });
    }
    componentWillUnmount() {
        socket.removeListener("gamesData", this.handleGamesData);
        socket.removeListener("newGolemVsGolemGame", this.handleNewGolemVsGolemGame);
    }
    handleNewGolemVsGolemGame = (data) => {
        const { gameId } = data;
        this.props.history.push("/game/" + gameId);
    };
    handleGamesData = (data) => {
        console.log(data);
        const totalGamesCount = data.games.length;
        const activeGamesCount = data.games.filter((x) => x.isGameFinished === false).length;
        const golemVsGolemGamesCount = data.games.filter(
            (x) => x.gameType === GameType.GolemVsGolem,
        ).length;
        const playerVsGolemGamesCount = data.games.filter(
            (x) => x.gameType === GameType.PlayerVsGolem,
        ).length;
        const isGolemVsGolemActive =
            data.games.filter(
                (x) => x.isGameFinished === false && x.gameType === GameType.GolemVsGolem,
            ).length > 0;

        const totalMovesCount = data.games.reduce((a, b) => a + b.movesCount, 0);

        const golemVsGolemGameId = isGolemVsGolemActive
            ? data.games.filter(
                  (x) => x.isGameFinished === false && x.gameType === GameType.GolemVsGolem,
              )[0].gameId
            : 0;
        this.setState({
            allGames: data.games,
            totalGamesCount,
            activeGamesCount,
            golemVsGolemGamesCount,
            playerVsGolemGamesCount,
            isGolemVsGolemActive,
            golemVsGolemGameId,
            totalMovesCount,
        });
        //  console.log(`allgames`);
        //  console.log(this.state.allGames);
    };
    handleRowClick = (gameId) => {
        //  console.log("clcied " + gameId);
        this.props.history.push("/game/" + gameId);
    };
    handleRequestNewGolemVsGolemGame = () => {
        socket.emit("newGolemVsGolemGameRequest");
    };

    getPagedData = () => {
        const { pageSize, currentPage, allGames } = this.state;

        let filtered = allGames;

        const games = paginate(filtered, currentPage, pageSize);

        return { totalCount: filtered.length, data: games };
    };
    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    render() {
        const { totalCount, data: games } = this.getPagedData();
        const { pageSize, currentPage } = this.state;
        return (
            <div>
                <Card bg="info" text="white" className="mb-2 mt-2">
                    <Card.Header>
                        <h2>Welcome!</h2>
                    </Card.Header>
                    <Card.Body>
                        <b>Chess on Golem</b> is web app that enables users to play chess against AI
                        powered by the{" "}
                        <a
                            style={{ textDecoration: "underline", color: "white" }}
                            href="http://golem.network"
                        >
                            Golem Network.
                        </a>
                        <br />
                        <br />
                        <a href="https://github.com/broadcastmonkey/chessongolem">
                            <Button variant="primary">Learn more</Button>
                        </a>
                    </Card.Body>
                </Card>
                <div>
                    <CardGroup>
                        {" "}
                        <HistoryCard games={this.state.allGames} rowClick={this.handleRowClick} />
                        <StatsCard
                            totalGamesCount={this.state.totalGamesCount}
                            playerVsGolemGamesCount={this.state.playerVsGolemGamesCount}
                            golemVsGolemGamesCount={this.state.golemVsGolemGamesCount}
                            activeGamesCount={this.state.activeGamesCount}
                            golemVsGolemGameId={this.state.golemVsGolemGameId}
                            isGolemVsGolemActive={this.state.isGolemVsGolemActive}
                            requestGameCallback={this.handleRequestNewGolemVsGolemGame}
                            totalMovesCount={this.state.totalMovesCount}
                        />
                        <ActiveGamesCard
                            totalGamesCount={this.state.totalGamesCount}
                            activeGamesCount={this.state.activeGamesCount}
                            games={this.state.allGames}
                            rowClick={this.handleRowClick}
                        />
                    </CardGroup>
                </div>

                <Card bg="light" text="dark" className="mb-2 mt-2">
                    <Card.Header>
                        <h2>All games</h2>{" "}
                    </Card.Header>
                    <Card.Body>
                        <GamesTable games={games} rowClick={this.handleRowClick} />{" "}
                        <Pagination
                            itemsCount={totalCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={this.handlePageChange}
                        />
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default LandingPage;
