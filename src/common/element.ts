import { Dispatch, IObserverHandle } from "@hpcc-js/util/lib-es6/dispatch";
import { classMeta } from "./decorator";
import { AttrChangedMessage, ChangeMap } from "./message";

export type HTMLColor = string;

const defaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

export class HPCCElement extends HTMLElement {

    static get observedAttributes(): string[] {
        return classMeta(this.name).observedAttributes;
    }

    get observedAttributes(): string[] {
        return classMeta(this.constructor.name).observedAttributes;
    }

    get observedProperties(): string[] {
        return classMeta(this.constructor.name).observedProperties;
    }

    get observed(): string[] {
        return classMeta(this.constructor.name).observed;
    }

    get styles(): string {
        return classMeta(this.constructor.name).styles;
    }

    private _dispath = new Dispatch<AttrChangedMessage>();

    protected _fire = (what: string, oldVal: any = false, newVal: any = true) => {
        this._dispath.post(new AttrChangedMessage(what, oldVal, newVal));
    };

    private _dispatchHandle: IObserverHandle;

    protected _styles: HTMLStyleElement;

    constructor() {
        super();
        this._styles = document.createElement("style");
        this._styles.innerHTML = this.styles;
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.appendChild(this._styles);
    }

    private _initialized = false;
    private initalizeAttributes(): ChangeMap {
        if (this._initialized) return {};
        this._initialized = true;
        const retVal: ChangeMap = {};
        this.observedAttributes.forEach(attr => {
            const innerID = `_${attr}`;
            const value = this[innerID];
            if (value === undefined) {
                this[innerID] = this.getAttribute(attr);
                retVal[attr] = { oldValue: undefined, newValue: this[innerID] };
            } else {
                this.setAttribute(attr, value);
                retVal[attr] = { oldValue: undefined, newValue: value };
            }
        });
        this.observedProperties.forEach(prop => {
            const innerID = `_${prop}`;
            retVal[prop] = { oldValue: undefined, newValue: this[innerID] };
        });
        return retVal;
    }

    connectedCallback() {
        const changes = this.initalizeAttributes();
        this.enter();
        this.update(changes);
        this._dispath.flush();
        this._dispatchHandle = this._dispath.attach((messages) => {
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
        this._dispatchHandle.release();
        this.exit();
    }

    adoptedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const innerID = `_${name}`;
        if (this[innerID] !== newValue) {
            this[innerID] = newValue;
            this._fire(name, oldValue, newValue);
        }
    }

    //  Lifecycle  ---
    enter() {
        for (const key of this.observedAttributes) {
            if (this[key] != this.getAttribute(key)) {
                console.log("enter error", key, this[key], this.getAttribute(key));
            }
        }
    }

    update(changes: ChangeMap) {
        for (const key in changes) {
            if (this[key] != this.getAttribute(key)) {
                this.setAttribute(key, this[key]);
            }
        }
        for (const key of this.observedAttributes) {
            if (this[key] != this.getAttribute(key)) {
                console.log("update error", key, this[key], this.getAttribute(key));
            }
        }
    }

    exit() {
    }

    //  Events  ---
    $emit(type: string, detail?: any, options?) {
        if (this.isConnected) {
            return this.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
        }
        return false;
    }
}
