# eslint相关配置

```json
{
  "env": { // 运行环境
    "browser": true, // 浏览器
    "commonjs": true, // commonjs 模块化规范
    "es2021": true // ES12
  },
  "extends": [ // 检查规范
    "prettier" // prettier
  ],
  "parserOptions": { // 解析器
    "ecmaVersion": "latest"
  },
  "plugins": [ // 插件
    "react" // react
  ],
  "rules": {} // 规则
}
```



# prettier相关配置

```json
{
  "useTabs": true, // 允许使用 Tab 代替空格
  "tabSize": 2, // 一个 Tab 等于 2 个空格
  "semi": true, // 结尾使用分号
  "singleQuote": true, // 使用单引号代替双引号
  "trailingComma": "es5", // 只有 es5 中才在结尾加逗号
  "bracketSpacing": true, // 对象括号两边用逗号隔开
  "parser": "typescript" // 使用 ts 解析器
}
```

# 指令配置

```json
{
  // 通过 npm link 即可将该指令挂载到全局，g
  "bin": {
    "analyze-cli": "./bin/index.js"
  }
}
```

