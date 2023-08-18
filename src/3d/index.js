let graph;

const getData = (flag) => {
	// 渲染数据
	const render = (data) => {
		if (graph) graph.graphData(null); // 清理先前的图形实例

		const graphData = JSON.parse(data); // 序列化
		graph = ForceGraph3D()(document.querySelector('#graph-3d'))
			.linkDirectionalParticles(2)
			.graphData(graphData)
			.linkDirectionalArrowLength(3.5) // 箭头长度
			.linkDirectionalArrowRelPos(1) // 箭头位置偏移 source指向target
			.linkDirectionalParticles('value')
			.linkDirectionalParticleSpeed((d) => d.value * 0.005)
			.nodeThreeObject((node) => {
				const sprite = new SpriteText(node.id);
				sprite.material.depthWrite = true; // make sprite background transparent
				sprite.color = node.color;
				sprite.textHeight = 2;
				return sprite;
			});
	};
	if (flag == 1) render(sessionStorage.getItem('dependHash'));
	else if (flag == 2) render(sessionStorage.getItem('devPendHash'));

	if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
	else changedMode(false);
};

const mode = document.querySelector('#mode');
const changedMode = (init = true) => {
	let body = document.body;
	if (localStorage.getItem('mode') == 'day') {
		mode.innerHTML = `夜间模式`;
		graph
			.graphData(JSON.parse(sessionStorage.getItem('dependHash'))) // 加载数据
			.backgroundColor('white') //背景色
			.linkOpacity(1) // 链接透明度
			.nodeThreeObject((node) => {
				const sprite = new SpriteText(node.id);
				sprite.color = 'black';
				sprite.textHeight = 4;
				return sprite;
			});
	} else if (localStorage.getItem('mode') == 'dark') {
		mode.innerHTML = `白天模式`;
		graph
			.backgroundColor('#7f7f7f') //背景色
			.linkOpacity(1) // 链接透明度
			.nodeThreeObject((node) => {
				const sprite = new SpriteText(node.id);
				sprite.color = 'white';
				sprite.textHeight = 4;
				return sprite;
			});
	}
	if (init) body.classList.toggle('dark');
	else if (!init && localStorage.getItem('mode') == 'dark')
		body.classList.add('dark'); //初始化时保存的是夜间模式更新背景色
};

mode.addEventListener('click', () => {
	if (localStorage.getItem('mode') == 'dark')
		localStorage.setItem('mode', 'day');
	else if (localStorage.getItem('mode') == 'day')
		localStorage.setItem('mode', 'dark');
	changedMode();
});
getData(1);

const dependencies = document.querySelector('#dependencies');
const devDependencies = document.querySelector('#devDependencies');

let flag = 1;

const toggleMode = (el) => {
	dependencies.style.backgroundColor = 'white';
	dependencies.style.color = '#606266';
	devDependencies.style.backgroundColor = 'white';
	devDependencies.style.color = '#606266';
	el.style.backgroundColor = '#409eff';
	el.style.color = 'white';
};
toggleMode(dependencies);

dependencies.addEventListener('click', () => {
	if (flag == 2) {
		toggleMode(dependencies);
		flag = 1;
		// getData(flag);
		graph.graphData(JSON.parse(sessionStorage.getItem('dependHash'))); // 加载数据
	}
});

devDependencies.addEventListener('click', () => {
	if (flag == 1) {
		toggleMode(devDependencies);
		flag = 2;
		// getData(flag);
		graph.graphData(JSON.parse(sessionStorage.getItem('devPendHash'))); // 加载数据
	}
});

const ThreeD = document.querySelector('#ThreeD');
ThreeD.addEventListener('click', () => {
	location.href = '../2d/index.html';
});

const size = document.querySelector('#size');
size.addEventListener('click', () => {
	location.href = '../size/index.html';
});
