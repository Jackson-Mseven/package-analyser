// 获得文本宽高
export function getTextWidth(text) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = '12px Courier New';
	return context.measureText(text).width;
}
export function getTextHeight() {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = '16px Courier New';
	const metrics = context.measureText('M');
	return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}
