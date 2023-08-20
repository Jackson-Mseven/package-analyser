import * as fs from 'fs/promises';
import path = require('path');
import * as Panalyze from './type';
import { Package, DenpendType } from '../type';
import {
	checkVersion,
	getJsonFileObjPath,
	isNumberStr,
	nameVersionStringify,
} from '../utils';
import field from '../field';
const targetPath = 'E:/div/test_package/test_case';
const ignoreFolder = ['.bin', 'lib'];

/**将文件映射成对象，并且只读取package.json文件 */
const getVirtualFolder = async (folderPath: string) => {
	async function dfs(folderPath: string) {
		const virtualFolder: Panalyze.VirtualFolder = {
			file: {},
			folder: {},
			info: {},
		};
		const files = await fs.readdir(folderPath);
		for (const filename of files) {
			if (ignoreFolder.includes(filename)) continue;
			const fileDir = path.join(folderPath, filename);
			const stat = await fs.stat(fileDir);

			if (stat.isFile() && filename == field.packageJson) {
				try {
					const pack = require(fileDir);
					if (!pack) continue;
					virtualFolder.file[filename] = pack;
				} catch (e) {
					//这里是读取的包有问题时不做处理
					// console.log(fileDir);
				}
			}

			if (stat.isDirectory()) {
				const childVirtualFolder = await dfs(fileDir);
				childVirtualFolder.parent = virtualFolder;
				childVirtualFolder.info.folderName = filename;
				virtualFolder.folder[filename] = childVirtualFolder;
			}
		}
		return virtualFolder;
	}
	return await dfs(folderPath);
};

/**通过要经过的文件夹，跳转至虚拟文件夹中 */
const findTargetByDirs = (VF: Panalyze.VirtualFolder, dirs: string[]) => {
	// @ts-ignore
	for (const dir of dirs) VF = VF?.folder?.[dir];
	return VF;
};

/**在node_modelus中查找是否有符合条件的包 */
const findDependFromNode_modules = (
	name: string,
	versionCondition: string,
	node_modulesVF: Panalyze.VirtualFolder
) => {
	const dirs = name.split('/');
	const Vfolder = findTargetByDirs(node_modulesVF, dirs);
	const pack = Vfolder?.file[field.packageJson] as Package;
	if (pack && pack.version && checkVersion(versionCondition, pack.version)) {
		return [pack, Vfolder] as [Package, Panalyze.VirtualFolder];
	}
	return null;
};

/*
    逐级向上查找自己的符合要求的包，直到找到符合条件的就终止向上查找
*/
export const findDepend = (
	name: string,
	versionCondition: string,
	virtualFolder?: Panalyze.VirtualFolder
) => {
	while (virtualFolder) {
		const node_modulesVF = virtualFolder.folder[field.node_modules];
		if (!node_modulesVF) {
			virtualFolder = virtualFolder.parent;
			continue;
		}
		const dependPack = findDependFromNode_modules(
			name,
			versionCondition,
			node_modulesVF
		);
		if (dependPack) return dependPack;
		virtualFolder = virtualFolder.parent;
	}
	return null;
};

const findDepend_ChildDepend = (
	virtualFolder: Panalyze.VirtualFolder,
	depth: number,
	dependName: DenpendType
) => {
	const hash: Record<string, Record<string, string>> = {};
	function dfs(
		virtualFolder: Panalyze.VirtualFolder,
		/**递归深度 */ d: number,
		importName: string | null,
		dependName: DenpendType = field.dependencies
	) {
		const pack = virtualFolder.file[field.packageJson] as Package;
		const { name, version } = pack || {};
		const nameVersion = nameVersionStringify(importName || name, version);

		if (pack && name && version && !hash[nameVersion]) {
			hash[nameVersion] = {};
			Object.entries(pack[dependName] || {}).forEach(
				([name, versionCondition]) => {
					const depndInfo = findDepend(name, versionCondition, virtualFolder);
					if (!depndInfo) return null;
					const [childPack, childVFolder] = depndInfo;
					hash[nameVersion][name] = childPack.version;
					if (d < depth) dfs(childVFolder, d + 1, name);
				}
			);
		}
	}
	dfs(virtualFolder, 1, null, dependName);
	return hash;
};

export default async function getNpm_YarnDependHash(
	depth: number,
	dependName: DenpendType = field.dependencies
) {
	const VF = await getVirtualFolder(process.cwd());
	const hash = findDepend_ChildDepend(VF, depth, dependName);
	return hash;
}
