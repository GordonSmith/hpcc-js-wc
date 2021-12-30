import { Message } from "@hpcc-js/util";

export interface Change {
    oldValue: any;
    newValue: any;
}

export interface ChangeMap {
    [what: string]: Change;
}

export class AttrChangedMessage extends Message {

    get canConflate(): boolean {
        return true;
    }

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
