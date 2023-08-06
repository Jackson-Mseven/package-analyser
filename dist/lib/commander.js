"use strict";
var myAction = require('./action');
var packageName = require(process.cwd().replace(/\\/g, '/') + "/package.json").name;
var dependencies = require(process.cwd().replace(/\\/g, '/') + "/package.json").dependencies;
var devDependencies = require(process.cwd().replace(/\\/g, '/') + "/package.json").devDependencies;
module.exports = function (program, version) {
    program
        .command('analyze [depth] [jsonFile]')
        .description('analyze dependency packages')
        .action(myAction(packageName, version, dependencies, devDependencies));
};
