import { type } from 'os';
import { parentSybmol, pathSymbol } from '../Symbol';
import field from '../field';

export type Package = {
	name: string;
	version: string;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	[pathSymbol]: string;
};

export type VirtualFolder = {
	file: Record<string, Package>;
	folder: Record<string, VirtualFolder>;
	parent?: VirtualFolder;
	info: {
		folderName?: string;
	};
};

export type denpendType = field.dependencies | field.devDependencies;
