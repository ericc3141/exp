"use strict";

import { CardElement } from './card.js';

function rand(min, max) { return Math.random() * (max - min) + min; }

/** generate a random color and pattern of gaps for a card */
function randomStyle() {
    let randGaps = (numGaps) => {
        let gaps = [];
        for (let i = 0; i < numGaps; i ++) {
            gaps.push(rand(0, 360));
        }
        return gaps;
    };

    return {
        color: [rand(0, 360), 100, rand(20, 30)],
        innerRing: randGaps(Math.floor(rand(4, 8))),
        outerRing: randGaps(Math.floor(rand(8, 16))),
    };
}

/** generate a random speed and spin */
function randomFall() {
    return {
        position: [rand(0, 100), rand(-100, 100)],
        axis: [rand(0,1), rand(0,1), rand(0,1)],
        spin: rand(.01, .05),
        speed: rand(4, 10),
    };
}

function resetCard(card) {
    //card.update(randomStyle());
    let {position, axis, spin, speed} = randomFall();
    let duration = 200 / speed * 1000;
    let animation = card.animate(
        [
            { transform: `translate3d(${position[0]}vw, -50vh, ${position[1]}vw) rotate3d(0, 0, 0, 0deg)` },
            { transform: `translate3d(${position[0]}vw, 150vh, ${position[1]}vw) rotate3d(${axis[0]}, ${axis[1]}, ${axis[2]}, ${spin * duration}deg` },
        ],
        { duration: duration, iterations: 1, fill: "forwards" }
    );
    animation.onfinish = () => resetCard(card);
    return animation;
}

function spawnCard() {
    let card = new CardElement(randomStyle());
    document.body.appendChild(card);
    card.style.position = "fixed";
    card.style.width = "10vw";
    return resetCard(card);
}


function init() {
    console.log("init");
    customElements.define("card-element", CardElement);

    for (let i = 0; i < 51; i ++) {
        let anim = spawnCard();
        anim.pause();
        setTimeout(() => anim.play(), i * 1000);
    }
}

window.addEventListener("load", init);

