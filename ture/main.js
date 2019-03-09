"use strict";

let tape;

const fns = {
    "+": [2, ([a, b]) => a+b ],
    "-": [2, ([a, b]) => a-b ],
    "*": [2, ([a, b]) => a*b ],
    "/": [2, ([a, b]) => a/b ],
}

const newTape = (aparent, afns) => {
    let parent = aparent;
    let fns = [afns];
    let data = {};
    let elems = {};
    let curr = 0;

    data[0] = "";
    parent.addEventListener("keydown", onkeydown);
    elems[0] = elem("");
    elems[0].classList.add("currcell");
    elems[0].childNodes[0].focus();

    /* Create new element, append it to parent, and return it. */
    function elem(v) {
        let elem = document.createElement("li");
        let txt = document.createElement("input");

        txt.type="textbox";
        txt.value = v;
        elem.appendChild(txt);
        parent.appendChild(elem);
        return elem;
    }

    function onkeydown(e) {
        if (e.key == "Enter") {
            if (!e.shiftKey) {
                move(1);
            } else {
                move(-1);
            }
        }
        let f;
        for (let i in fns) {
            if (e.target.value+e.key in fns[i]) {
                f = fns[i][e.target.value+e.key];
                break;
            } else if (e.key in fns[i]) {
                f = fns[i][e.key];
                break;
            }
        }
        if (f) {
            e.preventDefault();
            elems[curr].childNodes[0].value = "";
            let args = []
            for (let i = 0; i < f[0]; i ++) {
                args.push(pop());
            }
            push(f[1](args));
        }
    }

    function move(n) {
        let v = elems[curr].childNodes[0].value;
        let vf = parseFloat(v);
        data[curr] = (isNaN(vf)) ? v : vf;
        elems[curr].classList.remove("currcell");
        curr += n;
        if (!(curr in elems)) {
            elems[curr] = elem("");
        }
        elems[curr].classList.add("currcell");
        elems[curr].childNodes[0].focus();
        return v;
    }

    function get() {
        return data[curr];
    }
    function push(v) {
        elems[curr].childNodes[0].value = v;
        move(1);
    }
    function pop() {
        move(-1);
        elems[curr].childNodes[0].value = "";
        return data[curr];
    }

    return {
        parent, fns, data,
        get, move, push, pop,
    }
}

function init() {
    tape = newTape(document.getElementById("tape"), fns);
}

window.addEventListener("load", init);