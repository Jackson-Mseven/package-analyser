import * as fs from 'fs/promises';
import * as semver from 'semver';
import { Package } from './npm_yarn/type';
import { pathSymbol } from './Symbol';

/**
 * 合法版本号是否符合条件
 * @param versionCondition 合法范围 例子^1.1.1 | ~2.2.2
 * @param version 要检查是否合法的版本号
 * @returns
 */
export const checkVersion = (versionCondition: string, version: string) => {
	let ranges = versionCondition.split('||').map((s) => s.trim());
	ranges.forEach((range, idx) => {
		//npm处理版本范围
		if (range.slice(0, 3) == 'npm') ranges[idx] = range.split('@')[1];
	});
	for (let range of ranges) if (semver.satisfies(version, range)) return true;
	return false;
};

/**名字版本号字符化 */
export function nameVersionStringify(name: string, version: string) {
	return `${name} : ${version}`;
}

/** 名字版本字符串解析 */
export function nameVersionParse(nameVersion: string) {
	const arr = nameVersion.split(' : ');
	const version = arr.pop();
	const name = arr.join(' : ');
	return {
		name,
		version,
	};
}

/** 通过路径获取JSON文件并解析成对象 */
export async function getJsonFileObjPath(path: string) {
	try {
		const packJson = await fs.readFile(path, 'utf-8');
		const pack = JSON.parse(packJson);
		pack[pathSymbol] = path;
		return pack as Package;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export const isNumberStr = (s: string) => {
	return /^-?\d*\.?\d+$/.test(s);
};

export function dependHash_To_nameVersionsObj(
	hash: Record<string, Record<string, string>> = {}
) {
	const nameToVersion = Object.keys(hash).reduce(
		(obj: Record<string, string[]>, nameVersion) => {
			const { name, version } = nameVersionParse(nameVersion);
			if (!obj[name]) obj[name] = [];
			if (version) obj[name].push(version);
			return obj;
		},
		{}
	);
	return nameToVersion;
}

export function handleHasCjsVersionObj(
	obj: Record<string, string> | undefined
) {
	const newObj = obj || {};
	Object.entries(obj || {}).forEach(([key, val]) => {
		newObj[key] = val.split('/').pop()!;
	});
	return newObj;
}
