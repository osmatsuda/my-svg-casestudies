(function(g) {
    var d = g.document

    var MOPS = {
        patterns: [],
        parts: [],
        triggers: [],
        patternType: 0
    }
    function initMOPS() {
        var s = Array.prototype.slice
        MOPS.patterns = s.call(d.querySelectorAll('.MOPSPtn'))
        var ps = s.call(d.querySelectorAll('.MOPSBodyPart'))
        
        MOPS.parts = ps.reduce(function(acc, node) {
            return [node.querySelector('*[fill^="url(#MOPSPtn"]')].concat(acc)
        }, [])
        MOPS.triggers = ps.reduce(function(acc, node) {
            return [node.querySelector('#' + node.id + 'A1')].concat(acc)
        }, [])
    }
    
    function updatePattern() {
        var n = MOPS.patterns.length
        if (n == 0) return

        var p = Math.floor(Math.random() * n)
        while (p == MOPS.patternType) {
            p = Math.floor(Math.random() * n)
        }
        MOPS.patternType = p
        var fill = 'url(#MOPSPtn' + p + ')'
        
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

    function main() {
        initMOPS()
        setTimeout(loop, 3000)

        d.querySelector('#MOPSHeadA2').addEventListener('endEvent', function(e) {
            updatePattern()
        }, false)
    }
    
    g.Main = main
    g.addEventListener('DOMContentLoaded', function(e) {
        d.querySelector('svg').removeAttribute('onload')
        g.Main = null
        main()
    }, false)
})(this)
