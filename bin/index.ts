#!/usr/bin/env node
// 指定用 node 环境运行这个 js 脚本
const fs = require('fs')
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

let packageManagementTools: string = 'npm';
/**
 * 根据版本锁定文件判断项目所使用的包管理工具
 * @param {string} path：版本锁定文件路径
 * @param {string} packageManagementTools：包管理工具
 */
async function readFile(path: string, packageManagementTools: string) {
  await fs.readFile(process.cwd().replace(/\\/g, '/') + path, (err: any, data: any) => {
    if (err) return
    packageManagementTools = packageManagementTools
  })
}
readFile("/package-lock.json", "npm")
readFile("/yarn.lock", "yarn")
readFile("/pnpm-lock.yaml", "pnpm")

myCommander(program, version, packageManagementTools)

// 表示使用 Commander 来处理命令行参数
/**
 * process.argv：当前进程的 运行环境 和 命令的参数
 * 第一个值为：当前cli执行的环境文件（'D:\\NodeJS\\node.exe'）
 * 第二个值为：当前cli执行的文件的位置（'D:\\NodeJS\\node_global\\node_modules\\package_analyze\\bin\\index.js'）
 * 后续值为参数
 */
program.parse(process.argv);