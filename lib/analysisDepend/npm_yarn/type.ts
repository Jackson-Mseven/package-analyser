import { type } from 'os';
import { parentSybmol, pathSymbol } from '../Symbol';
import field from '../field';
import { Package } from '../type';

export type VirtualFolder = {
	file: Record<string, Package>;
	folder: Record<string, VirtualFolder>;
	parent?: VirtualFolder;
	info: {
		folderName?: string;
	};
};

export type denpendType = field.dependencies | field.devDependencies;
