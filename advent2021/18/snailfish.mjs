export { isRegular, eq, stringify, add, magnitude }

let isRegular = (a) => typeof(a) === "number";

let eq = (a, b) => {
    if (isRegular(a) && isRegular(b)) {
        return a === b;
    } else if (!isRegular(a) && !isRegular(b)) {
        return eq(a[0], b[0]) && eq(a[1], b[1]);
    } else {
        return false;
    }
}

let stringify = (a) => isRegular(a) ? `${a}` : `[${stringify(a[0])}, ${stringify(a[1])}]`;

let explode = (a, depth) => {
    let addLeft = (a, reg) => {
        if (isRegular(a)) {
            return a + reg;
        } else {
            return [addLeft(a[0], reg), a[1]];
        }
    };
    let addRight = (a, reg) => {
        if (isRegular(a)) {
            return a + reg;
        } else {
            return [a[0], addRight(a[1], reg)];
        }
    };
    if (isRegular(a[0]) && isRegular(a[1])) {
        if (depth >= 4) {
            return { didExplode: true, left: a[0], mid: 0, right: a[1] };
        } else {
            return { didExplode: false, left: null, mid: a, right: null };
        }
    }
    if (!isRegular(a[0])) {
        let { didExplode, left, mid, right } = explode(a[0], depth+1);
        if (right !== null) {
            return { didExplode, left, mid: [mid, addLeft(a[1], right)], right: null };
        } else if (didExplode) {
            return { didExplode, left, mid: [mid, a[1]], right };
        }
    }
    if (!isRegular(a[1])) {
        let { didExplode, left, mid, right } = explode(a[1], depth+1);
        if (left !== null) {
            return { didExplode, left: null, mid: [addRight(a[0], left), mid], right };
        } else {
            return { didExplode, left, mid: [a[0], mid], right };
        }
    }
    return { didExplode: false, left: null, mid: a, right: null };
}

let split = (a) => {
    if (isRegular(a) && a >= 10) {
        return { didSplit: true, res: [Math.floor(a/2), Math.ceil(a/2)] };
    } else if (isRegular(a)) {
        return { didSplit: false, res: a };
    } else {
        let { didSplit, res } = split(a[0]);
        if (didSplit) {
            return { didSplit, res: [ res, a[1]] };
        }
        ({ didSplit, res } = split(a[1]));
        return { didSplit, res: [ a[0], res] };
    }
}

let reduce = (num) => {
    //console.log(stringify(num));
    let { didExplode, left, mid, right } = explode(num, 0);
    if (didExplode) {
        return reduce(mid);
    }

    let { didSplit, res } = split(mid);
    if (didSplit) {
        return reduce(res);
    }

    return num;
}

let add = (a, b) => reduce([a, b]);

let magnitude = (a) => {
    if (isRegular(a)) {
        return a;
    } else {
        return (3 * magnitude(a[0])) + (2 * magnitude(a[1]));
    }
}
