import { degreesToRadians, normalizeRadians } from "@hpcc-js/util";
import { HPCCSVGElement, attribute, css, property, ChangeMap, customElement, HTMLColor, display, html, ref } from "../common";
import * as d3 from "d3";

const template = html<HPCCPieElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_slicesG")}></g>
    <g ${ref("_labelsG")}></g>
</svg>`;

const styles = css`
${display("inline-block")}

:host {
}

svg {
    font-family: sans-serif;
    font-size: 10;
}

g.links {
    fill: none;
}
`;

type Point = { x: number, y: number };
type Rect = { x: number, y: number, width: number, height: number };
type TextSize = { width: number; height: number; };

const lerp = function (point: Point, that: Point, t: number): Point {
    //  From https://github.com/thelonious/js-intersections
    return {
        x: point.x + (that.x - point.x) * t,
        y: point.y + (that.y - point.y) * t
    };
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

export class HPCCD3Element extends HPCCSVGElement {

    _palette: d3.ScaleOrdinal<string, string, never>;

    pos(_: Point): void;
    pos(): Point;
    pos(_?: Point): void | Point {
        if (!arguments.length) return { x: this.clientWidth / 2, y: this.clientHeight / 2 };
    }

    cssTag(id: string): string {
        return ("" + id).replace(/[^a-z0-9]/g, (s) => {
            const c = s.charCodeAt(0);
            if (c === 32) return "-";
            if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
            return "_0x" + c.toString(16);
        });
    }

    fillColor(row: any[], column?, value?, origRow?): string {
        return this._palette(row[0]);
    }

    textSize(_text: string | string[], fontName: string = "Verdana", fontSize: number = 12, bold: boolean = false): Readonly<TextSize> {
        return { width: _text.length * fontSize / 2, height: fontSize };
    }

    getOffsetPos(): Point {
        const retVal = { x: 0, y: 0 };
        return retVal;
    }

    intersectCircle(radius: number, pointA: Point, pointB: Point): Point | null {
        const center = this.getOffsetPos();
        const intersection = intersectCircleLine(center, radius, pointA, pointB);
        if (intersection.points.length) {
            return { x: intersection.points[0].x, y: intersection.points[0].y };
        }
        return null;
    }
}

type Columns = string[];
type Row = [string, number];
type Data = Row[];
type PieArcDatum = d3.PieArcDatum<Row>;

@customElement("hpcc-pie", { template, styles })
export class HPCCPieElement extends HPCCD3Element {

    @attribute showLabels = true;
    @attribute showSeriesValue = false;
    @attribute seriesValueFormat = ",.0f";
    @attribute showSeriesPercentage = false;
    @attribute seriesPercentageFormat = ",.0f";
    @attribute innerRadius = 0;
    @attribute minOuterRadius = 20;
    @attribute startAngle = 0;
    @attribute labelHeight = 12;

    @property columns: Columns = [];
    @property data: Data = [];

    protected _slicesG: SVGGElement;
    protected _labelsG: SVGGElement;
    protected _slices: d3.Selection<SVGGElement, unknown, null, undefined>;
    protected _labels: d3.Selection<SVGGElement, unknown, null, undefined>;

    protected _totalValue: number;

    d3Pie = d3.pie<Row>();
    d3Arc = d3.arc<PieArcDatum>();
    d3LabelArc = d3.arc<PieArcDatum>();

    private _labelPositions;
    private _smallValueLabelHeight;
    private _labelWidthLimit: number;
    private _quadIdxArr;
    private _minLabelTop = 0;
    private _maxLabelBottom = 0;
    private _seriesValueFormatter;
    private _seriesPercentageFormatter;

    constructor() {
        super();
        this._slices = d3.select<SVGGElement, unknown>(this._slicesG);
        this._labels = d3.select<SVGGElement, unknown>(this._labelsG);
    }

    intersection(pointA, pointB) {
        return this.intersectCircle(this.calcOuterRadius(), pointA, pointB);
    }

    calcInnerRadius() {
        return this.innerRadius !== undefined ? this.calcOuterRadius() * this.innerRadius / 100 : 0;
    }

    calcOuterRadius() {
        const maxTextWidth = this.textSize(this.data.map(d => this.getLabelText({ data: d }, false)), "Verdana", 12).width;
        const horizontalLimit = this._svg.clientWidth - (this.showLabels ? maxTextWidth * 2 : 0) - 20;
        const verticalLimit = this._svg.clientHeight - 12 * 3 - (this.showLabels ? this._smallValueLabelHeight : 0);
        const outerRadius = Math.min(horizontalLimit, verticalLimit) / 2 - 2;
        if ((horizontalLimit / 2) - 2 < this.minOuterRadius) {
            this._labelWidthLimit = maxTextWidth - (this.minOuterRadius - ((horizontalLimit / 2) - 2));
        } else {
            this._labelWidthLimit = maxTextWidth;
        }
        if (outerRadius < this.minOuterRadius) {
            return this.minOuterRadius;
        }
        return outerRadius;
    }

    calcSmallValueLabelHeight() {
        const smallDef = 0.1;
        const totalVal = this.data.reduce((acc, n) => acc + n[1], 0);
        let smallCount = 0;
        this.data.forEach(row => {
            if (row[1] / totalVal < smallDef) {
                smallCount++;
            }
        });
        return this.labelHeight * smallCount;
    }

    calcTotalValue(): number {
        return this.data.reduce((acc, d) => {
            return acc + d[1];
        }, 0);
    }

    getLabelText(d: { data: Row }, truncate?: boolean): string {
        let len;
        let label = d.data[0];
        if (typeof this._labelWidthLimit !== "undefined" && truncate) {
            const labelWidth = this.textSize(label, "Verdana", this.labelHeight).width;
            if (this._labelWidthLimit < labelWidth) {
                len = label.length * (this._labelWidthLimit / labelWidth) - 3;
                label = len < label.length ? label.slice(0, len) + "..." : label;
            }
        }
        if (this.showSeriesValue) {
            label += ` : ${this._seriesValueFormatter(d.data[1])}`;
        }
        if (this.showSeriesPercentage) {
            let sum = this._totalValue;
            const dm: any = {};//this.dataMeta();
            if (typeof dm.sum !== "undefined") {
                sum = dm.sum;
            }
            const perc = (d.data[1] / sum) * 100;
            label += ` : ${this._seriesPercentageFormatter(perc)}%`;
        }
        return label;
    }

    enter() {
        super.enter();
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this._slices.attr("transform", `translate(${this.clientWidth / 2}, ${this.clientHeight / 2})`);
        this._labels.attr("transform", `translate(${this.clientWidth / 2}, ${this.clientHeight / 2})`);
        const context = this;
        this.updateD3Pie();
        this._palette = d3.scaleOrdinal([] as string[], d3.schemeTableau10);
        this._seriesValueFormatter = d3.format(this.seriesValueFormat);
        this._seriesPercentageFormatter = d3.format(this.seriesPercentageFormat);

        this._smallValueLabelHeight = this.calcSmallValueLabelHeight();
        this._totalValue = this.calcTotalValue();
        const innerRadius = this.calcInnerRadius();
        const outerRadius = this.calcOuterRadius();
        const labelRadius = outerRadius + 12;
        this.d3Arc
            .innerRadius(innerRadius)
            .padRadius(outerRadius)
            .outerRadius(outerRadius)
            ;

        this._quadIdxArr = [[], [], [], []];
        const data = [...this.data].sort((a, b) => {
            return a[1] - b[1] > 0 ? -1 : 1;
        });
        const arc = this._slices.selectAll<SVGGElement, PieArcDatum>(".arc").data(this.d3Pie(data), d => d.data[0]);

        this._labelPositions = [];

        //  Enter  ---
        arc.enter().append("g")
            .attr("class", (d, i) => "arc series series-" + this.cssTag(d.data[0]))
            .attr("opacity", 0)
            // .call(this._selection.enter.bind(this._selection))
            .on("click", function (d) {
                // context.click(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
            })
            .on("dblclick", function (d) {
                // context.dblclick(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
            })
            .each(function (d, i) {
                d3.select(this).append("path")
                    // .on("mouseout.tooltip", context.tooltip.hide)
                    // .on("mousemove.tooltip", context.tooltip.show)
                    .on("mouseover", arcTween(0, 0))
                    .on("mouseout", arcTween(-5, 150))
                    ;
            })
            .merge(arc).transition()
            .attr("opacity", 1)
            .each(function (d, i) {
                const quad = context.getQuadrant(midAngle(d));
                context._quadIdxArr[quad].push(i);
                (d as any).outerRadius = outerRadius - 5;
                const element2 = d3.select(this);
                element2.select<SVGPathElement>("path").transition()
                    .attr("d", d => context.d3Arc(d as PieArcDatum))
                    .style("fill", context.fillColor(d.data, context.columns[1], d.data[1]))
                    ;
            })
            ;

        //  Exit  ---
        arc.exit().transition()
            .style("opacity", 0)
            .remove()
            ;
        //  Labels  ---
        this.d3LabelArc
            .innerRadius(labelRadius)
            .outerRadius(labelRadius)
            ;
        const text = this._labels.selectAll<SVGTextElement, PieArcDatum>("text").data(this.showLabels ? this.d3Pie(data) : [], d => d.data[0]);

        const mergedText = text.enter().append("text")
            // .on("mouseout.tooltip", context.tooltip.hide)
            // .on("mousemove.tooltip", context.tooltip.show)
            .attr("dy", ".5em")
            .on("click", function (d) {
                // context._slices.selectAll("g").filter(function (d2) {
                //     if (d.data === d2.data) {
                //         context._selection.click(this);
                //         context.click(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
                //     }
                // });
            })
            .on("dblclick", function (d) {
                // context._slices.selectAll("g").filter(function (d2) {
                //     if (d.data === d2.data) {
                //         context.dblclick(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
                //     }
                // });
            })
            .merge(text)
            .text(d => this.getLabelText(d, true))
            .each(function (d, i) {
                const pos = context.d3LabelArc.centroid(d);
                const mid_angle = midAngle(d);
                pos[0] = labelRadius * (context.isLeftSide(mid_angle) ? 1 : -1);
                context._labelPositions.push({
                    top: pos[1],
                    bottom: pos[1] + context.labelHeight
                });
            });
        if (this.showLabels) {
            this.adjustForOverlap();
            mergedText.transition()
                .style("font-size", this.labelHeight + "px")
                .attr("transform", (d, i) => {
                    const pos = context.d3LabelArc.centroid(d);
                    pos[0] = labelRadius * (context.isLeftSide(midAngle(d)) ? 1 : -1);
                    pos[1] = context._labelPositions[i].top;
                    return "translate(" + pos + ")";
                })
                .style("text-anchor", d => this.isLeftSide(midAngle(d)) ? "start" : "end");
        }

        text.exit()
            .remove();

        const polyline = this._labels.selectAll<SVGPolylineElement, PieArcDatum>("polyline").data(this.showLabels ? this.d3Pie(data) : [], d => this.getLabelText(d, true));

        polyline.enter()
            .append("polyline")
            .merge(polyline).transition()
            .attr("points", function (d, i) {
                const pos = context.d3LabelArc.centroid(d);
                const pos1 = context.d3Arc.centroid(d);
                const pos2 = [...pos];
                pos[0] = labelRadius * (context.isLeftSide(midAngle(d)) ? 1 : -1);
                pos[1] = context._labelPositions[i].top;
                return `[${pos1}, ${pos2}, ${pos}]`;
            });

        polyline.exit()
            .remove();

        if (this.showLabels) {
            this.centerOnLabels();
        }
        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        function arcTween(outerRadiusDelta, delay) {
            function tween(d: PieArcDatum) {
                const i = d3.interpolate((d as any).outerRadius, outerRadius + outerRadiusDelta);
                return function (t): string {
                    (d as any).outerRadius = i(t);
                    return context.d3Arc(d)!;
                };
            }
            return function (this: SVGPathElement, d) {
                d3.select<SVGPathElement, PieArcDatum>(this).transition().delay(delay)
                    .attrTween("d", tween);
            };
        }
    }

    isLeftSide(midAngle) {
        midAngle = normalizeRadians(midAngle);
        const isLeft = midAngle > Math.PI * 2 ? midAngle : midAngle < Math.PI && midAngle > 0;
        return isLeft;
    }

    getQuadrant(radians) {
        let quad = 0;
        const rad = normalizeRadians(radians);
        quad = rad <= Math.PI * 1.0 && rad >= Math.PI * 0.5 ? 3 : quad;
        quad = rad <= Math.PI * 0.5 && rad >= Math.PI * 0.0 ? 2 : quad;
        quad = rad <= Math.PI * 0.0 && rad >= Math.PI * -0.5 ? 1 : quad;
        return quad;
    }

    centerOnLabels() {
        const gY = this.pos().y;
        const gY2 = gY * 2;
        const radius = this.calcOuterRadius();
        const top = Math.min(this._minLabelTop, -radius);
        const bottom = Math.max(this._maxLabelBottom, radius);
        const h = bottom - top;
        const heightDiff = gY2 - h;
        const absTop = Math.abs(this._minLabelTop);
        let yShift = 0;
        if (bottom > gY) {
            yShift = gY - bottom + (this.labelHeight / 2);
            yShift -= heightDiff / 2;
        } else if (top < 0 && absTop > gY) {
            yShift = absTop - gY + (this.labelHeight / 2);
            yShift += heightDiff / 2;
        }
        const pos = this.pos();
        this.pos({
            y: pos.y + yShift,
            x: pos.x
        });
    }

    adjustForOverlap() {
        const labelHeight = this.labelHeight;
        this._quadIdxArr.forEach((arr, quad) => {
            this._quadIdxArr[quad].sort((a, b) => {
                if (quad === 1 || quad === 2) {
                    return this._labelPositions[a].top > this._labelPositions[b].top ? -1 : 1;
                } else if (quad === 0 || quad === 3) {
                    return this._labelPositions[a].top > this._labelPositions[b].top ? 1 : -1;
                }
            });
            let prevTop;
            this._quadIdxArr[quad].forEach((n, i) => {
                if (i > 0) {
                    if (quad === 1 || quad === 2) {
                        if (prevTop < this._labelPositions[n].bottom) {
                            const overlap = this._labelPositions[n].bottom - prevTop;
                            this._labelPositions[n].top -= overlap;
                            this._labelPositions[n].bottom -= overlap;
                        }
                    } else if (quad === 0 || quad === 3) {
                        if (prevTop + labelHeight > this._labelPositions[n].top) {
                            const overlap = Math.abs(this._labelPositions[n].top) - Math.abs(prevTop + labelHeight);
                            this._labelPositions[n].top -= overlap;
                            this._labelPositions[n].bottom -= overlap;
                        }
                    }
                }
                prevTop = this._labelPositions[n].top;
            });
        });
        this._minLabelTop = 0;
        this._maxLabelBottom = 0;
        this._quadIdxArr.forEach((arr, quad) => {
            this._quadIdxArr[quad].forEach((n, i) => {
                if (this._minLabelTop > this._labelPositions[n].top) {
                    this._minLabelTop = this._labelPositions[n].top;
                }
                if (this._maxLabelBottom < this._labelPositions[n].bottom) {
                    this._maxLabelBottom = this._labelPositions[n].bottom;
                }
            });
        });
    }

    exit() {
        super.exit();
    }

    updateD3Pie() {
        const startAngle = normalizeRadians(degreesToRadians(this.startAngle));
        this.d3Pie
            .padAngle(0.0025)
            .startAngle(startAngle)
            .endAngle(2 * Math.PI + startAngle)
            .sort(function (b, a) {
                return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
            })
            .value(function (d) {
                return d[1];
            })
            ;
    }
}
