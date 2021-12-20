export { lookup, enhance, stringify, parse, lit };

let parse = (str) => {
    let pixels = str.split("\n").map((row) => row.split("").map(c => c === "#"))
    return {
        background: false,
        pixels,
        top: 0,
        left: 0,
    };
};

let lookup = ({background, pixels, top, left}, x, y) => {
    if (x < left || y < top ||
        x >= left + pixels[0].length || y >= top + pixels.length) {
        return background;
    } else {
        return pixels[y-top][x-left];
    }
}

let transform = (algorithm, image, x, y) => {
    let pix = 9;
    let idx = 0;
    for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
            pix -= 1;
            if (lookup(image, x+dx, y+dy)) {
                idx += Math.pow(2, pix);
            }
        }
    }
    return algorithm[idx];
}

// image: { background, pixels, top, left }
let enhance = (algorithm, image) => {
    let pixels = [];
    for (let ry = -1; ry < image.pixels.length + 1; ry += 1) {
        let row = [];
        for (let rx = -1; rx < image.pixels[0].length + 1; rx += 1) {
            row.push(transform(algorithm, image, rx+image.left, ry+image.top))
        }
        pixels.push(row);
    }
    return {
        background: transform(algorithm, image, image.left-3, image.top-3),
        pixels,
        top: image.top - 1,
        left: image.left - 1,
    };
}

let stringify = (image) => {
    let str = "";
    for (let ry = -1; ry < image.pixels.length + 1; ry += 1) {
        for (let rx = -1; rx < image.pixels[0].length + 1; rx += 1) {
            str += lookup(image, rx+image.left, ry+image.top) ? "#" : ".";
        }
        str += "\n";
    }
    return str;
}

let lit = ({ background, pixels }) => {
    if (background) {
        return 1/0;
    }
    let count = 0;
    for (let row of pixels) {
        for (let pixel of row) {
            if (pixel) {
                count += 1;
            }
        }
    }
    return count;
}
