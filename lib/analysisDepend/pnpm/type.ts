import field from '../field';

export type Dependencies = {};

export type pnpmLockYamlObj = {
	[field.dependencies]: Record<string, string>;
	[field.devDependencies]: Record<string, string>;
	packages: {
		[key: string]: {
			[field.dependencies]: Record<string, string>;
		};
	};
};
