import { ChangeMap } from "./message";
import { HPCCResizeElement } from "./resize";

export class HPCCSVGElement extends HPCCResizeElement {

    protected _svg: SVGSVGElement;

    constructor() {
        super();
        this._svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.shadowRoot?.appendChild(this._svg);
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this._svg.setAttribute("width", `${this.innerWidth}px`);
        this._svg.setAttribute("height", this.heightString);
        this._svg.setAttribute("viewbox", `[0,0,${this._svg.clientWidth},${this._svg.clientHeight}]`);
    }
}
