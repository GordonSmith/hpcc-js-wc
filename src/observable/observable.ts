import { OJSRuntime, OMDRuntime, OJSRuntimeError, OJSSyntaxError } from "@hpcc-js/observable-md";
import { IObserverHandle } from "@hpcc-js/util";
import { ChangeMap, HPCCResizeElement, css, customElement, display, html, ref, attribute, property } from "../common";

const template = html<HPCCObservableElement>`\
<div ${ref("_div")}>
</div>
<slot ${ref("_slot")}></slot>
`;

const styles = css`
${display("inline-block")}

:host  {
    width:100%;
    overflow-y: auto;
}

:host > slot {
    display: none;
}

`;

@customElement("hpcc-observable", { template, styles })
export class HPCCObservableElement extends HPCCResizeElement {

    @attribute mode: "markdown" | "observablescript" = "observablescript";

    @property plugins: { [key: string]: object } = {};

    @property content: string = "";

    private _watcher: IObserverHandle;

    private _errors: OJSRuntimeError[] = [];
    private errors(): OJSRuntimeError[] {
        return this._errors;
    }

    protected _div: HTMLDivElement;
    protected _slot: HTMLSlotElement;

    constructor() {
        super();
        this.construct();
        this._slot.addEventListener("slotchange", () => this.construct());
    }

    private construct() {
        const text = this._slot.assignedNodes().map(n => n.textContent).join("\n");
        this.content = text;
    }

    enter() {
        super.enter();
    }

    update(changes: ChangeMap) {
        super.update(changes);

        if (changes.content) {
            this._div.innerHTML = "";

            const context = this;
            const runtimeUpdated = throttle(function () {
                context.runtimeUpdated();
            }, 500);

            const runtime = this.mode === "observablescript" ? new OJSRuntime(this._div, this.plugins) : new OMDRuntime(this._div, this.plugins);
            if (this._watcher) {
                this._watcher.release();
            }

            this._watcher = runtime.watch(async () => {
                const vars = runtime.latest();
                this._errors = vars.map(n => {
                    const { start, end } = n.variable.pos();
                    return new OJSRuntimeError(n.type, start, end, stringify(n.value));
                });
                runtimeUpdated();
            });

            runtime.evaluate("", this.content, ".")
                .catch((e: OJSSyntaxError) => {
                    this._errors = [new OJSRuntimeError("error", e.start, e.end, e.message)];
                    this.runtimeUpdated();
                });
        }
    }

    //  Events  ---
    runtimeUpdated() {
    }

}

function throttle(func, interval) {
    let timeout;
    return function (this) {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = false;
        };
        if (!timeout) {
            func.apply(context, args);
            timeout = true;
            setTimeout(later, interval);
        }
    };
}

function stringify(value: any): string {
    if (value instanceof Element) {
        return value.outerHTML;
    }
    const type = typeof value;
    switch (type) {
        case "function":
            return "ƒ()";
        case "object":
            if (Array.isArray(value)) {
                return "[Array]";
            }
            break;
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "symbol":
        case "undefined":
            break;
    }
    if (value?.toString) {
        return value.toString();
    }
    return value;
}