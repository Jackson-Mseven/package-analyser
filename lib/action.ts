import field from './analysisDepend/field';
import {
	dependHash_To_nameVersionsObj,
	nameVersionParse,
} from './analysisDepend/utils';
import getDependHash from './analysisDepend/getDependHash';
import * as fs from 'fs/promises';
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
		depth = depth || '1';
		const dependHash = await getDependHash(depth, packageManagementTools);
		const devPendHash = await getDependHash(
			depth,
			packageManagementTools,
			field.devDependencies
		);
		const dependToVersionsObj = dependHash_To_nameVersionsObj(dependHash);
		const devDependToVersionsObj = dependHash_To_nameVersionsObj(devPendHash);
		const data = {
			dependHash,
			devPendHash,
			dependToVersionsObj,
			devDependToVersionsObj,
		};
		if (!jsonFile) {
			const server: Function = require('./server');
			server(data);
		} else {
			fs.writeFile(jsonFile, JSON.stringify(data, null, 2));
		}
	};
};
