export function renderLine(flag, g) {
	let marker;
	if (flag) {
		// 连线（折线）
		marker = g
			.append('defs')
			.append('marker')
			.attr('id', 'arrow')
			.attr('markerUnits', 'strokeWidth')
			.attr('markerWidth', '16')
			.attr('markerHeight', '16')
			.attr('viewBox', '0 0 12 12')
			.attr('refX', '15') // 调整箭头的位置偏移量
			.attr('refY', '5.5')
			.attr('orient', 'auto');
	} else if (!flag) {
		// 连线（曲线）
		marker = g
			.append('defs')
			.append('marker')
			.attr('id', 'arrow')
			.attr('markerUnits', 'strokeWidth')
			.attr('markerWidth', '18')
			.attr('markerHeight', '18')
			.attr('viewBox', '0 0 12 12')
			.attr('refX', '20') // 调整箭头的位置偏移量
			.attr('refY', '5.4')
			.attr('orient', 'auto');
	}
	// 箭头
	marker
		.append('path')
		.attr('d', 'M2,2 L10,6 L2,10 L6,6 Z')
		.attr('fill', 'black');
}

export function renderBlock(node) {
	const rect = node.append('rect');
	const text = node
		.append('text')
		.text((d) => d.id)
		.attr('fill', 'black')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-weight', '100');
	return rect;
}
