var animateFunction = function(){
  $('.animate-box').css("opacity", "0");
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
}

export default animateFunction
