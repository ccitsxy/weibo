import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/sso': {
        target: 'https://login.sina.com.cn/sso',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sso/, ''),
        headers: {
          Host: 'login.sina.com.cn',
          Referer: 'https://weibo.com/'
        },
        cookieDomainRewrite: {
          "*": ""
        }
      },
      '/wbsso': {
        target: 'https://passport.weibo.com/wbsso',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wbsso/, ''),
        headers: {
          Host: 'login.sina.com.cn',
          Referer: 'https://weibo.com/'
        },
        cookieDomainRewrite: {
          "*": ""
        }
      }
    }
  }
})
