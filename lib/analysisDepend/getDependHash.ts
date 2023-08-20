import field from './field';
import getNpmDependHash from './npm';
import getPnpmDependHash from './pnpm';
import { DependHash } from './type';
import { isNumberStr } from './utils';
import getYarnDependHash from './yarn';

export default function (depth: string, packageManagementTools: string) {
	let d: number;
	if (!isNumberStr(depth) || depth == 'Infinity') d = 1e9;
	else d = +depth;

	const exeHash: Record<string, (d: number) => [DependHash, DependHash]> = {
		pnpm: getPnpmDependHash,
		npm: getNpmDependHash,
		yarn: getYarnDependHash,
	};
	return exeHash[packageManagementTools](d);
}
