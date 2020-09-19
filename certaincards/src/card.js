"use strict";

import color from "./color.svg";
import back from "./back.svg";

/** parse a string to a DOM element */
function toElem(str) {
    let temp = document.createElement("template")
    temp.innerHTML = str;
    return temp.content.firstChild;
}

/* Not sure if I'm doing something wrong, but SVGs really don't like 3D transforms.
 * To make the front actually get blocked by the back when rotating,
 * we split it into a separate SVG, so it's has its own element,
 * and we can set transformStyle = preseve-3d in way too many places */
let colorSvg = toElem(color);
colorSvg.style.position = "absolute";
colorSvg.style.left = "0";
colorSvg.style.top = "0";
colorSvg.style.transform = "translateZ(.1px)";

let backSvg = toElem(back);

let cardElem = document.createElement("div");
cardElem.style.position = "absolute";
cardElem.style.width = "100%";
cardElem.style.transformStyle = "preserve-3d";
cardElem.appendChild(backSvg);
cardElem.appendChild(colorSvg);


export class CardElement extends HTMLElement {
    constructor(props) {
        super();
        this.style.display = "inline-block";
        this.style.transformStyle = "preserve-3d";
        this.svg = cardElem.cloneNode(true);
        this.appendChild(this.svg);

        this.update(props);
    }

    /** generates svg stroke-dasharray property to show gaps in the rings
     * takes the positions of gaps in degrees, and radius of circle */
    _toDashes(gaps_, radius) {
        let gaps = [...gaps_]
            .sort((a, b) => a - b)
            .filter(a => a < 360);

        let space = 3;
        // sweep around the circle, filling in dashes and spaces as we go
        let pattern = [] // dasharray
        let angle = 0; // current position
        for (let gap of gaps) {
            let segment = Math.max(gap - angle, 0);
            pattern.push(segment, space);
            angle = gap + space;
        }
        pattern.push(Math.max(360 - angle, 0), 0); // bring us full circle

        return pattern
            .map(a => a / 360 * 2 * Math.PI * radius) // convert angles to lengths
            .join(" ");
    }

    update({color, innerRing, outerRing}) {
        this.props = {color, innerRing, outerRing};
        this.svg.style.setProperty(
            "--color",
            `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`,
        );
        // radii from the source svg
        this.svg.style.setProperty("--inner-dash", this._toDashes(innerRing, 47.5));
        this.svg.style.setProperty("--outer-dash", this._toDashes(outerRing, 109.5));
    }
}

