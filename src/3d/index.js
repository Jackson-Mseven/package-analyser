let graph;

const getData = (flag) => {
  // 渲染数据
  const render = (data) => {
    if (graph) graph.graphData(null); // 清理先前的图形实例

    const graphData = JSON.parse(data); // 序列化
    graph = ForceGraph3D()(document.querySelector('#graph-3d'))
      .graphData(graphData)
      .linkDirectionalArrowLength(4) // 箭头长度
      .linkDirectionalArrowRelPos(1) // 箭头位置偏移 source指向target
      .linkDirectionalParticles('value')
      .linkDirectionalParticleSpeed((d) => d.value * 0.005)
      .linkAutoColorBy((d) => d.source);
  };
  if (flag == 1) render(sessionStorage.getItem('dependHash'));
  else if (flag == 2) render(sessionStorage.getItem('devPendHash'));

  if (!localStorage.getItem('mode')) localStorage.setItem('mode', 'day');
  else changedMode(false);
};

const mode = document.querySelector('#mode');
const changedMode = (init = true) => {
  let body = document.body;

  if (localStorage.getItem('mode') == 'day') {
    mode.innerHTML = '夜间模式';
    graph
      .graphData(JSON.parse(sessionStorage.getItem('dependHash')))
      .backgroundColor(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--background-color-day'
        )
      )
      .linkOpacity(
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--link-opacity-day'
          )
        )
      )
      .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--node-color-day');
        sprite.textHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--node-text-height'
          )
        );
        return sprite;
      });
  } else if (localStorage.getItem('mode') == 'dark') {
    mode.innerHTML = '白天模式';
    graph
      .backgroundColor(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--background-color-dark'
        )
      )
      .linkOpacity(
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--link-opacity-dark'
          )
        )
      )
      .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--node-color-dark');
        sprite.textHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--node-text-height'
          )
        );
        return sprite;
      });
  }

  if (init) {
    body.classList.toggle('dark');
  } else if (!init && localStorage.getItem('mode') == 'dark') {
    body.classList.add('dark');
  }
};

mode.addEventListener('click', () => {
  if (localStorage.getItem('mode') == 'dark') {
    localStorage.setItem('mode', 'day');
  } else if (localStorage.getItem('mode') == 'day') {
    localStorage.setItem('mode', 'dark');
  }
  changedMode();
});

const dependencies = document.querySelector('#dependencies');
const devDependencies = document.querySelector('#devDependencies');

let flag = 1;

const toggleMode = (el) => el.classList.add('active');
toggleMode(dependencies);

dependencies.addEventListener('click', () => {
  if (flag == 2) {
    devDependencies.classList.remove('active');
    toggleMode(dependencies);
    flag = 1;
    graph.graphData(JSON.parse(sessionStorage.getItem('dependHash'))); // 加载数据
  }
});

devDependencies.addEventListener('click', () => {
  if (flag == 1) {
    dependencies.classList.remove('active');
    toggleMode(devDependencies);
    flag = 2;
    graph.graphData(JSON.parse(sessionStorage.getItem('devPendHash'))); // 加载数据
  }
});



const size = document.querySelector('#size');
size.addEventListener('click', () => (location.href = '../size/index.html'));

getData(1);
