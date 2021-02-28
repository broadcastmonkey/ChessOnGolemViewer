function createStatusLine(id, text, type, value) {
    return { id: id, text: text, type: type, value: value };
}

function createStatusLines() {
    const defaultStatus = "golemStatusInactive";

    const lines = [];
    lines.push(createStatusLine("calculationRequested", "requesting task", defaultStatus));
    lines.push(createStatusLine("subscriptionCreated", "offer is in the market", defaultStatus));
    lines.push(createStatusLine("proposalsReceived", "gathering proposals", defaultStatus));
    lines.push(createStatusLine("offersReceived", "gathering offers", defaultStatus));
    lines.push(createStatusLine("agreementCreated", "offer created", defaultStatus));
    lines.push(createStatusLine("agreementConfirmed", "offer accepted", defaultStatus));
    lines.push(createStatusLine("computationStarted", "calculation started", defaultStatus));
    lines.push(createStatusLine("computationFinished", "calculation finished", defaultStatus));
    lines.push(createStatusLine("sendChessMove", "result downloaded", defaultStatus));

    return lines;
}

export { createStatusLine, createStatusLines };
