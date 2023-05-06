import { fileURLToPath, URL } from 'node:url';

import { type ConfigEnv, defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
// @ts-ignore
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const CUSTOMIZED_CONFIG = require('./config/index.ts');
  const NODE_ENV = loadEnv(mode, __dirname).VITE_NODE_ENV;
  const API_HOST = CUSTOMIZED_CONFIG.default[NODE_ENV].apiHost;
  console.log('NODE_ENV ==> ', NODE_ENV);
  console.log('API_HOST ==> ', API_HOST);
  return {
    build: {
      chunkSizeWarningLimit: 500,
      assetsDir: './src/assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'static/js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks: {
            // 'element-plus': ['element-plus'],
            'vue-router': ['vue-router']
            // vant: ['vant']
          }
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      // 打包后就会生成 gzip 文件了，但是服务端 nginx 还需要配置一下才能生效

      // server{
      //   #gzip
      //   #开启gzip功能
      //   gzip on;
      //   #开启gzip静态压缩功能
      //   gzip_static on;
      //   #gzip缓存大小
      //   gzip_buffers 4 16k;
      //   #gzip http版本
      //   gzip_http_version 1.1;
      //   #gzip 压缩级别 1-10
      //   gzip_comp_level 5;
      //   #gzip 压缩类型
      //   gzip_types text/plain...;
      //   gzip_vary on;}
      viteCompression({
        // gzip静态资源压缩配置
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),

      importToCDN({
        modules: [
          autoComplete('vue'), // vue2 use autoComplete('vue2')
          autoComplete('axios'),
          // autoComplete('@vueuse/shared'),
          // autoComplete('@vueuse/core')
          // {
          //   name: 'element-plus',
          //   var: 'ElementPlus',
          //   path: `https://cdn.staticfile.org/element-plus/2.2.28/index.full.min.js`,
          //   css: 'https://cdn.staticfile.org/element-plus/2.2.28/index.min.css'
          // }
          {
            name: 'pinia',
            var: 'Pinia',
            path: 'dist/pinia.iife.min.js'
          }
        ]
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 20
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      }),

      // put it the last one，放在最后
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      /* CSS 预处理器 */
      preprocessorOptions: {
        scss: {
          // additionalData: `@import '@/assets/styles/theme.css';` // 这里可以配置全局的scss
        }
      }
    },

    server: {
      port: 8899,
      proxy: {
        // 选项写法
        '/api': {
          target: 'http://127.0.0.1:4523/m1/2005353-0-default',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // 正则表达式写法
        '^/mock/.*': {
          target: API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mock/, '')
        }
      }
    }

    // proxy: {
    //   '/mock': {
    //     target: 'http://127.0.0.1:4523/m1/2005353-0-default', // 实际请求地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/mock/, '')
    //   }
    // }
  };
});
