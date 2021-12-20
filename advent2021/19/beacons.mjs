import * as vec from "./vector.mjs";
import { DIR } from "./vector.mjs";

export { parse, align };

let parse = (str) => {
    let readings = str.split("\n\n");
    return readings.map((reading, id) => {
        let beacons = reading.split("\n").slice(1)
        let points = beacons.map((coordinate) => {
            return coordinate.split(",").map((i) => parseInt(i));
        });
        let pointsSet = new Set(points.map(vec.hash));
        return {
            id,
            reference: id,
            offset: [0, 0, 0],
            xDir: DIR.PX,
            yDir: DIR.PY,
            points,
            pointsSet,
        };
    });
}

let align2 = (reference, unaligned) => {
    for (let xDir in DIR) {
        for (let yDir in DIR) {
            if (vec.dot(DIR[xDir], DIR[yDir]) !== 0) { continue; }
            let rotated = unaligned.points.map(p => vec.rotate(p, xDir, yDir));
            for (let refpoint of reference.points) {
                for (let newpoint of rotated) {
                    let offset = vec.add(refpoint, vec.mul(newpoint, -1));
                    let intersections = 0;
                    for (let point of rotated) {
                        if (reference.pointsSet.has(vec.hash(vec.add(point, offset)))) {
                            intersections += 1;
                            if (intersections >= 12) {
                                let transformed = rotated.map(p => vec.add(p, offset));
                                return {
                                    id: unaligned.id,
                                    reference: reference.id,
                                    offset,
                                    xDir,
                                    yDir,
                                    points: transformed,
                                    pointsSet: new Set(transformed.map(vec.hash)),
                                };
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

// scanner: { id, reference, offset, xDir, yDir, points, pointsSet }
let align = (aligned, unaligned, attempted) => {
    console.log(`aligning ${unaligned.length} to ${aligned.length}`);
    if (unaligned.length === 0) {
        return aligned;
    } else {
        for (let i = 0; i < unaligned.length; i ++) {
            for (let j = 0; j < aligned.length; j ++) {
                if (attempted.has(vec.hash([aligned[j].id, unaligned[i].id]))) {
                    continue;
                }
                let alignment = align2(aligned[j], unaligned[i]);
                if (alignment !== null) {
                    return align(
                        [alignment, ...aligned],
                        unaligned.slice(0,i).concat(unaligned.slice(i+1)),
                        attempted,
                    );
                } else {
                    attempted.add(vec.hash([aligned[j].id, unaligned[i].id]));
                }
            }
        }
    }
    console.log(aligned, unaligned);
    throw new Error("alignment failed");
}
