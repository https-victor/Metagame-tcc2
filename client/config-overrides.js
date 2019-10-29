const { fixBabelImports, addLessLoader } = require('customize-cra');
const path = require('path');

module.exports = {
  webpack(config, env) {
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    })(config);
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#ef925e',
        '@layout-header-background': '#57c2a7',
        '@layout-trigger-background ': '#009897',
        '@menu-dark-submenu-bg': '#21ada8',
      },
    })(config);
    return config;
  },
};
