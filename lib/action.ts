import getDependHash from './analysisDepend/virtualFloder';
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
		// console.log(packageName);
		// console.log(version);
		// console.log(dependencies);
		// console.log(devDependencies);
		const hash = await getDependHash(jsonFile, depth);
		console.log(hash);
	};
};
