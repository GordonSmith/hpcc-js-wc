import { HPCCElement, attribute } from "../common/element";

export { customElement, css, html, ref, volatile } from "@microsoft/fast-element";

export class HPCCResizeElement extends HPCCElement implements EventListenerObject {
    /**
     * The element width
     */
    @attribute width?: number | string;

    /**
     * The element height
     */
    @attribute height?: number | string;

    @attribute innerWidth: number = 0;

    @attribute innerHeight: number = 0;

    protected _computedStyle: CSSStyleDeclaration;

    handleEvent(): void {
        this.innerWidth = this.clientWidth - parseFloat(this._computedStyle.paddingLeft) - parseFloat(this._computedStyle.paddingRight);
        this.innerHeight = this.clientHeight - parseFloat(this._computedStyle.paddingTop) - parseFloat(this._computedStyle.paddingBottom);
    }

    protected observer = new ResizeObserver(() => {
        this.handleEvent();
    });

    connectedCallback(): void {
        super.connectedCallback();
        this._computedStyle = getComputedStyle(this);
        if (this.parentElement === document.body) {
            window.addEventListener("resize", this);
            this.handleEvent();
        } else {
            this.observer.observe(this);
        }
    }

    disconnectedCallback(): void {
        if (this.parentElement === document.body) {
            window.removeEventListener("resize", this);
        } else {
            this.observer.unobserve(this);
        }
        super.disconnectedCallback();
    }
}
