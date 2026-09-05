const path = require('path');

/**
 * CRA/webpack resolves @clerk/clerk-react to ESM (.mjs), which re-exports hooks
 * from @clerk/shared/react. That subpath often lands on CJS, and webpack then
 * drops the named re-exports. Point both packages at their CJS builds.
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@clerk/clerk-react': path.resolve(
          __dirname,
          'node_modules/@clerk/clerk-react/dist/index.js'
        ),
        '@clerk/shared/react': path.resolve(
          __dirname,
          'node_modules/@clerk/shared/dist/react/index.js'
        ),
      };
      return webpackConfig;
    },
  },
};
