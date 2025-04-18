const path = require('path');
const CWP = require('copy-webpack-plugin');

module.exports = {
    entry: '/Users/julianporter/Developer/Webstorm/TempSensor/js/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude : '/node_modules/',
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new CWP({
            patterns: [{
                from: './static',
                to: '.'
            }, {
                from: './less',
                to: '.',
                filter: (path => /\.css(\.map)?$/.test(path))
            }]
        })
    ],
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
};