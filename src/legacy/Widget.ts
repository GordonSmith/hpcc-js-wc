import { HPCCElement } from "../common";
import { Class } from "./Class";
import { textSize, TextSize } from "./Utility";
export interface IPos {
    x: number;
    y: number;
}

export class Widget extends Class {

    protected _pos;
    constructor(host: HPCCElement) {
        super(host);
        this._pos = { x: 0, y: 0 };
    }

    pos(): IPos;
    pos(_: IPos): this;
    pos(_?: IPos): IPos | this {
        if (!arguments.length) return this._pos;
        this._pos = _;
        return this;
    }

    x(): number;
    x(_): this;
    x(_?): number | this {
        if (!arguments.length) return this._pos.x;
        this.pos({ x: _, y: this._pos.y });
        return this;
    }

    y(): number;
    y(_): this;
    y(_?): number | this {
        if (!arguments.length) return this._pos.y;
        this.pos({ x: this._pos.x, y: _ });
        return this;
    }
    textSize(_text: string | string[], fontName: string = "Verdana", fontSize: number = 12, bold: boolean = false): Readonly<TextSize> {
        return textSize(_text, fontName, fontSize, bold);
    }
}
