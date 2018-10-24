'use strict';

var screepsApi = require('screeps-api');
var fs = require('fs');
var git = require('git-rev-sync');
var path = require('path');

class ScreepsWebpackPlugin {
    constructor(options) {
        this.options = options || {};
        this.lastCompileSucceeded = true;
    }

    apply(compiler) {
        compiler.hooks.failed.tap("ScreepsWebpackPlugin", (errors) => this.compilerFailed(errors));
        compiler.hooks.done.tap("ScreepsWebpackPlugin", (stats) => this.compilerDone(stats));
    }

    compilerFailed(errors) {
        this.lastCompileSucceeded = false;
    }

    compilerDone(stats) {
        if (this.lastCompileSucceeded && stats.compilation.errors.length == 0) {
            if (this.options.sourcemap) {
                // generateSourceMaps(bundle);
                // writeSourceMaps(this.options);
            }

            if (!this.options.dryRun) {
                this.uploadSource((this.options.configFile || this.options.config), this.options, stats.compilation.options.output.path);
            }
        }
    }

    validateConfig(cfg) {
        if (cfg.hostname && cfg.hostname === 'screeps.com') {
            return [
                typeof cfg.token === "string",
                cfg.protocol === "http" || cfg.protocol === "https",
                typeof cfg.hostname === "string",
                typeof cfg.port === "number",
                typeof cfg.path === "string",
                typeof cfg.branch === "string"
            ].reduce(function(a, b) { return a && b; });
        }
        return [
            (typeof cfg.email === 'string' && typeof cfg.password === 'string') || typeof cfg.token === 'string',
            cfg.protocol === "http" || cfg.protocol === "https",
            typeof cfg.hostname === "string",
            typeof cfg.port === "number",
            typeof cfg.path === "string",
            typeof cfg.branch === "string"
        ].reduce(function(a, b) { return a && b; });
    }

    loadConfigFile(configFile) {
        var data = fs.readFileSync(configFile, 'utf8');
        var cfg = JSON.parse(data);
        if (!this.validateConfig(cfg))
            throw new TypeError("Invalid config");
        if (cfg.email && cfg.password && !cfg.token && cfg.hostname === 'screeps.com') {
            console.log('Please change your email/password to a token');
        }
        return cfg;
    }

    uploadSource(config, options, outputPath) {
        if (!config) {
            console.log('ScreepsWepackPlugin() needs a config e.g. ScreepsWepackPlugin({configFile: \'./screeps.json\'}) or ScreepsWepackPlugin({config: { ... }})');
        } else {
            if (typeof config === "string") {
                config = this.loadConfigFile(config);
            }

            const code = this.getFileList(outputPath);
            const branch = this.getBranchName(config.branch);

            const api = new screepsApi.ScreepsAPI(config);
            if (!config.token) {
                api.auth().then(() => {
                    this.runUpload(api, branch, code);
                });
            } else {
                this.runUpload(api, branch, code);
            }
        }
    }

    getFileList(outputPath) {
        var code = {};
        var files = fs.readdirSync(outputPath).filter((f) => path.extname(f) === '.js');
        files.map((file) => {
            code[file.replace(/\.js$/i, '')] = fs.readFileSync(path.join(outputPath, file), 'utf8');
        });
        return code;
    }

    getBranchName(branch) {
        if (branch === 'auto') {
            return git.branch();
        } else {
            return branch;
        }
    }

    runUpload(api, branch, code) {
        api.raw.user.branches().then(function(data) {
            var branches = data.list.map(function(b) { return b.branch; });
            if (branches.includes(branch)) {
                api.code.set(branch, code);
            } else {
                api.raw.user.cloneBranch('', branch, code);
            }
        });
    }
}

module.exports = ScreepsWebpackPlugin