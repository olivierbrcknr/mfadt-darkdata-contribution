// next.config.js

module.exports =
  {
    trailingSlash: true,
      exportPathMap: function() {
      return {
        '/': { page: '/' },
      };
    },
    webpack(config, options) {

      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: '[name].[ext]',
            esModule: false,
          },
        }
      })

      // config.module.rules.push({
      //   test: /\.json$/,
      //   use: [
      //     {
      //       loader: 'json-loader',
      //       options: {
      //         name: '[name].[ext]'
      //       }
      //     }
      //   ]
      // })

      config.module.rules.push({
        test: /\.(mp4|obj)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      })

      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })

      return config
    },
  };
