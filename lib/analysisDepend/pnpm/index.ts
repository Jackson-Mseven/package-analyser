import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as type from './type';
import path = require('path');
import field from '../field';
import { DenpendType, DependHash, getDependHash } from '../type';
const { nameVersionStringify } = require('../utils');
function getPnpmYamlObj() {
	const pnpm_yamlPath = path.join(
		process.cwd().replace(/\\/g, '/'),
		'/pnpm-lock.yaml'
	);
	try {
		const PnpmYamlObj = yaml.load(fs.readFileSync(pnpm_yamlPath, 'utf-8'));
		return PnpmYamlObj as type.pnpmLockYamlObj;
	} catch (e) {
		throw new Error('pnpm-lock.yaml解析失败');
	}
}

function getPnpm5_4AllDependHash(
	depnedType: DenpendType,
	yamlObj: type.pnpmLockYaml5_4Obj
) {
	function dependenciesVersionFormat(
		dependencies: Record<string, string> | undefined
	) {
		const res: Record<string, string> = {};
		Object.entries(dependencies || {}).forEach(([name, version]) => {
			res[name] = version.split('_')[0];
		});
		return res;
	}
	const hash: DependHash = {};
	Object.entries(yamlObj?.packages || {}).forEach(([key, value]) => {
		const arr = key.split('/');
		//删除第一个空字符
		arr.shift();
		const version = arr.pop()!.split('_')[0];
		const name = arr.join('/');
		hash[nameVersionStringify(name, version)] = dependenciesVersionFormat(
			value.dependencies
		);
	});
	//获取用户包的名字
	const entryPack = require(path.join(
		process.cwd().replace(/\\/g, '/'),
		'./package.json'
	));
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	hash[nameVersion] = dependenciesVersionFormat(yamlObj?.[depnedType] || {});
	return hash;
}
function getPnpm6_0AllDependHash(
	depnedType: DenpendType = field.dependencies,
	yamlObj: type.pnpmLockYaml6_0Obj
) {
	function removeParentheses(str: string) {
		return str.replace(/\([^()]*\)$/, '');
	}
	function dependenciesVersionFormat(
		dependencies: Record<string, string> | undefined
	) {
		const res: Record<string, string> = {};
		Object.entries(dependencies || {}).forEach(([name, version]) => {
			version = removeParentheses(version);
			res[name] = version.split('@').pop()!;
		});
		return res;
	}
	const hash: DependHash = {};
	Object.entries(yamlObj.packages).forEach(([packLink, info]) => {
		//删除"@babel/helper-create-class-features-plugin@7.22.10(@babel/core@7.22.10)"这种后面带括号内容
		packLink = removeParentheses(packLink);
		//下面三行用来去除域前缀或者是除前面'/'
		let arr = packLink.split('/');
		arr.shift();
		packLink = arr.join('/');
		//后面是将版本号和包名分开
		arr = packLink.split('@');
		const version = arr.pop()!;
		const packName = arr.join('@');
		hash[nameVersionStringify(packName, version)] = dependenciesVersionFormat(
			info.dependencies
		);
	});
	//获取用户包的名字
	const entryPack = require(path.join(
		process.cwd().replace(/\\/g, '/'),
		'./package.json'
	));
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	const userDepend: Record<string, string> = {};
	Object.entries(yamlObj[depnedType] || {}).forEach(([packName, info]) => {
		const { version } = info;
		userDepend[packName] = version;
	});
	hash[nameVersion] = dependenciesVersionFormat(userDepend);
	return hash;
}

function getPnpmAllDependHash(depnedType: DenpendType = field.dependencies) {
	const yamlObj = getPnpmYamlObj();
	const exeHash = {
		'5.4': getPnpm5_4AllDependHash,
		'6.0': getPnpm6_0AllDependHash,
	};
	const lockfileVersion = yamlObj.lockfileVersion;
	const exe = exeHash[lockfileVersion];
	if (!exe) throw new Error(`pnpm中锁版本${lockfileVersion}还未做兼容`);
	//@ts-ignore
	return exe!(depnedType, yamlObj);
}

const getPnpmDependHash: getDependHash = (/** 递归的最大深度*/ d) => {
	const AllDependHash = getPnpmAllDependHash(field.dependencies);
	const AllDevDependHash = getPnpmAllDependHash(field.devDependencies);
	const entryPack = require(path.join(
		process.cwd().replace(/\\/g, '/'),
		'./package.json'
	));

	function dfs(
		depth: number,
		nameVersion: string,
		allHash: DependHash,
		hash: DependHash
	) {
		if (depth >= d || hash[nameVersion]) return;
		hash[nameVersion] = allHash[nameVersion];
		Object.entries(hash[nameVersion] || {}).forEach(([name, version]) => {
			dfs(depth + 1, nameVersionStringify(name, version), allHash, hash);
		});
	}
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	const hash: DependHash = {};
	const devHash: DependHash = {};
	dfs(0, nameVersion, AllDependHash, hash);
	dfs(0, nameVersion, AllDevDependHash, devHash);
	return [hash, devHash];
};

module.exports = getPnpmDependHash;
