import { handleDifferentSituation } from '../processingData.js';
import { showDepend } from '../sidebar.js';
import { zoomed } from './zoomed.js';
import { getTextWidth, getTextHeight } from './getText.js';
import { asideInit } from './initAside.js';
import { renderLine, renderBlock } from './line.js';
import { initPath } from './initPath.js';

let highLight;
let updatePosition;
const toggleMode = (el) => el.classList.add('active');

export function show(res) {
	const {dependHash,devPendHash,dependToVersions,devDependToVersions,dependencyHoop,devDependencyHoop,} = handleDifferentSituation(res);

	let isPolyline = false; // true: 折线 ;false: 曲线
	let cachedNormalX = null, cachedNormalY = null; // 存储普通节点移动距离

	// 渲染依赖图
	const init = (flag, data, noRoot = false) => { // true: 折线 ;false: 曲线; noRoot:环状数据时无根节点
		let cachedRootX = null, cachedRootY = null; // 存储根节点移动距离
		let x = null, y = null;

		d3.select('SVG').call(d3.zoom().scaleExtent([0.1, 1.5]).on('zoom', zoomed));
		d3.select('#SVG').append('g').attr('id', 'graph').attr('style', 'display:none'); // 创建图形容器
		const g = d3.select('#graph').append('g'); // 创建力导向图容器
		renderLine(flag, g);

		let simulation; // 创建力导向图模拟
		if (flag) {
			simulation = d3.forceSimulation(data.nodes).force('link', d3.forceLink(data.links).id((d) => d.id).distance(100))
				.force('charge', d3.forceManyBody().strength(-50)) // 创建斥力
				.force('center', d3.forceCenter(0, (10 * data.nodes.length) / 3)); // 设置中心点
		} else if (!flag) {
			simulation = d3.forceSimulation(data.nodes).force('link', d3.forceLink(data.links).id((d) => d.id).distance(150))
				.force('charge', d3.forceManyBody().strength(-50)) // 创建斥力
				.force('center', d3.forceCenter(0, (60 * data.nodes.length) / 3)); // 设置中心点
		}
		// 节点拖拽行为
		const dragstarted = (d) => {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		};
		const dragged = (d) => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		};
		const dragended = (d, status) => {
			num = d.index;
			if (status == 'init' || !d3.event?.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
			setTimeout(() => {
				if (d.id == data.nodes[0].id) {
					cachedRootX = d.x;
					cachedRootY = d.y;
				} else {
					cachedNormalX = d.x;
					cachedNormalY = d.y;
				}
			}, 999);
		};

		const link = g.selectAll('.link').data(data.links).enter().append('path').attr('class', 'link'); // 创建路径  PS:路径与节点有层叠性，故先创新路径为底
		const node = g.selectAll('.node').data(data.nodes).enter().append('g').attr('class', 'node').call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)); // 创建节点
		const rect = renderBlock(node);

		simulation.on('tick', () => {
			initPath(flag, link);
			// 移动节点到最新位置
			node.attr('transform', (d) => {
				if (d.id == data.nodes[0].id && !noRoot) return `translate(${d.x}, ${d.y}) scale(1.8)`;
				else return `translate(${d.x}, ${d.y})`;
			});
		});

		const rootNode = node.filter((d) => d.id == data.nodes[0].id);
		if (!noRoot) rootNode.attr('class', 'root');
		const horizontalForce = d3.forceX().x((d) => (d.id == data.nodes[0].id ? 0 : d.x));
		let verticalForce;
		if (flag) verticalForce = d3.forceY().y((d) => (d.id == data.nodes[0].id ? -40 * data.nodes.length : d.y));
		else if (!flag) verticalForce = d3.forceY().y((d) => (d.id == data.nodes[0].id ? -40 * data.nodes.length : d.y));
		simulation.force('vertical', verticalForce).force('horizontal', horizontalForce); // 根节点高度

	  const nodePadding = 20; // 文本宽度
		const updateNodes = () => {
			// 边框宽度
			rect.attr('width', (d) => getTextWidth(d.id) + nodePadding).attr('height', (d) => getTextHeight() + nodePadding).attr('rx', 6).attr('ry', 6).attr('x', (d) => -getTextWidth(d.id) / 2 - nodePadding / 2).attr('y', (d) => -getTextHeight() / 2 - nodePadding / 2);
			// 创建碰撞力，避免节点重叠
			simulation.force('collision', d3.forceCollide().radius((d) => Math.max(getTextWidth(d.id), getTextHeight()) + nodePadding));
		};
		updateNodes();

		// 视角返回节点
		let num = data.nodes[0].index; // 上次触发的节点，默认为根节点
		const rootOrNormal = (d, a, b, multiple) => { // 根节点或普通节点更新为中央视角
			x = d.x;
			y = d.y;
			d3.select('#graph').attr('transform', `translate(${-(a ? a + x : x) / multiple}, ${-(b + y ? b : y)})`);
			d3.zoom().scaleExtent([0.01, 100]).on('zoom', zoomed).transform(d3.select('#SVG'), d3.zoomIdentity.translate(-(a ? a + x : x) / multiple, -(b + y ? b : y))); // 重置内部状态
		}
		updatePosition = (num, cachedX, cachedY) => {
			if (num == 'init') { node.filter((d) => {if (d.id == data.nodes[0].id) dragended.call(d, d, num);});}
			node.attr('getPosition', (d) => {
				if (d.index == num && d.index == data.nodes[0].index) rootOrNormal(d, cachedRootX, cachedRootY, 1); // 返回根节点
				else if (d.index == num) rootOrNormal(d, cachedX ? cachedX : cachedNormalX, cachedY?cachedY : cachedNormalY, 2);
			});
		};
		updatePosition('init');

		const backBtn = document.querySelector('#backBtn');
		backBtn.addEventListener('click', () => updatePosition(num));
		const backRootBtn = document.querySelector('#backRootBtn');
		backRootBtn.addEventListener('click', () => updatePosition(data.nodes[0].index));
		setTimeout(() => {
			backBtn.click();
			d3.select('#SVG g').node().style = 'display:block';
		}, Math.min(Math.max(data.nodes.length * 2 + data.links.length * 5, 900), 1500));

		// 视口大小发生变化时更新元素位置
		const updateViewPort = () => {
			let viewportWidth = window.innerWidth;
			let viewportHeight = window.innerHeight;
			g.attr('transform', `translate(${viewportWidth / 2},${viewportHeight / 2})`);
		};
		updateViewPort();	// 初始化设置各节点位置
		window.addEventListener('resize', updateViewPort);

		// 悬停节点 突出以该节点为起点的依赖
		highLight = (id, cancel) => {
			let hoveredNodeId = null;
			node.on('mouseover', (d) => {
				hoveredNodeId = d.id;
				highlightLinks();
			});
			node.on('mouseout', () => {
				hoveredNodeId = null;
				highlightLinks();
			});
			const highlightLinks = () => { // 设置高亮
				link.attr('class', (d) => {	// 设置与悬停节点相关的连线样式
					if (d.source.id == hoveredNodeId) return 'link-hover';
					else return 'link';
				});
			};
			const defaultLinks = () => { //取消高亮
				link.attr('class', 'link');
				node.attr('class', (d) => {
					if (d.index == 0 && !noRoot) return 'root';
					else return 'node';
				});
			};
			if (id && !cancel) {
				hoveredNodeId = id;
				node.attr('class', (d) => {
					if (d.id == hoveredNodeId) return 'node-hover';
					else {
						if (d.index == 0 && !noRoot) return 'root';
						else return 'node';
					}
				});
				highlightLinks();
			}
			if (cancel) defaultLinks();
		};
		highLight();
	};

	// 切换曲/折线
	let inputData = dependHash;
	const polyline = document.querySelector('#polyline');
	const curve = document.querySelector('#curve');
	const polylineOrCurve = (bool, type, other) => { // 渲染不同连线
		const svg = d3.select('#graph');
		svg.remove();
		isPolyline = bool;
		if (showRingBtn.innerHTML == '取消展示') {
			if (inputData == dependHash) init(isPolyline, dependencyHoop, true);
			else if (inputData == devPendHash) init(isPolyline, devDependencyHoop, true);
		} else init(isPolyline, inputData);
		type.classList.remove('active');
		toggleMode(other);
	};
	polyline.addEventListener('click', () => {
		if (!isPolyline) polylineOrCurve(true, curve, polyline);
	});
	curve.addEventListener('click', () => {
		if (isPolyline) polylineOrCurve(false, polyline, curve);
	});

	// 展示环状数据
	const showRingBtn = document.querySelector(`.ring`);
	let isOn = false, ringData;
	showRingBtn.addEventListener('click', () => {
		showRingBtn.classList.add('can');
		isOn = !isOn;
		if (isOn) {
			showRingBtn.innerHTML = '取消展示';
			const svg = d3.select('#graph');
			svg.remove();
			backRootBtn.disabled = true;
			backRootBtn.classList.add('disabled');
			if (inputData == dependHash) {
				ringData = dependencyHoop;
				showDepend(JSON.parse(localStorage.getItem('dependencyHoopObj'))[2]);
				asideInit(dependencyHoop);
			} else if (inputData == devPendHash) {
				ringData = devDependencyHoop;
				showDepend(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[2]);
				asideInit(devDependencyHoop);
			}
			init(isPolyline, ringData, true);
		} else {
			showRingBtn.innerHTML = '点击展示';
			const svg = d3.select('#graph');
			svg.remove();
			backRootBtn.disabled = false;
			backRootBtn.classList.remove('disabled');
			init(isPolyline, inputData);
			if (inputData == dependHash) {
				asideInit( dependHash);
				showDepend(dependToVersions);
			} else if (inputData == devPendHash) {
				asideInit(devPendHash);
				showDepend(devDependToVersions);
			}
		}
	});

	const visibleRingBtn = (data) => { // 控制展示环按钮
		if (data) {
			document.querySelector(`.status`).innerText = '有环';
			showRingBtn.style.display = 'inline-block';
		} else {
			document.querySelector(`.status`).innerText = '无环';
			showRingBtn.style.display = 'none';
		}
	};
	visibleRingBtn(JSON.parse(localStorage.getItem('dependencyHoopObj'))[0]);

	// 切换依赖环境
	const dependencies = document.querySelector('#dependencies');
	const devDependencies = document.querySelector('#devDependencies');
	const commonChange = (lastData, nextData, version, source, btn) => {
		if (inputData == lastData) {
			const svg = d3.select('#graph');
			svg.remove();
			inputData = nextData;
			init(isPolyline, inputData);
			showDepend(version);
			source.classList.remove('active');
			toggleMode(btn);
			asideInit(nextData);
			visibleRingBtn(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[0]);
			isOn = false;
			showRingBtn.innerHTML = '点击展示';
			document.querySelector('#backRootBtn').classList.remove('disabled');
		}
	};

	dependencies.addEventListener('click', () => commonChange(devPendHash, dependHash, dependToVersions, devDependencies, dependencies));
	devDependencies.addEventListener('click', () => commonChange(dependHash, devPendHash, devDependToVersions, dependencies, devDependencies));

	toggleMode(dependencies);
	showDepend(dependToVersions);
	polylineOrCurve(true, curve, polyline);
	asideInit(dependHash);
	if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
	else changedMode(false);
}

export { highLight, updatePosition };