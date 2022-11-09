(function(g) {
    const d = g.document

    const MOPS = {
        patterns: [],
        parts: [],
        triggers: [],
        patternType: 0
    }
    function initMOPS() {
        const s = Array.prototype.slice;
        MOPS.patterns = s.call(d.querySelectorAll('.MOPSPtn'));
        const ps = s.call(d.querySelectorAll('.MOPSBodyPart'));
        
        MOPS.parts = ps.reduce(function(acc, node) {
            return [node.querySelector('*[fill^="url(#MOPSPtn"]')].concat(acc);
        }, []);
        MOPS.triggers = ps.reduce(function(acc, node) {
            return [node.querySelector('#' + node.id + 'A1')].concat(acc);
        }, []);

        setTimeout(loop, 1000);
        d.querySelector('#MOPSHeadA2').addEventListener('endEvent', function(e) {
            updatePattern();
        });
    }
    
    function updatePattern() {
        const n = MOPS.patterns.length
        if (n == 0) return

        let p = Math.floor(Math.random() * n)
        while (p == MOPS.patternType) {
            p = Math.floor(Math.random() * n)
        }
        MOPS.patternType = p
        const fill = 'url(#MOPSPtn' + p + ')'
        
        MOPS.parts.forEach(function(node) {
            node.setAttribute('fill', fill)
        })
    }

    function loop() {
        setTimeout(function(){
            MOPS.triggers.forEach(function(node) {
                node.beginElement()
            })
        }, 100)
        setTimeout(loop, 4000 + Math.random() * 3000)
    }

    let readyState = 0;
    let offsetTimerId;
    function main(state) {
	if (state === 'loaded'
	    && offsetTimerId === undefined
	    && readyState === 0) {
	    readyState = 1;
	    offsetTimerId = setTimeout(() => {
		readyState = 2;
		initMOPS();
	    }, 1500);
	} else if (state === 'start') {
	    if (readyState === 1) {
		clearTimeout(offsetTimerId);
	    }
	    if (readyState !== 2) {
		readyState = 2;
		initMOPS();
	    }
	}
    }

    g.addEventListener('message', (e) => {
	if (e.origin === this.origin && (e.data === 'loaded' || e.data === 'start')) {
	    main(e.data);
	}
    });
})(this);
