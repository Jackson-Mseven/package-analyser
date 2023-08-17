const dependentSizes = JSON.parse(sessionStorage.getItem('dependentSizes'));
// 获取数据
const data = workWithPieData(dependentSizes);
showPie(data);
const { xData, yData } = workWithBarData(data);
showBar(xData, yData);

/**
 * 处理pie数据
 * @param {object} data：数据
 */
function workWithPieData(data) {
	const resArr = [];
	Object.keys(data).forEach((package) => {
		resArr.push({
			value: Number(data[package].slice(0, -2)),
			name: package,
		});
	});
	return resArr.sort((pre, cur) => pre.value - cur.value).slice(0, 10);
}

/**
 * 展示pie
 * @param {array[{value: number, name: string}]} data：数据
 */
function showPie(data) {
	const pie = echarts.init(document.getElementById('pie')); // 初始化图表

	const option = {
		// 配置项
		tooltip: {
			trigger: 'item',
		},
		legend: {
			top: '5%',
			left: 'center',
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2,
				},
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 30,
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: false,
				},
				data,
			},
		],
	};

	pie.setOption(option); // 渲染图表
}

/**
 * 处理bar数据
 * @param {object} data：数据
 */
function workWithBarData(data) {
	const xData = data.map((item) => item.value);
	const yData = data.map((item) => item.name);
	return {
		xData,
		yData,
	};
}

/**
 * 展示bar
 * @param {array[{value: number, name: string}]} data：数据
 */
function showBar(xData, yData) {
	const bar = echarts.init(document.getElementById('bar')); // 初始化图表

	const option = {
		// 配置项
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		yAxis: [
			{
				type: 'category',
				data: yData,
				axisTick: {
					alignWithLabel: true,
				},
			},
		],
		xAxis: [
			{
				type: 'value',
			},
		],
		series: [
			{
				name: 'Size',
				type: 'bar',
				barWidth: '60%',
				data: xData,
			},
		],
	};

	bar.setOption(option); // 渲染图表
}

const back = document.querySelector('#back');
back.addEventListener('click', () => {
	window.history.back();
});

const mode = document.querySelector('#mode');
const changedMode = (init = true) => {
	console.log(init, localStorage.getItem('mode'));
	let body = document.body;
	if (localStorage.getItem('mode') == 'day') mode.innerHTML = `夜间模式`;
	else if (localStorage.getItem('mode') == 'dark') mode.innerHTML = `白天模式`;
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

if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
else changedMode(false);