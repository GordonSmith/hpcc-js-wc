import { HPCCElement, attribute, property, ChangeMap, customElement, css, html, ref } from "../base/hpcc-element";
import { format as d3Format } from "d3";
import { SankeyChart } from "./sankey";

const template = html<HPCCSankeyElement>`
<svg width="${s => s.width}" height="${s => s.height}" viewbox="[0, 0, ${s => s.width}, ${s => s.height}]">
    <g ${ref("nodesG")} stroke="${s => s.nodeStroke}" stroke-width="${s => s.nodeStrokeWidth}" stroke-opacity="${s => s.nodeStrokeOpacity}" stroke="${s => s.nodeStrokeLinejoin}"></g>
    <g ${ref("linksG")} fill="none" stroke-opacity="${s => s.linkStrokeOpacity}"></g>
    <g ${ref("textG")} font-family="sans-serif" font-size="10"></g>
</svg>
`;

const styles = css`
svg {
    min-height: 100px; 
    max-width: 100%; 
    height: auto;
    height: intrinsic;
 }
`;

@customElement({ name: "hpcc-sankey", template, styles })
export class HPCCSankeyElement extends HPCCElement {

    @attribute width: string | number = 800;
    @attribute height: string | number = 600;

    @attribute nodeAlign: "justify" | "left" | "right" = "justify"; // stroke around node rects
    @attribute nodeStroke = "currentColor"; // stroke around node rects
    @attribute nodeStrokeWidth; // width of stroke around node rects, in pixels
    @attribute nodeStrokeOpacity; // opacity of stroke around node rects
    @attribute nodeStrokeLinejoin; // line join for stroke around node rects

    @attribute linkStrokeOpacity = 0.5; // opacity of stroke around node rects
    @attribute linkColor: "source" | "target" | "source-target" | string = "source-target"; // stroke around node rects

    @property links: any[];

    nodesG: SVGGElement;
    linksG: SVGGElement;
    textG: SVGGElement;

    update(changes: ChangeMap) {
        super.update(changes);
        if (this.links?.length) {
            SankeyChart({ nodesG: this.nodesG, linksG: this.linksG, textG: this.textG }, { nodes: undefined, links: this.links }, {
                nodeGroup: d => d.id.split(/\W/)[0], // take first word for color
                nodeAlign: this.nodeAlign,
                linkColor: this.linkColor, // e.g., "source" or "target"; set by input above
                format: (f => d => `${f(d)} TWh`)(d3Format(",.1~f")),
                width: this.width,
                height: this.height,
            });
        }
    }
}
