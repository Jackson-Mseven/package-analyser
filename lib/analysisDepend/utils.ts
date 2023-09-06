const semver = require('semver');
/**
 * 合法版本号是否符合条件
 * @param versionCondition 合法范围 例子^1.1.1 | ~2.2.2
 * @param version 要检查是否合法的版本号
 * @returns
 */
const checkVersion = (versionCondition: string, version: string) => {
	let ranges = versionCondition.split('||').map((s) => s.trim());
	ranges.forEach((range, idx) => {
		//npm处理版本范围
		if (range.slice(0, 3) == 'npm') ranges[idx] = range.split('@')[1];
	});
	for (let range of ranges) if (semver.satisfies(version, range)) return true;
	return false;
};

/**名字版本号字符化 */
function nameVersionStringify(name: string, version: string) {
	return `${name} : ${version}`;
}

/** 名字版本字符串解析 */
function nameVersionParse(nameVersion: string) {
	const arr = nameVersion.split(' : ');
	const version = arr.pop();
	const name = arr.join(' : ');
	return {
		name,
		version,
	};
}

const isNumberStr = (s: string) => {
	return /^-?\d*\.?\d+$/.test(s);
};

function dependHash_To_nameVersionsObj(
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

module.exports = {
	checkVersion,
	nameVersionStringify,
	nameVersionParse,
	isNumberStr,
	dependHash_To_nameVersionsObj,
};
