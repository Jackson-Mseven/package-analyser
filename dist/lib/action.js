"use strict";
module.exports = function (packageName, version, packageManagementTools, dependencies, devDependencies) {
    return function (depth, jsonFile) {
        if (!jsonFile) {
            var server = require('./server');
            server();
        }
        else {
            console.log('输出JSON');
        }
        console.log(packageManagementTools);
    };
};
