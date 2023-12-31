
<h1 align="center">package-analyser</h1>

<div align="center">

![Static Badge](https://img.shields.io/badge/bulid-experimental-orange)
[![NPM version][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/package-analyser.svg
[npm-url]: https://www.npmjs.com/package/package-analyser

![Static Badge](https://img.shields.io/badge/npm_size-94.6KB-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Jackson-Mseven/package-analyser)

![Static Badge](https://img.shields.io/badge/license-MIT-yellow)
</div>

## 介绍

package-analyser 是一个简单易用的分析依赖以及依赖体积的 NodeJS 命令行工具。

它实现了：

1.  分析生产、开发环境下的依赖关系
2.  分析生产环境下的依赖体积
3.  判断当前项目是否存在循环依赖（当存在循环依赖时可以展示循环依赖）
4.  通过2D、3D的形式展示依赖关系
    -   支持搜索某个依赖并进行定位
    -   支持折线、曲线两种方式进行展示
5.  通过可视化图表的形式展示依赖体积
6.  支持日间、夜间两种模式
7.  支持页面展示以及输出为 JSON 文件两种方式

## README.md
- en [English](README.md)
- zh_CN [中文](README.zh_CN.md)

## 安装

```bash
npm i package-analyser -g
```

>   注意：
>
>   由于 package-analyser 是一个命令行工具，所以一定要全局安装。

## 使用

### 后台使用

```bash
/**
 * @param { number } depth：依赖的深度（限制为 整数 以及 Infinity）
 * @param { string } jsonFile：要输出的JSON文件的路径（相对于命令行执行的路径）
 */
analyze-cli analyze [depth] [jsonFile]
```

### 依赖图使用
#### 2D
<div align="center">

|  操作   |  效果  |
|  :----:  | :----:  |
| 左键节点  |  拖动节点 |
| 左键画布  |  平移视角 |
| 左键双击画布  |  放大视角 |
| 侧边栏双击节点  | 跳转到节点 |
| 滑动滚轮  | 放大缩小视角 |

</div>

#### 3D
<div align="center">

|  操作   |  效果  |
|  :----:  | :----:  |
| 左键画布  | 旋转视角 |
| 左键/右键节点  | 拖动节点 |
| 右键画布  | 平移视角 |
| 滑动滚轮  | 缩放视角 |

</div>

## 注意

如果你手动将 localStorage 中的数据删除后不能正常展示，请删除项目根目录下的 time.txt 文件后，重新运行命令行。