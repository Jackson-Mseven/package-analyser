import { Data } from './analysisDepend/type';

// 启动服务器
module.exports = function (data: Data) {
  // 引入 express 框架
  const express = require('express');
  // 引入子进程
  const childProcess: { exec: Function } = require('child_process');

  // 创建服务器实例
  const app: { use: Function; get: Function; listen: Function } = express();

  // 配置 express 服务器的默认地址
  app.use(
    express.static(__dirname.slice(0, __dirname.indexOf('dist')) + '\\src')
  );

  app.get('/getData', (req: object, res: { send: Function }) => {
    res.send(data);
  });

  /**
   * 打开默认浏览器
   * @param {string} url：浏览器地址
   */
  const openDefaultBrowser = function (url: string) {
    switch (process.platform) {
      case 'darwin':
        childProcess.exec('open ' + url);
        break;
      case 'win32':
        childProcess.exec('start ' + url);
        break;
      default:
        childProcess.exec('xdg-open', [url]);
    }
  };

  openDefaultBrowser('http://localhost:5005/2d/index.html');

  app.listen(5005, (err: object) => {
    if (err) {
      console.log('服务器启动失败');
      return err;
    }
    console.log('服务器启动了');
    console.log('http://localhost:5005/2d/index.html');
  });
};
