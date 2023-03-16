// first get info
let content = document.getElementById('content');
let allPages = loadXML(local.xml).children;
let log = [], flag = true;
for(let z = allPages.length - 1; z >= 0; z--) {
	log.push({
		num: z + 1,
		command: allPages[z].children[0].firstChild ? allPages[z].children[0].firstChild.nodeValue : '======->'
	});
}
// then append stuff
let oldToNew = elt('a', {className: 'old-to-new'}, local.old2new);
content.appendChild(oldToNew);
let logAsc = elt('ol', {className: 'log-div', style: 'display: none;'});
let logDsc = elt('ol', {className: 'log-div', reversed: 1});
for(let z = log.length - 1; z >= 0; z--) {
	logAsc.appendChild(elt('li', {className: 'log-page'}, elt('a', {href: `../?page=${log[z].num}`}, log[z].command)));
}
for(let z = 0; z < log.length; z++) {
	logDsc.appendChild(elt('li', {className: 'log-page'}, elt('a', {href: `../?page=${log[z].num}`}, log[z].command)));
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
