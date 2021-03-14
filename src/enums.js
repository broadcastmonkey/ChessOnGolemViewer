export const PlayerEnum = {
    white: "white",
    black: "black",
};
export const PlayerType = {
    GOLEM: "golem",
    HUMAN: "human",
};
export const GameTableType = {
    ALL: "all",
    PLAYER_GAMES: "player_games",
};

export const StatusEnum = {
    none: 1,
    searching: 2,
    provider_confirmed: 3,
    finished: 4,
    game_end: 5,
    wednesday: 6,
};
export const GameType = { GolemVsGolem: "Golem vs Golem", PlayerVsGolem: "Player vs Golem" };

export const StatusBar = {
    Active: "golemStatusActive",
    Inactive: "golemStatusInactive",
    Ok: "golemStatusOk",
    Failed: "golemStatusFailed",
};
