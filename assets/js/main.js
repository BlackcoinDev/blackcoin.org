(function ($) {
	'use strict';

	/* --------------------------------------------------
		Initialization
	-------------------------------------------------- */

	// Initialize all functions when the document is ready.
	$(document).ready(function () {

		initNavbar();
		initMobileHover();

	});

	// Initialize functions after elements are loaded.
	$(window).on('load', function () {

		// Preloader
		$('.preloader img').fadeOut(); // will first fade out the loading animation
		$('.preloader').delay(350).fadeOut('slow', function () {

		});

		initParallax();
		initSliders();

	});


	/* --------------------------------------------------
		Navigation | Navbar
	-------------------------------------------------- */

	function initNavbar() {

		// Sticky Nav & Transparent Background
		$(window).scroll(function () {

			if ($(window).scrollTop() > 20) {
				$('nav').removeClass('navbar-trans', 300);
				$('nav').removeClass('navbar-trans-dark');
				$('nav').addClass('navbar-small', 300);
			} else {
				$('nav:not(.mobile-nav)').addClass('navbar-trans', 300);
				$('nav').removeClass('navbar-small', 300);

				if ($('nav').hasClass('trans-helper')) {
					$('nav:not(.mobile-nav)').addClass('navbar-trans-dark');
				}
			}

			$('nav:not(.navbar-fixed-top):not(.fixed-top)').removeClass('navbar-trans navbar-small navbar-trans-dark');

		});


		// Nav on mobile screens
		$(window).resize(function () {
			if ($(window).width() <= 1259) {
				$('nav').addClass('mobile-nav');
			} else {
				$('nav').removeClass('mobile-nav');
			}

			if ($('nav').hasClass('mobile-nav')) {
				$('nav').removeClass('navbar-trans');
				$('nav').removeClass('navbar-trans-dark');
			} else {
				if ($(window).width() > 1259 && $(window).scrollTop() === 0) {
					$('nav').addClass('navbar-trans');
				}
			}

		}).resize();

		// Close mobile menu when clicked link
		$('.nav a:not(.dropdown-toggle)').on('click', function () {
			if ($('.navbar-toggler').css('display') !== 'none') {
				$(".navbar-toggler").trigger("click");
			}
		});

		// Bugfix for iOS not scrolling on open menu
		$(".navbar-collapse").css({
			maxHeight: $(window).height() - $(".navbar-header").height() + "px"
		});


	} // initNavbar



	/* --------------------------------------------------
		Parallax
	-------------------------------------------------- */


	function initParallax() {
		if (typeof $.fn.parallax !== 'function') return;


		var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

		if (!isSafari) {
			$(".testimonials-parallax").parallax("50%", 0.4);
		}
	}



	/* --------------------------------------------------
		Sliders
	-------------------------------------------------- */

	function initSliders() {
		if (typeof $.fn.slick !== 'function') return;

		// Brands/Clients Slider (USED on index.html)
		$('.clients-slider').slick({
			autoplay: true,
			autoplaySpeed: 500,
			slidesToShow: 5,
			slidesToScroll: 1,
			dots: false,
			arrows: false,
			responsive: [{
					breakpoint: 999,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 1,
						infinite: true
					}
				},
				{
					breakpoint: 770,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1
					}
				},
				{
					breakpoint: 599,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1
					}
				}
			]
		});

	} // initSliders


	/* --------------------------------------------------
		Mobile Hover (Tap to Expand)
	-------------------------------------------------- */

	function initMobileHover() {
		$('.ft-boxed-hover ul li, .no-gap ul li').on('click', function (e) {
			if ($(window).width() <= 991) {
				// If clicking a link inside the box, let it through
				if ($(e.target).closest('a').length) {
					return;
				}

				$(this).toggleClass('is-tapped');
				// Close others
				$(this).siblings().removeClass('is-tapped');
			}
		});
	}

})(jQuery);