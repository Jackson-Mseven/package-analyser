const remote = require('remote-file-size')
var fs = require('fs')
const need = Object.keys(require(process.cwd().replace(/\\/g, '/') + '/package.json').dependencies)
const needLen = need.length;

/**
 * 处理 npm 包
 */
async function getNpmSizes() {
  const packages = require(process.cwd().replace(/\\/g, '/') + '/node_modules/.package-lock.json').packages
  const urlMap = new Map()
  for (const key of Object.keys(packages)) {
    const arr = key.split('node_modules/')
    const mapKey = arr[arr.length - 1]
    if (need.includes(mapKey)) {
      urlMap.set(mapKey + ' : ' + packages[key].version, packages[key].resolved)
      need.splice(need.indexOf(mapKey), 1)
      if (urlMap.size === needLen) break;
    }
  }

  const p = new Promise((resolve: Function, reject: Function) => {
    const sizeMap: Map<string, string> = new Map();
    Array.from(urlMap.keys()).forEach((item: string) => {
      remote(urlMap.get(item).replace('npmjs.org', 'npmmirror.com'), (err: Error, size: number) => {
        if (err) reject(err);
        sizeMap.set(item, (size / 1024).toFixed(2) + 'kB')
        if (sizeMap.size === urlMap.size) resolve(sizeMap)
      })
    })
  })
  let res
  await p.then(val => {
    res = val
  }).catch((err: Error) => {
    throw err;
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
      if (need.includes(item.split('@')[0])) {
        const key = item.replace(/@(\^|~)?/i, ' : ')
        remote(urlJSON[item], (err: Error, size: number) => {
          if (err) reject(err)
          sizeMap.set(key, (size / 1024).toFixed(2) + 'kB')
          if (sizeMap.size === needLen) resolve(sizeMap)
        })
        need.splice(need.indexOf(item.split('@')[0]), 1)
      }
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
    const len = need.length;
    for (let i = 0; i < arr.length - 1; i++) {
      const nameStartIndex = arr[i].lastIndexOf('registry.npmmirror.com/')
      const nameEndIndex = arr[i].slice(nameStartIndex).indexOf(':') + nameStartIndex
      const urlIndex = arr[i + 1].indexOf('}')
      const nameNoVersion = arr[i].slice(nameStartIndex + 23, nameEndIndex).split('@')[0]
      if (need.includes(nameNoVersion)) {
        const name = arr[i].slice(nameStartIndex + 23, nameEndIndex).replace(/@(\^|~)?/i, ' : ') // 包名
        const url = arr[i + 1].slice(0, urlIndex) // 地址
        remote(url, (err: Error, size: number) => {
          if (err) reject(err)
          sizeMap.set(name, (size / 1024).toFixed(2) + 'kB')
          if (sizeMap.size === needLen) resolve(sizeMap)
        })
        need.splice(need.indexOf(nameNoVersion), 1)
      }
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