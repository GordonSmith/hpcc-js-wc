import { HPCCResizeElement, attribute, customElement, css, html, ref, ChangeMap } from "../common/element";
import * as d3 from "d3";

const template = html<HPCCZoomElement>`
    <svg ${ref("_svg")} width="${(s) => s.width}" height="${(s) => s.height}" viewbox="[0, 0, ${(s) => s._svg.clientWidth}, ${(s) => s._svg.clientHeight}]">
        <foreignObject ${ref("_content")} x="0" y="0" width="100%" height="800px">
            <slot> </slot>
        </foreignObject>
    </svg>
`;

const styles = css`
    svg {
    }
`;

@customElement({ name: "hpcc-zoom", template, styles })
export class HPCCZoomElement extends HPCCResizeElement {
    /**
     * The minimum scale extent that can be applied to the content
     *
     * @defaultValue 0.5
     */
    @attribute scaleMin = 0.1;

    /**
     * The maximum scale extent that can be applied to the content
     *
     * @defaultValue 0.5
     */
    @attribute scaleMax = 2;

    /**
     * The current x-position of the content
     *
     * @defaultValue 0
     */
    @attribute x = 0;

    /**
     * The current y-position of the content
     *
     * @defaultValue 0
     */
    @attribute y = 0;

    /**
     * The current scale of the content
     *
     * @defaultValue 1
     */
    @attribute scale = 1;

    _svg: SVGSVGElement;
    protected svg: d3.Selection<SVGSVGElement, any, any, any>;
    _content: SVGGElement;
    protected content: d3.Selection<SVGGElement, any, any, any>;

    _zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .duration(0)
        .on("zoom", ({ transform }) => {
            this.x = transform.x;
            this.y = transform.y;
            this.scale = transform.k;
            this.$emit("changed");
        });

    enter() {
        super.enter();
        this.svg = d3.select(this._svg);
        this.content = d3.select(this._content);
        this.svg.call(this._zoom, d3.zoomIdentity.translate(this.x, this.y).scale(this.scale));
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this._zoom
            .extent([
                [0, 0],
                [this._svg.clientWidth, this._svg.clientHeight]
            ])
            .scaleExtent([this.scaleMin, this.scaleMax]);
        if (changes.x !== undefined || changes.y !== undefined || changes.scale !== undefined) {
            this.content.attr("transform", d3.zoomIdentity.translate(this.x, this.y).scale(this.scale).toString());
            this.$emit("zoom");
        }
        this._zoom.transform(this.svg, d3.zoomIdentity.translate(this.x, this.y).scale(this.scale));
    }
}
