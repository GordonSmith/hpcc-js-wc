function parse(string, type: DOMParserSupportedType = "text/xml") {
    return new DOMParser().parseFromString(string, type);
}

function stringify(DOM) {
    return new XMLSerializer().serializeToString(DOM);
}

function transform(xml, xsl) {
    const proc = new XSLTProcessor();
    proc.importStylesheet(typeof xsl == "string" ? parse(xsl) : xsl);
    const output = proc.transformToFragment(typeof xml == "string" ? parse(xml) : xml, document);
    return typeof xml == "string" ? stringify(output) : output;
}

function toString(node, pretty, level = 0, singleton = false) {
    if (typeof node == "string") node = parse(node);
    const tabs = pretty
        ? Array(level + 1)
              .fill("")
              .join("\t")
        : "";
    const newLine = pretty ? "\n" : "";
    if (node.nodeType == 3) return (singleton ? "" : tabs) + node.textContent.trim() + (singleton ? "" : newLine);
    if (!node.tagName) return toString(node.firstChild, pretty);
    let output = tabs + `<${node.tagName}`; // >\n
    for (let i = 0; i < node.attributes.length; i++) output += ` ${node.attributes[i].name}="${node.attributes[i].value}"`;
    if (node.childNodes.length == 0) return output + " />" + newLine;
    else output += ">";
    const onlyOneTextChild = node.childNodes.length == 1 && node.childNodes[0].nodeType == 3;
    if (!onlyOneTextChild) output += newLine;
    for (let i = 0; i < node.childNodes.length; i++) output += toString(node.childNodes[i], pretty, level + 1, onlyOneTextChild);
    return output + (onlyOneTextChild ? "" : tabs) + `</${node.tagName}>` + newLine;
}

export function minify(node) {
    return toString(node, false);
}

export function prettify(node) {
    return toString(node, true);
}
