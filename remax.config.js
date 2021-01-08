const sass = require('@remax/plugin-sass');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    one: true,
    plugins: [sass()],
    output: 'dist/' + process.env.REMAX_PLATFORM,
    configWebpack({ config }){
        config.plugin('copy').use(CopyPlugin, [[{ from: 'src/assets', to: 'assets' }]]);
    }
};
