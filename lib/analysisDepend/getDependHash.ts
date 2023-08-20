import field from './field';
import getNpmDependHash from './npm';
import getPnpmDependHash from './pnpm';
import { DenpendType, DependHash } from './type';
import { isNumberStr } from './utils';

export default function (depth: string, packageManagementTools: string) {
	let d: number;
	if (!isNumberStr(depth) || depth == 'Infinity') d = 1e9;
	else d = +depth;

	const exeHash: Record<string, (d: number) => [DependHash, DependHash]> = {
		pnpm: getPnpmDependHash,
		npm: getNpmDependHash,
		yarn: getNpmDependHash,
	};
	return exeHash[packageManagementTools](d);
}
