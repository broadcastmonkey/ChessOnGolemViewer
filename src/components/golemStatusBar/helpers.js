import moment from "moment";
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
        displayOtherStats: true,
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
function GetTimeDifference(unix) {
    let momentNow = moment(Date.now());
    let momentLastMove = moment(unix);
    //console.log("---------");
    //  console.log("moment now  : " + momentNow.format());
    // console.log("moment last : " + momentLastMove.format());

    const diff = moment.duration(momentNow.diff(momentLastMove)); // moment(momentNow - momentLastMove).utc();
    // console.log("diff : " + diff.format());
    // let result = diff.format("D[ day(s)] H[ hour(s)] m[ minute(s)] s[ second(s) ago.]");

    //Get Days and subtract from duration
    var days = Math.floor(diff.asDays());
    diff.subtract(moment.duration(days, "days"));

    //Get hours and subtract from duration
    var hours = diff.hours();
    diff.subtract(moment.duration(hours, "hours"));

    //Get Minutes and subtract from duration
    var minutes = diff.minutes();
    diff.subtract(moment.duration(minutes, "minutes"));
    // var seconds = diff.seconds();
    // console.log(days, hours, minutes, seconds);
    //console.log(result);
    //  console.log("---------");

    if (days > 1) return `${days} days ago`;
    if (days === 1) return "yesterday";
    if (hours > 1) return `${hours} hours ago`;
    if (hours === 1) return "hour ago";
    if (minutes > 1) return `${minutes} minutes ago`;
    if (minutes === 1) return "minute ago";
    return "seconds ago";
}
export {
    createCurrentTaskState,
    createStatusLine,
    createStatusLines,
    createDefaultStats,
    createDefaultGameState,
    GetTimeDifference,
};
