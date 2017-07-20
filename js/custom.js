$(function () { // wait for document ready
    // init
    var controller = new ScrollMagic.Controller();

    // define movement of panels
    var wipeAnimation = new TimelineMax()
        .fromTo("section.panel.turqoise", 1, {x: "-100%"}, {x: "0%", ease: Linear.easeNone})  // in from left
        .fromTo("section.panel.green", 1, {x: "100%"}, {x: "0%", ease: Linear.easeNone})  // in from right
        .fromTo("section.panel.bordeaux", 1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone}); // in from top

    // create scene to pin and link animation
    new ScrollMagic.Scene({
        triggerElement: "#pinContainer",
        triggerHook: "onLeave",
        duration: "300%"
    }).setPin("#pinContainer")
        .setTween(wipeAnimation)
        // .addIndicators() // add indicators (requires plugin)
        .addTo(controller);


    var flightpath = {
        entry: {
            curviness: 1.25,
            autoRotate: true,
            values: [
                {x: 100, y: -20},
                {x: 300, y: 10}
            ]
        },
        looping: {
            curviness: 1.25,
            autoRotate: true,
            values: [
                {x: 510, y: 60},
                {x: 620, y: -60},
                {x: 500, y: -100},
                {x: 380, y: 20},
                {x: 500, y: 60},
                {x: 580, y: 20},
                {x: 620, y: 15}
            ]
        },
        leave: {
            curviness: 1.25,
            autoRotate: true,
            values: [
                {x: 660, y: 20},
                {x: 800, y: 130},
                {x: $(window).width() + 1300, y: -100},
            ]
        }
    };
// create tween
    var tween = new TimelineMax()
        .add(TweenMax.to($("#plane"), 1.2, {css: {bezier: flightpath.entry}, ease: Power1.easeInOut}))
        .add(TweenMax.to($("#plane"), 2, {css: {bezier: flightpath.looping}, ease: Power1.easeInOut}))
        .add(TweenMax.to($("#plane"), 1, {css: {bezier: flightpath.leave}, ease: Power1.easeInOut}));

    // build scene
    var scene = new ScrollMagic.Scene({triggerElement: "#trigger", duration: 500, offset: 100})
        .setPin("#target")
        .setTween(tween)
        // .addIndicators() // add indicators (requires plugin)
        .addTo(controller);

});