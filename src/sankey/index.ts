import { HPCCResizeElement, HPCCElement, attribute, property, volatile, ChangeMap, customElement, css, html, ref } from "../base/hpcc-element";
import { format as d3Format } from "d3";
import { SankeyChart } from "./sankey";

const template = html<HPCCSankeyElement>`
<svg ${ref("_svg")} width="${s => s.width}" height="${s => s.height}" viewbox="[0, 0, ${s => s._svg.clientWidth}, ${s => s._svg.clientHeight}]">
    <g ${ref("_nodesG")} stroke="${s => s.nodeStroke}" stroke-width="${s => s.nodeStrokeWidth}" stroke-opacity="${s => s.nodeStrokeOpacity}" stroke="${s => s.nodeStrokeLinejoin}"></g>
    <g ${ref("_linksG")} fill="none" stroke-opacity="${s => s.linkStrokeOpacity}"></g>
    <g ${ref("_textG")} font-family="sans-serif" font-size="10"></g>
</svg>
`;

const styles = css`
:host {
}

svg {
}
`;

@customElement({ name: "hpcc-sankey", template, styles })
export class HPCCSankeyElement extends HPCCResizeElement {

    @attribute nodeAlign: "justify" | "left" | "right" = "justify"; // stroke around node rects
    @attribute nodeStroke = "currentColor"; // stroke around node rects
    @attribute nodeStrokeWidth; // width of stroke around node rects, in pixels
    @attribute nodeStrokeOpacity; // opacity of stroke around node rects
    @attribute nodeStrokeLinejoin; // line join for stroke around node rects

    @attribute linkStrokeOpacity = 0.5; // opacity of stroke around node rects
    @attribute linkColor: "source" | "target" | "source-target" | string = "source-target"; // stroke around node rects

    @property links: any[];

    _svg: SVGSVGElement;
    _nodesG: SVGGElement;
    _linksG: SVGGElement;
    _textG: SVGGElement;

    update(changes: ChangeMap) {
        super.update(changes);
        const links = typeof this.links === "string" ? JSON.parse(this.links) : this.links;
        if (links?.length) {
            SankeyChart({ nodesG: this._nodesG, linksG: this._linksG, textG: this._textG }, { nodes: undefined, links }, {
                nodeGroup: d => d.id.split(/\W/)[0], // take first word for color
                nodeAlign: this.nodeAlign,
                linkColor: this.linkColor, // e.g., "source" or "target"; set by input above
                format: (f => d => `${f(d)} TWh`)(d3Format(",.1~f")),
                width: this._svg.clientWidth,
                height: this._svg.clientHeight,
            });
        }
    }
}
