# 介绍

Package-Analyze 是一个用于分析依赖的命令行工具，主要功能有：

1.  分析当前项目生产环境下的依赖关系
2.  分析当前项目开发环境下的依赖关系
3.  分析当前项目生产环境下的各依赖大小
4.  支持2D、3D展示依赖关系
5.  支持可视化展示依赖大小

# 使用

1.  解析TypeScrip

    ```bash
    tsc
    ```

3.  挂载命令

    ```bash
    npm link
    ```

4.  执行分析

    ```bash
    /**
     * @param { Integer | Infinity } depth：深度
     * @param { string } jsonFile：输出的 JSON 文件路径
     */
    analyze-cli analyze [depth] [jsonFile]
    ```

