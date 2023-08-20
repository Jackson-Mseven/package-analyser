import { DependHash } from '../type';
import { checkVersion, nameVersionStringify } from '../utils';
import * as type from './type';
import path = require('path');

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

function analyzePackPath(path: string) {
	//删除前缀node_modules/
	path = path.slice(13);
	const arr = path.split('/node_modules/');
	return arr;
}

function getNpmDependHash(d: number) {
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
		Object.entries(packs).forEach(([packPath, info]) => {
			const arr = analyzePackPath(packPath);
			const last = arr.pop()!;
			const targetNode = arr.reduce((DependNode, folderName) => {
				return DependNode.children[folderName];
			}, entryNode);
			targetNode.children[last] = {
				parent: targetNode,
				children: {},
				info,
			};
		});
		return entryNode;
	}
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

		if (!node.parent) throw new Error('预料之外的错误');
		return findDpendNode(packName, versionCondition, node.parent);
	}
	function getDepend_childDepend(
		node: type.DependNode,
		nodePackName: string,
		hash: DependHash
	) {
		const nameVersion = nameVersionStringify(nodePackName, node.info.version);
		//如果已经时出现过的版本则忽视
		if (hash[nameVersion]) return;
		const dependencies: Record<string, string> = {};
		hash[nameVersion] = dependencies;
		Object.entries(node.info.dependencies || {}).forEach(
			([packName, versionCondition]) => {
				const targetNode = findDpendNode(packName, versionCondition, node);
				dependencies[packName] = targetNode.info.version;
				getDepend_childDepend(targetNode, packName, hash);
			}
		);
	}
	const entryNode = getDependEntryNode();

	const hash: DependHash = {};
	const devHash: DependHash = {};
	getDepend_childDepend(entryNode, entryNode.info.name!, hash);

	Object.entries(entryNode.info.devDependencies || {}).forEach(
		([packName, versionCondition]) => {
			const targetNode = findDpendNode(packName, versionCondition, entryNode);
			getDepend_childDepend(targetNode, packName, devHash);
		}
	);
	return [hash, devHash] as [DependHash, DependHash];
}

export default getNpmDependHash;
