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


    new ScrollMagic.Scene({
        triggerElement: '#panel-4',
        triggerHook: 0.3,
        duration: "100%"
    }).setClassToggle('#bible-deuteronomy', 'fade-in').addTo(fadeinController);


    new ScrollMagic.Scene({
        triggerElement: '#panel-1',
        duration: "100%"
    }).setClassToggle('body', 'moss').addTo(fadeinController);


    new ScrollMagic.Scene({
        triggerElement: '#panel-2',
        duration: "100%"
    }).setClassToggle('body', 'waterfall').addTo(fadeinController);

    new ScrollMagic.Scene({
        triggerElement: '#panel-3',
        duration: "100%"
    }).setClassToggle('body', 'meadow').addTo(fadeinController);

    new ScrollMagic.Scene({
        triggerElement: '#panel-4',
        duration: "100%"
    }).setClassToggle('body', 'thundercloud').addTo(fadeinController);

    //parallax scene
    new ScrollMagic.Scene({
        triggerElement: '.bcg-parallax',
        triggerHook:1,
        duration: "150%"
    }).setTween(TweenMax.from('.bcg',1,{y:'-50%',ease:Power0.easeNone}))
        // .addIndicators({
        // name: 'parallax scene',
        // colorTrigger: 'black',
        // indent: 100
        // })
        .addTo(fadeinController)


});