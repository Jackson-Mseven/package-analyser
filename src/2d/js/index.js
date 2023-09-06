import { getData } from './getData.js'
import { handleDifferentSituation } from './processingData.js'
import { showDepend } from './sidebar.js'

// 获取接口数据
const dataPromise = getData(show);

dataPromise.then(val => {
  show(val); // 渲染节点
})

function show(res) {
  const { dependHash, devPendHash, dependToVersions, devDependToVersions, dependencyHoop, devDependencyHoop } = handleDifferentSituation(res)

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
  let highLight;
  let cachedX = null; // 存储普通节点移动距离
  let cachedY = null;
  // 渲染依赖图
  const init = (flag, data, noRoot = false) => {
    // true: 折线 ;false: 曲线; noRoot:环状数据时无根节点
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

      setTimeout(() => {
        if (d.id == data.nodes[0].id) {
          cachedRootX = d.x;
          cachedRootY = d.y;
        } else {
          cachedX = d.x;
          cachedY = d.y;
        }
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
        if (d.id == data.nodes[0].id && !noRoot)
          return `translate(${d.x}, ${d.y}) scale(1.8)`;
        else return `translate(${d.x}, ${d.y})`;
      });
    });

    const rootNode = node.filter((d) => d.id == data.nodes[0].id);
    if (!noRoot) rootNode.attr('class', 'root');

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
      // 设置高亮
      const highlightLinks = () => {
        link.attr('class', (d) => {
          // 设置与悬停节点相关的连线样式
          if (d.source.id == hoveredNodeId) return 'link-hover';
          else return 'link';
        });
      };
      //取消高亮
      const defaultLinks = () => {
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
  polyline.addEventListener('click', () => {
    if (!isPolyline) {
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = true;
      if (showRingBtn.innerHTML == '取消展示') {
        if (inputData == dependHash) init(isPolyline, dependencyHoop, true);
        else if (inputData == devPendHash)
          init(isPolyline, devDependencyHoop, true);
      } else init(isPolyline, inputData);
      curve.classList.remove('active');
      toggleMode(polyline);
    }
  });
  curve.addEventListener('click', () => {
    if (isPolyline) {
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = false;
      if (showRingBtn.innerHTML == '取消展示') {
        if (inputData == dependHash) init(isPolyline, dependencyHoop, true);
        else if (inputData == devPendHash)
          init(isPolyline, devDependencyHoop, true);
      } else init(isPolyline, inputData);
      polyline.classList.remove('active');
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
      backRootBtn.disabled = true;
      backRootBtn.classList.add('disabled');
      if (inputData == dependHash) {
        ringData = dependencyHoop;
        RefFlag = 3;
        showDepend(JSON.parse(localStorage.getItem('dependencyHoopObj'))[2]);
      } else if (inputData == devPendHash) {
        ringData = devDependencyHoop;
        RefFlag = 4;
        showDepend(JSON.parse(localStorage.getItem('devDependencyHoopObj'))[2]);
      }
      init(isPolyline, ringData, true);
      flag = 3;
      asideInit();
    } else {
      showRingBtn.innerHTML = '点击展示';
      const svg = d3.select('#graph');
      svg.remove();
      backRootBtn.disabled = false;
      backRootBtn.classList.remove('disabled');
      init(isPolyline, inputData);
      if (inputData == dependHash) {
        flag = 3;
        RefFlag = 1;
        showDepend(dependToVersions);
      } else if (inputData == devPendHash) {
        flag = 4;
        RefFlag = 2;
        showDepend(devDependToVersions);
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
      showDepend(dependToVersions);
      devDependencies.classList.remove('active');
      toggleMode(dependencies);
      RefFlag = 1;
      asideInit();
      visibleRingBtn(JSON.parse(localStorage.getItem('dependencyHoopObj'))[0]);
      isOn = false;
      showRingBtn.innerHTML = '点击展示';
      document.querySelector('#backRootBtn').classList.remove('disabled');
    }
  });

  devDependencies.addEventListener('click', () => {
    if (inputData == dependHash) {
      const svg = d3.select('#graph');
      svg.remove();
      inputData = devPendHash;
      init(isPolyline, inputData);
      showDepend(devDependToVersions);
      dependencies.classList.remove('active');
      toggleMode(devDependencies);
      RefFlag = 2;
      asideInit();
      visibleRingBtn(
        JSON.parse(localStorage.getItem('devDependencyHoopObj'))[0]
      );
      isOn = false;
      showRingBtn.innerHTML = '点击展示';
      document.querySelector('#backRootBtn').classList.remove('disabled');
    }
  });
  toggleMode(dependencies);
  polyline.click();
  showDepend(dependToVersions);

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
        li.addEventListener('mouseover', (e) => {
          const clickedNodeValue =
            e.target.dataset.nodeValue || e.target.textContent;
          let item = clickedNodeValue.replace(' - ', ' : ');
          if (RefFlag == 1) {
            dependHash.nodes.forEach((node) => {
              if (node.id == item) highLight(item);
            });
          } else if (RefFlag == 2) {
            devPendHash.nodes.forEach((node) => {
              if (node.id == item) highLight(item);
            });
          } else if (RefFlag == 3) {
            dependencyHoop.nodes.forEach((node) => {
              if (node.id == item) highLight(item);
            });
          } else if (RefFlag == 4) {
            devDependencyHoop.nodes.forEach((node) => {
              if (node.id == item) highLight(item);
            });
          }
        });
        li.addEventListener('mouseout', () => highLight(null, true));
      }
    });
  };
  asideInit();

  if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
  else changedMode(false);
};

const toggleMode = (el) => el.classList.add('active');

const arrow = document.querySelector('#aside div');
arrow.addEventListener('click', () => {
  const aside = document.querySelector('#aside');
  aside.classList.toggle('open');
  arrow.classList.toggle('arrow-open');
});