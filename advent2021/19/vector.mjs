export { DIR, zip, hash, eq, manhattan, add, mul, dot, cross, rotate };

let DIR = {
    PX: [1,0,0],
    PY: [0,1,0],
    PZ: [0,0,1],
    NX: [-1,0,0],
    NY: [0,-1,0],
    NZ: [0,0,-1],
}

let zip = (arr, ...arrs) => arr.map((i, idx) => [i].concat(arrs.map(ar => ar[idx])));
let sum = (arr) => arr.reduce((acc, i) => acc + i, 0)

let hash = (p) => p.join(",");
let eq = (a, b) => zip(a, b).every(([ai, bi]) => ai === bi);

let manhattan = (a, b) => sum(zip(a, b).map(([ai, bi]) => Math.abs(ai - bi)));
let add = (...points) => zip(...points).map(sum);
let mul = (a, scalar) => a.map(i => i * scalar);


let dot = (a, b) => sum(zip(a, b).map(([ai, bi]) => ai * bi));
let cross = ([a1, a2, a3], [b1, b2, b3]) =>
    [a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1];

let rotate = (coord, xDir, yDir) => {
    let axes = [DIR[xDir], DIR[yDir], cross(DIR[xDir], DIR[yDir])];
    return add(...zip(coord, axes).map(([c,ax]) => mul(ax, c)));
}
