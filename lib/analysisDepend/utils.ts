import * as fs from 'fs/promises';
import * as semver from 'semver';
import { pathSymbol } from './Symbol';

/** 合法版本号是否符合条件 */
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

/** 通过路径获取JSON文件并解析成对象 */
export async function getJsonFileObjPath(path: string) {
	try {
		const packJson = await fs.readFile(path, 'utf-8');
		const pack = JSON.parse(packJson);
		pack[pathSymbol] = path;
		return pack;
	} catch (e) {
		return null;
	}
}

export const isNumberStr = (s: string) => {
	return /^-?\d*\.?\d+$/.test(s);
};
