import { degreesToRadians, normalizeRadians } from "@hpcc-js/util";
import * as d3 from "d3";
import { HPCCSVGElement, attribute, css, property, ChangeMap, customElement, display, html, ref } from "../common";
import { SVGWidget } from "../legacy";

const template = html<HPCCPieElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_slicesG")}></g>
    <g ${ref("_labelsG")}></g>
</svg>`;

export const pieCommonStyles = `\
svg {
    font-family: sans-serif;
    font-size: 12;
}

.arc path {
    stroke: white;
    stroke-width: 0.75px;
}

polyline {
    opacity: .3;
    stroke: black;
    stroke-width: 2px;
    fill: none;
}`;

const styles = css`
${display("inline-block")}

${pieCommonStyles}
`;

export type Columns = string[];
export type Row = [string, number];
export type Data = Row[];
export type PieArcDatum = d3.PieArcDatum<Row>;

@customElement("hpcc-pie", { template, styles })
export class HPCCPieElement extends HPCCSVGElement {

    /**
     * Show labels for each slice
     * 
     * @defaultValue true
     */
    @attribute({ type: "boolean" }) show_labels = true;

    /**
     * Show value for each slice
     * 
     * @defaultValue false
     */
    @attribute({ type: "boolean" }) show_series_value = false;

    /**
     * Value format (when visible)
     * 
     * @defaultValue ",.0f"
     * 
     * @Remarks Internally the format string uses `d3.format` to format the value.  See
     * https://github.com/d3/d3-format#locale_format for details.
     */
    @attribute series_value_format = ",.0f";

    /**
     * Show value as a percentage for each slice
     * 
     * @defaultValue false
     */
    @attribute({ type: "boolean" }) show_series_percentage = false;

    /**
     * Percentage format (when visible)
     * 
     * @defaultValue ",.0f"
     * 
     * @Remarks Internally the format string uses `d3.format` to format the percentage.  See
     * https://github.com/d3/d3-format#locale_format for details.
     */
    @attribute series_percentage_format = ",.0f";

    /**
     * Inner radius of the pie chart.  A larger value will make the pie chart appear as a donut chart.
     * 
     * @defaultValue 2
     */
    @attribute({ type: "number" }) inner_radius = 2;

    /**
     * The minimum outer radius.  In general the pie chart will expand to fill the available space.
     * 
     * @defaultValue 20
     */
    @attribute({ type: "number" }) min_outer_radius = 20;

    /**
     * The starting position for the first slice.  This is used to rotate the pie chart.
     * 
     * @defaultValue 0
     */
    @attribute({ type: "number" }) start_angle = 0;

    /**
     * Name of label font family
     * 
     * @defaultValue "Verdana"
     */
    @attribute font_name = "Verdana";

    /**
     * Label pixel height.  Used to position the labels.
     * 
     * @defaultValue 12
     */
    @attribute({ type: "number" }) label_height = 12;

    /**
     * "Column" labels for the data.  Used to describe the data content
     * 
     * @defaultValue ["Label", "Value"]
     */
    @property columns: Columns = ["Label", "Value"];

    /**
     * The data content for the pie chart.
     * 
     * @defaultValue []
     */
    @property data: Data = [];

    protected _slicesG: SVGGElement;
    protected _labelsG: SVGGElement;
    protected _slices: d3.Selection<SVGGElement, unknown, null, undefined>;
    protected _labels: d3.Selection<SVGGElement, unknown, null, undefined>;

    protected _totalValue: number;

    protected d3Pie = d3.pie<Row>();
    protected d3Arc = d3.arc<PieArcDatum>();
    protected d3LabelArc = d3.arc<PieArcDatum>();

    private _labelPositions;
    private _smallValueLabelHeight;
    private _labelWidthLimit: number;
    private _quadIdxArr;
    private _minLabelTop = 0;
    private _maxLabelBottom = 0;
    private _seriesValueFormatter;
    private _seriesPercentageFormatter;

    protected _legacy = new SVGWidget(this);

    constructor() {
        super();
        this._slices = d3.select<SVGGElement, unknown>(this._slicesG);
        this._labels = d3.select<SVGGElement, unknown>(this._labelsG);
    }

    calcInnerRadius() {
        return this.inner_radius !== undefined ? this.calcOuterRadius() * this.inner_radius / 100 : 0;
    }

    calcOuterRadius() {
        const maxTextWidth = this._legacy.textSize(this.data.map(d => this.getLabelText({ data: d }, false)), this.font_name, this.label_height).width;
        const horizontalLimit = this._svg.clientWidth - (this.show_labels ? maxTextWidth * 2 : 0) - 20;
        const verticalLimit = this._svg.clientHeight - 12 * 3 - (this.show_labels ? this._smallValueLabelHeight : 0);
        const outerRadius = Math.min(horizontalLimit, verticalLimit) / 2 - 2;
        if ((horizontalLimit / 2) - 2 < this.min_outer_radius) {
            this._labelWidthLimit = maxTextWidth - (this.min_outer_radius - ((horizontalLimit / 2) - 2));
        } else {
            this._labelWidthLimit = maxTextWidth;
        }
        if (outerRadius < this.min_outer_radius) {
            return this.min_outer_radius;
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
        return this.label_height * smallCount;
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
            const labelWidth = this._legacy.textSize(label, this.font_name, this.label_height).width;
            if (this._labelWidthLimit < labelWidth) {
                len = label.length * (this._labelWidthLimit / labelWidth) - 3;
                label = len < label.length ? label.slice(0, len) + "..." : label;
            }
        }
        if (this.show_series_value) {
            label += ` : ${this._seriesValueFormatter(d.data[1])}`;
        }
        if (this.show_series_percentage) {
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

    update(changes: ChangeMap<this>) {
        super.update(changes);
        this._slices.attr("transform", `translate(${this.clientWidth / 2}, ${this.clientHeight / 2})`);
        this._labels.attr("transform", `translate(${this.clientWidth / 2}, ${this.clientHeight / 2})`);
        const context = this;
        this.updateD3Pie();
        this._legacy._palette = d3.scaleOrdinal([] as string[], d3.schemeTableau10);
        this._seriesValueFormatter = d3.format(this.series_value_format);
        this._seriesPercentageFormatter = d3.format(this.series_percentage_format);

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
            .attr("class", d => "arc series series-" + this._legacy.cssTag(d.data[0]))
            .attr("opacity", 0)
            // .call(this._selection.enter.bind(this._selection))
            .on("click", function () {
                // context.click(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
            })
            .on("dblclick", function () {
                // context.dblclick(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
            })
            .each(function () {
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
                    .style("fill", context._legacy.fillColor(d.data, context.columns[1], d.data[1]))
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
        const text = this._labels.selectAll<SVGTextElement, PieArcDatum>("text").data(this.show_labels ? this.d3Pie(data) : [], d => d.data[0]);

        const mergedText = text.enter().append("text")
            // .on("mouseout.tooltip", context.tooltip.hide)
            // .on("mousemove.tooltip", context.tooltip.show)
            .attr("dy", ".5em")
            .on("click", function () {
                // context._slices.selectAll("g").filter(function (d2) {
                //     if (d.data === d2.data) {
                //         context._selection.click(this);
                //         context.click(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
                //     }
                // });
            })
            .on("dblclick", function () {
                // context._slices.selectAll("g").filter(function (d2) {
                //     if (d.data === d2.data) {
                //         context.dblclick(context.rowToObj(d.data), context.columns()[1], context._selection.selected(this));
                //     }
                // });
            })
            .merge(text)
            .text(d => this.getLabelText(d, true))
            .each(function (d) {
                const pos = context.d3LabelArc.centroid(d);
                const mid_angle = midAngle(d);
                pos[0] = labelRadius * (context.isLeftSide(mid_angle) ? 1 : -1);
                context._labelPositions.push({
                    top: pos[1],
                    bottom: pos[1] + context.label_height
                });
            });
        if (this.show_labels) {
            this.adjustForOverlap();
            mergedText.transition()
                .style("font-size", this.label_height + "px")
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

        const polyline = this._labels.selectAll<SVGPolylineElement, PieArcDatum>("polyline").data(this.show_labels ? this.d3Pie(data) : [], d => this.getLabelText(d, true));

        polyline.enter()
            .append("polyline")
            .merge(polyline).transition()
            .attr("points", function (d, i) {
                const pos = context.d3LabelArc.centroid(d);
                const pos1 = context.d3Arc.centroid(d);
                const pos2 = [...pos];
                pos[0] = labelRadius * (context.isLeftSide(midAngle(d)) ? 1 : -1);
                pos[1] = context._labelPositions[i].top;
                return `${pos1}, ${pos2}, ${pos}`;
            });

        polyline.exit()
            .remove();

        if (this.show_labels) {
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
            return function (this: SVGPathElement) {
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
        const gY = this._legacy.pos().y;
        const gY2 = gY * 2;
        const radius = this.calcOuterRadius();
        const top = Math.min(this._minLabelTop, -radius);
        const bottom = Math.max(this._maxLabelBottom, radius);
        const h = bottom - top;
        const heightDiff = gY2 - h;
        const absTop = Math.abs(this._minLabelTop);
        let yShift = 0;
        if (bottom > gY) {
            yShift = gY - bottom + (this.label_height / 2);
            yShift -= heightDiff / 2;
        } else if (top < 0 && absTop > gY) {
            yShift = absTop - gY + (this.label_height / 2);
            yShift += heightDiff / 2;
        }
        const pos = this._legacy.pos();
        this._legacy.pos({
            y: pos.y + yShift,
            x: pos.x
        });
    }

    adjustForOverlap() {
        const labelHeight = this.label_height;
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
        this._quadIdxArr.forEach((_arr, quad) => {
            this._quadIdxArr[quad].forEach(n => {
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
        const startAngle = normalizeRadians(degreesToRadians(this.start_angle));
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
