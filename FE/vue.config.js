// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');

const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
  },
  configureWebpack: {
    resolve: {
      fallback: {
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        net: false,
        tls: false,
        assert: require.resolve('assert/'),
        querystring: require.resolve('querystring-es3'),
      },
    },
    plugins: [
      // ลบ DefinePlugin ที่ใช้กับ process.env
      new ESLintPlugin({
        extensions: ['js', 'vue'],
        overrideConfig: {
          globals: {
            OmiseCard: 'readonly',
          },
        },
        overrideConfigFile: false
      }),
    ],
  },
};
