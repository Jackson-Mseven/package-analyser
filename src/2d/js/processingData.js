/**
 * 获取对应深度的依赖信息
 * @param {Object} data - 原始依赖信息
 * @param {String} depth - 依赖的深度
 * @return {Array} dependencyInfo - 依赖信息
 */
function getDepthData(data, depth) {
  depth = Number(depth);
  const dependencyInfo = new Map();
  if (Object.keys(data).length) {
    const head = Object.keys(data)[0]; // 根节点
    const queue = [head];
    while (depth--) {
      // 深度递减直到为0
      let len = queue.length; // 每一个深度应该遍历的节点数
      while (len--) {
        const node = queue.shift();
        const values = data[node];
        dependencyInfo.set(node, values);
        Object.entries(values).forEach((item) => {
          queue.push(item[0] + ' : ' + item[1]);
        });
      }
    }
    queue.forEach((item) => {
      dependencyInfo.set(item, {});
    });
  }
  return Object.fromEntries(dependencyInfo);
}

/**
 * 处理对应深度版本信息
 * @param {Object} data - 原始版本信息
 * @return {Array} versionInfo - 版本信息
 */
function getDepthVersion(data) {
  const versionMap = new Map();
  Object.keys(data).forEach((item) => {
    const name = item.split(' : ')[0];
    const version = item.split(' : ')[1];
    if (versionMap.has(name)) {
      // 多个版本
      const versions = versionMap.get(name);
      versionMap.set(name, [...versions, version]);
    } else {
      // 第一个版本
      versionMap.set(name, [version]);
    }
  });
  return Object.fromEntries(versionMap);
}

/**
 *  转换 JSON 格式为渲染的数据格式
 * @param {Object} data：所有数据
 * @return {}
 */
function convertJsonToArrays(data) {
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
}

/**
 * 获取渲染数据
 * @param {Object} data - 所有数据
 */
function getRenderData(data) {
  let dependHash = JSON.parse(localStorage.getItem('dependHashObj'))
  let devPendHash = JSON.parse(localStorage.getItem('devPendHashObj'))
  let dependencyHoop = JSON.parse(localStorage.getItem('dependencyHoopObj'))[1]
  let devDependencyHoop = JSON.parse(localStorage.getItem('devDependencyHoopObj'))[1];
  // 1、处理深度
  if (data.depth !== 'Infinity') { // 局部递归
    dependHash = getDepthData(dependHash, data.depth);
    devPendHash = getDepthData(devPendHash, data.depth);
  }

  // 2、获取版本
  let dependToVersions = getDepthVersion(dependHash);
  let devDependToVersions = getDepthVersion(devPendHash);

  // 3、处理格式
  dependHash = convertJsonToArrays(dependHash);
  devPendHash = convertJsonToArrays(devPendHash);
  dependencyHoop = convertJsonToArrays(dependencyHoop);
  devDependencyHoop = convertJsonToArrays(devDependencyHoop);
  sessionStorage.setItem('dependHash', JSON.stringify(dependHash));
  sessionStorage.setItem('devPendHash', JSON.stringify(devPendHash));
  sessionStorage.setItem('dependToVersions', JSON.stringify(dependToVersions));
  sessionStorage.setItem('devDependToVersions', JSON.stringify(devDependToVersions));
  sessionStorage.setItem('dependencyHoop', JSON.stringify(dependencyHoop));
  sessionStorage.setItem('devDependencyHoop', JSON.stringify(devDependencyHoop));

  return {
    dependHash,
    devPendHash,
    dependToVersions,
    devDependToVersions,
    dependencyHoop,
    devDependencyHoop
  }
}

/**
 * 第一次 或者 依赖信息改变了的渲染
 * @param {Object} data - 原始数据
 * @return {Objct} renderData - 渲染数据
 */
function firstOrChangedRender(data) {
  // 1、存储原始数据
  localStorage.setItem('dependHashObj', JSON.stringify(data.dependHash));
  localStorage.setItem('devPendHashObj', JSON.stringify(data.devPendHash));
  localStorage.setItem('dependToVersionsObj', JSON.stringify(data.dependToVersions));
  localStorage.setItem('devDependToVersionsObj', JSON.stringify(data.devDependToVersions));
  localStorage.setItem('dependencyHoopObj', JSON.stringify(data.dependencyHoop));
  localStorage.setItem('devDependencyHoopObj', JSON.stringify(data.devDependencyHoop));
  localStorage.setItem('dependentSizes', JSON.stringify(data.dependentSizes));

  // 2、处理深度并且转换格式
  return getRenderData(data);
}

/**
 * 多次的渲染
 * @param {Object} data - 原始数据
 * @return {Objct} renderData - 渲染数据
 */
function multipleRender(data) {
  // 1、处理深度并且转换格式
  return getRenderData(data);
}

const situations = {
  firstOrChangedRender,
  multipleRender
}

export function handleDifferentSituation(res) {
  if (Object.keys(res).length === 1) {
    return situations.multipleRender(res)
  } else {
    return situations.firstOrChangedRender(res)
  }
}