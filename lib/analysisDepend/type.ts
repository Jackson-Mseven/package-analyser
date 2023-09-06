import field from './field';

export type Package = {
	name: string;
	version: string;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
};

export type DenpendType = field.dependencies | field.devDependencies;

export type DependHash = Record<string, Record<string, string>>;

export type Data = {
	dependHash: DependHash;
	devPendHash: DependHash;
	dependToVersionsObj: Record<string, string[]>;
	devDependToVersionsObj: Record<string, string[]>;
};

export type getDependHash = (
	/*解析依赖到第几层*/ d: number
) => [DependHash, DependHash];
