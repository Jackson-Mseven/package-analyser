// 获取数据
let data;
async function getData() {
  await axios.get('http://localhost:5005/getData').then(res => {
    data = res.data;
    console.log(data);
    show(JSON.parse(JSON.stringify(data.dependHash)))
  }).catch(err => {
    console.log('出现错误：', err);
  })
}
getData();

function show(res) {
  const smallGrid = 50;
  const Grid = 500;
  const MARGIN_LEFT = 100;
  const MARGIN_TOP = 50;
  let isPolyline = false; // 判断是折线还是曲线图

  // 处理数据
  const json = res;
  // 转换JSON格式
  const convertJsonToArrays = (json) => {
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
        links.push({ source: sourceNodeId, target: targetNodeId });
      }

      if (typeof value == 'object') {
        for (let key in value) {
          const childId = key.trim();
          const childValue = value[key].trim();
          if (typeof childValue == 'string') {
            const targetNodeId = childId + ' : ' + childValue;
            if (!nodes.find((node) => node.id == targetNodeId)) nodes.push({ id: targetNodeId });
            links.push({ source: nodeId, target: targetNodeId });
          } else processNode(childId, childValue, nodeId);
        }
      }
    };

    for (let key in json) processNode(key, json[key]);
    return { nodes, links };
  };
  const data = convertJsonToArrays(json);

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

  const init = (flag) => {
    let cachedRootX = null;
    let cachedRootY = null; // 存储根节点移动距离
    let cachedX = null; // 存储普通节点移动距离
    let cachedY = null;
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
    d3.select('SVG').call(d3.zoom().scaleExtent([0.3, 1.5]).on('zoom', zoomed));
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
      return (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
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
        // 调整箭头的位置偏移量
        .attr('refX', '15')
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
        .force('link', d3.forceLink(data.links).id((d) => d.id)
          // .distance(100)
        )
        .force('charge', d3.forceManyBody().strength(-80)) // 创建斥力
        .force('center', d3.forceCenter(0, (100 * data.nodes.length) / 3)); // 设置中心点
    } else if (!flag) {
      simulation = d3
        .forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id((d) => d.id)
          // .distance(150)
        )
        .force('charge', d3.forceManyBody().strength(-80)) // 创建斥力
        .force('center', d3.forceCenter(0, (70 * data.nodes.length) / 3)); // 设置中心点
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
      if (status == 'init' || !d3.event?.active)
        simulation.alphaTarget(0);
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
        d3.drag()
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
            'M' + (d.source.x + sourcePadding * hDirection) + ',' + d.source.y +
            'H' + (d.target.x - targetPadding * hDirection) +
            'V' + (d.target.y + targetPadding * vDirection) +
            'H' + d.target.x +
            'L' + d.target.x + ',' + d.target.y
          );
        });
      } else if (!flag) {
        link.attr('d', (d) => {
          const dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);

          return ('M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y);
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
      .x((d) => (d.id === data.nodes[0].id ? 0 : d.x));
    let verticalForce;
    if (flag) {
      verticalForce = d3
        .forceY()
        .y((d) =>
          d.id == data.nodes[0].id ? -100 * data.nodes.length : d.y
        );
    } else if (!flag) {
      verticalForce = d3
        .forceY()
        .y((d) =>
          d.id == data.nodes[0].id ? -80 * data.nodes.length : d.y
        );
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
          .radius((d) => Math.max(getTextWidth(d.id), getTextHeight(d.id)) + nodePadding)
      );
    };
    updateNodes();

    // 视角返回节点
    let num = data.nodes[0].index; // 上次触发的节点，默认为根节点
    const updatePosition = (num) => {
      if (num == 'init') {
        node.filter((d) => { if (d.id == data.nodes[0].id) dragended.call(d, d, num); });
      }
      node.attr('getPosition', (d) => {
        // 返回根节点
        if (d.index == num && d.index == data.nodes[0].index) {
          x = d.x;
          y = d.y;
          d3.select('#graph').attr('transform', `translate(${-(cachedRootX ? cachedRootX + x : x)}, ${-(cachedRootY + y ? cachedRootY : y)})`);

          d3.zoom()
            .scaleExtent([0.01, 100])
            .on('zoom', zoomed)
            .transform(d3.select('#SVG'), d3.zoomIdentity.translate(-(cachedRootX ? cachedRootX + x : x), -(cachedRootY + y ? cachedRootY : y))); // 重置内部状态
        } else if (d.index == num) {
          x = d.x;
          y = d.y;

          d3.select('#graph').attr('transform', `translate(${-(cachedX ? cachedX + x : x) / 1.5}, ${-(cachedY + y ? cachedY : y)})`);

          d3.zoom()
            .scaleExtent([0.01, 100])
            .on('zoom', zoomed)
            .transform(d3.select('#SVG'), d3.zoomIdentity.translate(-(cachedX ? cachedX + x : x) / 1.5, -(cachedY + y ? cachedY : y))); // 重置内部状态
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
    setTimeout(() => {
      backBtn.click();
      d3.select('#SVG g').node().style = 'display:block';
    }, 1000);

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
        if (d.source.id === hoveredNodeId)
          return 'link-hover'; // 设置与悬停节点相关的连线样式
        else return 'link';
      });
    };

    // 折叠节点
  };

  // 切换格式
  const polyline = document.querySelector('#polyline');
  const curve = document.querySelector('#curve');

  polyline.addEventListener('click', () => {
    if (!isPolyline) {
      polyline.disabled = true;
      curve.disabled = false;
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = true;
      init(isPolyline);
    }
  });

  curve.addEventListener('click', () => {
    if (isPolyline) {
      polyline.disabled = false;
      curve.disabled = true;
      const svg = d3.select('#graph');
      svg.remove();
      isPolyline = false;
      init(isPolyline);
    }
  });

  polyline.click();
}