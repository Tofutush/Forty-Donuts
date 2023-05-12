testFlag = false;

// first get info
let content = document.getElementById('content');
let allPages = loadXML(local.xml).children;
let log = [], flag = true;
for(let z = allPages.length - 1; z >= 0; z--) {
	let date = allPages[z].getAttribute('date');
	let comm = allPages[z].children[0].firstChild ? allPages[z].children[0].firstChild.nodeValue : '======->';
	if(date || testFlag)
		log.push({
			num: allPages[z].getAttribute('num'),
			date: date + ' ',
			command: comm,
			class: comm[1] == 'F' ? 'flash' : '',
		});
}
console.log(log);
// then append stuff
let oldToNew = elt('a', {className: 'old-to-new'}, local.old2new);
content.appendChild(oldToNew);
let logAsc = elt('ul', {style: 'display: none;'});
let logDsc = elt('ul',);
for(let z = log.length - 1; z >= 0; z--) {
	logAsc.appendChild(elt('li',
		{},
		elt('span', {className: 'date'}, log[z].date),
		elt('a', {href: `../?page=${log[z].num}`, className: log[z].class}, log[z].command)));
}
for(let z = 0; z < log.length; z++) {
	logDsc.appendChild(elt('li',
		{},
		elt('span', {className: 'date'}, log[z].date),
		elt('a', {href: `../?page=${log[z].num}`, className: log[z].class}, log[z].command)));
}
content.appendChild(logAsc);
content.appendChild(logDsc);
// old to new function
oldToNew.addEventListener('click', e => {
	if(flag) { // asc
		logAsc.style.display = 'block';
		logDsc.style.display = 'none';
		oldToNew.innerText = local.new2old;
	} else { // desc
		logDsc.style.display = 'block';
		logAsc.style.display = 'none';
		oldToNew.innerText = local.old2new;
	}
	flag = !flag;
});
