"use strict";
module.exports = function (packageName, version, packageManagementTools, dependencies, devDependencies) {
    return function (depth, jsonFile) {
        console.log(packageManagementTools);
    };
};
