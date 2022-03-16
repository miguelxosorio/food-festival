const path = require('path'); // path dep
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // webpack has access to this plugin

// main configuration object
// We'll write options within this object that tell webpack what to do
module.exports = { 
    // basic configuration - provide webpack with 3 properties(entry, output, mode)
    // the entry point is the root of the bundle and the beginning of the dependency graph, so provide relative path
    entry: { 
        app:'./assets/js/script.js',
        events: './assets/js/events.js',
        schedule: './assets/js/schedule.js',
        tickets: './assets/js/tickets.js' 
    },
    // webpack will take the entry point, bundle that code, and output that bundled code to a folder we specify - common practice is to put it in folder dist
    
    // build step will create a series of bundled files, one for each listing in the entry object
    // The name of each attribute in the entry object will be used in place of [name] in each bundle.js file that is created
    // script.js - app.bundle.js; events.js - events.bundle.js, etc.
    output: {
        filename: '[name].bundle.js',
        // The output bundle files will be written to the dist folder, and will eliminate any need for the main.bundle.js that we created previously
        path: __dirname + '/dist',
    },
    
    // add the file-loader to our webpack configuration
    module:{
        rules: [
            // process any image file with the file extension of .jpg
            {
                test: /\.jpg$/i,
                // add another property called use where the actual loader is implemented
                use: [
                    {
                        loader: 'file-loader', // npm package
                        options: {
                            // to prevent default behavior(file loader treats file as ES5 module) add a key-value pair esModule: false 
                            esModule: false,
                            // name function which returns the name of the file with the file extension
                            name(file) {
                                return "[path][name].[ext]"
                            },
                            // also a function that changes our assignment URL by replacing the ../ from our require() statement with /assets/
                            publicPath: function(url) {
                                return url.replace("../", "/assets/")
                            }
                        }
                    },
                    // image optimizer loader - npm package
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    // tell webpack which plugin we want to use
    plugins: [
        new webpack.ProvidePlugin({         // use the providePlugin plugin to define the $ and jQuery variables to use the installed npm package
            $: 'jquery',                    // tell webpack to make exceptions for these variables by using webpack.ProvidePlugin
            jQuery: 'jquery'
        }),
        // add to plugins property the bundle analyzer
        new BundleAnalyzerPlugin({
            analyzerMode: 'static', // the report outputs to an HTML file in the dist folder
        })
        // Notice that when we added the BundleAnalyzerPlugin, we configured the analyzerMode property with a static value. This will output an HTML file called report.html that will generate in the dist folder
    ],
    // provide the mode - by default, webpack wants to run in prodution mode
    mode: 'development'
};
// several ways to code split
// entry point splitting - separates code by entry pointes in your app. An entry point is defined by each page's requisite script files to load
// vendor splitting - separates vendor code (e.g., jQuery, Bootstrap) away from your app's code. A vendor bundle can also be shared between other bundles, further reducing overall bundle size by creating a common chunk
// dynamic splitting - separates code and allows dynamic importing of modules. This type of splitting is often best for single-page applications that use front end routing