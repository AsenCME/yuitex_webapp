;(function () {
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {
		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint(function(direction) {
			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				i++;
				$(this.element).addClass('item-animate');
				setTimeout(function(){
					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout(function() {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}
							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
				}, 100);
			}
		} , { offset: '85%' } );
	};

	var burgerMenu = function() {
		$('.js-site-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);
			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');
			}
		});
	};

	var mobileMenuOutsideClick = function() {
		$(document).click(function (e) {
			var container = $("#site-aside, .js-site-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	    	if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-site-nav-toggle').removeClass('active');
	    	}
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {
    			$('body').removeClass('offcanvas');
    			$('.js-site-nav-toggle').removeClass('active');
	    	}
		});
	};


	var sliderMain = function() {
  	$('#site-hero .flexslider').flexslider({
		animation: "fade",
		slideshowSpeed: 5000,
		start: function(){
			setTimeout(function(){
				$('.slider-text').removeClass('animated fadeInUp');
				$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
			}, 500);
		},
		before: function(){
			setTimeout(function(){
				$('.slider-text').removeClass('animated fadeInUp');
				$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
			}, 500);
		}
  	});
	};

	var menuHandler = function(){
		$('ul li').click(function(){
			$(this).siblings().removeClass('site-active');
			$(this).addClass('site-active');
		});
	};

	var fabHandler = function() {
		$('.main-circle').click(function(){
		  toggleFab();
		});

		var toggleFab = function(){
		  var btn = $('.fab');
		  if(btn.hasClass('active-fab')){
		    btn.removeClass('active-fab');
		    $('.fab-circle').each(function(i){
		      var $li = $(this);
		      setTimeout(function(){
		        $li.removeClass('active-fab-link');
		      }, i * 30);
		    });
		  }else{
		    btn.addClass('active-fab');
		    $('.fab-menu').show();
		    $($('.fab-circle').get().reverse()).each(function(i){
		      var $li = $(this);
		      setTimeout(function(){
		        $li.addClass('active-fab-link');
		      }, i * 30);
		    });
		  }
		};
	};

	// Document on load.
	$(function(){
		fullHeight();
		contentWayPoint();
		// burgerMenu();
		// mobileMenuOutsideClick();
		sliderMain();
		menuHandler();
		fabHandler();
	});
}());
