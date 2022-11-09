const trigger = {
    readyState: 0,
    offsetTimerId: undefined,
    main(state) {
	if (state === 'loaded' && this.offsetTimerId === undefined && this.readyState === 0) {
	    this.readyState = 1;
	    this.offsetTimerId = setTimeout(() => {
		this.start();
	    }, 1500);
	} else if (state === 'start') {
	    if (this.readyState === 1) {
		clearTimeout(this.offsetTimerId);
	    }
	    this.start();
	}
    },
    start() {
	if (this.readyState === 2) return;
	this.readyState = 2;

	if (location.pathname.endsWith('/drain.svg')) {
	    this.drain();
	} else if (location.pathname.endsWith('/camo.svg')) {
	    this.camo();
	}
    },
    drain() {
	const sel = 'animate[data-start], animateTransform[data-start]';
	document.querySelectorAll(sel).forEach((elm) => {
	    elm.beginElement();
	});
    },
    camo() {
	document.querySelectorAll('g#main>use').forEach((use) => {
	    const display = use.getAttribute('display');
	    const to = display === 'block' ? 'none' : 'block';
	    use.setAttribute('display', to);
	});
    },
};

addEventListener('message', (e) => {
    if (e.origin === this.origin && (e.data === 'loaded' || e.data === 'start')) {
	trigger.main(e.data);
    }
});
