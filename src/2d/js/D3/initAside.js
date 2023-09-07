import { highLight, updatePosition } from './render.js';

// 初始化侧边栏
export function asideInit(obj) {
	const selectLis = document.querySelectorAll('#aside .content li');
	const searchInput = document.querySelector('#search-input');
	let searchText = '';
	searchInput.value = ''; // 清空上次输入
	let cachedX, cachedY;

	// 输入防抖
	const debounce = (callback, delay) => {
		let timerId;
		return function () {
			clearTimeout(timerId);
			timerId = setTimeout(callback, delay);
		};
	};

	searchInput.addEventListener(
		'input',
		debounce(() => {
			searchText = searchInput.value;
			search();
		}, 300)
	);

	// 搜索
	const search = () => {
		selectLis.forEach((item) => {
			const itemText = item.textContent.toLowerCase();
			const isMatch = itemText.includes(searchText.toLowerCase());
			if (isMatch) {
				item.style.display = 'block';
				const subLis = item.querySelectorAll('ul li'); // 内层li标签可见
				subLis.forEach((subLi) => (subLi.style.display = 'inline-block'));
			} else {
				if (item.style.display == 'inline-block')
					item.style.display = 'block'; // 内层不隐藏
				else item.style.display = 'none';
			}
		});
	};

	const updateLi = (obj, item) => {
		obj.nodes.forEach((node) => {
			if (node.id == item) {
				cachedX = node.x;
				cachedY = node.y;
				updatePosition(node.index, cachedX, cachedY);
			}
		});
	};

	// 渲染依赖项
	selectLis.forEach((li) => {
		const ulElement = li.querySelector('ul');
		if (ulElement) {
			ulElement.addEventListener('click', (e) => e.stopPropagation()); // 阻止内部 ul 元素的事件冒泡和事件委托
		} else {
			li.addEventListener('dblclick', (e) => {
				const clickedNodeValue =
					e.target.dataset.nodeValue || e.target.textContent;
				let item = clickedNodeValue.replace(' - ', ' : ');
				updateLi(obj, item);
			});

			const hoverLi = (obj, item) => {
				obj.nodes.forEach((node) => {
					if (node.id == item) highLight(item);
				});
			};

			li.addEventListener('mouseover', (e) => {
				const clickedNodeValue =
					e.target.dataset.nodeValue || e.target.textContent;
				let item = clickedNodeValue.replace(' - ', ' : ');
				hoverLi(obj, item);
			});
			li.addEventListener('mouseout', () => highLight(null, true));
		}
	});
}
