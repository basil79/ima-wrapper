const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { name, version } = require('./package.json');

module.exports = function(env, args) {

  let plugins = args.mode === 'production' ? [] : [new webpack.BannerPlugin({
    banner: `${name} v${version} ${args.mode}\nUpdated : ${(new Date()).toISOString().substring(0, 10)}`
  })];

  const module = {
    rules: [{
      test: /\.js$/,
      loader: 'string-replace-loader',
      options: {
        multiple: [{
          search: '!!#Version#!!',
          replace: `${version}`
        }]
      }
    }]
  };

  let outputs = [{
    entry : './src/index.js',
    output : {
      path: __dirname + (args.mode === 'production' ? '/dist' : '/public/js'),
      filename : 'video-ad-manager-ima-wrapper.js',
      library: 'adserve'
    },
    plugins: plugins,
    optimization: {
      minimize: args.mode === 'production',
      minimizer: [new TerserPlugin({
        parallel: 4,
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: true,
            ecma: 2015
          }
        },
      })],
    },
    module: module
  }];

  args.mode === 'production' && outputs.push({
    entry : './src/video-ad-manager-ima-wrapper.js',
    experiments: {
      outputModule: true,
    },
    output : {
      path: __dirname + '/dist',
      filename : 'video-ad-manager-ima-wrapper.es.js',
      library: {
        type: 'module'
      }
    },
    plugins: plugins,
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        parallel: 4,
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: true,
            ecma: 2015
          }
        },
      })],
    },
    module: module
  });

  return outputs;

}
