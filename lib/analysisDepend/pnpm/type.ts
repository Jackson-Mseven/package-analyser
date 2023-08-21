import { type } from 'os';
import field from '../field';

export type Dependencies = {};

export enum LockFileVersion {
	V5_4 = '5.4',
	V6_0 = '6.0',
}

export type pnpmLockYaml5_4Obj = {
	lockfileVersion: LockFileVersion.V5_4;
	[field.dependencies]?: Record<string, string>;
	[field.devDependencies]?: Record<string, string>;
	packages: {
		[key: string]: {
			[field.dependencies]: Record<string, string>;
		};
	};
};

export type pnpmLockYaml6_0Obj = {
	lockfileVersion: LockFileVersion.V6_0;
	[field.dependencies]?: Record<
		string,
		{
			version: string;
		}
	>;
	[field.devDependencies]?: Record<
		string,
		{
			version: string;
		}
	>;
	packages: Record<
		string,
		{
			[field.dependencies]?: Record<string, string>;
			[field.devDependencies]?: Record<string, string>;
			version: string;
		}
	>;
};

export type pnpmLockYamlObj = pnpmLockYaml5_4Obj | pnpmLockYaml6_0Obj;
