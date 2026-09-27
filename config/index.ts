import { defineConfig } from '@tarojs/cli'

import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/config
const baseConfig = {
  projectName: 'swapswap',
  date: '2024-1-1',
  // NutUI 设计稿基准为 375；自有样式全部用 rpx，不受此值影响
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // plugin-html：让小程序支持 NutUI 用到的 HTML 标签（div/i 等），生成对应模板
  plugins: ['@tarojs/plugin-sass', '@tarojs/plugin-html'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  mini: {
    // NutUI 图标样式与各页面 SCSS 的引入顺序会引起冲突警告，忽略之
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      }
    }
  }
}

export default defineConfig(async (merge) => {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
