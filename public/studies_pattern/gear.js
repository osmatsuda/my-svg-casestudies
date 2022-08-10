// deno-lint-ignore-file
(function(g) {
    var indexes = {
        buffer: [],
        setCount: function(c) {
            for (var i=0; i<c; i++) {
                indexes.buffer[i] = i
            }
        },
        select: function() {
            var i = Math.floor(Math.random() * indexes.buffer.length)
            var r = indexes.buffer[i]
            indexes.buffer.splice(i, 1)
            return r ? r : 0
        }
    }
    g.addEventListener("DOMContentLoaded", function() {
        var selector = "g[clip-path='url(#clip-gear)'] rect"
        var paths = document.querySelectorAll(selector)
	var patterns = document.querySelectorAll('svg>defs>pattern')
        indexes.setCount(patterns.length)
        Array.prototype.slice.call(paths).forEach(function(element) {
            var v = "url(#gear_bg_pattern_" + indexes.select() + ")"
            element.setAttribute("fill", v)
        })
    }, false)
})(this)

var App = function(d) {
    var selG = 'g[clip-path="url(#clip-gear)"] '
    var trigs = d.querySelectorAll(selG + 'animate[id^=anim]')
    var rects = d.querySelectorAll(selG + '>rect')

    this.triggers = Array.prototype.filter.call(trigs, function(node) {
	return node.id.slice(-1) == 'R'
    })
    this.firstTrigger = d.querySelector(selG + '#anim0F')
    this.rects = Array.prototype.slice.call(rects)

    var colors = this.rects.reduce(function(acc, rect) {
	var n = rect.getAttribute('fill').slice(-2, -1) * 1
	acc.push(n)
	return acc
    }, [])
    var ptns = [0,1,2,3]
    var pid = ptns.pop()
    while (1) {
	if (colors.indexOf(pid) == -1) break
	pid = ptns.pop()
    }
    this.exColor = pid
}

App.prototype.updateFills = function(id) {
    var updates
    switch (id) {
    case 0: updates = [this.rects[1], this.rects[2]]; break
    case 1: updates = [this.rects[0], this.rects[2]]; break
    case 2: updates = [this.rects[0], this.rects[1]]; break
    case 3: updates = [this.rects[0], this.rects[2]];
    }
    
    var out, save
    if (Math.random() > 0.5) {
	out = 0
	save = 1
    } else {
	out = 1
	save = 0
    }
    var saved = updates[save].getAttribute('fill').slice(-2, -1) * 1
    var outed = updates[out].getAttribute('fill').slice(-2, -1) * 1
    var fill = 'url(#gear_bg_pattern_'

    updates[out].setAttribute('fill', fill + saved + ')')
    updates[save].setAttribute('fill', fill + this.exColor + ')')

    this.exColor = outed
}

App.prototype.endFormerAnim = function(anim) {
    var id = anim.id.slice(-2, -1) * 1
    this.updateFills(id)

    var nextId = 'anim' + id + 'R'
    var i = 0
    for (; i<this.triggers.length; ++i) {
	if (this.triggers[i].id == nextId) break
    }
    var next = this.triggers[i]

    setTimeout(function() {
	next.beginElement()
    }, 1000)
}

App.prototype.startAnimation = function() {
    this.firstTrigger.beginElement()
}

function Main() {
    if (this.gearApp == undefined) {
	this.gearApp = new App(document)
    }
    setTimeout(function() {
	this.gearApp.startAnimation()
    }, 1000)
}
