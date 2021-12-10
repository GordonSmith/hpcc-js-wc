import { HPCCResizeElement, attribute, customElement, css, html, ref, ChangeMap } from "../base/hpcc-element";
import * as d3 from "d3";

const template = html<HPCCZoomElement>`
<svg ${ref("_svg")} width="${s => s.width}" height="${s => s.height}" viewbox="[0, 0, ${s => s._svg.clientWidth}, ${s => s._svg.clientHeight}]">
    <foreignObject ${ref("_content")} x="0" y="0" width="100%" height="100%">
        <slot>
        </slot>
    </foreignObject>
</svg>
`;

const styles = css`
svg {
}
`;

@customElement({ name: "hpcc-zoom", template, styles })
export class HPCCZoomElement extends HPCCResizeElement {

    @attribute scaleMin: number = 0.1;
    @attribute scaleMax: number = 2;
    @attribute x = 0;
    @attribute y = 0;
    @attribute scale = 1;

    _svg: SVGElement;
    _content: SVGGElement;
    protected content: d3.Selection<SVGGElement, any, any, any>;

    _zoom = d3.zoom()
        .on("zoom", ({ transform }) => {
            this.x = transform.x;
            this.y = transform.y;
            this.scale = transform.k;
        })
        ;

    enter() {
        super.enter();
        this.content = d3.select(this._content);
        d3.select(this._svg).call(this._zoom);
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this._zoom
            .extent([[0, 0], [this._svg.clientWidth, this._svg.clientHeight]])
            .scaleExtent([this.scaleMin, this.scaleMax])
            ;

        if (changes.x !== undefined || changes.y !== undefined || changes.scale !== undefined) {
            this.content
                .attr("transform", d3.zoomIdentity.translate(this.x, this.y).scale(this.scale))
                ;
            this.$emit("zoom");
        }
    }
}
