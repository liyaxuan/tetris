var webpack = require('webpack')

module.exports = {
    entry: ['./main.js'],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        sourceMapFilename: ''
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.scss/, loader: 'style!css!sass' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.vue$/, loader: 'vue' }
        ]
    }
}