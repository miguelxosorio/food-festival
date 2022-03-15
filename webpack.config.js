const path = require('path'); // path dep
const webpack = require('webpack');

// main configuration object
// We'll write options within this object that tell webpack what to do
module.exports = { 
    // basic configuration - provide webpack with 3 properties(entry, output, mode)
    // the entry point is the root of the bundle and the beginning of the dependency graph, so provide relative path
    entry: './assets/js/script.js',
    // webpack will take the entry point, bundle that code, and output that bundled code to a folder we specify - common practice is to put it in folder dist
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    // tell webpack which plugin we want to use
    plugins: [
        new webpack.ProvidePlugin({         // use the providePlugin plugin to define the $ and jQuery variables to use the installed npm package
            $: 'jquery',                    // tell webpack to make exceptions for these variables by using webpack.ProvidePlugin
            jQuery: 'jquery'
        }),
    ],
    // provide the mode - by default, webpack wants to run in prodution mode
    mode: 'development'
};