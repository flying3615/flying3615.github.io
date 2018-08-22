$(function () { // wait for document ready

		particlesJS.load('particles-js', '../particles.json', function () {
			console.log('callback - particles.js config loaded');
		});


		var fadeinController = new ScrollMagic.Controller();

		//can help fade in scene
		new ScrollMagic.Scene({
			triggerElement: '#panel-3',
			// triggerHook: 0.9,
			duration: "150%"
		}).setClassToggle('#can_help', 'fade-in')
			.addTo(fadeinController);

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
			'#panel-1': 'moss',
			'#panel-2': 'waterfall',
			'#panel-3': 'meadow',
			'#panel-4': 'thundercloud',
		}

		for (var panel in colorEffectArray) {
			new ScrollMagic.Scene({
				triggerElement: panel,
				duration: "100%"
			}).setClassToggle('body', colorEffectArray[panel]).addTo(fadeinController);
		}


		//fade out timejs frame
		// new ScrollMagic.Scene({
		// 	triggerElement: '#panel-1',
		// 	triggerHook: 0.8,
		// 	duration: "50%"
		// }).setTween(
		// 	TweenMax.to('#timelineJS', 0.5, {autoAlpha: 0, scale: 10, ease: Power0.easeNone})
		// ).addTo(fadeinController)

		//fade out menu
		new ScrollMagic.Scene({
			triggerElement: '#timelineJS',
			triggerHook: 0.3,
			duration: "20%"
		}).setTween(
			TweenMax.to('.header', 0.5, {y: -200, autoAlpha: 0, ease: Power0.easeNone})
		).addTo(fadeinController)


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
			.from('body > div.header > h3 > a', 0.5, {y: -25, autoAlpha: 0, ease: Power1.easeOut})
			.from('.go_myself', 0.5, {x: -25, autoAlpha: 0, ease: Power1.easeOut}, '-=0.15')
			.from('#self-taught', 0.5, {x: 25, autoAlpha: 0, ease: Power1.easeOut}, '-=0.15')
			.from('#self-desc', 0.5, {y: 25, autoAlpha: 0, ease: Power1.easeOut}, '-=0.15')
			.from('#timelineJS', 0.5, {y: -25, autoAlpha: 0, ease: Power1.easeOut}, '-=0.15')

		var postTl = new TimelineLite();
		postTl.staggerFrom('.post', 0.5, {x: 100, autoAlpha: 0, ease: Power1.easeOut}, 0.1)


		TweenMax.from("#golang", 2, {x: 200, ease: Power1.easeOut})

		$('#all').click(function () {
			getImages()
		})


		$('.owl-carousel').owlCarousel({
			loop: true,
			dots: false,
			animateOut: 'slideOutDown',
			animateIn: 'flipInX',
			autoplay: true,
			autoplayTimeout: 1500,
			autoplayHoverPause: true,
			margin: 10,
			nav: true,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 3
				},
				1000: {
					items: 5
				}
			}
		})

		var booktype = ['all', 'backend', 'database', 'frontend'];
		var book_count = 0;

		booktype.forEach(function (t) {
			$('#' + t).click(function () {
				for (; book_count != 0; book_count--) {
					$('.owl-carousel').trigger('remove.owl.carousel', book_count)
				}
				$('.owl-carousel').trigger('refresh.owl.carousel')
				if (t == 'all') {
					getImages()
				} else {
					getImages(t)
				}
			})
		})


		function getImages(type) {
			if (type) {
				getAjaxFiles(type);
			} else {
				booktype.forEach(function (t) {
					if (t != 'all') getAjaxFiles(t);
				})
			}
		}


		function getAjaxFiles(type) {
			$.ajax({
				type: 'GET',
				url: 'https://api.github.com/repos/flying3615/flying3615.github.io/contents/image/books/' + type,
				success: function (data) {
					$(data).each(function () {
						book_count++
						var images = this.download_url;
						$('.owl-carousel')
							.owlCarousel('add', '<image src=' + images + ' class=book_img width=196px height=257px margin=2px>')
							.owlCarousel('refresh')
					});
				}
			});
		}

		getImages()

		$(".go_myself").hover(
			function () {
				var src = ($("#golang").attr('src') === 'image/golang.png')
					? 'image/golang2.png'
					: 'image/golang.png';
				$("#golang").attr('src', src);
			}
		)


	}
);