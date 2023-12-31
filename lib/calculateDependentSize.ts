const remote = require('remote-file-size')
const jsYaml = require('js-yaml')
var fs = require('fs')

/**
 * 处理 npm 包
 * @param {Array} need - 生产环境的依赖
 * @param {Number} needLen - 依赖个数
 */
async function getNpmSizes(need: Array<string>, needLen: Number) {
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
 * @param {Array} need - 生产环境的依赖
 * @param {Number} needLen - 依赖个数
 */
async function getYarnSizes(need: Array<string>, needLen: Number) {
  const urlJSON = JSON.parse(fs.readFileSync('./node_modules/.yarn-integrity', 'utf8')).lockfileEntries
  const p = new Promise((resolve: Function, reject: Function) => {
    const sizeMap = new Map()
    Object.keys(urlJSON).forEach((item) => {
      if (need.includes(item.split('@')[0])) {
        const key = item.replace(/@(\^|~)?/i, ' : ')
        const remoteURL = urlJSON[item].slice(0, urlJSON[item].indexOf('tgz') + 3) // 远程地址
        remote(remoteURL.replace('yarnpkg', 'npmmirror'), (err: Error, size: number) => {
          if (err) reject(err)
          sizeMap.set(key, (size / 1024).toFixed(2) + 'kB')
          if (sizeMap.size === needLen) resolve(sizeMap)
        })
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
 * @param {Array} need - 生产环境的依赖
 * @param {Number} needLen - 依赖个数
 */
async function getPnpmSizes(need: Array<string>, needLen: Number) {
  try {
    const dependencies = jsYaml.load(fs.readFileSync('./pnpm-lock.yaml', 'utf8')).dependencies;
    const urlMap = new Map() // 远程地址

    for (const item of Object.keys(dependencies)) {
      const name = item
      const version = dependencies[item]['specifier'].replace(/\^|~/, '')
      if (need.includes(name)) {
        urlMap.set(name + ' : ' + version, "https://registry.npmmirror.com/" + name + /-/ + name + '-' + version + '.tgz')
        if (urlMap.size === needLen) break
      }
    }
    const p = new Promise((resolve, reject) => {
      const sizeMap = new Map() // 体积
      Array.from(urlMap.keys()).forEach(item => {
        remote(urlMap.get(item), (err: Error, size: number) => {
          if (err) reject(err)
          sizeMap.set(item, (size / 1024).toFixed(2) + 'kB')
          if (sizeMap.size === needLen) resolve(sizeMap)
        })
      })
    })
    let res;
    await p.then(val => {
      res = val
    }).catch(err => {
      throw err
    })
    return res;
  } catch (err) {
    throw err
  }
}

module.exports = async function (packageManagementTools: string) {
  const need = Object.keys(require(process.cwd().replace(/\\/g, '/') + '/package.json').dependencies || {})
  const needLen = need.length;
  if (needLen === 0) return new Map();

  const map: Map<string, Function> = new Map([
    ['npm', getNpmSizes],
    ['yarn', getYarnSizes],
    ['pnpm', getPnpmSizes]
  ]);

  let res;
  await map.get(packageManagementTools)!(need, needLen).then((val: Map<string, string>) => {
    res = val
  })
  return res;
}