import { parse, Dependency, FirstLevelDependency } from '@yarnpkg/lockfile';
import path = require('path');
import * as fs from 'fs';
import { DependHash, Package, getDependHash } from '../type';
const { nameVersionStringify } = require('../utils');

function getLockObj() {
	// 读取 yarn.lock 文件的内容
	const lockfileContent = fs.readFileSync(
		path.join(process.cwd(), '/yarn.lock'),
		'utf8'
	);
	const LockObj = parse(lockfileContent).object;
	return LockObj;
}

const getYarnDependHash: getDependHash = (d: number) => {
	const LockObj = getLockObj();

	//将对象中的值从依赖包的版本条件转变成依赖包的信息
	function getInfoByDepend(dependencies: Record<string, string>) {
		const nameToInfo: Record<string, FirstLevelDependency> = {};
		Object.entries(dependencies || {}).forEach(
			([packName, versionCondition]) => {
				nameToInfo[packName] = LockObj[`${packName}@${versionCondition}`];
			}
		);
		return nameToInfo;
	}
	function dfs(
		packName: string,
		version: string,
		dependencies: Record<string, string>,
		hash: DependHash,
		depth: number
	) {
		if (depth >= d) return;
		const nameToInfo = getInfoByDepend(dependencies);
		const nameVersion = nameVersionStringify(packName, version);
		if (hash[nameVersion]) return;
		const depend: Record<string, string> = {};
		hash[nameVersion] = depend;
		Object.entries(nameToInfo || {}).forEach(([packName, info]) => {
			const { version, dependencies } = info;
			depend[packName] = version;
			if (dependencies) dfs(packName, version, dependencies, hash, depth + 1);
		});
	}
	const { name, version, dependencies, devDependencies } = require(path.join(
		process.cwd(),
		'package.json'
	)) as Package;
	const hash: DependHash = {};
	dfs(name, version, dependencies, hash, 0);
	const devHash: DependHash = {};
	dfs(name, version, devDependencies, devHash, 0);
	return [hash, devHash];
};

module.exports = getYarnDependHash;
