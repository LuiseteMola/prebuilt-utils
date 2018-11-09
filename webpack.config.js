var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/server.ts',
    devtool: 'inline-source-map',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.js', '.ts']
    },
    context: __dirname,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    resolve: {
        extensions: ['.ts'],
        plugins: [new TsconfigPathsPlugin({
            configFile: "./tsconfig.json",
            logLevel: "info",
            extensions: [".ts"],
        })]
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
}