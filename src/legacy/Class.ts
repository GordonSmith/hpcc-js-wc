import { HPCCElement } from "../common";

export class Class {

    protected _host: HPCCElement;

    constructor(host: HPCCElement) {
        this._host = host;
    }

    cssTag(id: string): string {
        return ("" + id).replace(/[^a-z0-9]/g, (s) => {
            const c = s.charCodeAt(0);
            if (c === 32) return "-";
            if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
            return "_0x" + c.toString(16);
        });
    }
}