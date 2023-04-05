const colors = {
	rust: '#a10000',
	bronze: '#a15000',
	gold: '#a1a100',
	gray: '#626262',
	olive: '#416600',
	jade: '#078446',
	teal: '#008282',
	cerulean: '#004182',
	indigo: '#0021cb',
	equius: '#000056',
	sparky: '#0cf',
	purple: '#440a7f',
	violet: '#6a006a',
	fuchsia: '#99004d',
	john: '#0715cd',
	jane: '#00d6f1',
	rose: '#b536da',
	roxy: '#ff6ff2',
	dave: '#e00707',
	dirk: '#f1a500',
	jade: '#4a7925',
	jake: '#1e9300'
};
let url = new URLSearchParams(window.location.search);
let allPages = loadXML(local.xml).children;

class Page {
	constructor(num) {
		this.num = num;
		this.prevNum = this.num - 1;
		this.nextNum = this.num + 1;
		// 这个脚注写得我满脸狼狈
		this.ftn = elt('ol');
		this.footnote = elt('div', {id: 'footnote'}, this.ftn);
		this.ftnCount = 0;
		try {
			this.getDom();
			this.getSwitchLang();
			this.getCommand();
			// compromise for spoilers
			this.div = this.getContent(this.dom.children[1]); // the "content" tag
			this.getLink();
			this.getControls();
			this.eventListeners();
			this.appendStuff();
		} catch(e) { // page number larger than largest page number
			console.log(e);
			this.getControls();
			let f = document.getElementById('frame');
			f.appendChild(elt('div', {id: 'content'}, elt('p', {}, 'An error occured. Maybe because this page number does not exist yet. Maybe because the stupid author made a typo. Check console.')));
			f.appendChild(this.controls);
		}
	}
	para(d, dom) {
		let c = dom.childNodes;
		for(let z = 0; z < c.length; z++) {
			if(c[z].tagName) { // if it has something special, not a text node
				if(c[z].tagName == 'ftn') {
					this.ftnCount++;
					this.ftn.appendChild(elt('li', {id: `ftn-${this.ftnCount}`}, String(c[z].firstChild.nodeValue)));
					d.appendChild(elt('sup', {}, elt('a', {href: `#ftn-${this.ftnCount}`}, String(this.ftnCount))));
				} else {
					let d1;
					if(c[z].tagName == 'a') {
						d1 = elt('a', {href: c[z].getAttribute('href')});
					} else {
						d1 = elt('span');
						switch(c[z].tagName) {
							case 'c': // color
								d1.style.color = colors[c[z].getAttribute('c')] || c[z].getAttribute('c');
								break;
							case 's': // size
								d1.style.fontSize = c[z].getAttribute('s');
								break;
							case 'i': // italic
								d1.style.fontStyle = 'italic';
								break;
							case 'u': // underline
								d1.style.textDecoration = 'underline';
								break;
							case 'st': // strikethrough
								d1.style.textDecoration = 'line-through';
								break;
							case 'w': // weight
								d1.style.fontWeight = c[z].getAttribute('w');
								break;
							case 'cap': // all caps
								d1.style.textTransform = 'uppercase';
								break;
							default:
								throw new Error(`whoops sorry tag name ${c[z].tagName} not supported`);
						}
					};
					d.appendChild(this.para(d1, c[z]));
				}
			} else { // if its a text node
				d.appendChild(c[z]);
				z--;
			}
		}
		return d;
	}
	dialog(dom) {
		let t = elt('table', {className: 'dialog'});
		let c = dom.children;
		for(let z = 0; z < c.length; z++) {
			t.appendChild(elt('tr',
				{style: `color: ${colors[c[z].getAttribute('c')] || c[z].getAttribute('c')}`},
				this.para(elt('td', {className: 'dialog-speaker'}), c[z].children[0]),
				elt('td', {className: 'dialog-speaker'}, local.colon),
				this.para(elt('td', {className: 'dialog-line'}),
				c[z].children[1])));
		}
		return t;
	}
	spoiler(dom) {
		let button = elt('button', {}, dom.getAttribute('text'));
		let cont = this.getContent(dom);
		button.addEventListener('click', e => {
			console.log(document.body.scrollHeight);
			if(cont.style.display == 'block') {
				cont.style.display = 'none';
			} else {
				cont.style.display = 'block';
			}
		});
		return elt('div', {className: 'spoiler'}, button, cont);
	}
	goToPage(num) {
		window.location.href = `?page=${num}`;
	}
	getDom() {
		this.dom = findPage(this.num);
	}
	getSwitchLang() {
			this.switchLang = elt('div', {id: 'switch-lang'},
				elt('a', {href: `${local.href}/?page=${this.num}`}, local.switchLang));
	}
	getCommand() {
		this.command = elt('div', {id: 'command'},
			this.dom.children[0].firstChild ? this.dom.children[0].firstChild.nodeValue : '======->');
	}
	getContent(dom) {
		let q = dom.children;
		let div = elt('div', {id: 'content'});
		for(let z = 0; z < q.length; z++) {
			switch(q[z].tagName) {
				case 'img':
					div.appendChild(elt('div',
						{className: 'panel'},
						elt('img', {src: q[z].firstChild.nodeValue, title: q[z].getAttribute('alt') || ''})));
					break;
				case 'p':
					let d = elt('div', {className: 'p'});
					div.appendChild(this.para(d, q[z]));
					break;
				case 'br':
					div.appendChild(elt('br'));
				case 'log':
					div.appendChild(this.dialog(q[z]));
					break;
				case 'spoiler':
					div.appendChild(this.spoiler(q[z]));
					break;
				default:
					throw new Error(`dang it tag name "${q[z].tagName}" isnt supported sorry`);
			}
		}
		return div;
	}
	getLink() {
		let q = findPage(this.nextNum);
		if(q) this.link = elt('div', {id: 'link'},
			'> ',
			elt('a', {href: `?page=${this.nextNum}`},
				q.children[0].firstChild ? q.children[0].firstChild.nodeValue : '======->'));
		else this.link = 0;
	}
	getLoadAndSaveButtons() {
		this.saveButton = elt('a', {}, local.save);
		this.loadButton = elt('a', {}, local.load);
		this.saveButton.addEventListener('click', e => {
			window.localStorage.setItem('place', this.num);
			alert('place saved!');
		});
		this.loadButton.addEventListener('click', e => {
			let storage = window.localStorage.getItem('place');
			if(storage) window.location.href = `?page=${storage}`;
			else alert(local.saveAlert);
		});
	}
	getControls() {
		this.getLoadAndSaveButtons();
		this.controls = elt('div', {id: 'controls'},
			elt('a', {href: `?page=${this.prevNum}`}, local.goBack),
			elt('span', {style: 'font-weight: bold;'}, ' | '),
			elt('a', {href: `?page=1`}, local.startOver),
			elt('span', {style: 'font-weight: bold;'}, ' | '),
			this.saveButton,
			elt('span', {style: 'font-weight: bold;'}, ' | '),
			this.loadButton);
	}
	eventListeners() {
		document.body.addEventListener('keydown', e => {
			if(e.keyCode == 37 && findPage(this.prevNum)) // left arrow
				this.goToPage(this.prevNum);
			if(e.keyCode == 39 && findPage(this.nextNum)) // right arrow
				this.goToPage(this.nextNum);
		});
	}
	appendStuff() {
		let f = document.getElementById('frame');
		f.appendChild(this.switchLang);
		f.appendChild(this.command);
		f.appendChild(this.div);
		if(this.link) f.appendChild(this.link);
		if(this.ftnCount) f.appendChild(this.footnote);
		f.appendChild(this.controls);
	}
}
let page = new Page(Number(url.get('page')) || 1);
