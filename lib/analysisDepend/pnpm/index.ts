import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as type from './type';
import path = require('path');
import {
	getJsonFileObjPath,
	handleHasCjsVersionObj,
	nameVersionStringify,
} from '../utils';
import field from '../field';
import { DenpendType } from '../type';
function getPnpmYamlObj() {
	const pnpm_yamlPath = path.join(
		process.cwd().replace(/\\/g, '/'),
		'/pnpm-lock.yaml'
	);
	try {
		const PnpmYamlObj = yaml.load(fs.readFileSync(pnpm_yamlPath, 'utf-8'));
		return PnpmYamlObj as type.pnpmLockYamlObj;
	} catch (e) {
		console.log(e);
	}
}

async function getPnpmAllDependHash(
	depnedType: DenpendType = field.dependencies
) {
	const yamlObj = getPnpmYamlObj();
	const hash: Record<string, Record<string, string>> = {};
	Object.entries(yamlObj?.packages || {}).forEach(([key, value]) => {
		const arr = key.split('/');
		arr.shift();
		const version = arr.pop()!;
		const name = arr.join('/');
		hash[nameVersionStringify(name, version)] = handleHasCjsVersionObj(
			value.dependencies || {}
		);
	});
	//获取用户包的名字
	const entryPack = (await getJsonFileObjPath('./package.json'))!;
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	hash[nameVersion] = handleHasCjsVersionObj(yamlObj?.[depnedType] || {});
	return hash;
}

async function getPnpmDependHash(
	/** 递归的最大深度*/ d: number,
	depnedType: DenpendType = field.dependencies
) {
	const AllDependHash = await getPnpmAllDependHash(depnedType);
	const entryPack = (await getJsonFileObjPath('./package.json'))!;
	const hash: Record<string, Record<string, string>> = {};
	function dfs(depth: number, nameVersion: string) {
		if (depth > d || hash[nameVersion]) return;
		hash[nameVersion] = AllDependHash[nameVersion];
		Object.entries(hash[nameVersion] || {}).forEach(([name, version]) => {
			dfs(depth + 1, nameVersionStringify(name, version));
		});
	}
	dfs(1, nameVersionStringify(entryPack.name, entryPack.version));
	return hash;
}

export default getPnpmDependHash;
