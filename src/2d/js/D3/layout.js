const smallGrid = 50;
const Grid = 500;

// 添加svg元素
d3.select('#svg_div')
	.append('svg')
	.attr('id', 'SVG')
	.attr('width', '100%')
	.attr('height', '100%');

// 绘制栅格背景
const defs = d3.select('SVG').append('defs');
defs
	.append('pattern')
	.attr('id', 'smallGrid')
	.attr('width', smallGrid)
	.attr('height', smallGrid)
	.attr('patternUnits', 'userSpaceOnUse')
	.append('path')
	.attr('fill', 'none')
	.attr('stroke', 'gray')
	.attr('stoke-width', '0.3');

const border = defs.append('pattern');
border
	.attr('id', 'grid')
	.attr('width', Grid)
	.attr('height', Grid)
	.attr('patternUnits', 'userSpaceOnUse')
	.append('rect')
	.attr('width', Grid)
	.attr('height', Grid)
	.attr('fill', 'url(#smallGrid)');
border
	.append('path')
	.attr('d', `M ${Grid} 0 L 0 0 0 ${Grid}`)
	.attr('fill', 'none')
	.attr('stroke', 'gray')
	.attr('stroke-width', '1.5');

d3.select('SVG')
	.append('rect')
	.attr('id', 'bg-grid')
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('fill', 'url(#grid)');


