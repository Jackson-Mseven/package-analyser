import { DependHash, getDependHash } from '../type';
import * as type from './type';
import path = require('path');
const { checkVersion, nameVersionStringify } = require('../utils');

function getNpmLockObj() {
	const npmLockJsonPath = path.join(
		process.cwd().replace(/\\/g, '/'),
		'/package-lock.json'
	);
	try {
		const packageLockJsonObj =
			require(npmLockJsonPath) as type.packageLockJsonObj;
		return packageLockJsonObj;
	} catch (e) {
		console.log(e);
	}
}

/**
 * 解析包的路径来获取包的名字
 * @param path 例如: node_modules/@vitest/runner/node_modules/yocto-queue
 * @returns 例如: ["@vitest/runner","yocto-queue"]
 */
function analyzePackPath(path: string) {
	//删除前缀node_modules/
	path = path.slice(13);
	const arr = path.split('/node_modules/');
	return arr;
}

const getNpmDependHash: getDependHash = (d) => {
	/**
	 * 将package.json文件转变成对象树结构
	 * */
	function getDependEntryNode() {
		const packs = getNpmLockObj()?.packages;
		if (!packs) {
			throw new Error('package-lock.json文件解析失败');
		}
		const entryInfo = packs[''];
		const entryNode: type.DependNode = {
			children: {},
			info: entryInfo,
		};
		//删除入口依赖避免解析字符时出现非常规路径
		delete packs[''];

		//生成树
		Object.entries(packs).forEach(([packPath, info]) => {
			const arr = analyzePackPath(packPath);
			const targetPackName = arr.pop()!;
			//通过reduce进行深搜
			const targetParentNode = arr.reduce((DependNode, folderName) => {
				return DependNode.children[folderName];
			}, entryNode);
			const targetNode = {
				parent: targetParentNode,
				children: {},
				info,
			};
			targetParentNode.children[targetPackName] = targetNode;
		});
		return entryNode;
	}
	/**
	 *
	 * @param packName 要查找的包名
	 * @param versionCondition 要查找的包名版本条件
	 * @param node 准备搜索的节点
	 * @returns
	 */
	function findDpendNode(
		packName: string,
		versionCondition: string,
		node: type.DependNode
	): type.DependNode {
		if (
			node.children[packName] &&
			checkVersion(versionCondition, node.children[packName].info.version)
		)
			return node.children[packName];

		if (!node.parent) throw new Error('出现找不到包依赖的错误');
		return findDpendNode(packName, versionCondition, node.parent);
	}

	/**
	 * 生成节点与后代节点的hash依赖
	 * @param node 正在查找的节点
	 * @param nodePackName 正在查找节点的包名
	 * @param hash 存放hash依赖的地方
	 * @param depth
	 * @returns
	 */
	function getDepend_childDepend(
		node: type.DependNode,
		nodePackName: string,
		hash: DependHash,
		depth: number
	) {
		if (depth >= d) return;
		const nameVersion = nameVersionStringify(nodePackName, node.info.version);
		//如果已经出现过的版本则忽视
		if (hash[nameVersion]) return;
		const dependencies: Record<string, string> = {};
		hash[nameVersion] = dependencies;
		Object.entries(node.info.dependencies || {}).forEach(
			([packName, versionCondition]) => {
				const targetNode = findDpendNode(packName, versionCondition, node);
				dependencies[packName] = targetNode.info.version;
				getDepend_childDepend(targetNode, packName, hash, depth + 1);
			}
		);
	}
	const entryNode = getDependEntryNode();

	const hash: DependHash = {};
	const devHash: DependHash = {};
	getDepend_childDepend(entryNode, entryNode.info.name!, hash, 0);
	const devDependencies: Record<string, string> = {};
	devHash[nameVersionStringify(entryNode.info.name!, entryNode.info.version)] =
		devDependencies;
	Object.entries(entryNode.info.devDependencies || {}).forEach(
		([packName, versionCondition]) => {
			const targetNode = findDpendNode(packName, versionCondition, entryNode);
			devDependencies[packName] = targetNode.info.version;
			getDepend_childDepend(targetNode, packName, devHash, 1);
		}
	);
	return [hash, devHash];
};

module.exports = getNpmDependHash;
