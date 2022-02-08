import { attribute, css, ChangeMap, customElement, display, html, ref } from "../common";
import { HPCCPieElement, pieCommonStyles } from "./pie";
import * as d3 from "d3";

const template = html<HPCCHalfPieElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_slicesG")}></g>
    <g ${ref("_labelsG")}></g>
</svg>`;

const styles = css`
${display("inline-block")}

${pieCommonStyles}
`;

@customElement("hpcc-halfpie", { template, styles })
export class HPCCHalfPieElement extends HPCCPieElement {
    /**
     * Determines the placement and start/end angle.
     * 
     * @typeParam top - orients widget towards the top
     * @typeParam right - orients widget towards the right
     * @typeParam bottom - orients widget towards the bottom
     * @typeParam left - orients widget towards the left
     * 
     * @defaultValue "left"
     */
     @attribute({ type: "string" }) orientation: "top" | "right" | "bottom" | "left" = "bottom";

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
        if(this.orientation === "top"){
            y += (outerRadius/2);
        } else if (this.orientation === "right") {
            x -= (outerRadius/2);
        } else if (this.orientation === "bottom") {
            y -= (outerRadius/2);
        } else {
            x += (outerRadius/2);
        }
        this._slices.attr("transform", `translate(${x}, ${y})`);
        this._labels.attr("transform", `translate(${x}, ${y})`);
    }

    updateD3Pie() {
        super.updateD3Pie();
        let startAngle = Math.PI;
        if(this.orientation === "top"){
            startAngle += (Math.PI / 2);
        } else if (this.orientation === "right") {
            startAngle += (Math.PI / 2) * 2;
        } else if (this.orientation === "bottom") {
            startAngle += (Math.PI / 2) * 3;
        }
        const endAngle = startAngle + Math.PI;
        this.d3Pie
            .startAngle(startAngle)
            .endAngle(endAngle)
            ;
    }
}
