const path = require('path');

module.exports = {
  webpack: {
    alias: {
      Pages: path.resolve(__dirname, 'src/Pages'),
      components: path.resolve(__dirname, 'src/components'),
      Elements: path.resolve(__dirname, 'src/components/Elements'),
      tests: path.resolve(__dirname, 'src/tests'),
      state: path.resolve(__dirname, 'src/state'),
    },
  },
};
