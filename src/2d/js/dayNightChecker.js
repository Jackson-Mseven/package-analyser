const mode = document.querySelector('#mode');

/**
 * 切换日/夜间模式
 * @param {Boolean} init - 日/夜间
 */
function changedMode(init = true) {
  const body = document.body;

  if (init) {
    body.classList.toggle('dark');
  } else if (!init && localStorage.getItem('mode') == 'dark') {
    body.classList.add('dark'); //初始化时保存的是夜间模式更新背景色
  }

  if (body.classList.contains('dark')) {
    mode.innerHTML = '白天模式';
  } else {
    mode.innerHTML = '夜间模式';
  }

  const status = document.querySelector('.status');
  const computedStyle = getComputedStyle(document.body);
  status.style.color = computedStyle.getPropertyValue('--status-color');
};

mode.addEventListener('click', () => {
  if (localStorage.getItem('mode') == 'dark') {
    localStorage.setItem('mode', 'day');
  } else if (localStorage.getItem('mode') == 'day') {
    localStorage.setItem('mode', 'dark');
  }
  changedMode(true, mode);
});