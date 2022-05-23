const intercept = require('intercept-stdout');

const path = require('path');

const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  publicRuntimeConfig: {},
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
};

/**
 * Hide warning of RecoilJS when hot reload
 */
intercept((text) => (text.includes('Duplicate atom key') ? '' : text));

module.exports = nextConfig;
