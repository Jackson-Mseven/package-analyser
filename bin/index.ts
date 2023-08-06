#!/usr/bin/env node
// 指定用 node 环境运行这个 js 脚本

const program: programType = require('commander')
const myCommander: Function = require('../lib/commander')
const version: string = require(process.cwd().replace(/\\/g, '/') + "/package.json").version

// programType：program的类型
type programType = {
  version: Function,
  parse: Function,
  command: Function,
  description: Function,
  action: Function
}

// 增加命令支持的参数
program
  .version(version) // 版本号

myCommander(program, version)

// 表示使用 Commander 来处理命令行参数
/**
 * process.argv：当前进程的 运行环境 和 命令的参数
 * 第一个值为：当前cli执行的环境文件（'D:\\NodeJS\\node.exe'）
 * 第二个值为：当前cli执行的文件的位置（'D:\\NodeJS\\node_global\\node_modules\\package_analyze\\bin\\index.js'）
 * 后续值为参数
 */
program.parse(process.argv);