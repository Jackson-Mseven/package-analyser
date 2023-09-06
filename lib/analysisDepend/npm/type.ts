import field from '../field';

export type packageLockJsonObj = {
	name: string;
	packages: {
		[packageName: string]: {
			version: string;
			[field.dependencies]?: Record<string, string>;
			[field.devDependencies]?: Record<string, string>;
		};
	};
};
export type DependNode = {
	parent?: DependNode;
	children: Record<string, DependNode>;
	info: {
		name?: string;
		version: string;
		[field.dependencies]?: Record<string, string>;
		[field.devDependencies]?: Record<string, string>;
	};
};
