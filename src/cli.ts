// 导入所需的功能模块
import { analyze } from './analyze'
import { render } from './renderer'

// 解析命令行参数
const args = process.argv.slice(2)
const command = args[0]

// 根据命令调用相应的功能模块
if (command === 'analyze') {
  analyze()
} else if (command === 'render') {
  render()
} else {
  console.log('Unknown command.')
}
