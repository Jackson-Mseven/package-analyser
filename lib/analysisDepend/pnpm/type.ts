import field from '../field';

export type Dependencies = {};

export type pnpmLockYamlObj = {
	[field.dependencies]: {
		[key: string]: string;
	};
	packages: {
		[key: string]: {
			[field.dependencies]: {
				[key: string]: string;
			};
		};
	};
};
