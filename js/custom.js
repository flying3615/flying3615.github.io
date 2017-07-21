$(function () { // wait for document ready


    var fadeinController = new ScrollMagic.Controller();

    //can help fade in scene
    new ScrollMagic.Scene({
        triggerElement: '#panel-1',
        // triggerHook: 0.9,
        duration: "150%"
    })
        // .addIndicators({
        //     name: 'can help scene',
        //     colorTrigger: 'black',
        //     indent: 10
        // })
        .setClassToggle('#can_help', 'fade-in').addTo(fadeinController);


    // $('.panel').each(function () {
    //     //first panel fade in scene
    //     new ScrollMagic.Scene({
    //         triggerElement: this,
    //         reverse:false,
    //         triggerHook: 0.9,
    //         duration: "100%"
    //     }).setClassToggle('.show_all', 'fade-in')
    //         .addIndicators({
    //             name: 'panel fade scene',
    //             colorTrigger: 'black',
    //             indent: 100
    //         }) // add indicators (requires plugin)
    //         .addTo(fadeinController);
    // })

    new ScrollMagic.Scene({
        triggerElement: '#panel-1',
        duration: "100%"
    }).setClassToggle('body', 'moss')
        // .addIndicators({
        //     name: 'panel 1 scene',
        //     colorTrigger: 'black',
        //     indent: 100
        // })
        .addTo(fadeinController);


    new ScrollMagic.Scene({
        triggerElement: '#panel-2',
        duration: "100%"
    }).setClassToggle('body', 'waterfall')
        // .addIndicators({
        //     name: 'panel 2 scene',
        //     colorTrigger: 'black',
        //     indent: 100
        // })
        .addTo(fadeinController);

    new ScrollMagic.Scene({
        triggerElement: '#panel-3',
        duration: "100%"
    }).setClassToggle('body', 'meadow')
        // .addIndicators({
        //     name: 'panel 3 scene',
        //     colorTrigger: 'black',
        //     indent: 100
        // })
        .addTo(fadeinController);

    new ScrollMagic.Scene({
        triggerElement: '#panel-4',
        duration: "100%"
    }).setClassToggle('body', 'thundercloud')
        // .addIndicators({
        //     name: 'panel 4 scene',
        //     colorTrigger: 'black',
        //     indent: 100
        // })
        .addTo(fadeinController);

    // new ScrollMagic.Scene({
    //     triggerElement: '#panel-1',
    //     duration: "100%"
    // }).setPin('.go_myself').addTo(fadeinController)


});