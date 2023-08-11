import { pathSymbol } from './Symbol';

export type Package = {
	name: string;
	version: string;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	[pathSymbol]: string;
};
