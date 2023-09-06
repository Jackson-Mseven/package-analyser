/**
 * 调用接口获取数据
 * @return {Promise} dataPromise - 数据
 */
export async function getData() {
  let res;
  await axios
    .get('http://localhost:5005/getData')
    .then((val) => {
      res = JSON.parse(JSON.stringify(val.data));
    })
    .catch((err) => {
      throw err;
    });
  return res;
}