function createStatusLine(id, text, type, value) {
    return { id: id, text: text, type: type, value: value };
}

function createStatusLines() {
    const defaultStatus = "golemStatusInactive";

    const lines = [];
    lines.push(createStatusLine("calculationRequested", "requesting task", defaultStatus));
    lines.push(
        createStatusLine("computationStarted", "initializing golem executor", defaultStatus),
    );
    lines.push(createStatusLine("subscriptionCreated", "offer is in the market", defaultStatus));
    lines.push(createStatusLine("proposalsReceived", "gathering proposals", defaultStatus));
    lines.push(createStatusLine("offersReceived", "gathering offers", defaultStatus));
    lines.push(createStatusLine("agreementCreated", "offer created", defaultStatus));
    lines.push(createStatusLine("agreementConfirmed", "offer accepted", defaultStatus));
    lines.push(createStatusLine("scriptSent", "task sent to provider", defaultStatus));
    lines.push(createStatusLine("computationFinished", "calculation finished", defaultStatus));
    lines.push(createStatusLine("sendChessMove", "result downloaded", defaultStatus));

    return lines;
}

function createDefaultStats() {
    return {
        total_moves: 0,
        avg_depth: 0,
        total_vm_time: 0,
        avg_vm_time: 0,
        avg_golem_time: 0,
        best_golem_time: 0,
        total_time: 0,
        total_cost: 0,
    };
}
function createCurrentTaskState() {
    return {
        stepId: 0,
        proposalsReceived: 0,
        status: "...",
        statusStats: "a..",
        depth: 1,
        secondsComputing: 0,
        statusLines: createStatusLines(),
    };
}
function createDefaultGameState() {
    return {
        fen: "start",
        turn: "white",
        gameId: 1,
        moves: [],
        interval: {
            intervalEnabled: false,
            intervalId: 0,
        },
        white_stats: createDefaultStats(),
        black_stats: createDefaultStats(),
    };
}

export {
    createCurrentTaskState,
    createStatusLine,
    createStatusLines,
    createDefaultStats,
    createDefaultGameState,
};
