import React from 'react';

export const ItemsDispatch = React.createContext(null);

export function filename(path) {
    const ns = path.split('/');
    if (ns.length === 0) return '';
    return ns[ns.length - 1];
}

export function canScroll(elem) {
    const overflow = elem.style.overflow;
    return (overflow === 'visible' ||
	    overflow === '' ||
	    overflow === undefined)
};

export function toggleClassName(elem, name, adding) {
    const names = elem.className.trim().split(' ');
    const i = names.indexOf(name);
    if (adding && i > -1)
	return;
    
    if (i < 0) {
	names.push(name);
    } else {
	names.splice(i, 1);
    }
    elem.className = names.join(' ');
};

export function pageRect(rect) {
    if (rect === null) {
	return {
	    top: (window.scrollY + window.innerHeight / 2) + 'px',
	    left: (window.scrollX + window.innerWidth / 2) + 'px',
	    width: 0, height: 0,
	};
    }
    return {
	top: (window.scrollY + rect.y) + 'px',
	left: (window.scrollX + rect.x) + 'px',
	width: rect.width + 'px',
	height: rect.height + 'px',
    };
};

export function dimmed(title, rect) {
    if (rect === null) {
	return <div className="dimmed">{title}</div>;
    }
    return (
	<div
	    style={{
		width: rect.width + 'px',
		height: rect.height + 'px',
	    }}
	    className="dimmed"
	>{title}</div>
    );
};

export function src2className(src) {
    // ‘/foo/bar.svg’ => FooBarSvg
    return src.split('/').reduce((result, s) => {
	const _s = s.split('.').reduce((result, s) => {
	    return result + s.slice(0,1).toUpperCase() + s.slice(1);
	});
	return result + _s.slice(0,1).toUpperCase() + _s.slice(1);
    });
};

export function getSvgTitle(src) {
    const p = new Promise((resolve) => {
	const req = new XMLHttpRequest();
	req.onreadystatechange = () => {
	    if (req.readyState === XMLHttpRequest.DONE) {
		if (req.status === 200) {
		    const title = req.responseXML.querySelector('title');
		    if (title !== null) {
			resolve(title.textContent.trim());
		    } else {
			resolve('');
		    }
		} else {
		    resolve('');
		}
	    }
	};
	req.open('GET', src, true);
	req.send();
    });
    return p;
};


