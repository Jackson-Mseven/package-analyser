const dependentSizes = JSON.parse(localStorage.getItem('dependentSizes'));
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
  Object.keys(data).forEach((name) => {
    resArr.push({
      value: Number(data[name].slice(0, -2)),
      name: name,
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
      textStyle: {
        color: '',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '',
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
            color: '',
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };

  if (localStorage.getItem('mode') == 'day') {
    option.legend.textStyle.color = 'black';
    option.series[0].itemStyle.borderColor = 'black';
    option.series[0].emphasis.label.color = 'black';
  } else if (localStorage.getItem('mode') == 'dark') {
    option.legend.textStyle.color = 'white';
    option.series[0].itemStyle.borderColor = 'white';
    option.series[0].emphasis.label.color = 'white';
  }

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
        axisLabel: {
          color: '',
        },
      },
    ],
    xAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '',
        },
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

  if (localStorage.getItem('mode') == 'day') {
    option.yAxis[0].axisLabel.color = 'black';
    option.xAxis[0].axisLabel.color = 'black';
  } else if (localStorage.getItem('mode') == 'dark') {
    option.yAxis[0].axisLabel.color = 'white';
    option.xAxis[0].axisLabel.color = 'white';
  }

  bar.setOption(option); // 渲染图表
}