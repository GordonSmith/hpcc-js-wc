module.exports = {
  lang: 'en-US',
  title: '@hpcc-js/web-components',
  description: 'HPCC Systems Custom Web Components',
  basexxx: '/hpcc-js-wc/',

  themeConfig: {
    repo: 'GordonSmith/hpcc-js-wc',
    docsDir: 'docs',
    docsBranch: 'trunk',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
      {
        text: 'Components',
        link: '/components/',
        activeMatch: '^/components/'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/GordonSmith/hpcc-js-wc/releases'
      }
    ],

    sidebar: {
      '/guide/': getGuideSidebar(),
      '/components/': getComponentsSidebar(),
    }
  },

  vueOptions: {
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
    }
  }
}

function getGuideSidebar() {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'Getting Started', link: '/guide/getting-started' },
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'API Reference', link: '/guide/api' },
      ]
    }
  ]
}

function getComponentsSidebar() {
  return [
    {
      text: 'Visualizations',
      children: [
        { text: 'Sankey', link: '/components/sankey' },
      ]
    },
    {
      text: 'Layouts',
      children: [
        { text: 'Zoom', link: '/components/zoom' },
      ]
    }
  ]
}
