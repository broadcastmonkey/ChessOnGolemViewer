function defaultStatsObject() {
    return {
        total_moves: 0,
        avg_depth: 0,
        total_vm_time: 0,
        total_time: 0,
        total_cost: 0,
        avg_vm_time: 0,
        avg_golem_time: 0,
        best_golem_time: 0,
    };
}
function getMoveStats(moves, turn, playerColor) {
    if (
        moves.length === 0 ||
        moves.filter((x) => x.turn === turn && x.move !== undefined).length === 0
    ) {
        return defaultStatsObject();
    }

    let stats = {};
    stats.displayOtherStats = turn !== playerColor;
    stats.total_moves = moves.filter((x) => x.turn === turn && x.move !== undefined).length;
    stats.avg_depth =
        moves
            .filter((x) => x.turn === turn && x.move !== undefined)
            .map((x) => x.depth)
            .reduce((a, c) => a + c) / stats.total_moves;
    stats.total_vm_time = moves
        .filter((x) => x.turn === turn && x.move !== undefined)
        .map((x) => parseFloat(x.vm_time) / 1000)
        .reduce((a, c) => a + c)
        .toFixed(3);
    stats.total_time = moves
        .filter((x) => x.turn === turn && x.move !== undefined)
        .map((x) => (x.total_time === undefined ? 0.0 : parseFloat(x.total_time) / 1000))
        .reduce((a, c) => a + c)
        .toFixed(3);

    stats.avg_vm_time = (stats.total_vm_time / stats.total_moves).toFixed(3);
    stats.avg_golem_time = (stats.total_time / stats.total_moves).toFixed(3);
    stats.best_golem_time = Math.min(
        ...moves
            .filter((x) => x.turn === turn && x.move !== undefined)
            .map((x) => (x.total_time === undefined ? 9999.0 : parseFloat(x.total_time) / 1000)),
    ).toFixed(3);
    if (stats.best_golem_time === 9999.0) stats.best_golem_time = "-";

    stats.total_cost = moves
        .filter((x) => x.turn === turn && x.move !== undefined)
        .map((x) => (x.cost === undefined ? 0.0 : parseFloat(x.cost)))
        .reduce((a, c) => a + c);
    return stats;
}

export { getMoveStats };
