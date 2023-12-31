/**
   * JSON 转换为 Map 数据格式
   * @param {JSON} dataJson - JSON 类型的数据
   * @return {Map} dataMap - Map 类型的数据
   */
function jsonToMap(
  dataJson: Record<string, Record<string, string>>
): Map<string, object> {
  return new Map(Object.entries(dataJson));
}

/**
   * 遍历每一个包，将其依赖由对象转换为数组
   * @param {Map} dataMap - Map 类型的数据
   * @returns {Array} directedGraphInfo - 有向图信息
   */
function typeConversion(dataMap: Map<string, object>): {
  directedGraph: Map<string, Array<string>>;
  indegree: Map<string, number>;
  noVisited: Set<string>;
} {
  const directedGraph: Map<string, Array<string>> = new Map(); // 有向图
  const indegree: Map<string, number> = new Map(); // 入度表
  const noVisited: Set<string> = new Set(); // 未访问的节点数组

  function isValidKey(
    value: string,
    object: object
  ): value is keyof typeof object {
    return value in object;
  }

  for (const curPackage of Array.from(dataMap.keys())) {
    const dependencies: object = dataMap.get(curPackage) || {}; // 依赖对象

    // 添加入度
    if (!indegree.has(curPackage)) {
      indegree.set(curPackage, 0);
    }

    // 添加到为访问的数组
    noVisited.add(curPackage);

    // 遍历依赖
    const dependenciesArr: Array<string> = []; // 依赖数组
    for (const dependency of Object.keys(dependencies)) {
      let node: string = '';

      if (isValidKey(dependency, dependencies)) {
        node = dependency + ' : ' + dependencies[dependency]; // 依赖（有向图的节点）
      }

      dependenciesArr.push(node); // 添加依赖
      indegree.set(node, (indegree.get(node) || 0) + 1); // 记录入度
      noVisited.add(node);
    }

    // 将对象转换为数组
    directedGraph.set(curPackage, dependenciesArr);
  }
  Array.from(indegree.keys()).forEach(item => {
    if (!directedGraph.has(item)) {
      directedGraph.set(item, [])
    }
  })

  return { directedGraph, indegree, noVisited };
}

/**
   * 查找环，并且展示环
   * @param {Map} directedGraph - 有向图
   * @param {Map} indegree - 入度表
   * @param {Set} noVisited - 为访问的节点数组
   * @param {Map} dataMap - 数据
   * @return {Array} hoopInfo - 环信息（是否有环，环节点）
   */
function findHoopAndShow(
  directedGraph: Map<string, Array<string>>,
  indegree: Map<string, number>,
  noVisited: Set<string>,
  dataMap: Map<string, object>
) {
  // 获取入口节点
  const iterator: IterableIterator<string> = directedGraph.keys(); // 数据 Map 的迭代器
  const inlet: string = iterator.next().value; // 入口节点（唯一入度为0的节点）

  // 查找环
  const queue: Array<string> = [inlet]; // 当前可以搜索到的节点队列
  while (queue.length) {
    const node: string = queue.shift() as string; // 当前搜索的节点
    // 将该节点记录到已经遍历过的节点数组中
    noVisited.delete(node);
    for (const dependency of directedGraph.get(node)!) {
      indegree.set(dependency, (indegree.get(dependency) as number) - 1);
      if (indegree.get(dependency) === 0) queue.push(dependency);
    }
  }

  let flag = false;
  if (noVisited.size !== 0) {
    flag = true;
  }

  const hoop = Array.from(noVisited.values()).reduce((total, item) => { // 环
    return total.set(item, dataMap.get(item))
  }, new Map())

  const hoopVersion = Array.from(hoop.keys()).reduce((total: Map<string, Array<string>>, item) => { // 环版本
    const name: string = item.split(' : ')[0]
    const version: string = item.split(' : ')[1]
    if (total.has(name)) { // 存在多个版本
      const versions = total.get(name)!
      return total.set(name, [...versions, version])
    } else { // 第一个版本
      return total.set(name, [version])
    }
  }, new Map())

  return [flag, Object.fromEntries(hoop), Object.fromEntries(hoopVersion)];
}

/**
 * 处理循环依赖
 * @param {JSON} data - JSON 类型的数据
 * @return {Array} hoopInfo - 环信息
 */
export default function (data: Record<string, Record<string, string>>) {
  const dataMap: Map<string, object> = jsonToMap(data); // Map 类型的数据

  const { directedGraph, indegree, noVisited } = typeConversion(dataMap); // 有向图信息

  return findHoopAndShow(directedGraph, indegree, noVisited, dataMap); // 环信息
}