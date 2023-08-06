"use strict";
module.exports = function (packageName, version, dependencies, devDependencies) {
    return function (depth, jsonFile) {
        console.log(packageName);
        console.log(version);
        console.log(dependencies);
        console.log(devDependencies);
    };
};
