const remote = require('remote-file-size')

/**
 * 处理 npm 包
 */
async function getNpmSizes() {
  const packages = require(process.cwd().replace(/\\/g, '/') + '/node_modules/.package-lock.json').packages
  const urlMap = new Map()
  for (const key of Object.keys(packages)) {
    const arr = key.split('node_modules/')
    const mapKey = arr[arr.length - 1]
    urlMap.set(mapKey + ' : ' + packages[key].version, packages[key].resolved)
  }

  const p = new Promise((resolve: Function, reject: Function) => {
    const sizeMap: Map<string, string> = new Map();
    Array.from(urlMap.keys()).forEach((item: string) => {
      remote(urlMap.get(item), (err: Error, size: number) => {
        if (err) reject('获取依赖体积失败了');
        sizeMap.set(item, (size / 1024).toFixed(2) + 'kB')
        if (sizeMap.size === urlMap.size) resolve(sizeMap)
      })
    })
  })
  let res
  await p.then(val => {
    res = val
  }).catch((err: Error) => {
    throw err
  })
  return res
}

/**
 * 处理 yarn 包
 */
async function getYarnSizes() {
  const urlJSON = JSON.parse(fs.readFileSync('./node_modules/.yarn-integrity', 'utf8')).lockfileEntries
  const p = new Promise((resolve: Function, reject: Function) => {
    const sizeMap = new Map()
    Object.keys(urlJSON).forEach((item, index) => {
      const key = item.replace(/@(\^|~)?/i, ' : ')
      remote(urlJSON[item], (err: Error, size: number) => {
        if (err) reject('获取依赖体积失败了')
        sizeMap.set(key, (size / 1024).toFixed(2) + 'kB')
        if (index === Object.keys(urlJSON).length - 1) {
          resolve(sizeMap)
        }
      })
    })
  })
  let res
  await p.then(val => {
    res = val
  }).catch((err: Error) => {
    throw err
  })
  return res
}

/**
 * 处理 pnpm 包
 */
async function getPnpmSizes() {
  const message = fs.readFileSync('./pnpm-lock.yaml', 'utf8')
  const packages = message.split('packages:')[1]
  const arr = packages.split('tarball: ')
  const p = new Promise((resolve: Function, reject: Function) => {
    const sizeMap = new Map();
    for (let i = 0; i < arr.length - 1; i++) {
      const nameStartIndex = arr[i].lastIndexOf('registry.npmmirror.com/')
      const nameEndIndex = arr[i].slice(nameStartIndex).indexOf(':') + nameStartIndex
      const urlIndex = arr[i + 1].indexOf('}')
      const name = arr[i].slice(nameStartIndex + 23, nameEndIndex).replace(/@(\^|~)?/i, ' : ') // 包名
      const url = arr[i + 1].slice(0, urlIndex) // 地址
      remote(url, (err: Error, size: number) => {
        if (err) reject('获取依赖体积失败了')
        sizeMap.set(name, (size / 1024).toFixed(2) + 'kB')
        if (i === arr.length - 2) {
          resolve(sizeMap)
        }
      })
    }
  })
  let res
  await p.then(val => {
    res = val
  }).catch(err => {
    throw err
  })
  return res
}

module.exports = async function (packageManagementTools: string) {
  const map: Map<string, Function> = new Map([
    ['npm', getNpmSizes],
    ['yarn', getYarnSizes],
    ['pnpm', getPnpmSizes]])
  let res;
  await map.get(packageManagementTools)!().then((val: Map<string, string>) => {
    res = val
  })
  return res;
}