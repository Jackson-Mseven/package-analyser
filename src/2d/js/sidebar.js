/**
 * 展示侧边栏
 * @param {Object} data - 版本信息
 */
export function showDepend(data) {
	const content = document.querySelector('#aside .content');
	const ulElement = content.querySelector('ul');
	if (ulElement) ulElement.parentNode.removeChild(ulElement);

	const ul = document.createElement('ul');
	for (let i in data) {
		const li = document.createElement('li');
		let version = data[i];
		if (Array.isArray(version)) {
			if (version.length == 1) {
				li.textContent = `${i} - ${version[0]}`;
				li.dataset.nodeValue = `${i} - ${version[0]}`;
				li.title = `${i} - ${version[0]}`; // 添加 title 属性
			} else {
				const span = document.createElement('span');
				span.textContent = i;
				li.appendChild(span);
				const ul2 = document.createElement('ul');
				for (let j in version) {
					const li2 = document.createElement('li');
					li2.textContent = version[j];
					li2.dataset.nodeValue = `${i} - ${version[j]}`;
					li2.title = `${i} - ${version[j]}`; // 添加 title 属性
					ul2.appendChild(li2);
				}
				li.appendChild(ul2);
			}
		} else {
			li.textContent = `${i} - ${version}`;
			li.title = `${i} - ${version}`; // 添加 title 属性
		}
		ul.appendChild(li);
	}
	content.appendChild(ul);
}

const arrow = document.querySelector('#aside div');
arrow.addEventListener('click', () => {
	const aside = document.querySelector('#aside');
	aside.classList.toggle('open');
	arrow.classList.toggle('arrow-open');
});
