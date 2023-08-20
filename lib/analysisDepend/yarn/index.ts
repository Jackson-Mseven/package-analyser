import { parse, Dependency, FirstLevelDependency } from '@yarnpkg/lockfile';
import path = require('path');
import * as fs from 'fs';
import { DenpendType, DependHash, Package } from '../type';
import { nameVersionStringify } from '../utils';

function getLockObj() {
	// 读取 yarn.lock 文件的内容
	const lockfileContent = fs.readFileSync(
		path.join(process.cwd(), '/yarn.lock'),
		'utf8'
	);
	const LockObj = parse(lockfileContent).object;
	return LockObj;
}
function getYarnDependHash(d: number) {
	const LockObj = getLockObj();
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
		hash: DependHash
	) {
		const nameToInfo = getInfoByDepend(dependencies);
		const nameVersion = nameVersionStringify(packName, version);
		if (hash[nameVersion]) return;
		const depend: Record<string, string> = {};
		hash[nameVersion] = depend;
		Object.entries(nameToInfo || {}).forEach(([packName, info]) => {
			const { version, dependencies } = info;
			depend[packName] = version;
			if (dependencies) dfs(packName, version, dependencies, hash);
		});
	}
	const { name, version, dependencies, devDependencies } = require(path.join(
		process.cwd(),
		'package.json'
	)) as Package;
	const hash: DependHash = {};
	dfs(name, version, dependencies, hash);
	const devHash: DependHash = {};
	dfs(name, version, devDependencies, devHash);
	return [hash, devHash] as [DependHash, DependHash];
}

export default getYarnDependHash;
