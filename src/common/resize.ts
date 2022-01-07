import { attribute } from "./decorator";
import { HPCCElement } from "./element";

export class HPCCResizeElement extends HPCCElement {

    protected observer = new ResizeObserver(() => {
        this._fire("resize");
    });

    connectedCallback(): void {
        super.connectedCallback();
        this.observer.observe(this);
    }

    disconnectedCallback(): void {
        this.observer.unobserve(this);
        super.disconnectedCallback();
    }
}
