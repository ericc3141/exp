"use strict";

let elems = {};
let tape;

const fns = [{
        "+": (a, b) => a+b,
        "-": (a, b) => a-b,
        "*": (a, b) => a*b,
        "/": (a, b) => a/b,
    },
    Math,
];

const makeTape = (parent) => {
    let data = {};
    let elems = {};
    let curr = 0;

    /* Create new element, append it to parent, and return it. */
    function elem(i) {
        let elem = document.createElement("li");
        elem.style.top = i*2+"em";
        parent.appendChild(elem);
        return elem;
    }

    function move(n) {
        curr += n;
        parent.style.marginTop = -curr*2 +"em";
    }

    function has(n) {
        for (let i = 1; i <= n; i ++) {
            if (!(curr - i in data)) {
                return false;
            }
        }
        return true;
    }
    function call(f) {
        if (!f || !has(f.length)) { return; }
        let args = [];
        for (let i = 0; i < f.length; i ++) {
            args.push(pop());
        }
        push(f.apply(null, args.reverse()));
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
        has, call,
        get, move, push, pop,
    }
}

function findFunc(name, fns) {
    for (let i in fns) {
        if (name in fns[i]) {
            return fns[i][name];
        }
    }
}


function onkeydown(e) {
    if (e.key == "Enter") {
        let v = parseInt(e.target.value);
        e.target.select();
        if (isNaN(v)) {
            let f = findFunc(e.target.value, fns);
            tape.call(f);
        } else {
            tape.push(v);
        }
        return;
    }
    let f = findFunc(e.key, fns);
    if (f) {
        tape.call(f);
        e.preventDefault();
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