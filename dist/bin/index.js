#!/usr/bin/env node
"use strict";
var program = require('commander');
var myCommander = require('../lib/commander');
var version = require(process.cwd().replace(/\\/g, '/') + "/package.json").version;
program
    .version(version);
myCommander(program, version);
program.parse(process.argv);
