module.exports = {
  lang: 'en-US',
  title: '@hpcc-js/web-components',
  description: 'HPCC Systems Custom Web Components',
  base: '/hpcc-js-wc/',

  themeConfig: {
    repo: 'GordonSmith/hpcc-js-wc',
    docsBranch: 'trunk',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      { text: 'Guide', link: '/docs/guide/getting-started', activeMatch: '^/docs/guide/' },
      {
        text: 'Components',
        link: '/docs/components/',
        activeMatch: '^/docs/components/'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/GordonSmith/hpcc-js-wc/releases'
      }
    ],

    sidebar: {
      '/docs/guide/': getGuideSidebar(),
      '/docs/components/': getComponentsSidebar(),
    }
  },

  vite: {
    plugins: []
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
        { text: 'Getting Started', link: '/docs/guide/getting-started' },
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'API Reference', link: '/docs/guide/api' },
      ]
    }
  ]
}

function getComponentsSidebar() {
  return [
    {
      text: 'Visualizations',
      children: [
        { text: 'Sankey', link: '/docs/components/sankey' },
      ]
    },
    {
      text: 'Layouts',
      children: [
        { text: 'Zoom', link: '/docs/components/zoom' },
      ]
    }
  ]
}
