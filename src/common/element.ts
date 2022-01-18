import { Dispatch, IObserverHandle } from "@hpcc-js/util";
import { classMeta, instanceMeta } from "./decorator";
import { Ref } from "./html";
import { AttrChangedMessage, ChangeMap } from "./message";

export type HTMLColor = string;

export const DefaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true
};

export class HPCCElement extends HTMLElement {

    static get observedAttributes(): string[] {
        return classMeta(this).observedAttributes;
    }

    private $meta = instanceMeta(this);

    private $dispatch = new Dispatch<AttrChangedMessage>();

    protected _fire = (what: string, oldVal: any = false, newVal: any = true) => {
        this.$dispatch.post(new AttrChangedMessage(what, oldVal, newVal));
    };

    private $dispatchHandle: IObserverHandle;

    private $styles: HTMLStyleElement;
    protected set styles(_: string) {
        this.$styles.innerHTML = _;
    }
    protected get styles() {
        return this.$styles.innerHTML;
    }

    constructor() {
        super();

        //  Gather user values set prior to "upgrade"  ---
        Object.keys(this.$meta.observed).forEach(prop => this.$upgradeProperty(prop));

        //  Initialize shadow DOM  ---
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = this.$meta.template?.html.trim() || "";
        for (const directive of this.$meta.template?.directives || []) {
            if (directive instanceof Ref) {
                const ref = this.shadowRoot!.getElementById(String(directive.propertyName));
                this[directive.propertyName] = ref;
                ref?.removeAttribute("id");
            }
        }
        this.$styles = document.createElement("style");
        this.$styles.innerHTML = this.$meta.styles.trim();
        this.shadowRoot!.insertBefore(this.$styles, this.shadowRoot!.firstChild);
    }

    private $upgradeProperty(prop) {
        const userValueID = `__${prop}`;
        if (this.hasOwnProperty(prop)) {
            this[userValueID] = this[prop];
            delete this[prop];
        } else if (this.hasAttribute(prop)) {
            this[userValueID] = this.getAttribute(prop);
        }
    }

    protected attrValue(qualifiedName: string, value: string | null) {
        switch (this.$meta.observed[qualifiedName].type) {
            case "boolean":
                return !!value;
            case "number":
                const retVal = Number(value);
                return isNaN(retVal) ? null : retVal;
            case "string":
            default:
                return value;
        }
    }

    attr(qualifiedName: string): boolean | number | string | null;
    attr(qualifiedName: string, _: boolean | number | string | null): this;
    attr(qualifiedName: string, _?: boolean | number | string | null): boolean | number | string | null | this {
        if (_ === undefined) {
            switch (this.$meta.observed[qualifiedName].type) {
                case "boolean":
                    return this.attrValue(qualifiedName, this.hasAttribute(qualifiedName) ? "true" : "");
                case "number":
                case "string":
                default:
                    return this.attrValue(qualifiedName, this.getAttribute(qualifiedName));
            }
        } else {
            switch (this.$meta.observed[qualifiedName].type) {
                case "boolean":
                    if (_ as boolean) {
                        this.setAttribute(qualifiedName, "true");
                    } else {
                        this.removeAttribute(qualifiedName);
                    }
                    break;
                case "number":
                    this.setAttribute(qualifiedName, (_ as number).toString());
                    break;
                case "string":
                default:
                    this.setAttribute(qualifiedName, _ as string);
            }
        }
        return this;
    }

    private $_initialized = false;
    private initalizeAttributes(): ChangeMap {
        if (this.$_initialized) return {};
        this.$_initialized = true;

        const retVal: ChangeMap = {};
        this.$meta.observedAttributes.forEach(attr => {
            const userValueID = `__${attr}`;
            const innerID = `_${attr}`;
            const value = this[innerID];
            if (this[userValueID] !== undefined) {
                this[innerID] = this[userValueID];
                delete this[userValueID];
            } else {
                this.attr(attr, value);
            }
            retVal[attr] = { oldValue: undefined, newValue: this[innerID] };
        });

        this.$meta.observedProperties.forEach(prop => {
            const userValueID = `__${prop}`;
            const innerID = `_${prop}`;
            if (this[userValueID] !== undefined) {
                this[innerID] = this[userValueID];
                delete this[userValueID];
            }
            retVal[prop] = { oldValue: undefined, newValue: this[innerID] };
        });
        return retVal;
    }

    connectedCallback() {
        const changes = this.initalizeAttributes();
        this.enter();
        this.update(changes);
        this.$dispatch.flush();
        this.$dispatchHandle = this.$dispatch.attach((messages) => {
            if (this.isConnected) {
                const changes: ChangeMap = {};
                if (messages.length > 1) throw new Error("Conflation issue.");
                for (const what in messages[0].changes) {
                    const change = messages[0].changes[what];
                    if (change.oldValue !== change.newValue) {
                        changes[what] = change;
                    }
                }
                if (Object.keys(changes).length) {
                    this.update(changes);
                }
            }
        });
    }

    disconnectedCallback() {
        this.$dispatchHandle.release();
        this.exit();
    }

    adoptedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const innerID = `_${name}`;
        const coercedValue = this.attrValue(name, newValue);
        if (this[innerID] !== coercedValue) {
            const oldValue = this[innerID];
            this[innerID] = coercedValue;
            this._fire(name, oldValue, coercedValue);
        }
    }

    //  Lifecycle  ---
    enter() {
        //  Debugging, remove for production  ---
        for (const key of this.$meta.observedAttributes) {
            if (this[key] !== this.attr(key)) {
                console.log("enter sync error", key, this[key], this.attr(key));
            }
        }
        //  Debugging, remove for production  ---
    }

    update(changes: ChangeMap) {
        for (const key in changes) {
            if (this.$meta.observed[key]?.isAttribute && this[key] !== this.attr(key)) {
                this.attr(key, this[key]);
            }
        }
        //  Debugging, remove for production  ---
        for (const key of this.$meta.observedAttributes) {
            if (this.$meta.observedAttributes.indexOf(key) >= 0 && this[key] !== this.attr(key)) {
                console.log("update sync error", key, this[key], this.attr(key));
            }
        }
        //  Debugging, remove for production  ---
    }

    exit() {
    }

    //  Events  ---
    $emit(type: string, detail?: any, options?) {
        const opts = { detail, ...DefaultEventOptions, ...options };
        if (this.isConnected) {
            return this.dispatchEvent(new CustomEvent(type, opts));
        }
        return opts.cancelable ? true : false;
    }
}
