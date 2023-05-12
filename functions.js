function loadXML(url) {let r=new XMLHttpRequest();r.open('GET',url,false);r.send(null);let p=new DOMParser();let dom=p.parseFromString(r.responseText,'text/xml');if(isParseError(dom)){document.getElementById('frame').appendChild(dom.children[0]);throw new Error('xmlparsing error')}else{return dom.children[0]}};
function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}
// code from https://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross
function isParseError(parsedDocument){var parser=new DOMParser(),errorneousParse=parser.parseFromString('<','application/xml'),parsererrorNS=errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;if(parsererrorNS==='http://www.w3.org/1999/xhtml'){return parsedDocument.getElementsByTagName("parsererror").length>0;}return parsedDocument.getElementsByTagNameNS(parsererrorNS,'parsererror').length>0;};
// THE title box. targets is array
function titleBox(targets) {
	let box = elt('div', {style: 'font-size:24px;border:10px solid #aaa;background-color:#fff;padding:5px;position:fixed;filter:opacity(0);transition:filter .1s;z-index:12345;'});
	for(let z = 0; z < targets.length; z++) {
		targets[z].addEventListener('mouseover', e => {
			box.innerText = targets[z].getAttribute('text');
			box.style.filter = 'opacity(1)';
		});
		targets[z].addEventListener('mouseout', e => {
			box.style.filter = 'opacity(0)';
		});
	};
	window.addEventListener('mousemove', e => {
		box.style.top = (e.clientY + 20) + 'px';
		box.style.left = (e.clientX + 20) + 'px';
	});
	return box;
}
// menu in every page
(function() {
	let menu = Array.from(document.getElementById('menu').children);
	let open = menu.shift().children[0]; // now open is the first element and menu contains the rest
	document.body.appendChild(titleBox(menu));
	open.addEventListener('click', e => {
		if(open.style.transform == 'rotate(540deg)') {
			open.style.transform = '';
			setTimeout(() => {
				for(let z = 0; z < menu.length; z++) {
					menu[z].style.display = 'none';
				}
			}, 250);
		} else {
			open.style.transform = 'rotate(540deg)';
			setTimeout(() => {
				for(let z = 0; z < menu.length; z++) {
					menu[z].style.display = 'block';
				}
			}, 250);
		}
	})
})();
