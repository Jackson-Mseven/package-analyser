// import * as packageInfo from (process.cwd().replace(/\\/g, '/') + "/package.json")

// 获取数据
async function getData() {
  await axios
    .get('http://localhost:5005/getData')
    .then((res) => {
      show(JSON.parse(JSON.stringify(res.data)));
    })
    .catch((err) => {
      throw err;
    });
}
getData();

let dependHash; // 生产依赖数据
let devPendHash; // 开发依赖数据
let dependToVersions; // 生成依赖版本信息
let devDependToVersions; // 开发依赖版本信息
let dependencyHoop; // 生产依赖环状数据
let devDependencyHoop; // 开发依赖环状数据

// 处理数据
const handleDataStrategy = {
  /**
   * 获取深度的数据
   * @param { string } env：环境
   */
  getDepthData: function (data, depth) {
    depth = Number(depth);
    const dependentInfo = new Map();
    if (Object.keys(data).length) {
      const head = Object.keys(data)[0]; // 根节点
      const queue = [head];
      while (depth--) { // 深度递减直到为0
        let len = queue.length; // 每一个深度应该遍历的节点数
        while (len--) {
          const node = queue.shift();
          const values = data[node];
          dependentInfo.set(node, values);
          Object.entries(values).forEach(item => {
            queue.push(item[0] + ' : ' + item[1]);
          })
        }
      }
      queue.forEach(item => {
        dependentInfo.set(item, {});
      })
    }
    return Object.fromEntries(dependentInfo);
  },

  getDepthVersion: function (data) {
    const versionMap = new Map();
    Object.keys(data).forEach(item => {
      const name = item.split(' : ')[0]
      const version = item.split(' : ')[1]
      if (versionMap.has(name)) { // 多个版本
        const versions = versionMap.get(name);
        versionMap.set(name, [...versions, version]);
      } else { // 第一个版本
        versionMap.set(name, [version]);
      }
    })
    return Object.fromEntries(versionMap)
  },
  /**
   * 获取渲染的数据
   */
  getRenderData: function (json) {
    // 1、处理深度
    if (json.depth !== 'Infinity') { // 局部递归
      dependHash = this.getDepthData(JSON.parse(localStorage.getItem('dependHashObj')), json.depth);
      devPendHash = this.getDepthData(JSON.parse(localStorage.getItem('devPendHashObj')), json.depth);
      dependencyHoop = this.getDepthData(JSON.parse(localStorage.getItem('dependencyHoopObj'))[1], json.depth);
      devDependencyHoop = this.getDepthData(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[1], json.depth);
    } else { // 全局递归
      dependHash = JSON.parse(localStorage.getItem('dependHashObj'));
      devPendHash = JSON.parse(localStorage.getItem('devPendHashObj'));
      dependencyHoop = JSON.parse(localStorage.getItem('dependencyHoopObj'))[1];
      devDependencyHoop = JSON.parse(localStorage.getItem('devDependencyHoopObj'))[1];
    }

    // 2、获取版本
    dependToVersions = this.getDepthVersion(dependHash)
    devDependToVersions = this.getDepthVersion(devPendHash)

    // 3、处理格式
    dependHash = this.convertJsonToArrays(dependHash);
    devPendHash = this.convertJsonToArrays(devPendHash);
    dependencyHoop = this.convertJsonToArrays(dependencyHoop);
    devDependencyHoop = this.convertJsonToArrays(devDependencyHoop);

    sessionStorage.setItem("dependHash", JSON.stringify(dependHash))
    sessionStorage.setItem("devPendHash", JSON.stringify(devPendHash))
    sessionStorage.setItem("dependToVersions", JSON.stringify(dependToVersions))
    sessionStorage.setItem("devDependToVersions", JSON.stringify(devDependToVersions))
    sessionStorage.setItem("dependencyHoop", JSON.stringify(dependencyHoop))
    sessionStorage.setItem("devDependencyHoop", JSON.stringify(devDependencyHoop))
  },
  /**
   *  转换 JSON 格式
   * @param { object{ name: version } } data：数据
   * @returns 
   */
  convertJsonToArrays: function (data) {
    let nodes = [];
    let links = [];
    let nodeIndex = 0;
    const processNode = (id, value, parent = null) => {
      const nodeId = id.trim();
      if (!nodes.find((node) => node.id == nodeId)) {
        nodeIndex++;
        nodes.push({ id: nodeId, index: nodeIndex });
      }
      if (parent) {
        const sourceNodeId = parent.trim();
        const targetNodeId = nodeId;
        links.push({
          source: sourceNodeId,
          target: targetNodeId,
          value: 1,
        });
      }
      if (typeof value == 'object') {
        for (let key in value) {
          const childId = key.trim();
          const childValue = value[key].trim();
          if (typeof childValue == 'string') {
            const targetNodeId = childId + ' : ' + childValue;
            if (!nodes.find((node) => node.id == targetNodeId)) {
              nodeIndex++;
              nodes.push({ id: targetNodeId, index: nodeIndex });
            }
            links.push({
              source: nodeId,
              target: targetNodeId,
              value: 1,
            });
          } else processNode(childId, childValue, nodeId);
        }
      }
    };
    for (let key in data) processNode(key, data[key]);
    return { nodes, links };
  },
  // 依赖没有变
  unchanged: function (json) {
    // 1、处理深度并且转换格式
    this.getRenderData(json)
  },
  // 依赖改变了
  changed: function (json) {
    // 1、存储原始数据
    localStorage.setItem('dependHashObj', JSON.stringify(json.dependHash));
    localStorage.setItem('devPendHashObj', JSON.stringify(json.devPendHash));
    localStorage.setItem('dependToVersionsObj', JSON.stringify(json.dependToVersions));
    localStorage.setItem('devDependToVersionsObj', JSON.stringify(json.devDependToVersions));
    localStorage.setItem('dependencyHoopObj', JSON.stringify(json.dependencyHoop));
    localStorage.setItem('devDependencyHoopObj', JSON.stringify(json.devDependencyHoop));
    localStorage.setItem('dependentSizes', JSON.stringify(json.dependentSizes));

    // 2、处理深度并且转换格式
    this.getRenderData(json)
  },
};

const show = (res) => {
  if (Object.keys(res).length === 1) {
    // package.json 没有改变，接收 depth
    handleDataStrategy.unchanged(res);
  } else {
    // package.json 改变了，接收 对象
    handleDataStrategy.changed(res);
  }

  const smallGrid = 50;
  const Grid = 500;
  let isPolyline = false; // true: 折线 ;false: 曲线

  //#region
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
  //#endregion

  let updatePosition;
  let cachedX = null; // 存储普通节点移动距离
  let cachedY = null;
  // 渲染依赖图
  const init = (flag, data) => {
    // true: 折线 ;false: 曲线
    let cachedRootX = null;
    let cachedRootY = null; // 存储根节点移动距离
    let x = null;
    let y = null;
    let k = null;
    // 拖拽缩放
    const zoomed = () => {
      d3.select('#graph').attr('transform', d3.event.transform);
      k = d3.event.transform.k;
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
    };
    d3.select('SVG').call(d3.zoom().scaleExtent([0.1, 1.5]).on('zoom', zoomed));
    // 创建图形容器
    d3.select('#SVG')
      .append('g')
      .attr('id', 'graph')
      .attr('style', 'display:none');
    // 创建力导向图容器
    const g = d3.select('#graph').append('g');
    let marker;
    // 获得文本宽高
    const getTextWidth = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '12px Courier New';
      return context.measureText(text).width;
    };
    const getTextHeight = (text) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = '16px Courier New';
      const metrics = context.measureText('M');
      return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    };
    const nodePadding = 20; // 文本宽度
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

    let simulation; // 创建力导向图模拟
    if (flag) {
      simulation = d3
        .forceSimulation(data.nodes)
        .force(
          'link',
          d3
            .forceLink(data.links)
            .id((d) => d.id)
            .distance(100)
        )
        .force('charge', d3.forceManyBody().strength(-50)) // 创建斥力
        .force('center', d3.forceCenter(0, (10 * data.nodes.length) / 3)); // 设置中心点
    } else if (!flag) {
      simulation = d3
        .forceSimulation(data.nodes)
        .force(
          'link',
          d3
            .forceLink(data.links)
            .id((d) => d.id)
            .distance(150)
        )
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
      document.querySelector('#backBtn').disabled = true;
      document.querySelector('#backRootBtn').disabled = true;

      setTimeout(() => {
        if (d.id == data.nodes[0].id) {
          cachedRootX = d.x;
          cachedRootY = d.y;
        } else {
          cachedX = d.x;
          cachedY = d.y;
        }
        document.querySelector('#backBtn').disabled = false;
        document.querySelector('#backRootBtn').disabled = false;
      }, 999);
    };

    // 创建路径  PS:路径与节点有层叠性，故先创新路径为底
    const link = g
      .selectAll('.link')
      .data(data.links)
      .enter()
      .append('path')
      .attr('class', 'link');

    // 创建节点
    const node = g
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    const rect = node.append('rect');
    const text = node
      .append('text')
      .text((d) => d.id)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-weight', '100');

    // 定义了路径元素的形状
    const initPath = (flag) => {
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
    };
    simulation.on('tick', () => {
      initPath(flag);

      // 移动节点到最新位置
      node.attr('transform', (d) => {
        if (d.id == data.nodes[0].id)
          return `translate(${d.x}, ${d.y}) scale(1.8)`;
        else return `translate(${d.x}, ${d.y})`;
      });
    });

    const rootNode = node.filter((d) => d.id == data.nodes[0].id);
    rootNode.attr('class', 'root');

    const horizontalForce = d3
      .forceX()
      .x((d) => (d.id == data.nodes[0].id ? 0 : d.x));
    let verticalForce;
    if (flag) {
      verticalForce = d3
        .forceY()
        .y((d) => (d.id == data.nodes[0].id ? -40 * data.nodes.length : d.y));
    } else if (!flag) {
      verticalForce = d3
        .forceY()
        .y((d) => (d.id == data.nodes[0].id ? -40 * data.nodes.length : d.y));
    }

    simulation
      .force('vertical', verticalForce)
      .force('horizontal', horizontalForce); // 根节点高度

    const updateNodes = () => {
      // 边框宽度
      rect
        .attr('width', (d) => getTextWidth(d.id) + nodePadding)
        .attr('height', (d) => getTextHeight(d.id) + nodePadding)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('x', (d) => -getTextWidth(d.id) / 2 - nodePadding / 2)
        .attr('y', (d) => -getTextHeight(d.id) / 2 - nodePadding / 2);
      // 创建碰撞力，避免节点重叠
      simulation.force(
        'collision',
        d3
          .forceCollide()
          .radius(
            (d) =>
              Math.max(getTextWidth(d.id), getTextHeight(d.id)) + nodePadding
          )
      );
    };
    updateNodes();

    // 视角返回节点
    let num = data.nodes[0].index; // 上次触发的节点，默认为根节点
    updatePosition = (num) => {
      if (num == 'init') {
        node.filter((d) => {
          if (d.id == data.nodes[0].id) dragended.call(d, d, num);
        });
      }
      node.attr('getPosition', (d) => {
        // 返回根节点
        if (d.index == num && d.index == data.nodes[0].index) {
          x = d.x;
          y = d.y;
          d3.select('#graph').attr(
            'transform',
            `translate(${-(cachedRootX
              ? cachedRootX + x
              : x)}, ${-(cachedRootY + y ? cachedRootY : y)})`
          );

          d3.zoom()
            .scaleExtent([0.01, 100])
            .on('zoom', zoomed)
            .transform(
              d3.select('#SVG'),
              d3.zoomIdentity.translate(
                -(cachedRootX ? cachedRootX + x : x),
                -(cachedRootY + y ? cachedRootY : y)
              )
            ); // 重置内部状态
        } else if (d.index == num) {
          x = d.x;
          y = d.y;

          d3.select('#graph').attr(
            'transform',
            `translate(${-(cachedX ? cachedX + x : x) / 2}, ${-(cachedY + y
              ? cachedY
              : y)})`
          );

          d3.zoom()
            .scaleExtent([0.01, 100])
            .on('zoom', zoomed)
            .transform(
              d3.select('#SVG'),
              d3.zoomIdentity.translate(
                -(cachedX ? cachedX + x : x) / 2,
                -(cachedY + y ? cachedY : y)
              )
            ); // 重置内部状态
        }
      });
    };
    updatePosition('init');

    const backBtn = document.querySelector('#backBtn');
    backBtn.addEventListener('click', () => updatePosition(num));
    const backRootBtn = document.querySelector('#backRootBtn');
    backRootBtn.addEventListener('click', () =>
      updatePosition(data.nodes[0].index)
    );

    setTimeout(
      () => {
        backBtn.click();
        d3.select('#SVG g').node().style = 'display:block';
      },
      Math.min(
        Math.max(data.nodes.length * 2 + data.links.length * 5, 900),
        1500
      )
    );

    // 视口大小发生变化时更新元素位置
    const updateViewPort = () => {
      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;

      g.attr(
        'transform',
        `translate(${viewportWidth / 2},${viewportHeight / 2}) `
      );
    };

    // 初始化设置各节点位置
    updateViewPort();
    window.addEventListener('resize', updateViewPort);

    // 悬停节点 突出以该节点为起点的依赖
    let hoveredNodeId = null;
    node.on('mouseover', (d) => {
      hoveredNodeId = d.id;
      highlightLinks();
    });
    node.on('mouseout', () => {
      hoveredNodeId = null;
      highlightLinks();
    });
    // 设置高亮
    const highlightLinks = () => {
      link.attr('class', (d) => {
        // 设置与悬停节点相关的连线样式
        if (d.source.id == hoveredNodeId) return 'link-hover';
        else return 'link';
      });
    };
  };

  // 切换曲/折线
  let inputData = dependHash;
  const polyline = document.querySelector('#polyline');
  const curve = document.querySelector('#curve');
  polyline.addEventListener('click', () => {
    if (!isPolyline) {
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = true;
      if (showRingBtn.innerHTML == '取消展示') {
        if (inputData == dependHash) init(isPolyline, dependencyHoop);
        else if (inputData == devPendHash) init(isPolyline, devDependencyHoop);
      } else init(isPolyline, inputData);
      toggleMode(polyline);
    }
  });
  curve.addEventListener('click', () => {
    if (isPolyline) {
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = false;
      if (showRingBtn.innerHTML == '取消展示') {
        if (inputData == dependHash) init(isPolyline, dependencyHoop);
        else if (inputData == devPendHash) init(isPolyline, devDependencyHoop);
      } else init(isPolyline, inputData);
      toggleMode(curve);
    }
  });

  // 展示环状数据
  const showRingBtn = document.querySelector(`.ring`);
  let isOn = false;
  let ringData;
  showRingBtn.addEventListener('click', () => {
    showRingBtn.classList.add('can');
    isOn = !isOn;
    if (isOn) {
      showRingBtn.innerHTML = '取消展示';
      const svg = d3.select('#graph');
      svg.remove();
      if (inputData == dependHash) {
        ringData = dependencyHoop;
        RefFlag = 3;
        showDepend(JSON.parse(localStorage.getItem('dependencyHoopObj'))[2]);
      } else if (inputData == devPendHash) {
        ringData = devDependencyHoop;
        RefFlag = 4;
        showDepend(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[2]);
      }
      init(isPolyline, ringData);
      flag = 3;
      asideInit();
    } else {
      showRingBtn.innerHTML = '点击展示';
      const svg = d3.select('#graph');
      svg.remove();
      init(isPolyline, inputData);
      if (inputData == dependHash) {
        flag = 3;
        RefFlag = 1;
        showDepend(JSON.parse(localStorage.getItem('dependToVersionsObj')));
      } else if (inputData == devPendHash) {
        flag = 4;
        RefFlag = 2;
        showDepend(JSON.parse(localStorage.getItem('devDependToVersionsObj')));
      }
      asideInit();
    }
  });

  // 控制展示环按钮
  const visibleRingBtn = (data) => {
    if (data) {
      document.querySelector(`.status`).innerText = '有环';
      showRingBtn.style.display = 'inline-block';
    } else {
      document.querySelector(`.status`).innerText = '无环';
      showRingBtn.style.display = 'none';
    }
  };
  visibleRingBtn(JSON.parse(localStorage.getItem('dependencyHoopObj'))[0]);

  let RefFlag = 1; // 用于判断侧边栏处于那个依赖  1:生产  2:开发  3:展示环
  // 切换依赖环境
  const dependencies = document.querySelector('#dependencies');
  const devDependencies = document.querySelector('#devDependencies');
  dependencies.addEventListener('click', () => {
    if (inputData == devPendHash) {
      const svg = d3.select('#graph');
      svg.remove();
      inputData = dependHash;
      init(isPolyline, inputData);
      showDepend(JSON.parse(localStorage.getItem('dependToVersionsObj')));
      toggleMode(dependencies);
      RefFlag = 1;
      asideInit();
      visibleRingBtn(JSON.parse(localStorage.getItem('dependencyHoopObj'))[0]);
      isOn = false;
      showRingBtn.innerHTML = '点击展示';
    }
  });

  devDependencies.addEventListener('click', () => {
    if (inputData == dependHash) {
      const svg = d3.select('#graph');
      svg.remove();
      inputData = devPendHash;
      init(isPolyline, inputData);
      showDepend(JSON.parse(localStorage.getItem('devDependToVersionsObj')));
      toggleMode(devDependencies);
      RefFlag = 2;
      asideInit();
      visibleRingBtn(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[0]);
      isOn = false;
      showRingBtn.innerHTML = '点击展示';
    }
  });
  toggleMode(dependencies);
  polyline.click();
  showDepend(JSON.parse(localStorage.getItem('dependToVersionsObj')));

  // 初始化侧边栏
  const asideInit = () => {
    const selectLis = document.querySelectorAll('#aside .content li');
    const searchInput = document.querySelector('#search-input');
    let searchText = '';
    searchInput.value = ''; // 清空上次输入

    // 输入防抖
    const debounce = (callback, delay) => {
      let timerId;
      return function () {
        clearTimeout(timerId);
        timerId = setTimeout(callback, delay);
      };
    };

    searchInput.addEventListener(
      'input',
      debounce(() => {
        searchText = searchInput.value;
        search();
      }, 300)
    );

    // 搜索
    const search = () => {
      selectLis.forEach((item) => {
        const itemText = item.textContent.toLowerCase();
        const isMatch = itemText.includes(searchText.toLowerCase());
        if (isMatch) {
          item.style.display = 'block';
          const subLis = item.querySelectorAll('ul li'); // 内层li标签可见
          subLis.forEach((subLi) => (subLi.style.display = 'inline-block'));
        } else {
          if (item.style.display == 'inline-block')
            item.style.display = 'block'; // 内层不隐藏
          else item.style.display = 'none';
        }
      });
    };

    // 渲染依赖项
    selectLis.forEach((li) => {
      const ulElement = li.querySelector('ul');
      if (ulElement) {
        ulElement.addEventListener('click', (e) => e.stopPropagation()); // 阻止内部 ul 元素的事件冒泡和事件委托
      } else {
        li.addEventListener('dblclick', (e) => {
          const clickedNodeValue =
            e.target.dataset.nodeValue || e.target.textContent;
          let item = clickedNodeValue.replace(' - ', ' : ');
          if (RefFlag == 1) {
            dependHash.nodes.forEach((node) => {
              if (node.id == item) {
                cachedX = node.x;
                cachedY = node.y;
                updatePosition(node.index);
              }
            });
          } else if (RefFlag == 2) {
            devPendHash.nodes.forEach((node) => {
              cachedX = node.x;
              cachedY = node.y;
              if (node.id == item) updatePosition(node.index);
            });
          } else if (RefFlag == 3) {
            dependencyHoop.nodes.forEach((node) => {
              cachedX = node.x;
              cachedY = node.y;
              if (node.id == item) updatePosition(node.index);
            });
          } else if (RefFlag == 4) {
            devDependencyHoop.nodes.forEach((node) => {
              cachedX = node.x;
              cachedY = node.y;
              if (node.id == item) {
                updatePosition(node.index);
              }
            });
          }
        });
      }
    });
  };
  asideInit();

  if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
  else changedMode(false);
};

const toggleMode = (el) => {
  const dependencies = document.querySelector(`#dependencies`);
  const devDependencies = document.querySelector(`#devDependencies`);
  const polyline = document.querySelector(`#polyline`);
  const curve = document.querySelector(`#curve`);

  if (['dependencies', 'devDependencies'].includes(el.id)) {
    dependencies.style.backgroundColor = 'white';
    dependencies.style.color = '#606266';
    devDependencies.style.backgroundColor = 'white';
    devDependencies.style.color = '#606266';
    el.style.backgroundColor = '#409eff';
    el.style.color = 'white';
  } else if (['polyline', 'curve'].includes(el.id)) {
    polyline.style.backgroundColor = 'white';
    polyline.style.color = '#606266';
    curve.style.backgroundColor = 'white';
    curve.style.color = '#606266';
    el.style.backgroundColor = '#409eff';
    el.style.color = 'white';
  }
};

const arrow = document.querySelector('#aside div');
arrow.addEventListener('click', () => {
  const aside = document.querySelector('#aside');
  aside.classList.toggle('open');
  arrow.classList.toggle('arrow-open');
});

// 切换3D依赖关系图界面
const ThreeD = document.querySelector('#ThreeD');
ThreeD.addEventListener('click', () => {
  location.href = '../3d/index.html';
});

// 切换白/夜间模式
const changedMode = (init = true) => {
  let body = document.body;
  let smallGrid = document.querySelector('defs #smallGrid path');
  let grid = document.querySelector('defs #grid path');
  if (localStorage.getItem('mode') == 'day') {
    mode.innerHTML = `夜间模式`;
    smallGrid.setAttribute('stroke', 'gray');
    grid.setAttribute('stroke', 'gray');
    document.querySelector('.status').style.color = 'black';
  } else if (localStorage.getItem('mode') == 'dark') {
    mode.innerHTML = `白天模式`;
    smallGrid.setAttribute('stroke', 'white');
    grid.setAttribute('stroke', 'white');
    document.querySelector('.status').style.color = 'white';
  }
  if (init) body.classList.toggle('dark');
  else if (!init && localStorage.getItem('mode') == 'dark')
    body.classList.add('dark'); //初始化时保存的是夜间模式更新背景色
};
const mode = document.querySelector('#mode');
mode.addEventListener('click', () => {
  if (localStorage.getItem('mode') == 'dark')
    localStorage.setItem('mode', 'day');
  else if (localStorage.getItem('mode') == 'day')
    localStorage.setItem('mode', 'dark');
  changedMode();
});

// 侧边栏依赖展示
const showDepend = (data) => {
  const content = document.querySelector('#aside .content');
  const ulElement = content.querySelector('ul');
  if (ulElement) ulElement.parentNode.removeChild(ulElement);

  const ul = document.createElement('ul');
  for (let i in data) {
    const li = document.createElement('li');
    let version = data[i];
    if (Array.isArray(version)) {
      if (version.length == 1) {
        li.textContent = `${i} - ${version[0]}`;
        li.dataset.nodeValue = `${i} - ${version[0]}`;
        li.title = `${i} - ${version[0]}`; // 添加 title 属性
      } else {
        const span = document.createElement('span');
        span.textContent = i;
        li.appendChild(span);
        const ul2 = document.createElement('ul');
        for (let j in version) {
          const li2 = document.createElement('li');
          li2.textContent = version[j];
          li2.dataset.nodeValue = `${i} - ${version[j]}`;
          li2.title = `${i} - ${version[j]}`; // 添加 title 属性
          ul2.appendChild(li2);
        }
        li.appendChild(ul2);
      }
    } else {
      li.textContent = `${i} - ${version}`;
      li.title = `${i} - ${version}`; // 添加 title 属性
    }
    ul.appendChild(li);
  }
  content.appendChild(ul);
};

// 切换依赖文件大小界面
const size = document.querySelector('#size');
size.addEventListener('click', () => {
  location.href = '../size/index.html';
});
