const smallGrid = 50;
const Grid = 500;

// 拖拽缩放
export function zoomed() {
	d3.select('#graph').attr('transform', d3.event.transform);
	let k = d3.event.transform.k;
	// 栅格缩放
	d3.select('#smallGrid')
		.attr('width', smallGrid * k)
		.attr('height', smallGrid * k);
	d3.select('#smallGrid')
		.select('path')
		.attr('width', smallGrid * k)
		.attr('height', smallGrid * k)
		.attr('d', `M ${smallGrid * k} 0 L 0 0 0 ${smallGrid * k}`);
	d3.select('#grid')
		.attr('width', Grid * k)
		.attr('height', Grid * k);
	d3.select('#grid')
		.select('rect')
		.attr('width', Grid * k)
		.attr('height', Grid * k);
	d3.select('#grid')
		.select('path')
		.attr('d', `M ${Grid * k} 0 L 0 0 0 ${Grid * k}`);
}
