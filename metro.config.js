const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Force correct MIME type for bundle and JS files
      if (req.url.includes('.bundle') || req.url.includes('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;