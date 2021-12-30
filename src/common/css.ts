export function css(templateData: TemplateStringsArray, ...args: any[]): string {
    let retVal = templateData[0];
    for (let i = 0; i < args.length; ++i) {
        const arg = String(args[i]);
        retVal += String(args[i]);
        retVal += templateData[i + 1];
    }
    return retVal;
}

export function display(display): string {
    return `\
:host([hidden]) {
    display: none
}

:host {
    display: ${display}
}`;
}