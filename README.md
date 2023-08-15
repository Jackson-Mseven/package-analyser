# 介绍

package-analysis 是一个简单易用的分析依赖以及依赖体积的工具。

# 使用

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

    
