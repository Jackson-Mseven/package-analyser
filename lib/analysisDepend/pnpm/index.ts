import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as type from './type';
import path = require('path');
import {
	getJsonFileObjPath,
	handleHasCjsVersionObj,
	nameVersionStringify,
} from '../utils';
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

async function getPnpmDependHash() {
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
	hash[nameVersionStringify(entryPack.name, entryPack.version)] =
		handleHasCjsVersionObj(yamlObj?.dependencies || {});
	return hash;
}

export default getPnpmDependHash;
