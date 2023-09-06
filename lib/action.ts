import { dependHash_To_nameVersionsObj } from './analysisDepend/utils'
import getDependHash from './analysisDepend/getDependHash'
import * as fs from 'fs/promises'
import findHoopAndShow from './findHoopAndShow'
const calculateDependentSize: Function = require('./calculateDependentSize')
const fileS = require('fs')

/**
 * 获取依赖数据
 * @param {String} depth - 传递给函数的依赖深度
 * @param {String} packageManagementTools - 包管理工具
 * @param {String} curDepth - 用户输入的依赖深度
 * @returns {Object} packageInfo - 依赖信息
 */
async function getData(depth: string = "Infinity", packageManagementTools: string, curDepth: string = 'Infinity') {
  // 依赖关系
  const [dependHash, devPendHash] = getDependHash(depth, packageManagementTools);

  // 依赖版本
  const dependToVersions = dependHash_To_nameVersionsObj(dependHash);
  const devDependToVersions = dependHash_To_nameVersionsObj(devPendHash);

  // 循环依赖
  const dependencyHoop = findHoopAndShow(dependHash);
  const devDependencyHoop = findHoopAndShow(devPendHash);

  // 依赖体积
  let dependentSizes;
  await calculateDependentSize(packageManagementTools).then((val: Map<string, string>) => {
    dependentSizes = Object.fromEntries(val);
  });

  return {
    dependHash,
    devPendHash,
    dependToVersions,
    devDependToVersions,
    dependencyHoop,
    devDependencyHoop,
    dependentSizes,
    depth: curDepth
  };
}

/**
 * 定义命令执行的回调函数
 * @param {String} packageManagementTools - 包管理工具
 * @return {Function} callback - 回调函数
 */
module.exports = function (packageManagementTools: string): Function {
  /**
   * 命令行的执行逻辑代码
   * @param {String} depth - 递归的深度
   * @param {String} jsonFile - 导出的 JSON 文件路径
   */
  return async function (depth: string, jsonFile: string) {
    const p: Promise<string | object> = new Promise((resolve: Function, reject: Function) => {
      if (!jsonFile) { // 网页显示
        fileS.stat('./package.json', (err: Error, state: { mtime: number }) => { // 读取 package.json 文件的状态
          if (err) reject(err);
          const time = state.mtime.toString();
          fileS.readFile('./time.txt', async (err: Error, data: string) => { // 读取 time.txt
            if (!err && data.toString() === time) { // 
              resolve({ depth: depth || 'Infinity' });
            } else { // 初始化 或 package.json 改变了
              await getData("Infinity", packageManagementTools, depth)
                .then((val) => {
                  fileS.writeFile('./time.txt', time, (err: Error) => {
                    if (err) throw err;
                  });
                  resolve(val);
                })
                .catch((err) => {
                  reject(err);
                });
            }
          });
        });
      } else { // 输出 JSON 文件
        getData(depth, packageManagementTools, depth).then((val) => {
          resolve(val);
        }).catch((err) => {
          reject(err);
        });
      }
    }
    );

    p.then((val: object | string) => {
      if (!jsonFile) { // 网页显示
        const server: Function = require('./server');
        server(val);
      } else { // 输出 JSON 文件
        fs.writeFile(jsonFile, JSON.stringify(val as object, null, 2));
      }
    }).catch((err) => {
      throw err;
    });
  };
};
