"use strict";

let elems = {};
let tape;

const fns = [{
    "+": [2, ([a, b]) => a+b ],
    "-": [2, ([a, b]) => a-b ],
    "*": [2, ([a, b]) => a*b ],
    "/": [2, ([a, b]) => a/b ],
}];

const makeTape = (parent) => {
    let data = {};
    let elems = {};
    let curr = 0;

    /* Create new element, append it to parent, and return it. */
    function elem(i) {
        let elem = document.createElement("li");
        parent.appendChild(elem);
        return elem;
    }

    function move(n) {
        if (curr in elems) {
            elems[curr].classList.remove("currcell");
        }
        curr += n;
        if (curr in elems) {
            elems[curr].classList.add("currcell");
        }
    }

    function get() {
        return data[curr];
    }
    function push(v) {
        data[curr] = v;
        if (!(curr in elems)) {
            elems[curr] = elem(curr);
        }
        elems[curr].textContent = v;
        move(1);
    }
    function pop() {
        move(-1);
        let v = data[curr];
        delete data[curr];
        parent.removeChild(elems[curr]);
        delete elems[curr];
        return v;
    }

    return {
        parent, data,
        get, move, push, pop,
    }
}


function onkeydown(e) {
    if (e.key == "Enter") {
        let v = parseInt(e.target.value);
        e.target.select();
        if (isNaN(v)) {v = 0;}
        tape.push(v);
        return;
    }
    let f;
    for (let i in fns) {
        if (e.key in fns[i]) {
            f = fns[i][e.key];
            break;
        }
    }
    if (f) {
        e.preventDefault();
        let args = []
        for (let i = 0; i < f[0]; i ++) {
            args.push(tape.pop());
        }
        tape.push(f[1](args.reverse()));
    }
}

function init() {
    let ids = ["tape", "entry"];
    for (let i in ids) {
        elems[ids[i]] = document.getElementById(ids[i]);
    }
    tape = makeTape(elems.tape);
    document.body.addEventListener("keydown", onkeydown);
}

window.addEventListener("load", init);