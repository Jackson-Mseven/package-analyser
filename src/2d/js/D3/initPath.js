// 定义了路径元素的形状
export function initPath(flag, link) {
	if (flag) {
		link.attr('d', (d) => {
			const dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				sourcePadding = 10, // 起始节点的填充
				targetPadding = 10, // 目标节点的填充
				hDirection = dx > 0 ? 1 : -1, // 计算水平方向
				vDirection = dy > 0 ? 1 : -1, // 计算垂直方向
				dr = Math.sqrt(dx * dx + dy * dy);

			return (
				'M' +
				(d.source.x + sourcePadding * hDirection) +
				',' +
				d.source.y +
				'H' +
				(d.target.x - targetPadding * hDirection) +
				'V' +
				(d.target.y + targetPadding * vDirection) +
				'H' +
				d.target.x +
				'L' +
				d.target.x +
				',' +
				d.target.y
			);
		});
	} else if (!flag) {
		link.attr('d', (d) => {
			const dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = Math.sqrt(dx * dx + dy * dy);

			return (
				'M' +
				d.source.x +
				',' +
				d.source.y +
				'A' +
				dr +
				',' +
				dr +
				' 0 0,1 ' +
				d.target.x +
				',' +
				d.target.y
			);
		});
	}
}
