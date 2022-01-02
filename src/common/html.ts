import { HPCCElement } from "./element";

export class Directive {
}

export class Ref extends Directive {

    constructor(public id: string) {
        super();
    }
}

export interface HTMLTemplate {
    html: string;
    directives: Directive[];
}

export function html<T extends HPCCElement>(templateData: TemplateStringsArray, ...args: any[]): HTMLTemplate {
    let html = templateData[0];
    const directives: Directive[] = [];
    for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (arg instanceof Directive) {
            directives.push(arg);
            if (arg instanceof Ref) {
                html += `id="${arg.id}"`;
            }
        } else {
            html += String(args[i]);
        }
        html += templateData[i + 1];
    }
    return { html, directives };
}

export function ref(refID: string) {
    return new Ref(refID);
}
