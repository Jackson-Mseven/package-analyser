import field from './analysisDepend/npm_yarn/field';
import {
	dependHash_To_nameVersionsObj,
	nameVersionParse,
} from './analysisDepend/utils';
import getDependHash from './analysisDepend/npm_yarn';
import * as fs from 'fs/promises';
/**
 * 定义命令执行的回调函数
 */

/**
 * @params {string} packageName：包名
 * @params {string} version：版本号
 * @params {object} dependencies：生成环境下的依赖
 * @params {object} devDependencies：开发环境下的依赖
 */
module.exports = function (
	packageName: string,
	version: string,
	dependencies: object,
	devDependencies: object
): Function {
	// 命令行的执行逻辑代码
	/**
	 * @params {string} depth：递归的深度
	 * @params {string} jsonFile：导出的 JSON 文件路径
	 */
	return async function (depth: string, jsonFile: string) {
		depth = depth || '1';
		const dependHash = await getDependHash(depth);
		const devPendHash = await getDependHash(depth, field.devDependencies);

		const dependToVersionsObj = dependHash_To_nameVersionsObj(dependHash);
		const devDependToVersionsObj = dependHash_To_nameVersionsObj(devPendHash);

		if (jsonFile) {
			const dep = {
				dependHash,
				devPendHash,
				dependToVersionsObj,
				devDependToVersionsObj,
			};
			fs.writeFile(jsonFile, JSON.stringify(dep, null, 2));
		}
	};
};
