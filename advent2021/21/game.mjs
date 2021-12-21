export { detDie, play, winner, hash, multiPlay };

let detDie = (i) => [(i%100) + 1, i + 1 ];

let splice = (arr, start, deleteCount, ...items) => arr.slice(0, start).concat(items).concat(arr.slice(start+deleteCount));

// player: { score, position }
// game: { turn, rolls, rollTotal, players }
let step = (game, roll) => {
    let rollTotal = game.rollTotal + roll;
    game = { ...game, rolls: game.rolls + 1, rollTotal };
    if (game.rolls < 3) {
        return game;
    }
    let currentPlayer = game.turn % game.players.length;
    let { score, position } = game.players[currentPlayer];
    position = (position + rollTotal) % 10;
    score += position + 1;
    return {
        rolls: 0,
        rollTotal: 0,
        turn: game.turn + 1,
        players: splice(game.players, currentPlayer, 1, { score, position }),
    }
}

let winner = (threshold, game) => {
    for (let i = 0; i < game.players.length; i += 1) {
        if (game.players[i].score >= threshold) {
            return i;
        }
    }
    return null;
}

let hash = (game) => {
    let hashPlayer = ({ score, position }) => `P${score}-${position}`;
    return `G${game.turn}-${game.rolls}-${game.rollTotal}-${game.players.map(hashPlayer).join("-")}`;
}

let multiStep = (games, wins) => {
    let newGames = new Map();
    for (let [game, weight] of games.values()) {
        for (let i = 1; i <= 3; i += 1) {
            let updated = step(game, i);
            let w = winner(21, updated);
            if (w !== null) {
                wins[w] += weight;
            } else {
                let key = hash(updated);
                if (!newGames.has(key)) {
                    newGames.set(key, [updated, weight]);
                } else {
                    newGames.get(key)[1] += weight;
                }
            }
        }
    }
    return [newGames, wins];
}

let multiPlay = (positions) => {
    let game = {
        turn: 0,
        rolls: 0,
        rollTotal: 0,
        players: positions.map((p) => ({ score: 0, position: p })),
    };
    let wins = positions.map(() => 0);
    let games = new Map([[hash(game), [game, 1]]]);
    while (games.size > 0) {
        [games, wins] = multiStep(games, wins);
    }
    return wins;
}

let play = (die, dieState, positions) => {
    let game = {
        turn: 0,
        rolls: 0,
        rollTotal: 0,
        players: positions.map((p) => ({ score: 0, position: p })),
        weight: 1,
    };
    while (winner(1000, game) === null) {
        let roll;
        [roll, dieState] = die(dieState);
        game = step(game, roll);
    }
    return game;
}

