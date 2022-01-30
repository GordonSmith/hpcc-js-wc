import * as d3 from "d3";
import { annotation, annotationCalloutElbow } from "d3-svg-annotation";
import { HPCCSVGElement, attribute, css, property, ChangeMap, customElement, display, html, ref, HTMLColor } from "../common";

function value2Angle(value: number): number {
    return (value - 0.5) * .65 * 2 * Math.PI;
}

function pointOnArc(angle: number, radius: number): { x: number, y: number } {
    return {
        x: Math.cos(angle - Math.PI / 2) * radius,
        y: Math.sin(angle - Math.PI / 2) * radius
    };
}

function indicatorTranslate(angle: number, radius: number, inner: boolean = false) {
    const point = pointOnArc(angle, radius);
    const rotation = angle * 180 / Math.PI + (inner === true ? 180 : 0);
    return `translate(${point.x}, ${point.y}) rotate(${rotation})`;
}

type IndicatorDatum = { angle: number };
function indicatorTween(newAngle: number, radius: number, inner: boolean = false) {
    return function (d: IndicatorDatum) {
        const interpolate = d3.interpolate(d.angle, newAngle);
        d.angle = newAngle;
        return function (t: number) {
            return indicatorTranslate(interpolate(t), radius, inner);
        };
    };
}

function arcTween(startAngle: number, endAngle: number, arc: d3.Arc<unknown, d3.DefaultArcObject>) {
    return function (d: d3.DefaultArcObject) {
        const startInterpolate = d3.interpolate(d.startAngle, startAngle);
        const endInterpolate = d3.interpolate(d.endAngle, endAngle);
        return function (t: number): string {
            d.startAngle = startInterpolate(t);
            d.endAngle = endInterpolate(t);
            return arc(d)!;
        };
    };
}

export type TipData = { x?: number, y?: number, w?: number, h?: number, label?: string };
export type TextSize = { width: number, height: number, scale: number };

const template = html<HPCCGaugeElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_element")}></g>
</svg>`;

const styles = css`
${display("inline-block")}

:host {
    padding: 0px!important;
}

svg {
    font-family: sans-serif;
    font-size: 12;
}
`;

@customElement("hpcc-gauge", { template, styles })
export class HPCCGaugeElement extends HPCCSVGElement {

    private _d3Arc: d3.Arc<any, d3.DefaultArcObject> = d3.arc()
        .innerRadius(85)
        .outerRadius(100)
        ;
    private _colorScale = d3.scaleLinear<string, string>()
        .interpolate(d3.interpolateHcl)
        ;

    protected _svg: SVGSVGElement;
    protected _element: SVGGElement;

    protected _usageArc: d3.Selection<SVGPathElement, d3.DefaultArcObject, null, undefined>;
    protected _meanArc: d3.Selection<SVGPathElement, d3.DefaultArcObject, null, undefined>;
    protected _freeArc: d3.Selection<SVGPathElement, d3.DefaultArcObject, null, undefined>;
    protected _indInner: any;
    protected _indOuter: any;
    protected _centerTextG: any;
    protected _centerText: any;
    protected _bottomText: any;
    protected _tooltipG: any;
    protected _mainTooltip: any;

    /**
     * Title to display at the bottom of the gauge
     * 
     * @defaultValue ""
     */
    @attribute title: string = "";

    /**
     * Description to display when mouse is over the title
     * 
     * @defaultValue ""
     */
    @attribute title_description: string = "";

    /**
     * Main value of the gauge, expects value from 0 to 1
     * 
     * @defaultValue 0
     */
    @attribute({ type: "number" }) value: number = 0;

    /**
     * Description to display when mouse is over the gauge arc
     * 
     * @defaultValue ""
     */
    @attribute value_description: string = "";

    /**
     * Show "tick" indicator on the gauge
     * 
     * @defaultValue false
     */
    @attribute({ type: "boolean" }) show_tick: boolean = false;

    /**
     * Tick value of the gauge, expects value from 0 to 1
     * 
     * @defaultValue 0
     */
    @attribute({ type: "number" }) tick_value: number = 0;

    /**
     * Description to display when mouse is over the tick indicators
     * 
     * @defaultValue ""
     */
    @attribute tick_value_description: string = "";

    /**
     * Tooltip to display when mouse is over the gauge
     * 
     * @defaultValue ""
     */
    @attribute tooltip: string = "";

    /**
     * Array of colors for the filled gauge portion. The fill color will be relative to the gauge value
     * 
     * @defaultValue ["green", "green", "green", "green", "green", "green", "green", "green", "orange", "red", "red"]
     */
    @property color_range: HTMLColor[] = ["green", "green", "green", "green", "green", "green", "green", "green", "orange", "red", "red"];

    /**
     * This array augments the mapping of the value to the fill colorRange
     * 
     * @defaultValue [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
     */
    @property color_domain: number[] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

    /**
     * Color of the empty portion of the gauge
     * 
     * @defaultValue "lightgray"
     */
    @attribute empty_color: string = "lightgrey";

    /**
     * Color of the tick indicator
     * 
     * @defaultValue "black"
     */
    @attribute tick_color: HTMLColor = "black";

    constructor() {
        super();
    }

    protected tip(_d: TipData) {
        const d = { ...{ x: 0, y: 0, w: 0, h: 0, label: "" }, ..._d };

        if (d === null || d.label === "") {
            this._tooltipG
                .transition()
                .style("opacity", 0)
                .on("interrupt end", () => {
                    this._tooltipG
                        .selectAll("g")
                        .remove()
                        ;
                })
                ;
        } else {
            this._tooltipG
                .interrupt()
                .style("opacity", 1)
                ;
            d.w = (this._centerText.datum() as any).w + 10;
            let lineType = "horizontal";
            let xOffset = 0;
            let yOffset = 5;
            let padding: number | undefined = 5;
            if (d.y >= 5 && d.y <= 25) {
                xOffset = d.x < 0 ? -d.w / 2 : d.w / 2;
                yOffset = 12.5;
                padding = undefined;
                lineType = "vertical";
            } else if (d.y > 25) {
                yOffset = 25;
                padding = 0;
            }
            const annotationtip = annotation()
                .type(annotationCalloutElbow)
                .annotations([{
                    data: d,
                    dx: -d.x + xOffset,
                    dy: -d.y + yOffset,
                    color: "black",
                    note: {
                        label: d.label,
                        lineType,
                        padding,
                        align: "middle"
                    }
                }])
                .accessors({ x: (d2: any) => d2.x, y: (d2: any) => d2.y });
            this._tooltipG.call(annotationtip as any);
        }
    }

    protected calcSize(textElement: d3.Selection<SVGGElement, unknown, any, any>, width: number, height: number): TextSize {

        const bb = textElement.node()!.getBBox();
        const widthTransform = width / bb.width;
        const heightTransform = height / bb.height;
        const scale = widthTransform < heightTransform ? widthTransform : heightTransform;

        return {
            width: bb.width,
            height: bb.height,
            scale
        };
    }

    protected updateText(textElement: d3.Selection<SVGGElement, unknown, any, any>, x: number, y: number, w: number, h: number) {

        textElement
            .datum({ x, y, w, h })
            .attr("transform", null)
            ;

        const size = this.calcSize(textElement, w, h);
        const x2 = x + w / 2 - size.width / 2 * size.scale;
        const y2 = y + h / 2 - size.height / 2 * size.scale;
        textElement.attr("transform", `translate(${x2}, ${y2}) scale(${size.scale})`);
    }

    calcWidth(): number {
        return Math.min(this.clientWidth, this.clientHeight);
    }

    enter() {
        super.enter();

        const element = d3.select(this._element);
        element.on("click", () => {
            this.click();
        });

        this._usageArc = element.append("path").datum({ startAngle: value2Angle(0), endAngle: value2Angle(0) } as d3.DefaultArcObject)
            .style("fill", "green")
            .on("mousemove", (d: d3.DefaultArcObject) => {
                const [x, y] = this._d3Arc.centroid(d);
                this.tip({ x, y, label: this.value_description });
            })
            .on("mouseout", () => {
                this.tip({});
            })
            ;
        this._freeArc = element.append("path").datum({ startAngle: value2Angle(0), endAngle: value2Angle(1) } as d3.DefaultArcObject)
            .style("fill", "lightGrey")
            ;
        this._meanArc = element.append("path").datum({ startAngle: value2Angle(0), endAngle: value2Angle(0) } as d3.DefaultArcObject)
            .style("fill", "black")
            .on("mousemove", (d: d3.DefaultArcObject) => {
                const [x, y] = this._d3Arc.centroid(d);
                this.tip({ x, y, label: this.tick_value_description });
            })
            .on("mouseout", () => {
                this.tip({});
            })
            ;

        this._mainTooltip = element.append("title");

        const context = this;
        function appendIndicator() {
            return element.append("path").datum({ angle: value2Angle(0) })
                .style("fill", "black")
                .style("stroke", "black")
                .attr("d", "M  0 0 l -3 -3 l 6 0 z")
                .on("mousemove", () => {
                    const [x, y] = context._d3Arc.centroid(context._meanArc.datum() as any);
                    context.tip({ x, y, label: context.tick_value_description });
                })
                .on("mouseout", () => {
                    context.tip({});
                })
                ;
        }
        this._indInner = appendIndicator();
        this._indOuter = appendIndicator();
        this._centerText = element.append("text")
            .attr("dy", ".66em")
            .style("fill", "green")
            .on("mousemove", () => {
                this.tip({ x: 0, y: 0, label: this.value_description });
            })
            .on("mouseout", () => {
                this.tip({});
            })
            ;
        this._bottomText = element.append("text")
            .attr("dy", ".66em")
            .on("mousemove", () => {
                this.tip({ x: 0, y: 0, label: this.title_description });
            })
            .on("mouseout", () => {
                this.tip({});
            })
            ;

        this._tooltipG = element.append("g")
            .attr("class", "annotation-tip")
            ;
    }

    update(changes: ChangeMap<this>) {
        super.update(changes);
        const width = this.clientWidth;
        const height = this.clientHeight;
        if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) return;

        const element = d3.select(this._element);
        element.attr("transform", `translate(${width / 2}, ${height / 2})`);

        this._colorScale
            .domain(this.color_domain)
            .range(this.color_range)
            ;

        element
            .attr("title", this.tooltip)
            // .style("cursor", (this.click !== HPCCGaugeElement.prototype.click) ? "pointer" : null)
            ;

        const innerRadius = this.calcWidth() / 3;
        const outerRadius = this.calcWidth() / 2 - 5;
        this._d3Arc
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            ;

        const val = this.value;
        const tickVal = this.tick_value;

        this._usageArc
            .style("fill", this._colorScale(val))
            .transition()
            .duration(750)
            .attrTween("d", arcTween(value2Angle(0), value2Angle(val), this._d3Arc))
            ;

        this._freeArc
            .style("fill", this.empty_color)
            .transition()
            .duration(750)
            .attrTween("d", arcTween(value2Angle(val), value2Angle(1), this._d3Arc))
            ;

        this._meanArc
            .style("fill", this.tick_color)
            .style("visibility", this.show_tick ? "visible" : "hidden")
            .transition()
            .duration(750)
            .attrTween("d", arcTween(value2Angle(tickVal - 0.001), value2Angle(tickVal + 0.001), this._d3Arc))
            ;

        this._indInner
            .style("fill", this.tick_color)
            .style("stroke", this.tick_color)
            .style("visibility", this.show_tick ? "visible" : "hidden")
            .transition()
            .duration(750)
            .attrTween("transform", indicatorTween(value2Angle(tickVal), innerRadius, true))
            ;

        this._indOuter
            .style("fill", this.tick_color)
            .style("stroke", this.tick_color)
            .style("visibility", this.show_tick ? "visible" : "hidden")
            .transition()
            .duration(750)
            .attrTween("transform", indicatorTween(value2Angle(tickVal), outerRadius))
            ;

        this._centerText
            .style("fill", this._colorScale(val))
            .text(d3.format(".0%")(val))
            ;

        this._bottomText
            .style("fill", this.click !== HPCCGaugeElement.prototype.click ? "blue" : "black")
            .style("text-decoration", this.click !== HPCCGaugeElement.prototype.click ? "underline" : null)
            .text(this.title)
            ;

        //  Update Text  ---
        const point = pointOnArc(value2Angle(1), innerRadius - 8);
        this.updateText(this._centerText, -point.x, -point.y, 2 * point.x, 2 * point.y);

        const point2 = pointOnArc(value2Angle(1), outerRadius);
        point2.y += 5;
        const textW = this.calcWidth() - 20;
        const textH = this.calcWidth() / 2 - point2.y - 5;
        this.updateText(this._bottomText, -textW / 2, point2.y, textW, textH);

        this._mainTooltip.text(this.tooltip);
    }

    exit() {
        const element = d3.select(this._element);
        element.selectAll("*").remove();
        super.exit();
    }

    // Events  ---

    click() {
    }
}
