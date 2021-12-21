import * as game from "./game.mjs";

let main = () => {
    let g = game.play(game.detDie, 0, [0, 2])
    console.log(g);
    let wins = game.multiPlay([0, 2])
    console.log(wins);
}

main();
