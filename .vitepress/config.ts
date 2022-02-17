import { ApiClass, ApiItem, ApiModel, ApiProperty } from "@microsoft/api-extractor-model";
import { IndentedWriter, writeApiItem } from "./mdWriter";
import path from "path";

function getGuideSidebar() {
    return [
        {
            text: "Introduction",
            children: [
                { text: "Getting Started", link: "/README" }
            ]
        },
        {
            text: "Advanced",
            children: [{ text: "API Reference", link: "/docs/api/web-components" }]
        }
    ];
}

function getComponentsSidebar() {
    return [
        {
            text: "Editors",
            children: [
                { text: "CodeMirror", link: "/packages/editor/src/codemirror" },
            ]
        }, {
            text: "Layouts",
            children: [
                { text: "Dock Panel", link: "/packages/layout/src/lumino/dockPanel" },
                { text: "Drag and Zoom", link: "/packages/layout/src/zoom" },
                { text: "Split Panel", link: "/packages/layout/src/lumino/splitPanel" },
                { text: "Tab Panel", link: "/packages/layout/src/lumino/tabPanel" },
            ]
        }, {
            text: "Visualizations",
            children: [
                { text: "Gauge", link: "/packages/gauge/src/gauge" },
                { text: "Half Pie", link: "/packages/pie/src/halfpie" },
                { text: "Observable JS", link: "/packages/observable/src/observable" },
                { text: "Pie", link: "/packages/pie/src/pie" },
                { text: "Quarter Pie", link: "/packages/pie/src/quarterpie" },
                { text: "Sankey", link: "/packages/sankey/src/sankey" },
                { text: "Treemap", link: "/packages/treemap/src/treemap" },
            ]
        }

    ];
}

module.exports = {
    lang: "en-US",
    title: "@hpcc-js/web-components",
    description: "HPCC Systems Custom Web Components",
    base: "/hpcc-js-wc/",

    head: [
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/hpcc-js-wc/resources/favicon.ico' }],
    ],

    themeConfig: {
        repo: "hpcc-systems/hpcc-js-wc",
        docsDir: "",
        docsBranch: "trunk",
        editLinks: true,
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",

        nav: [
            {
                text: "Guide",
                link: "/README",
                activeMatch: "^/README"
            },
            {
                text: "Components",
                link: "/packages/",
                activeMatch: "^/packages/"
            },
            {
                text: "Release Notes",
                link: "https://github.com/hpcc-systems/hpcc-js-wc/releases"
            }
        ],

        sidebar: {
            "/README": getGuideSidebar(),
            "/packages": getComponentsSidebar()
        }
    },

    vite: {
        cacheDir: "./.vitepress/cache",
        server: {
            fs: {
                strict: false
            }
        },
        resolve: {
            alias: {
            },
        },
        plugins: [
        ]
    },

    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => {
                    return tag.toLowerCase().indexOf("hpcc-") === 0;
                }
            }
        }
    },

    markdown: {
        config: (md) => {
            const structs: { [id: string]: ApiItem } = {};
            const props: { [id: string]: ApiItem } = {};

            let allMeta = {};
            try {
                allMeta = require(path.join(__dirname, "../temp/web-components.meta.json"));
            } catch (e) {
                //  File might not exit yet  ---
            }

            function writeAttributes(struct: ApiItem, writer: IndentedWriter, isAttribute: boolean = true): boolean {
                let retVal = false;
                const structClass = struct as ApiClass;
                // writer.writeLine(struct.displayName);
                const baseClass = structs[structClass.extendsType?.excerpt?.text?.trim()];
                if (baseClass) {
                    retVal = writeAttributes(baseClass, writer, isAttribute);
                }
                const classMeta = allMeta[struct.displayName] ?? { observed: {} };
                for (const prop of struct.members) {
                    const propMeta = classMeta.observed[prop.displayName];
                    if ((prop as ApiProperty).tsdocComment) {
                        if (propMeta === undefined || propMeta.isAttribute === isAttribute) {
                            if (writeApiItem(prop, { writer }, false)) {
                                retVal = true;
                            }
                        }
                    }
                }
                return retVal;
            }

            md.core.ruler.before("normalize", "types", function replace(state) {
                const apiModel = new ApiModel();
                let apiPackage;
                try {
                    apiPackage = apiModel.loadPackage("./temp/web-components.api.json");
                } catch (e) {
                    //  File might not exit yet  ---
                }

                apiPackage?.members.forEach(entyrPoint => {
                    for (const struct of entyrPoint.members) {
                        // if (struct.displayName.indexOf("HPCC") === 0 && struct.displayName.indexOf("Element") > 0) {
                        structs[struct.displayName] = struct;
                        for (const prop of struct.members) {
                            props[struct.displayName + "." + prop.displayName] = prop;
                        }
                        // }
                    }
                });

                for (const key in structs) {
                    const struct = structs[key];
                    const search = `## \`${key}\``;
                    if (state.src.indexOf(search) >= 0) {
                        let replacement = "";
                        const attrWriter = new IndentedWriter();
                        attrWriter.writeLine(`## Attributes`);
                        attrWriter.writeLine();
                        if (writeAttributes(struct, attrWriter, true)) {
                            replacement += attrWriter.toString();
                        }
                        const propWriter = new IndentedWriter();
                        propWriter.writeLine(`## Properties`);
                        propWriter.writeLine();
                        if (writeAttributes(struct, propWriter, false)) {
                            replacement += propWriter.toString();
                        }
                        state.src = state.src.split(search).join(replacement);
                    }
                }

                for (const key in props) {
                    const search = `### \`${key}\``;
                    if (state.src.indexOf(search) >= 0) {
                        const prop = props[key];
                        const writer = new IndentedWriter();
                        writeApiItem(prop, { writer }, false);
                        state.src = state.src.split(search).join(writer.toString());
                    }
                }
            });
        }
    }
};
