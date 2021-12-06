import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { Dispatch, Message, IObserverHandle } from "@hpcc-js/util/lib-es6/dispatch";

export { customElement, css, html, ref } from "@microsoft/fast-element";

export interface Change { oldValue: any; newValue: any; }
export interface ChangeMap { [what: string]: Change }

class AttrChangedMessage extends Message {

    get canConflate(): boolean { return true; }

    changes: ChangeMap = {};

    constructor(what: string, oldValue: any, newValue: any) {
        super();
        this.changes[what] = { oldValue, newValue };
    }

    conflate(other: AttrChangedMessage): boolean {
        for (const what in other.changes) {
            const thisChange = this.changes[what];
            const otherChange = other.changes[what];
            if (thisChange) {
                this.changes[what].newValue = otherChange.newValue;
            } else {
                this.changes[what] = otherChange;
            }
        }
        return true;
    }
}

export class HPCCElement extends FASTElement {
    private _dispath = new Dispatch<AttrChangedMessage>();
    protected _fire = (what: string, oldVal = false, newVal = true) => {
        this._dispath.post(new AttrChangedMessage(what, oldVal, newVal));
    };

    private _dispatchHandle: IObserverHandle;
    connectedCallback(): void {
        super.connectedCallback();
        this.enter();
        this._dispatchHandle = this._dispath.attach(messages => {
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

    disconnectedCallback(): void {
        this._dispatchHandle.release();
        this.exit();
        super.disconnectedCallback();
    }

    enter() {
    }

    update(changes: ChangeMap) {
    }

    exit() {
    }

    render(): Promise<this> {
        return new Promise(resolve => {
            const handle = this._dispath.attach(() => {
                handle.release();
                resolve(this);
            });
            this._fire("render");
        });
    }
}

function appendChangedHandler(configOrTarget, prop) {
    const __proto__ = Object.getPrototypeOf(configOrTarget);
    __proto__[`${prop}Changed`] = function (this: HPCCElement, oldValue, newValue) {
        this._fire(prop, oldValue, newValue);
    };
}

export function attribute(target: object, prop: string): void {
    appendChangedHandler(target, prop);
    return attr(target, prop!);
}

export function property(target: object, prop: string) {
    appendChangedHandler(target, prop);
    return observable(target, prop);
}
