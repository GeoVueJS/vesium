import { fileURLToPath, URL } from 'node:url';
import { getPackageInfoSync } from 'local-pkg';
import { defineConfig } from 'vitepress';
import { badgeTransform } from './plugins/badge';
import { markdownDemoContainer } from './plugins/demoContainer';
import { markdownDtsContainer } from './plugins/dtsContainer';
import { generateSidebar } from './utils/generateSidebar';

const CESIUM_VERSION = (getPackageInfoSync('cesium'))!.version;

const importmap = `
<script> window.CESIUM_BASE_URL="https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/Build/Cesium/";</script>
<script type="importmap">${
  JSON.stringify(
    {
      imports: {
        cesium: `https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/+esm`,
      },
    },
  )
}</script>`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './',
  vite: { configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)) },
  title: 'Vesium',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
  rewrites: {
    '(.*).en.md': '(.*).md',
    '(.*).zh.md': 'zh/(.*).md',
  },
  markdown: {
    config(md) {
      badgeTransform(md);
      md.use(markdownDemoContainer);
      md.use(markdownDtsContainer);
    },
  },
  locales: {
    root: {
      link: '/',
      label: 'English',
      lang: 'en',
      titleTemplate: 'Vesium',
      title: 'A CesiumJS toolkit based on Vue composition',
      description: 'Aimed at making the use of CesiumJS in Vue simpler and smoother',
      themeConfig: {
        siteTitle: 'Vesium',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Start', link: '/start' },
        ],
        sidebar: generateSidebar({
          base: '/',
          filter: path => path.endsWith('.en.md'),
        }),
        lastUpdated: {
          text: 'Last Updated',
        },
        editLink: {
          text: 'Suggest changes to this page',
          pattern: (payload) => {
            return `https://github.com/vesiumjs/vesium/blob/main/packages/${payload.relativePath.replace(/\.md$/, '.en.md')}`;
          },
        },
      },
    },
    zh: {
      link: '/zh',
      label: '简体中文',
      lang: 'zh',
      titleTemplate: 'Vesium',
      title: 'Vue3 与 CesiumJS 的优雅集成方案',
      description: 'Vue3 与 CesiumJS 的优雅集成方案',
      themeConfig: {
        siteTitle: 'Vesium',
        nav: [
          { text: '首页', link: '/zh' },
          { text: '开始使用', link: '/zh/start' },
        ],
        sidebar: generateSidebar({
          base: '/zh',
          filter: path => path.endsWith('.zh.md'),
        }),
        sidebarMenuLabel: '列表',
        langMenuLabel: '更换语言',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳至内容',
        darkModeSwitchLabel: '切换主题',
        darkModeSwitchTitle: '切换暗黑模式',
        lightModeSwitchTitle: '切换明亮模式',
        outline: {
          label: '目录',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        notFound: {
          title: '找不到页面',
          linkLabel: '返回首页',
          quote: '无法找到这个页面，请检查URL是否正确',
          linkText: '返回首页',
        },
        editLink: {
          text: '对此页面提出建议或帮助改进',
          pattern: (payload) => {
            return `https://github.com/vesiumjs/vesium/blob/main/packages/${payload.relativePath.replace('zh', '').replace(/\.md$/, '.zh.md')}`;
          },
        },

      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vesiumjs/vesium' },
    ],
    logo: {
      src: '/favicon.svg',
    },
  },
  transformHtml(html) {
    return html.replace('<head>', `<head>${importmap}`);
  },
});
