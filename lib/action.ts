import field from './analysisDepend/field';
import {
  dependHash_To_nameVersionsObj,
  nameVersionParse,
} from './analysisDepend/utils';
import getDependHash from './analysisDepend/getDependHash';
import * as fs from 'fs/promises';
import findHoopAndShow from './findHoopAndShow';
const calculateDependentSize: Function = require('./calculateDependentSize');
const fileS = require('fs');

/**
 * 定义命令执行的回调函数
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
  /**
   * 命令行的执行逻辑代码
   * @param {string} depth：递归的深度
   * @param {string} jsonFile：导出的 JSON 文件路径
   */
  return async function (depth: string, jsonFile: string) {
    /**
     * 获取依赖信息
     * @returns { object } data：依赖信息
     */
    async function getData(depth: string = 'Infinity') {
      // 依赖关系
      const [dependHash, devPendHash] = getDependHash(depth, packageManagementTools);
      console.log("dependHash:---", dependHash);
      console.log('depth:---', depth);

      // 依赖版本
      const dependToVersions = dependHash_To_nameVersionsObj(dependHash);
      const devDependToVersions = dependHash_To_nameVersionsObj(devPendHash);

      // 循环依赖
      const dependencyHoop = findHoopAndShow(dependHash);
      const devDependencyHoop = findHoopAndShow(devPendHash);

      // 依赖体积
      let dependentSizes;
      await calculateDependentSize(packageManagementTools).then(
        (val: Map<string, string>) => {
          dependentSizes = Object.fromEntries(val);
        }
      );

      return {
        dependHash,
        devPendHash,
        dependToVersions,
        devDependToVersions,
        dependencyHoop,
        devDependencyHoop,
        dependentSizes,
        depth
      };
    }

    const p: Promise<string | object> = new Promise((resolve: Function, reject: Function) => {
      if (!jsonFile) { // 网页显示
        fileS.stat('./package.json', (err: Error, state: { mtime: number }) => { // 读取 package.json 文件的状态
          if (err) reject(err);
          const time = state.mtime.toString();
          fileS.readFile('./time.txt', async (err: Error, data: string) => { // 读取 time.txt
            if (!err && data.toString() === time) { // package.json 没有改变
              resolve({ depth: depth || 'Infinity' });
            } else {
              // 初始化 或 package.json 改变了
              await getData(depth)
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
        getData(depth).then((val) => {
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
