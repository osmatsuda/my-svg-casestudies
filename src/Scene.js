import { canScroll } from './utils';

function SVGComponent(svg) {
    this.svg = svg;
    this.size = {
	width: svg.clientWidth,
	height: svg.clientHeight,
    };
}

function SVGcasestudies(svg) {
    const base = new SVGComponent(svg);
    for (const attrName in base) {
	if (base.hasOwnProperty(attrName)) {
	    this[attrName] = base[attrName];
	}
    }

    this.smallTrigger = svg.querySelector('#SVGcasestudiesAnime0');
    this.largeTrigger = svg.querySelector('#SVGcasestudiesAnime0R');
    this.state = 0;
    // 0: large freeze
    // 1: getting smaller
    // 2: small freeze
    // 3: getting larger
    
    this.smallTrigger.addEventListener('endEvent', () => {
	this.state = 2;
	const smallHeight = this.svg.clientHeight *.666;
	if (canScroll(document.body) && window.scrollY < smallHeight) {
	    window.scrollTo({
		top: smallHeight,
		left: 0,
		behavior: 'smooth',
	    });
	}
    });
    this.largeTrigger.addEventListener('endEvent', () => {
	this.state = 0;
	const h = this.svg.clientHeight * .2;
	if (canScroll(document.body)) {
	    window.scrollTo({
		top: window.scrollY < h ? 0 : h,
		left: 0,
		behavior: 'smooth',
	    });
	}
    });
};
Object.setPrototypeOf(SVGcasestudies.prototype, SVGComponent.prototype);

SVGcasestudies.prototype.getBigger = function() {
    if (this.state !== 2) {
	return;
    }
    this.state = 3;
    this.largeTrigger.beginElement();
};
SVGcasestudies.prototype.getSmaller = function() {
    if (this.state !== 0) {
	return;
    }
    this.state = 1;
    this.smallTrigger.beginElement();
};

function ToRepos(svg) {
    const base = new SVGComponent(svg);
    for (const attrName in base) {
	if (base.hasOwnProperty(attrName)) {
	    this[attrName] = base[attrName];
	}
    }

    this.trigger = svg.querySelector('#GotoRepositoryEyeCatching');
    this.state = 0;

    this.trigger.addEventListener('endEvent', () => {
	this.state = 0;
    });
};
Object.setPrototypeOf(ToRepos.prototype, SVGComponent.prototype);

ToRepos.prototype.eyeCatching = function() {
    if (this.state !== 0) {
	return;
    }
    this.state = 1;
    this.trigger.beginElement();
};

function Scene({title, toRepos}) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.header = new SVGcasestudies(document.querySelector(title));
    this.footer = new ToRepos(document.querySelector(toRepos));

    this.prevScrollPos = window.scrollY;
    this.resized();
};

Scene.prototype.resized = function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    [this.header, this.footer].forEach((part) => {
	part.size.height = part.svg.clientHeight;
	part.size.width = part.svg.clientWidth;
    });
    this.headerAnimPos = this.header.size.height * .5;
    this.footerAnimPos = document.body.clientHeight - this.height - this.footer.size.height * .5;

    this.scrolled();
};

Scene.prototype.scrolled = function(init) {
    const scrollY = window.scrollY;
    let cof = 1.5;
    if (scrollY > this.prevScrollPos) {
	cof = .5;
    }

    if (scrollY < this.headerAnimPos * cof) {
	this.header.getBigger();
    } else {
	this.header.getSmaller();
	if (scrollY > this.footerAnimPos) {
	    this.footer.eyeCatching();
	}
    }
    this.prevScrollPos = scrollY;
};

export default Scene;
