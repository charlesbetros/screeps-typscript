const path = require('path');
const ScreepsWebpackPlugin = require("./src/screeps-webpack-plugin/index");

module.exports = env => {
    let screepsConfig;
    let dryRun = false;
    const destination = env.DEST;
    if (!destination) {
        console.log("No destination specified - code will be compiled but not uploaded");
        dryRun = true;
    } else if ((screepsConfig = require("./screeps.json")[destination]) == null) {
        throw new Error("Invalid upload destination");
    }

    return {
        mode: "development",
        target: "node",
        entry: './src/main.ts',
        //        devtool: "inline-source-map",
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: "commonjs"
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                //                { test: /\.js$/, use: ["source-map-loader"], enforce: "pre" },
                { test: /\.tsx?$/, loader: 'ts-loader' },
            ]
        },
        plugins: [
            new ScreepsWebpackPlugin({ config: screepsConfig, dryRun: dryRun })
        ]
    };
};