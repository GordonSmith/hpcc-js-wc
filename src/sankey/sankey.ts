import { HPCCSVGElement, attribute, css, property, ChangeMap, customElement, HTMLColor, display, html, ref } from "../common";
import { format as d3Format } from "d3";
import { sankeyFunc } from "./sankeyFunc";

const template = html<HPCCSankeyElement>`\
<svg ${ref("_svg")}>
    <g ${ref("_nodesG")}></g>
    <g ${ref("_linksG")} class="links"></g>
    <g ${ref("_textG")}></g>
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

@customElement("hpcc-sankey", { template, styles })
export class HPCCSankeyElement extends HPCCSVGElement {
    /**
     * Alignment of the nodes
     *
     * @typeParam left - nodes are aligned to the left of the diagram
     * @typeParam right - nodes are aligned to the right of the diagram
     * @typeParam justify - nodes are evenly distributed in the diagram
     *
     * @defaultValue justify
     */
    @attribute node_align: "justify" | "left" | "right" = "justify"; // stroke around node rects

    /**
     * Border color of the nodes.  Value can be any valid CSS color string or "currentColor"
     *
     * @defaultValue "currentColor"
     */
    @attribute node_stroke: HTMLColor = "currentColor"; // stroke around node rects

    /**
     * Border width the nodes
     *
     * @defaultValue 1
     */
    @attribute({ type: "number" }) node_stroke_width: number = 1; // width of stroke around node rects, in pixels

    /**
     * Border opacity of the nodes
     *
     * @defaultValue 1
     */
    @attribute({ type: "number" }) node_stroke_opacity = 1; // opacity of stroke around node rects

    /**
     * Link opacity
     *
     * @defaultValue 0.5
     */
    @attribute({ type: "number" }) link_stroke_opacity = 0.5; // opacity of stroke around node rects

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
    @attribute link_color: "source" | "target" | "source-target" | HTMLColor = "source-target"; // stroke around node rects

    /**
     * Links to be displayed
     *
     * @defaultValue []
     */
    @property links: { source: string; target: string; value: number }[] = [];

    protected _nodesG: SVGGElement;
    protected _linksG: SVGGElement;
    protected _textG: SVGGElement;

    constructor() {
        super();
    }

    update(changes: ChangeMap<this>) {
        super.update(changes);
        this._nodesG.setAttribute("stroke", this.node_stroke);
        this._nodesG.setAttribute("stroke-width", `${this.node_stroke_width}`);
        this._nodesG.setAttribute("stroke-opacity", `${this.node_stroke_opacity}`);
        this._linksG.setAttribute("stroke-opacity", `${this.link_stroke_opacity}`);

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
                    nodeAlign: this.node_align,
                    linkColor: this.link_color, // e.g., "source" or "target"; set by input above
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
