// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/sankey-diagram

import * as d3 from "d3";
import { ScaleOrdinal, ValueFn } from "d3";
import * as d3Sankey from "d3-sankey";

export interface Link {
    source: string;
    target: string;
    value: number;
}

interface MappedNode {
    id: string;
    index: number;
    x0: number;
    y0: number;
    x1: number; y1: number;
}

interface MappedLink {
    index: number;
    source: MappedNode;
    target: MappedNode;
    value: number;
    width: number;
}

const endcodeID = (str: string) => {
    return str?.replace(/[^a-zA-Z0-9]/g, "_");
};

function intern(value): string {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
}

export function sankeyFunc(
    { nodesG, linksG, textG },
    {
        nodes, // an iterable of node objects (typically [{id}, …]); implied by links if missing
        links // an iterable of link objects (typically [{source, target}, …])
    }: { nodes?: any[], links: Link[] },
    {
        format = ",", // a function or format specifier for values in titles
        align = "justify", // convenience shorthand for nodeAlign
        nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeLabel, // given d in (computed) nodes, text to label the associated rect
        nodeTitle = (d) => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
        nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
        nodeWidth = 15, // width of node rects
        nodePadding = 10, // vertical separation between adjacent nodes
        nodeLabelPadding = 6, // horizontal separation between node and label
        linkSource = ({ source }): string => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }): string => target, // given d in links, returns a node identifier string
        linkValue = ({ value }): number => value, // given d in links, returns the quantitative value
        linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
        linkTitle = (d) => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
        linkColor = "source-target", // source, target, source-target, or static color
        linkMixBlendMode = "multiply", // link blending mode
        colors = d3.schemeTableau10, // array of colors
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        marginTop = 5, // top margin, in pixels
        marginRight = 1, // right margin, in pixels
        marginBottom = 5, // bottom margin, in pixels
        marginLeft = 1 // left margin, in pixels
    }: {
        nodeGroups?: string[],
        nodeGroup?: (d) => string,
        nodeTitle?: (d) => string,
        linkValue?: (d) => number,
        [id: string]: any
    } = {}
) {
    // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
    if (typeof nodeAlign !== "function")
        nodeAlign =
            {
                left: d3Sankey.sankeyLeft,
                right: d3Sankey.sankeyRight,
                center: d3Sankey.sankeyCenter
            }[nodeAlign] ?? d3Sankey.sankeyJustify;

    // Compute values.
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), (id) => ({ id }));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    const mappedNodes: MappedNode[] = d3.map(nodes, (_, i) => ({ index: 0, id: N[i], x0: 0, y0: 0, x1: 0, y1: 0 }));
    const mappedLinks: MappedLink[] = d3.map(links, (_, i) => ({
        source: LS[i],
        target: LT[i],
        value: LV[i]
    } as any));

    // Ignore a group-based linkColor option if no groups are specified.
    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = G;

    // Construct the scales.
    const color: ScaleOrdinal<string, Range> | null = (nodeGroup && nodeGroups) ? d3.scaleOrdinal(nodeGroups, colors) : null;

    // Compute the Sankey layout.
    d3Sankey
        .sankey()
        .nodeId(({ index: i }) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([
            [marginLeft, marginTop],
            [width - marginRight, height - marginBottom]
        ])({ nodes: mappedNodes, links: mappedLinks });

    // Compute titles and labels using layout nodes, so as to access aggregate values.
    if (typeof format !== "function") format = d3.format(format);
    const Tl: string[] | null = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(mappedNodes, nodeLabel);
    const Tt: string[] = d3.map(mappedNodes, nodeTitle);
    const Lt: string[] | null = linkTitle == null ? null : d3.map(mappedLinks, linkTitle);

    // A unique identifier for clip paths (to avoid conflicts).
    const clipPathID = `O-${Math.random().toString(16).slice(2)}`;

    const node = d3
        .select(nodesG)
        .selectAll("rect")
        .data(mappedNodes)
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("width", (d) => d.x1 - d.x0);

    if (G && color) node.attr("fill", ({ index: i }) => color(G[i]).toString());
    if (Tt)
        node.selectAll("title")
            .data((d) => [d])
            .join("title")
            .text(({ index: i }) => Tt[i]);

    const link = d3.select(linksG).selectAll("g").data(mappedLinks).join("g").style("mix-blend-mode", linkMixBlendMode);
    const gradiantID = ({ source, target }: MappedLink): string => `${endcodeID(source.id)}-${endcodeID(target.id)}`;
    link.selectAll("linearGradient")
        .data((d): MappedLink[] => (linkColor === "source-target" ? [d] : []), d => gradiantID(d as MappedLink))
        .join("linearGradient")
        .attr("id", (d) => `${clipPathID}-link-${gradiantID(d)}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => d.source.x1)
        .attr("x2", (d) => d.target.x0)
        .call((gradient) =>
            gradient
                .selectAll("stop")
                .data((d) => [d.source, d.target])
                .join("stop")
                .attr("offset", (d, i) => (i === 0 ? "0%" : "100%"))
                .attr("stop-color", ({ index: i }) => color!(G![i]).toString())
        );

    link.selectAll("path")
        .data((d) => [d], (d) => gradiantID(d as MappedLink))
        .join("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? (d) => `url(#${clipPathID}-link-${gradiantID(d)})` : linkColor === "source" ? ({ source: { index: i } }) => color!(G![i]) : linkColor === "target" ? ({ target: { index: i } }) => color!(G![i]) : linkColor)
        .attr("stroke-width", ({ width }) => Math.max(1, width))
        .call(Lt ?
            (path) => path
                .selectAll("title")
                .data((d) => [d])
                .join("title")
                .text(({ index: i }) => Lt[i])
            : () => { }
        );

    if (Tl) {
        d3.select(textG)
            .selectAll("text")
            .data(mappedNodes)
            .join("text")
            .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding))
            .attr("y", (d) => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
            .text(({ index: i }) => Tl[i]);
    }
}
