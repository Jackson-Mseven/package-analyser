import { show } from './D3/render.js';
import { getData } from './getData.js';

// 获取接口数据
const dataPromise = getData(show);

dataPromise.then((val) => {
  show(val); // 渲染节点
});