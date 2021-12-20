import { HPCCResizeElement, attribute, property, ChangeMap, customElement, css, html, ref, HTMLColor } from "../common/hpcc-element";
import { format as d3Format } from "d3";
import { sankeyFunc } from "./sankeyFunc";

const template = html<HPCCSankeyElement>`
    <svg ${ref("_svg")} width="${(s) => s.width}" height="${(s) => s.height}" viewbox="[0, 0, ${(s) => s._svg.clientWidth}, ${(s) => s._svg.clientHeight}]">
        <g ${ref("_nodesG")} stroke="${(s) => s.nodeStroke}" stroke-width="${(s) => s.nodeStrokeWidth}" stroke-opacity="${(s) => s.nodeStrokeOpacity}"></g>
        <g ${ref("_linksG")} fill="none" stroke-opacity="${(s) => s.linkStrokeOpacity}"></g>
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
    /**
     * Alignment of the nodes
     *
     * @typeParam left - nodes are aligned to the left of the diagram
     * @typeParam right - nodes are aligned to the right of the diagram
     * @typeParam justify - nodes are evenly distributed in the diagram
     *
     * @defaultValue justify
     */
    @attribute nodeAlign: "justify" | "left" | "right" = "justify"; // stroke around node rects

    /**
     * Border color of the nodes.  Value can be any valid CSS color string or "currentColor"
     *
     * @defaultValue "currentColor"
     */
    @attribute nodeStroke: HTMLColor = "currentColor"; // stroke around node rects

    /**
     * Border width the nodes
     *
     * @defaultValue 1
     */
    @attribute nodeStrokeWidth: number = 1; // width of stroke around node rects, in pixels

    /**
     * Border opacity of the nodes
     *
     * @defaultValue 1
     */
    @attribute nodeStrokeOpacity = 1; // opacity of stroke around node rects

    /**
     * Link opacity
     *
     * @defaultValue 0.5
     */
    @attribute linkStrokeOpacity = 0.5; // opacity of stroke around node rects

    /**
     * Link color of the links
     *
     * @typeParam source - links are colored based on the source node
     * @typeParam target - links are colored based on the target node
     * @typeParam source-target - links are colored based on the source and target nodes
     * @typeParam HTMLColor - links are colored by any valid CSS color string
     *
     * @defaultValue source-target
     */
    @attribute linkColor: "source" | "target" | "source-target" | HTMLColor = "source-target"; // stroke around node rects

    /**
     * Links to be displayed
     *
     * @defaultValue []
     */
    @property links: { source: string; target: string; value: number }[];

    _svg: SVGSVGElement;
    _nodesG: SVGGElement;
    _linksG: SVGGElement;
    _textG: SVGGElement;

    update(changes: ChangeMap) {
        super.update(changes);
        const links = typeof this.links === "string" ? JSON.parse(this.links) : this.links;
        if (links?.length) {
            sankeyFunc(
                {
                    nodesG: this._nodesG,
                    linksG: this._linksG,
                    textG: this._textG
                },
                { nodes: undefined, links },
                {
                    nodeGroup: (d) => d.id.split(/\W/)[0], // take first word for color
                    nodeAlign: this.nodeAlign,
                    linkColor: this.linkColor, // e.g., "source" or "target"; set by input above
                    format: (
                        (f) => (d) =>
                            `${f(d)} TWh`
                    )(d3Format(",.1~f")),
                    width: this._svg.clientWidth,
                    height: this._svg.clientHeight
                }
            );
        }
    }
}
