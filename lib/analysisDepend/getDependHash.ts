import field from './field';
import { DependHash, getDependHash } from './type';
const { isNumberStr } = require('./utils');
const getNpmDependHash = require('./npm');
const getPnpmDependHash = require('./pnpm');
const getYarnDependHash = require('./yarn');

module.exports = function (depth: string, packageManagementTools: string) {
	let d: number;
	if (!isNumberStr(depth) || depth == 'Infinity') d = 1e9;
	else d = +depth;

	const exeHash: Record<string, getDependHash> = {
		pnpm: getPnpmDependHash,
		npm: getNpmDependHash,
		yarn: getYarnDependHash,
	};
	return exeHash[packageManagementTools](d);
};
