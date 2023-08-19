import field from './analysisDepend/field';
import {
  dependHash_To_nameVersionsObj,
  nameVersionParse,
} from './analysisDepend/utils';
import getDependHash from './analysisDepend/getDependHash';
import * as fs from 'fs/promises';
import findHoopAndShow from './findHoopAndShow';
const calculateDependentSize: Function = require('./calculateDependentSize')
const fileS = require('fs')

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
module.exports = function (
  packageName: string,
  version: string,
  packageManagementTools: string,
  dependencies: object,
  devDependencies: object
): Function {
  // 命令行的执行逻辑代码
  /**
   * @param {string} depth：递归的深度
   * @param {string} jsonFile：导出的 JSON 文件路径
   */
  return async function (depth: string, jsonFile: string) {
    /**
     * 获取依赖信息
     * @returns { object } data：依赖信息
     */
    async function getData() {
      const dependHash = await getDependHash('Infinity', packageManagementTools);
      const devPendHash = await getDependHash(
        'Infinity',
        packageManagementTools,
        field.devDependencies
      );
      const dependToVersionsObj = dependHash_To_nameVersionsObj(dependHash);
      const devDependToVersionsObj = dependHash_To_nameVersionsObj(devPendHash);
      const dependencyHoop = findHoopAndShow(dependHash);
      const devDependencyHoop = findHoopAndShow(devPendHash);
      let dependentSizes  // 依赖大小
      await calculateDependentSize(packageManagementTools).then((val: Map<string, string>) => {
        dependentSizes = (Object.fromEntries(val))
      })

      return {
        dependHash,
        devPendHash,
        dependToVersionsObj,
        devDependToVersionsObj,
        dependencyHoop,
        devDependencyHoop,
        dependentSizes
      };
    }

    /**
     * 写入 time.txt、dependencyInformation.json 文件
     * @param { string } time：修改时间
     * @param { object } data：依赖信息
     */
    const writeFile = (time: string, data: object) => {
      fileS.writeFile('./time.txt', time, (err: Error) => { // 初始化 time.txt
        if (err) throw err // 写入 time.txt 失败
      })
      fileS.writeFile('./dependencyInformation.json', JSON.stringify(data, null, 2), (err: Error) => {
        if (err) throw err // 写入 dependencyInformation.json 失败
      })
    }

    const p: Promise<string | object> = new Promise((resolve: Function, reject: Function) => {
      fileS.stat('./package.json', (err: Error, state: { mtime: number }) => { // 读取 package.json 文件的状态
        if (err) reject(err)
        const time = state.mtime.toString();
        fileS.readFile('./time.txt', async (err: Error, data: string) => { // 读取 time.txt
          if (!err && data.toString() === time) { // package.json 没有改变
            resolve(depth || 'Infinity')
          } else { // 初始化 或 package.json 改变了
            await getData().then(val => {
              writeFile(time, val);
              resolve(val);
            })
          }
        })
      })
    })

    p.then((val: object | string) => {
      if (!jsonFile) {
        console.log(val);
        const server: Function = require('./server');
        server(val);
      } else {
        fs.writeFile(jsonFile, JSON.stringify(val as object, null, 2));
      }
    }).catch((err: Error) => {
      throw err
    })
  };
};
