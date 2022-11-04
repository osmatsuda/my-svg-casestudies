'use strict';

function App() {
    this.trigger = document.querySelector('#trigger');
    this.vh = 0;
    this.vw = 0;
    this.cols = document.querySelectorAll('clipPath>path')

    this.colsLastAnimateVals = []; // [values, ...]
    this.cols.forEach((col, i) => {
	this.colsLastAnimateVals[i] = col.getAttribute('d');
    });
    this.table = [];		   // [col[svg[animate, ...], ...], ...]
    this.rowsLastAnimateVals = []; // [[{prop: value}, ...], ...]

    const cols = document.querySelectorAll('g[id|=col]');
    cols.forEach((col) => {
	const rows = [];
	const rects = [];
	col.querySelectorAll('svg').forEach((svg) => {
	    const params = {};
	    const names = 'y height font-size viewBox'.split(' ');
	    names.forEach((name) => {
		params[name] = svg.getAttribute(name);
	    });
	    const animates = svg.querySelectorAll('animate');
	    const textAnimate = animates[animates.length - 1];
	    params['text-start-y'] = textAnimate.parentNode.getAttribute('y');

	    rows.push(params);
	    rects.push(animates);
	});
	this.rowsLastAnimateVals.push(rows);
	this.table.push(rects);
    });

    this.tspans = [];		// [col[text[tspan,tspan], ...], ...]
    cols.forEach((col) => {
	const _col = [];
	let tpl = [];
	col.querySelectorAll('tspan').forEach((tspan, i) => {
	    tpl.push(tspan);
	    if (i%2 === 1) {
		_col.push(tpl);
		tpl = [];
	    }
	});
	this.tspans.push(_col);
    });
    this.tspans.forEach((col) => {
	col.forEach((text) => {
	    text[0].textContent = this.randomSelects([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).join('');
	});
    });
    
    this.resized = true;
    this.trigger.addEventListener('endEvent', (e) => {
	setTimeout(() => {
	    this.begin();
	}, 100);
    });
    window.addEventListener('resize', () => {
	this.resized = true;
    });
}

App.prototype = {
    randomSelects(src) {
	const result = [];
	while (src.length > 0) {
	    const i = Math.floor(Math.random() * src.length);
	    result.push(src[i]);
	    src.splice(i, 1);
	}
	return result;
    },
    randomSegs(count, min, max) {
	let segs = [];
	let i=0;
	for (; i<count; i++) {
	    segs.push(min + (max - min * (count - 1)) * Math.random());
	}
	let total = segs.reduce((a,b) => a+b);
	
	while (1) {
	    const diff = max - total;
	    if (diff > 0) {
		segs = segs.map((seg) => {
		    if (seg < max - min * count) {
			total += 1;
			return seg + 1;
		    }
		    return seg;
		});
	    } else if (diff < 0) {
		segs = segs.map((seg) => {
		    if (seg > min) {
			total -= 1;
			return seg - 1;
		    }
		    return seg;
		});
	    }
	    const _diff = max - total;
	    if (diff * _diff <= 0) {
		break;
	    }
	}

	return segs.reduce((ps, seg, i) => {
	    if (i == 0) {
		ps.push(Math.floor(seg));
	    } else if (i < count-1) {
		ps.push(Math.floor(ps[i] + seg));
	    } else {
		ps.push(max);
	    }
	    return ps;
	}, [0]);
    },
    randomColsSegs() {
	const count = this.cols.length;
	const min = this.vw / count * .5;
	return this.randomSegs(count, min, this.vw);
    },
    colAnimateValues(idx, uprSegs, lwrSegs) {
	let s = this.colsLastAnimateVals[idx] + ';M';
	s += `${uprSegs[idx]},0 ${uprSegs[idx+1]},0 `;
	s += `${lwrSegs[idx+1]},${this.vh} ${lwrSegs[idx]},${this.vh}Z`
	return s;
    },
    setupColParams() {
	const uprSegs = this.randomColsSegs();
	const lwrSegs = this.randomColsSegs();
	this.cols.forEach((col, i) => {
	    const animate = col.querySelector('animate');
	    const values = this.colAnimateValues(i, uprSegs, lwrSegs);
	    animate.setAttribute('values', values);
	    this.colsLastAnimateVals[i] = values.split(';')[1];
	});
    },
    setupRowParams() {
	const count = this.table[0].length;
	const min = this.vh / count * .5;
	this.table.forEach((col, colIdx) => {
	    const segs = this.randomSegs(count, min, this.vh);
	    col.forEach((rect, rowIdx) => {
		rect.forEach((animate) => {
		    const name = animate.getAttribute('attributeName');
		    const prev = this.rowsLastAnimateVals[colIdx][rowIdx][name];
		    const y = segs[rowIdx];
		    const height = segs[rowIdx+1] - segs[rowIdx];
		    if (name === 'y') {
			if (animate.parentNode.nodeName.toLowerCase() === 'text') {
			    const prevH = this.rowsLastAnimateVals[colIdx][rowIdx]['text-start-y'];
			    animate.setAttribute('values', `${prevH};${height}`);
			    this.rowsLastAnimateVals[colIdx][rowIdx]['text-start-y'] = height;
			} else {
			    animate.setAttribute('values', `${prev};${y}`);
			    this.rowsLastAnimateVals[colIdx][rowIdx][name] = y;
			}
		    } else if (name === 'viewBox') {
			const vb = `0 0 1500 ${height}`;
			animate.setAttribute('values', `${prev};${vb}`);
			this.rowsLastAnimateVals[colIdx][rowIdx][name] = vb;
		    } else {
			animate.setAttribute('values', `${prev};${height}`);
			this.rowsLastAnimateVals[colIdx][rowIdx][name] = height;
		    }
		});
	    });
	});
    },
    randomClassNames() {
	this.tspans.forEach((col) => {
	    const names = this.randomSelects(['black', 'roman', 'cloock', 'type', 'script']);
	    if (col[col.length - 1][0].getAttribute('class') === names[names.length - 1]) {
		names.unshift(names.pop());
	    }
	    col.forEach((text, i) => {
		if (text[0].getAttribute('class') === names[0]) {
		    names.push(names.shift());
		}
		text[1].setAttribute('class', names.shift());
	    });
	});
    },
    shiftAndPushNumber(offset) {
	const p = new Promise((resolve) => {
	    let count = 0;
	    this.tspans.forEach((col) => {
		col.forEach((text) => {
		    count += 1;
		    setTimeout(() => {
			const h = text[0].textContent[0];
			const tail = text[0].textContent.slice(1);
			text[0].textContent = tail;
			text[1].insertAdjacentText('beforeend', h);
			count -= 1;
			if (count === 0) {
			    resolve();
			}
		    }, offset);
		});
	    });
	});
	return p;
    },
    async reflow() {
	this.randomClassNames();
	let offset = 500;
	while (this.tspans[0][0][0].textContent.length > 0) {
	    await this.shiftAndPushNumber(offset);
	    offset *= 0.8;
	}
	this.tspans.forEach((col) => {
	    col.forEach((text) => {
		text[0].setAttribute('class', text[1].getAttribute('class'));
		text[0].textContent = text[1].textContent;
		text[1].textContent = '';
	    });
	});
	return;
    },
    begin() {
	if (!!this.resized) {
	    this.resetSize();
	}
	this.setupColParams();
	this.setupRowParams();

	this.reflow().then(() => {
	    this.trigger.beginElement();
	});
    },
    resetSize() {
	const vb = document.rootElement.getAttribute('viewBox').split(' ');
	this.vh = parseInt(vb[3]);
	this.vw = parseInt(vb[2]);
	this.resized = false;
    },
};

function main() {
    const app = new App();
    app.begin();
}

function tests() {
    const app = new App();
    let n = 0;
    let sum = [0,0,0,0,0];
    while (++n < 1000) {
	const segs = app.randomSegs(5, 150, 1500);
	const segs_r = segs.reduce((acc, y, i, src) => {
	    if (i == 0) {
		acc.push(y);
	    } else {
		acc[i-1] = y - acc[i-1];
		if (i != src.length - 1) {
		    acc.push(y)
		}
	    }
	    return acc;
	}, []);
	sum = segs_r.map((y, i) => y + sum[i]);
    }
    console.log(sum.map((ys) => ys/n));
}

const trigger = {
    readyState: 0,
    offsetTimerId: undefined,
    main(state) {
	if (state === 'loaded' && this.offsetTimerId === undefined && this.readyState === 0) {
	    this.readyState = 1;
	    this.offsetTimerId = setTimeout(() => {
		main();
	    }, 1500);
	} else if (state === 'start') {
	    if (this.readyState === 1) {
		clearTimeout(this.offsetTimerId);
	    }
	    main();
	}
    },
};

addEventListener('message', (e) => {
    if (e.origin === this.origin && (e.data === 'loaded' || e.data === 'start')) {
	trigger.main(e.data);
    }
});
main();
