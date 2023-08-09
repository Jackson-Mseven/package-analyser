/**
 * 定义命令执行的回调函数
 */

/**
 * @param {string} packageName：包名
 * @param {string} version：版本号
 * @param {string} packageManagementTools：包管理工具
 * @param {object} dependencies：生成环境下的依赖
 * @param {object} devDependencies：开发环境下的依赖
 */
module.exports = function (packageName: string, version: string, packageManagementTools: string, dependencies: object, devDependencies: object): Function { // 命令行的执行逻辑代码
  /**
   * @param {string} depth：递归的深度
   * @param {string} jsonFile：导出的 JSON 文件路径
   */
  return function (depth: string, jsonFile: string) {
    if (!jsonFile) {
      const server: Function = require('./server')
      server()
    } else {
      console.log('输出JSON');

    }
    console.log(packageManagementTools)
  }
}