import { HPCCResizeElement, attribute, property, ChangeMap, customElement, css, html, ref, HTMLColor } from "../common/hpcc-element";
import { treemapFunc, Node, Leaf, Mode } from "./treemapFunc";

export type { Node, Mode, Leaf };

const template = html<HPCCTreemapElement>`
    <svg ${ref("_svg")} width="${(s) => s.width}" height="${(s) => s.height}" viewbox="[0, 0, ${(s) => s._svg.clientWidth}, ${(s) => s._svg.clientHeight}]">
    </svg>
`;

const styles = css`
    :host {
    }

    svg {
    }
`;

@customElement({ name: "hpcc-treemap", template, styles })
export class HPCCTreemapElement extends HPCCResizeElement {

    /**
    * Render mode
    *
    * @typeParam binary - Recursively partitions the specified nodes into an approximately-balanced binary tree, choosing horizontal partitioning for wide rectangles and vertical partitioning for tall rectangles
    * @typeParam squarify - mplements the squarified treemap algorithm by Bruls et al., which seeks to produce rectangles of a given aspect ratio
    * @typeParam sliceDice - If the specified node has odd depth, delegates to treemapSlice; otherwise delegates to treemapDice
    * @typeParam slice - Divides the rectangular area specified by x0, y0, x1, y1 vertically according the value of each of the specified node’s children. The children are positioned in order, starting with the top edge (y0) of the given rectangle. If the sum of the children’s values is less than the specified node’s value (i.e., if the specified node has a non-zero internal value), the remaining empty space will be positioned on the bottom edge (y1) of the given rectangle
    * @typeParam dice - Divides the rectangular area specified by x0, y0, x1, y1 horizontally according the value of each of the specified node’s children. The children are positioned in order, starting with the left edge (x0) of the given rectangle. If the sum of the children’s values is less than the specified node’s value (i.e., if the specified node has a non-zero internal value), the remaining empty space will be positioned on the right edge (x1) of the given rectangle
    * 
    * @defaultValue binary
    */
    @attribute mode: "binary" | "squarify" | "sliceDice" | "slice" | "dice" = "binary";

    /**
     * Data to be rendered
     *
     * @defaultValue undefined
     */
    @property data: Node;

    _svg: SVGSVGElement;

    update(changes: ChangeMap) {
        super.update(changes);
        const data = typeof this.data === "string" ? JSON.parse(this.data) : this.data;
        if (data) {
            treemapFunc(this._svg, data, {
                mode: this.mode,
                value: d => d.size, // size of each node (file); null for internal nodes (folders)
                group: (d, n) => n.ancestors().slice(-2)[0].data.name, // e.g., "animate" in flare/animate/Easing; color
                label: (d, n) => [...d.name.split(/(?=[A-Z][a-z])/g), n.value.toLocaleString("en")].join("\n"),
                title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}\n${n.value.toLocaleString("en")}`,
                link: (d, n) => `https://github.com/prefuse/Flare/blob/master/flare/src/${n.ancestors().reverse().map(d => d.data.name).join("/")}.as`,
                width: this._svg.clientWidth,
                height: this._svg.clientHeight
            });
        }
    }
}
