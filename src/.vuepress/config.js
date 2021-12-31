const {
  description
} = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Throw New Error',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', {
      name: 'theme-color',
      content: '#3eaf7c'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    }],
    ['meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black'
    }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [{
        text: 'Blog',
        link: '/blog/javascript/',
      },
      // {
      //   text: 'Config',
      //   link: '/config/'
      // },
      {
        text: 'LeetCode',
        link: 'https://leetcode-cn.com/u/wswangjinxu/'
      },
      {
        text: 'Github',
        link: 'https://github.com/wsWangjinxu'
      }
    ],
    sidebar: {
      '/blog/': [{
          title: 'JavaScript', // 必要的 // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1, // 可选的, 默认值是 1
          children: [
            'javascript/',
            'javascript/this',
            'javascript/闭包必知必会',
            'javascript/内存管理与垃圾回收'
          ]
        },
        {
          title: 'Rust', // 必要的 // 可选的, 标题的跳转链接，应为绝对路径且必须存在
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1, // 可选的, 默认值是 1
          children: [
            'rust/'
          ]
        }
      ]
      // '/guide/': [
      //   {
      //     title: 'Guide',
      //     collapsable: false,
      //     children: [
      //       '',
      //       'using-vue',
      //     ]
      //   }
      // ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
