import { HPCCResizeElement } from "./resize";

export class HPCCDivElement extends HPCCResizeElement {

    protected _div: HTMLDivElement;

    constructor() {
        super();
        this._div = document.createElement("div");
        this.shadowRoot?.appendChild(this._div);
    }
}
