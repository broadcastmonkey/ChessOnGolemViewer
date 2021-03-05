const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
        [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        ...(history.length && {
            [sourceSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
        }),
        ...(history.length && {
            [targetSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)",
            },
        }),
    };
};

export { squareStyling };
