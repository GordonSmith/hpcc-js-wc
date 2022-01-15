import { ApiClass, ApiItem, ApiModel, ApiProperty } from "@microsoft/api-extractor-model";
import { IndentedWriter, writeApiItem } from "./mdWriter";

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
            text: "Visualizations",
            children: [
                { text: "CodeMirror", link: "/src/codemirror/codemirror" },
                { text: "Gauge", link: "/src/gauge/gauge" },
                { text: "Observable JS", link: "/src/observable/observable" },
                { text: "Pie", link: "/src/pie/pie" },
                { text: "Sankey", link: "/src/sankey/sankey" },
                { text: "Treemap", link: "/src/treemap/treemap" },
            ]
        },
        {
            text: "Layouts",
            children: [
                { text: "Dock Panel", link: "/src/layouts/lumino/dockPanel" },
                { text: "Split Panel", link: "/src/layouts/lumino/splitPanel" },
                { text: "Tab Panel", link: "/src/layouts/lumino/tabPanel" },
                { text: "Zoom", link: "/src/layouts/zoom" }
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
        repo: "GordonSmith/hpcc-js-wc",
        docsDir: "docs",
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
                link: "/src/",
                activeMatch: "^/src/"
            },
            {
                text: "Release Notes",
                link: "https://github.com/GordonSmith/hpcc-js-wc/releases"
            }
        ],

        sidebar: {
            "/README": getGuideSidebar(),
            "/src": getComponentsSidebar()
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
                crypto: "",
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

            function writeClass(struct: ApiItem, writer: IndentedWriter) {
                const structClass = struct as ApiClass;
                // writer.writeLine(struct.displayName);
                const baseClass = structs[structClass.extendsType?.excerpt?.text?.trim()];
                if (baseClass) {
                    writeClass(baseClass, writer);
                }
                for (const prop of struct.members) {
                    if ((prop as ApiProperty).tsdocComment) {
                        writeApiItem(prop, { writer }, false);
                    }
                }
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
                        const writer = new IndentedWriter();
                        writer.writeLine(`## Attributes`);
                        writer.writeLine();
                        writeClass(struct, writer);
                        state.src = state.src.split(search).join(writer.toString());
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
