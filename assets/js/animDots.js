var x = window.matchMedia("(max-width: 700px)")
animDots(x) // Call listener function at run time
x.addListener(animDots) // Attach listener function on state changes

function animDots(x) {
    if (x.matches) { // If media query matches
        return
    } else {
        (function () {
            function e() {
                s = window.innerWidth, u = window.innerHeight, g = {
                    x: s / 2,
                    y: u / 2
                }, w = document.getElementById("large-header");
                
                // Allow CSS to override height if .compact-hero is present
                if (w.classList.contains("compact-hero")) {
                    u = w.offsetHeight || 400;
                } else {
                    w.style.height = u + "px";
                }
                
                f = document.getElementById("demo-canvas"), f.width = s, f.height = u, h = f.getContext("2d"), v = [];
                for (var e = 0; s > e; e += s / 18)
                    for (var n = 0; u > n; n += u / 18) {
                        var t = e + Math.random() * s / 18,
                            i = n + Math.random() * u / 18,
                            o = {
                                x: t,
                                originX: t,
                                y: i,
                                originY: i
                            };
                        v.push(o)
                    }
                for (var a = 0; a < v.length; a++) {
                    for (var r = [], c = v[a], l = 0; l < v.length; l++) {
                        var y = v[l];
                        if (c != y) {
                            for (var p = !1, x = 0; 5 > x; x++) p || void 0 == r[x] && (r[x] = y, p = !0);
                            for (var x = 0; 5 > x; x++) p || m(c, y) < m(c, r[x]) && (r[x] = y, p = !0)
                        }
                    }
                    c.closest = r
                }
                for (var a in v) {
                    var M = new d(v[a], 2 + 2 * Math.random(), "rgba(255,255,255,0.3)");
                    v[a].circle = M
                }
            }

            function n() {
                "ontouchstart" in window || window.addEventListener("mousemove", t), window.addEventListener("scroll", i), window.addEventListener("resize", o)
            }

            function t(e) {
                var n = posy = 0;
                e.pageX || e.pageY ? (n = e.pageX, posy = e.pageY) : (e.clientX || e.clientY) && (n = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop), g.x = n, g.y = posy
            }

            function i() {
                y = document.body.scrollTop > u ? !1 : !0
            }

            function o() {
                s = window.innerWidth, u = window.innerHeight;
                if (w.classList.contains("compact-hero")) {
                    u = w.offsetHeight || 400;
                } else {
                    w.style.height = u + "px";
                }
                f.width = s, f.height = u
            }

            function a() {
                r();
                for (var e in v) c(v[e])
            }

            function r() {
                if (y) {
                    h.clearRect(0, 0, s, u);
                    for (var e in v) Math.abs(m(g, v[e])) < 4e3 ? (v[e].active = 0.3, v[e].circle.active = 0.6) : Math.abs(m(g, v[e])) < 2e4 ? (v[e].active = 0.1, v[e].circle.active = 0.3) : Math.abs(m(g, v[e])) < 4e4 ? (v[e].active = 0.02, v[e].circle.active = 0.1) : (v[e].active = 0, v[e].circle.active = 0), l(v[e]), v[e].circle.draw()
                }
                requestAnimationFrame(r)
            }

            function c(e) {
                gsap.to(e, {
                    duration: 1 + 1 * Math.random(),
                    x: e.originX - 50 + 100 * Math.random(),
                    y: e.originY - 50 + 100 * Math.random(),
                    ease: "circ.inOut",
                    onComplete: function () {
                        c(e)
                    }
                })
            }

            function l(e) {
                if (e.active)
                    for (var n in e.closest) h.beginPath(), h.moveTo(e.x, e.y), h.lineTo(e.closest[n].x, e.closest[n].y), h.strokeStyle = "rgba(235,235,235," + e.active + ")", h.stroke()
            }

            function d(e, n, t) {
                var i = this;
                ! function () {
                    i.pos = e || null, i.radius = n || null, i.color = t || null
                }(), this.draw = function () {
                    i.active && (h.beginPath(), h.arc(i.pos.x, i.pos.y, i.radius, 0, 2 * Math.PI, !1), h.fillStyle = "rgba(255,255,255," + i.active + ")", h.fill())
                }
            }

            function m(e, n) {
                return Math.pow(e.x - n.x, 2) + Math.pow(e.y - n.y, 2)
            }
            var s, u, w, f, h, v, g, y = !0;
            e(), a(), n()
        })();
    }
}