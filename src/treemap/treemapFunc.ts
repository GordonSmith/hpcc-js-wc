// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/treemap

import * as d3 from "d3";

export interface Leaf {
    name: string;
    size: number
}

export interface Node {
    name: string;
    children: Array<Leaf | Node>
}

export interface HierarchyNodeEx<Datum> extends d3.HierarchyNode<Datum> {
    group: string;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

export type Mode = "binary" | "squarify" | "sliceDice" | "slice" | "dice";
const ModeMap = new Map<Mode, any>([
    ["binary", d3.treemapBinary],
    ["squarify", d3.treemapSquarify],
    ["sliceDice", d3.treemapSliceDice],
    ["slice", d3.treemapSlice],
    ["dice", d3.treemapDice]
]);

export function treemapFunc(
    svgNode: SVGSVGElement,
    data: Node, { // data is either tabular (array of objects) or hierarchy (nested objects)
        path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
        id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
        parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
        children, // if hierarchical data, given a d in data, returns its children
        value, // given a node d, returns a quantitative value (for area encoding; null for count)
        sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
        label, // given a leaf node d, returns the name to display on the rectangle
        group, // given a leaf node d, returns a categorical value (for color encoding)
        title, // given a leaf node d, returns its hover text
        link, // given a leaf node d, its link (if any)
        linkTarget = "_blank", // the target attribute for links (if any)
        mode = "binary", // treemap strategy
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        margin = 0, // shorthand for margins
        marginTop = margin, // top margin, in pixels
        marginRight = margin, // right margin, in pixels
        marginBottom = margin, // bottom margin, in pixels
        marginLeft = margin, // left margin, in pixels
        padding = 1, // shorthand for inner and outer padding
        paddingInner = padding, // to separate a node from its adjacent siblings
        paddingOuter = padding, // shorthand for top, right, bottom, and left padding
        paddingTop = paddingOuter, // to separate a node’s top edge from its children
        paddingRight = paddingOuter, // to separate a node’s right edge from its children
        paddingBottom = paddingOuter, // to separate a node’s bottom edge from its children
        paddingLeft = paddingOuter, // to separate a node’s left edge from its children
        round = true, // whether to round to exact pixels
        colors = d3.schemeTableau10, // array of colors
        zDomain, // array of values for the color scale
        fill = "#ccc", // fill for node rects (if no group color encoding)
        fillOpacity = group == null ? null : 0.6, // fill opacity for node rects
        stroke, // stroke for node rects
        strokeWidth, // stroke width for node rects
        strokeOpacity, // stroke opacity for node rects
        strokeLinejoin, // stroke line join for node rects
    }: { mode?: Mode, [id: string]: any } = {}) {

    const svg = d3.select(svgNode);
    const tile = ModeMap.get(mode);

    // If id and parentId options are specified, or the path option, use d3.stratify
    // to convert tabular data to a hierarchy; otherwise we assume that the data is
    // specified as an object {children} with nested objects (a.k.a. the “flare.json”
    // format), and use d3.hierarchy.
    // @ts-ignore

    const root: d3.HierarchyNode<Node> = d3.hierarchy(data, children);
    if (path != null) {
        // root = d3.stratify().path(path)(data);
    } else if (id != null || parentId != null) {
        // root = d3.stratify().id(id).parentId(parentId)(data);
    } else {
        //root = d3.hierarchy(data, children);
    }

    // Compute the values of internal nodes by aggregating from the leaves.
    value == null ? root.count() : root.sum(d => Math.max(0, value(d)));

    // Prior to sorting, if a group channel is specified, construct an ordinal color scale.
    const leaves = root.leaves() as HierarchyNodeEx<Node>[];
    const G = group == null ? null : leaves.map(d => {
        const retVal = group(d.data, d);
        d.group = retVal;
        return retVal;
    });
    if (zDomain === undefined) zDomain = G;
    zDomain = new d3.InternSet(zDomain);
    const color = group == null ? null : d3.scaleOrdinal(zDomain, colors);

    // Compute labels and titles.
    const L = label == null ? null : leaves.map(d => label(d.data, d));
    const T = title === undefined ? L : title == null ? null : leaves.map(d => title(d.data, d));

    // Sort the leaves (typically by descending value for a pleasing layout).
    if (sort != null) root.sort(sort);

    // Compute the treemap layout.
    d3.treemap()
        .tile(tile)
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .paddingInner(paddingInner)
        .paddingTop(paddingTop)
        .paddingRight(paddingRight)
        .paddingBottom(paddingBottom)
        .paddingLeft(paddingLeft)
        .round(round)(root);

    const node = svg.selectAll("a")
        .data(leaves)
        .join("a", undefined,)
        .attr("xlink:href", link == null ? null : (d, i) => link(d.data, d))
        .attr("target", link == null ? null : linkTarget)
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        ;

    node.selectAll("rect").data(d => d).join("rect")
        .attr("fill", color ? d => color(d.group) : fill)
        .attr("fill-opacity", fillOpacity)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    if (T) {
        node.append("title").text((d, i) => T[i]);
    }

    if (L) {
        // A unique identifier for clip paths (to avoid conflicts).
        const uid = `O-${Math.random().toString(16).slice(2)}`;

        node.append("clipPath")
            .attr("id", (d, i) => `${uid}-clip-${i}`)
            .append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        node.append("text")
            .attr("clip-path", (d, i) => `url(${new URL(`#${uid}-clip-${i}`, location as any)})`)
            .selectAll("tspan")
            .data((d, i) => `${L[i]}`.split(/\n/g))
            .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, D) => `${((i === D.length - 1) ? 1 : 0) * 0.3 + 1.1 + i * 0.9}em`)
            .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
            .text(d => d);
    }

    return Object.assign(svg.node(), { scales: { color } });
}