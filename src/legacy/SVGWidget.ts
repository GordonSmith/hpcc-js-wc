import { Widget } from "./Widget";
import * as d3 from "d3";
import { HPCCElement } from "../common";

type Point = { x: number, y: number };
type Rect = { x: number, y: number, width: number, height: number };

const lerp = function (point: Point, that: Point, t: number): Point {
    //  From https://github.com/thelonious/js-intersections
    return {
        x: point.x + (that.x - point.x) * t,
        y: point.y + (that.y - point.y) * t
    };
};

type LineIntersection = { type: "Intersection" | "No Intersection" | "Coincident" | "Parallel", points: Point[] };
const intersectLineLine = function (a1: Point, a2: Point, b1: Point, b2: Point): LineIntersection {
    //  From https://github.com/thelonious/js-intersections
    const result: LineIntersection = { type: "Parallel", points: [] };
    const uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    const ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    const uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if (uB !== 0) {
        const ua = uaT / uB;
        const ub = ubT / uB;

        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            result.type = "Intersection";
            result.points.push({
                x: a1.x + ua * (a2.x - a1.x),
                y: a1.y + ua * (a2.y - a1.y)
            });
        } else {
            result.type = "No Intersection";
        }
    } else {
        if (uaT === 0 || ubT === 0) {
            result.type = "Coincident";
        } else {
            result.type = "Parallel";
        }
    }

    return result;
};

type CircleIntersection = { type: "Outside" | "Tangent" | "Inside" | "Intersection", points: Point[] };
const intersectCircleLine = function (c: Point, r: number, a1: Point, a2: Point): CircleIntersection {
    //  From https://github.com/thelonious/js-intersections
    const result: CircleIntersection = { type: "Intersection", points: [] };
    const a = (a2.x - a1.x) * (a2.x - a1.x) +
        (a2.y - a1.y) * (a2.y - a1.y);
    const b = 2 * ((a2.x - a1.x) * (a1.x - c.x) +
        (a2.y - a1.y) * (a1.y - c.y));
    const cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y -
        2 * (c.x * a1.x + c.y * a1.y) - r * r;
    const deter = b * b - 4 * a * cc;

    if (deter < 0) {
        result.type = "Outside";
    } else if (deter === 0) {
        result.type = "Tangent";
        // NOTE: should calculate this point
    } else {
        const e = Math.sqrt(deter);
        const u1 = (-b + e) / (2 * a);
        const u2 = (-b - e) / (2 * a);

        if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
            if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
                result.type = "Outside";
            } else {
                result.type = "Inside";
            }
        } else {
            result.type = "Intersection";

            if (0 <= u1 && u1 <= 1)
                result.points.push(lerp(a1, a2, u1));

            if (0 <= u2 && u2 <= 1)
                result.points.push(lerp(a1, a2, u2));
        }
    }

    return result;
};

export class SVGWidget extends Widget {

    protected _boundingBox;
    _palette: d3.ScaleOrdinal<string, string, never>;

    constructor(host: HPCCElement) {
        super(host);
        this._boundingBox = null;
    }

    fillColor(row: any[], column?, value?, origRow?): string {
        return this._palette(row[0]);
    }

    getOffsetPos(): Point {
        const retVal = { x: 0, y: 0 };
        return retVal;
    }

    //  Intersections  ---
    containsCircle(radius: number, point: Point) {
        const center = this.getOffsetPos();
        return this.distance(center, point) <= radius;
    }

    intersectRectRect(rect1: Rect, rect2: Rect): Rect {
        const x = Math.max(rect1.x, rect2.x);
        const y = Math.max(rect1.y, rect2.y);
        const xLimit = (rect1.x < rect2.x) ? Math.min(rect1.x + rect1.width, rect2.x + rect2.width) : Math.min(rect2.x + rect2.width, rect1.x + rect1.width);
        const yLimit = (rect1.y < rect2.y) ? Math.min(rect1.y + rect1.height, rect2.y + rect2.height) : Math.min(rect2.y + rect2.height, rect1.y + rect1.height);
        return {
            x,
            y,
            width: xLimit - x,
            height: yLimit - y
        };
    }

    intersectCircle(radius: number, pointA: Point, pointB: Point): Point | null {
        const center = this.getOffsetPos();
        const intersection = intersectCircleLine(center, radius, pointA, pointB);
        if (intersection.points.length) {
            return { x: intersection.points[0].x, y: intersection.points[0].y };
        }
        return null;
    }

    distance(pointA: Point, pointB: Point): number {
        return Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y));
    }

}

