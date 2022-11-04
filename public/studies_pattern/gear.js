
(function(g) {
    const indexes = {
        buffer: [],
        setCount: function(c) {
            for (let i=0; i<c; i++) {
                indexes.buffer[i] = i
            }
        },
        select: function() {
            let i = Math.floor(Math.random() * indexes.buffer.length)
            let r = indexes.buffer[i]
            indexes.buffer.splice(i, 1)
            return r ? r : 0
        }
    }
    g.addEventListener("DOMContentLoaded", function() {
        const selector = "g[clip-path='url(#clip-gear)'] rect";
        const paths = document.querySelectorAll(selector);
	const patterns = document.querySelectorAll('svg>defs>pattern');
        indexes.setCount(patterns.length);
        paths.forEach(function(element) {
            const v = "url(#gear_bg_pattern_" + indexes.select() + ")"
            element.setAttribute("fill", v)
        })
    }, false)
})(this);

function App(d) {
    const selG = 'g[clip-path="url(#clip-gear)"] '
    const trigs = d.querySelectorAll(selG + 'animate[id^=anim]')
    const rects = d.querySelectorAll(selG + '>rect')

    this.triggers = Array.prototype.filter.call(trigs, function(node) {
	return node.id.slice(-1) == 'R'
    });
    this.gearRotation = d.querySelector('#gearRotation');
    this.firstTrigger = d.querySelector(selG + '#anim0F');
    this.rects = Array.prototype.slice.call(rects);

    const colors = this.rects.reduce(function(acc, rect) {
	const n = rect.getAttribute('fill').slice(-2, -1) * 1;
	acc.push(n);
	return acc;
    }, []);
    const ptns = [0,1,2,3];
    let pid = ptns.pop();
    while (1) {
	if (colors.indexOf(pid) == -1) break;
	pid = ptns.pop();
    }
    this.exColor = pid;

    this.readyState = 0;
    this.offsetTimerId;
}

App.prototype.updateFills = function(id) {
    let updates;
    switch (id) {
    case 0: updates = [this.rects[1], this.rects[2]]; break;
    case 1: updates = [this.rects[0], this.rects[2]]; break;
    case 2: updates = [this.rects[0], this.rects[1]]; break;
    case 3: updates = [this.rects[0], this.rects[2]];
    }
    
    let out, save;
    if (Math.random() > 0.5) {
	out = 0;
	save = 1;
    } else {
	out = 1;
	save = 0;
    }
    const saved = updates[save].getAttribute('fill').slice(-2, -1) * 1;
    const outed = updates[out].getAttribute('fill').slice(-2, -1) * 1;
    const fill = 'url(#gear_bg_pattern_';

    updates[out].setAttribute('fill', fill + saved + ')');
    updates[save].setAttribute('fill', fill + this.exColor + ')');

    this.exColor = outed;
};

App.prototype.endFormerAnim = function(anim) {
    const id = anim.id.slice(-2, -1) * 1;
    this.updateFills(id);

    const nextId = 'anim' + id + 'R';
    let i = 0;
    for (; i<this.triggers.length; ++i) {
	if (this.triggers[i].id == nextId) break;
    }
    const next = this.triggers[i];

    setTimeout(function() {
	next.beginElement();
    }, 1000);
}

App.prototype.startAnimation = function() {
    // this.readyState
    //   0: init
    //   1: waiting
    //   2: start
    if (this.readyState === 2) return;
    this.readyState = 2;
    this.firstTrigger.beginElement();
    this.gearRotation.beginElement();
}

function Main(state) {
    if (this.gearApp == undefined) {
	this.gearApp = new App(document)
    }

    if (state === 'loaded'
	&& this.gearApp.offsetTimerId === undefined
	&& this.gearApp.readyState === 0) {
	this.gearApp.readyState = 1;
	this.gearApp.offsetTimerId = setTimeout(() => {
	    this.gearApp.startAnimation();
	}, 1500);
    } else if (state === 'start') {
	if (this.gearApp.readyState === 1) {
	    clearTimeout(this.gearApp.offsetTimerId);
	}
	this.gearApp.startAnimation();
    }
}

addEventListener('message', (e) => {
    if (e.origin === this.origin && (e.data === 'loaded' || e.data === 'start')) {
	Main(e.data);
    }
});
