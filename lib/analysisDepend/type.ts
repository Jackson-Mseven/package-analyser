import { pathSymbol } from './Symbol';
import field from './field';

export type Package = {
	name: string;
	version: string;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	[pathSymbol]: string;
};

export type DenpendType = field.dependencies | field.devDependencies;
