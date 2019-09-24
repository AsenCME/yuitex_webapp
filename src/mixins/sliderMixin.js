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

var sliderFunction = function() {
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
  fullHeight();
};

export default sliderFunction
