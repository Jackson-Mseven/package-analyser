# package-analysis
## 介绍

package-analysis 是一个简单易用的分析依赖以及依赖体积的工具。

## 使用

1.  挂载命令行

    ```bash
    npm link
    ```

2.  使用命令行

    ```bash
    /**
     * @param { number } depth：依赖的深度
     * @param { string } jsonFile：要输出的JSON文件的路径
     */
    analyze-cli analyze [depth] [jsonFile]
    ```

## 依赖图使用
### 2D
<style>
.center
{
  width: auto;
  display: table;
  margin-left: auto;
  margin-right: auto;
}
</style>

<div class="center">

|  操作   |  效果  |
|  :----:  | :----:  |
| 左键节点  |  拖动节点 |
| 左键画布  |  平移视角 |
| 左键双击画布  |  放大视角 |
| 侧边栏双击节点  | 跳转到节点 |
| 滑动滚轮  | 放大缩小视角 |

</div>


### 3D

<style>
.center
{
  width: auto;
  display: table;
  margin-left: auto;
  margin-right: auto;
}
</style>

<p align="center"><font face="黑体" size=2.>表1 示例表格</font></p>

<div class="center">

|  操作   |  效果  |
|  :----:  | :----:  |
| 左键画布  | 旋转视角 |
| 左键/右键节点  | 拖动节点 |
| 右键画布  | 平移视角 |
| 滑动滚轮  | 缩放视角 |

</div>