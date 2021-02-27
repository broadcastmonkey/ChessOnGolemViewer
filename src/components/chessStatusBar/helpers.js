function createStatusLine(id, text, type) {
    return { id: id, text: text, type: type };
}

function createStatusLines() {
    const defaultStatus = "golemStatusInactive";

    const lines = [];
    lines.push(createStatusLine("task_request", "requesting task", defaultStatus));
    lines.push(createStatusLine("offer_in_market", "offer is in the market", defaultStatus));
    lines.push(createStatusLine("garthering_proposals", "gathering proposals", defaultStatus));
    lines.push(createStatusLine("gathering_offers", "gathering offers", defaultStatus));
    lines.push(createStatusLine("offer_accepted", "offer accepted", defaultStatus));
    lines.push(createStatusLine("calculation_started", "calculation started", defaultStatus));
    lines.push(createStatusLine("calculation_finished", "calculation finished", defaultStatus));
    lines.push(createStatusLine("result_downloaded", "result downloaded", defaultStatus));
    console.log("====");
    console.log(lines);
    return lines;
}

export { createStatusLine, createStatusLines };
