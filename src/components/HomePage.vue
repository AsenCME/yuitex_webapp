<template>
	<div id="site-main">
	  <aside id="site-hero" class="js-fullheight">
  		<div class="flexslider js-fullheight">
  			<ul class="slides">
  		   	<li v-lazy:background="img1">
  		   		<div class="overlay"></div>
  		   		<div class="container-fluid">
  		   			<div class="row">
  			   			<div class="col-md-8 offset-md-2 text-center js-fullheight slider-text">
  			   				<div class="slider-text-inner">
  			   					<h1 v-lang.slider1Main></h1>
  			   					<h2 v-lang.slider1Sub></h2>
  									<p><router-link to="/clothes" v-on:click="changeActiveLink('clothes')" class="btn btn-primary btn-learn"><span v-lang.catalogue></span> <i class="icon-arrow-right3"></i></router-link></p>
  			   				</div>
  			   			</div>
  			   		</div>
  		   		</div>
  		   	</li>
					<li v-lazy:background="img2">
  		   		<div  class="overlay"></div>
  		   		<div class="container-fluid">
  		   			<div class="row">
  			   			<div class="col-md-8 offset-md-2 text-center js-fullheight slider-text">
  			   				<div class="slider-text-inner">
  			   					<h1 v-lang.slider2Main></h1>
  			   					<h2 v-lang.slider2Sub></h2>
  									<p><router-link to="/contact" v-on:click="changeActiveLink('contact')" class="btn btn-primary btn-learn"><span v-lang.contactUs></span> <i class="icon-arrow-right3"></i></router-link></p>
  			   				</div>
  			   			</div>
  			   		</div>
  		   		</div>
  		   	</li>
  		  </ul>
  	  </div>
  	</aside>
  	<div class="site-narrow-content">
  		<h2 style="margin-bottom: 40px;" class="site-heading animate-box" data-animate-effect="fadeInLeft" v-lang.services></h2>
  		<div class="row">
  			<div class="col-md-6">
  				<div class="site-feature animate-box" data-animate-effect="fadeInLeft">
  					<div class="site-icon">
  						<i class="icon-settings"></i>
  					</div>
  					<div class="site-text">
  						<h3 v-lang.feature1Name></h3>
  						<p v-lang.feature1Desc></p>
  					</div>
  				</div>
  			</div>
  			<div class="col-md-6">
  				<div class="site-feature animate-box" data-animate-effect="fadeInLeft">
  					<div class="site-icon">
  						<i class="icon-search4"></i>
  					</div>
  					<div class="site-text">
  						<h3 v-lang.feature2Name></h3>
  						<p v-lang.feature2Desc></p>
  					</div>
  				</div>
  			</div>

  			<div class="col-md-6">
  				<div class="site-feature animate-box" data-animate-effect="fadeInLeft">
  					<div class="site-icon">
  						<i class="icon-paperplane"></i>
  					</div>
  					<div class="site-text">
  						<h3 v-lang.feature3Name></h3>
  						<p v-lang.feature3Desc></p>
  					</div>
  				</div>
  			</div>
  			<div class="col-md-6">
  				<div class="site-feature animate-box" data-animate-effect="fadeInLeft">
  					<div class="site-icon">
  						<i class="icon-params"></i>
  					</div>
  					<div class="site-text">
  						<h3 v-lang.feature4Name></h3>
  						<p v-lang.feature4Desc></p>
  					</div>
  				</div>
  			</div>
  		</div>
  	</div>

	</div>
</template>

<script>
import changeColorMixin from '../mixins/changeColorMixin'
import animateFunction from '../mixins/animationMixin'
import sliderFunction from '../mixins/sliderMixin'
import Firebase  from 'firebase'
import '../firebaseApp'

export default {
	data(){
		return{
			isLoggedIn: '',
			img1: '../../static/shop/shop-interior.jpg',
			img2: '../../static/shop/shop-exterior.jpg',
		}
	},
	methods:{
		sliderActivate: sliderFunction,
		changeColor: changeColorMixin,
		animateEntrance: animateFunction,
	},
	mounted(){
		$('.animate-box').css("opacity", "0");
		var $this = this;
    Firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $this.isLoggedIn = true;
      }else{
        $this.isLoggedIn = false;
      }
    });
		this.changeColor();
		this.animateEntrance();
		this.sliderActivate();
	}
}
</script>
