$(function () { // wait for document ready


    var fadeinController = new ScrollMagic.Controller();

    //can help fade in scene
    new ScrollMagic.Scene({
        triggerElement: '#panel-1',
        // triggerHook: 0.9,
        duration: "150%"
    }).setClassToggle('#can_help', 'fade-in').addTo(fadeinController);

    //about pop-up scene
    new ScrollMagic.Scene({
        triggerElement: '#panel-2',
        // triggerHook: 0.9,
        duration: "150%"
    }).setClassToggle('#about_life', 'left-in').addTo(fadeinController);


    var tween = new TimelineMax().from('blockquote h2.quote', 1, {autoAlpha: 0, y: -200, ease: Power0.easeNone})
        .from('blockquote p.credit', 1, {autoAlpha: 0, delay: 1})
    new ScrollMagic.Scene({
        triggerElement: '#panel-4',
        triggerHook: 0.3,
        duration: "30%"
    }).setTween(tween)
        .addTo(fadeinController);


    var colorEffectArray = {
        '#panel-1':'moss',
        '#panel-2':'waterfall',
        '#panel-3':'meadow',
        '#panel-4':'thundercloud',
    }

    for(var panel in colorEffectArray){
        new ScrollMagic.Scene({
            triggerElement: panel,
            duration: "100%"
        }).setClassToggle('body', colorEffectArray[panel]).addTo(fadeinController);
    }


    //fade out timejs frame
    new ScrollMagic.Scene({
        triggerElement: '#panel-1',
        triggerHook: 0.8,
        duration: "50%"
    }).setTween(TweenMax.to('#timelineJS', 0.5, {autoAlpha: 0, scale:10, ease: Power0.easeNone}))
        .addTo(fadeinController)


    //parallax scene
    new ScrollMagic.Scene({
        triggerElement: '.bcg-parallax',
        triggerHook: 1,
        duration: "150%"
    }).setTween(TweenMax.from('.bcg', 1, {y: '-50%', ease: Power0.easeNone}))
    // .addIndicators({
    // name: 'parallax scene',
    // colorTrigger: 'black',
    // indent: 100
    // })
        .addTo(fadeinController)


    //Timeline loading
    var tl = new TimelineLite();
    tl
        .from('body > div.header > h3 > a',0.5,{y:-25,autoAlpha:0,ease:Power1.easeOut})
        .from('.go_myself',0.5,{x:-25,autoAlpha:0,ease:Power1.easeOut},'-=0.15')
        .from('#self-taught',0.5,{x:25,autoAlpha:0,ease:Power1.easeOut},'-=0.15')
        .from('#self-desc',0.5,{y:25,autoAlpha:0,ease:Power1.easeOut},'-=0.15')
        .from('#timelineJS',0.5,{y:-25,autoAlpha:0,ease:Power1.easeOut},'-=0.15')

});