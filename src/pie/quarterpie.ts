import { attribute, css, ChangeMap, customElement, display, html, ref } from "../common";
import { HPCCPieElement, pieCommonStyles } from "./pie";
import * as d3 from "d3";

const template = html<HPCCQuarterPieElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_slicesG")}></g>
    <g ${ref("_labelsG")}></g>
</svg>`;

const styles = css`
${display("inline-block")}

${pieCommonStyles}
`;

@customElement("hpcc-quarterpie", { template, styles })
export class HPCCQuarterPieElement extends HPCCPieElement {
    /**
     * Determines the placement and start/end angle.
     * 
     * @typeParam top-left - orients widget corner in the top left
     * @typeParam top-right - orients widget corner in the top right
     * @typeParam bottom-right - orients widget corner in bottom right
     * @typeParam bottom-left - orients widget corner in the bottom left
     * 
     * @defaultValue "left"
     */
     @attribute orientation: "top-left" | "top-right" | "bottom-right" | "bottom-left" = "bottom-left";

    constructor() {
        super();
        this._slices = d3.select<SVGGElement, unknown>(this._slicesG);
        this._labels = d3.select<SVGGElement, unknown>(this._labelsG);
    }

    update(changes: ChangeMap<this>) {
        super.update(changes);
        
        const outerRadius = this.calcOuterRadius();
        let x = (this.clientWidth / 2);
        let y = (this.clientHeight / 2);
        if(this.orientation === "top-left") {
            x -= (outerRadius/2);
            y -= (outerRadius/2);
        } 
        else if (this.orientation === "bottom-right") {
            x -= (outerRadius/2);
            y += (outerRadius/2);
        } 
        else if (this.orientation === "top-right") {
            x += (outerRadius/2);
            y -= (outerRadius/2);
        } 
        else if (this.orientation === "bottom-left") {
            x -= (outerRadius/2);
            y += (outerRadius/2);
        }
        this._slices.attr("transform", `translate(${x}, ${y})`);
        this._labels.attr("transform", `translate(${x}, ${y})`);
    }

    updateD3Pie() {
        super.updateD3Pie();
        let startAngle = 0;
        if (this.orientation === "top-right") {
            startAngle = (Math.PI / 2) * 2;
        } else if(this.orientation === "top-left") {
            startAngle = (Math.PI / 2);
        } else if (this.orientation === "bottom-right") {
            startAngle = (Math.PI / 2) * 3;
        }
        const endAngle = startAngle + (Math.PI/2);
        this.d3Pie
            .startAngle(startAngle)
            .endAngle(endAngle)
            ;
    }

}