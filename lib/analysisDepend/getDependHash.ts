import field from './field';
import getNpm_YarnDependHash from './npm_yarn';
import getPnpmDependHash from './pnpm';
import { DenpendType } from './type';
import { isNumberStr } from './utils';

export default async function (
	depth: string,
	packageManagementTools: string,
	depnedType: DenpendType = field.dependencies
) {
	const d = isNumberStr(depth) ? +depth : 1;
	if (packageManagementTools == 'pnpm') {
		return await getPnpmDependHash(d, depnedType);
	} else {
		return await getNpm_YarnDependHash(d, depnedType);
	}
}
