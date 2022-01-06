import { attribute } from "./decorator";
import { HPCCElement } from "./element";

export class HPCCResizeElement extends HPCCElement implements EventListenerObject {
    /**
     * The element width
     */
    @attribute width?: number | string;

    /**
     * The element height
     */
    @attribute height?: number | string;

    get widthString() {
        return typeof this.width === "string" ? this.width : this.width + "px";

    }
    get heightString() {
        return typeof this.height === "string" ? this.height : this.height + "px";
    }

    @attribute parentWidth: number = 0;

    @attribute patentHeight: number = 0;

    @attribute thisWidth: number = 0;

    @attribute thisHeight: number = 0;

    protected _computedStyle: CSSStyleDeclaration;

    handleEvent(): void {
        this.parentWidth = this.parentElement!.clientWidth - parseFloat(this._computedStyle.paddingLeft) - parseFloat(this._computedStyle.paddingRight);
        this.patentHeight = this.parentElement!.clientHeight - parseFloat(this._computedStyle.paddingTop) - parseFloat(this._computedStyle.paddingBottom);
        this.thisWidth = this.clientWidth;
        this.thisHeight = this.clientHeight;
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
            this.observer.observe(this.parentElement!);
        }
        this.observer.observe(this);
    }

    disconnectedCallback(): void {
        this.observer.unobserve(this);
        if (this.parentElement === document.body) {
            window.removeEventListener("resize", this);
        } else {
            this.observer.unobserve(this.parentElement!);
        }
        super.disconnectedCallback();
    }
}
