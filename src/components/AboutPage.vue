<template>
  <div id="site-main">
		<div class="site-narrow-content">
			<div class="row row-bottom-padded-md">
				<div class="col-md-6 animate-box" data-animate-effect="fadeInLeft">
					<img class="img-fluid" src="../../static/shop/shop-exterior-2.jpg" alt="Free HTML5 Bootstrap Template by FreeHTML5.co">
				</div>
				<div class="col-md-6 animate-box" data-animate-effect="fadeInLeft">
					<h2 class="site-heading" v-lang.aboutTitle style="margin-top: 20px;"></h2>
					<p v-lang.aboutDesc></p>
				</div>
			</div>
		</div>

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

      <div class="masonry-container">
        <h2 class="site-heading animate-box" data-animate-effect="fadeInLeft" v-lang.gallery></h2>
        <div class="row animate-box" data-animate-effect="fadeInLeft" v-masonry transition-duration="0.3s" item-selector=".image-container">
          <div v-masonry-tile class="image-container col-md-4 col-sm-6 col-12" v-for="imgUrl in images">
            <img :src="imgUrl" class="image"/>
          </div>
        </div>
      </div>


  </div>
</template>

<script>
import changeColorMixin from '../mixins/changeColorMixin'
import animateFunction from '../mixins/animationMixin'
import Firebase  from 'firebase'
import '../firebaseApp'

export default {
  data(){
    return{
      isLoggedIn: '',
      images:[
        '../../static/shop/them1.jpg',
        '../../static/shop/us1.jpg',
        '../../static/shop/them2.jpg',
        '../../static/shop/us2.jpg',
        '../../static/shop/them3.jpg',
        '../../static/shop/us3.jpg',
        '../../static/shop/fourOfUs.jpg',
      ]
    }
  },
  methods: {
    changeColor: changeColorMixin,
    animateEntrance: animateFunction,
  },
  mounted(){
    var $this = this;
    Firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $this.isLoggedIn = true;
      }else{
        $this.isLoggedIn = false;
      }
    });
    this.animateEntrance();
    this.changeColor();
  }
}
</script>
<style>
  .image-container{
    padding: 10px;
  }
  .image{
    width: 100%;
    box-shadow: 0px 0px 35px -12px black;
    transition: .3s;
  }
  .image:hover{
    transform: scale(1.02);
  }
  .masonry-container{
    width: 90%;
    position: relative;
    margin: 0 auto;
  }
  .fullscreen-container{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: black;
    top: 0;
    left: 0;
    z-index: 100000;
    opacity: .8;
  }
</style>
