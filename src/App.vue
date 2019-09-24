<template>
	<div>
		<div class="js-site-nav-toggle site-nav-toggle" v-on:click.prevent="toggleSidebar()">
			<i></i>
		</div>

		<aside id="site-aside" role="complementary" class="border js-fullheight">
			<h1 id="site-logo">
				<router-link to="/" v-lang.companyName></router-link>
			</h1>
			<nav id="site-main-menu" role="navigation">
				<ul>
					<li>
						<router-link to="/" v-lang.menuHome></router-link>
					</li>
					<li>
						<router-link to="/clothes" v-lang.menuClothes @click.native="redraw()"></router-link>
					</li>
					<li>
						<router-link to="/about" v-lang.menuAbout></router-link>
					</li>
					<li>
						<router-link to="/contact" v-lang.menuContact></router-link>
					</li>
					<li>
						<span class="lang-left lang-active" v-on:click="changeLang('bg')">BG</span>
						<span class="lang-right" v-on:click="changeLang('en')">EN</span>
					</li>
				</ul>
			</nav>
			<div class="site-footer">
				<p>
					<small>&copy; 2017 Yuitex
						<span>Designed by
							<a href="http://agsoftworks.com" target="_blank">Asen</a>
						</span>
					</small>
				</p>
			</div>
		</aside>

		<keep-alive>
			<router-view></router-view>
		</keep-alive>

		<div class="fab">
			<ul class="fab-menu">
				<li v-show="isAdmin" class="fab-circle">
					<router-link to="/admin">
						<i class="fa fa-unlock-alt" aria-hidden="true" style="font-size: 25px; color: white;"></i>
					</router-link>
				</li>
				<li v-show="isLoggedIn" class="fab-circle">
					<router-link to="/dashboard">
						<i class="fa fa-database" aria-hidden="true" style="font-size: 25px; color: white;"></i>
					</router-link>
				</li>
				<li v-show="isLoggedIn" class="fab-circle">
					<router-link to="/profile">
						<i class="fa fa-eye" aria-hidden="true" style="font-size: 25px; color: white;"></i>
					</router-link>
				</li>
				<li v-show="!isLoggedIn" class="fab-circle">
					<router-link to="/login">
						<i class="fa fa-sign-in" aria-hidden="true" style="font-size: 25px; color: white;"></i>
					</router-link>
				</li>
				<li v-show="isLoggedIn" class="fab-circle" v-on:click="signOut()">
					<i class="fa fa-sign-out" aria-hidden="true" style="font-size: 25px; color: white;"></i>
				</li>
			</ul>
			<div class="main-circle">
				<i class="fa fa-user-circle-o" aria-hidden="true" style="font-size: 67px; color: white;"></i>
			</div>
		</div>

	</div>
</template>

<script>
import "./assets/css/bootstrap.min.css";
import "./assets/css/animate.css";
import "./assets/css/flexslider.css";
import "./assets/css/icomoon.css";
import "./assets/css/style.css";
import "./assets/css/button.css";
import "./assets/css/font-awesome.css";
import "./assets/css/iziToast.css";
import "./assets/css/themify-icons.css";

import "./assets/js/jquery-3.2.1.min.js";
import "./assets/js/jquery.easing.1.3.js";
import "./assets/js/jquery.waypoints.min.js";
import "./assets/js/jquery.flexslider-min.js";
import "./assets/js/jquery.touchSwipe.min.js";
import "./assets/js/main.js";

import changeColorMixin from "./mixins/changeColorMixin";
import toast from "izitoast";
import Firebase from "firebase";
import app from "./firebaseApp";

export default {
	data() {
		return {
			isLoggedIn: false,
			isAdmin: false,
			username: "",
			currentPage: this.$router.app._route.fullPath,
		};
	},
	methods: {
		changeColor: changeColorMixin,
		toggleSidebar: function() {
			$("body").toggleClass("offcanvas");
			$(".js-site-nav-toggle").toggleClass("active");
			$("html").toggleClass("hidden-scroll");
		},
		changeLang: function(lang) {
			this.$language = lang;
			if (lang === "bg") {
				$(".lang-right").removeClass("lang-active");
				$(".lang-left").addClass("lang-active");
			} else {
				$(".lang-left").removeClass("lang-active");
				$(".lang-right").addClass("lang-active");
			}
			if (window.innerWidth <= 800) {
				this.toggleSidebar();
			}
		},
		signOut: function() {
			Firebase.auth()
				.signOut()
				.then(function() {
					toast.success({
						position: "topRight",
						timeout: 2000,
						message: "Successfully signed out",
					});
				})
				.catch(function(err) {
					toast.error({
						position: "topRight",
						timeout: 2000,
						message: err.message,
					});
				});
		},
		redraw: function() {
			this.$redrawVueMasonry();
		},
	},
	mounted() {
		$("html").swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				event.preventDefault();
				if (window.innerWidth <= 800) {
					if (direction === "left") {
						$("body").removeClass("offcanvas");
						$(".js-site-nav-toggle").removeClass("active");
						$("html").removeClass("hidden-scroll");
					}
				}
			},
		});

		// if(document.cookie.indexOf('refresh')==-1) {
		//   document.cookie = 'refresh=1';
		// }else {
		//   this.$router.push('/');
		// }

		Firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.username = user.email;
				app
					.database()
					.ref("users/" + user.uid)
					.once("value", snap => {
						if (snap.val().username) {
							this.username = snap.val().username;
						}
					});
				this.isLoggedIn = true;
				if (user.email === "admin@yuitex.com") {
					this.isAdmin = true;
				} else {
					this.isAdmin = false;
				}
			} else {
				this.isLoggedIn = false;
				this.isAdmin = false;
			}
			this.changeColor();
		});
	},
};
</script>
<style>
.hidden-scroll {
	overflow: hidden;
}
.lang-left,
.lang-right {
	padding: 8px 16px;
	border: 1px solid #ccc;
	color: black;
	cursor: pointer;
	transition: 0.3s ease-in-out;
	font-size: 16px;
}
.lang-left:hover,
.lang-right:hover {
	background: #888888;
	color: white;
	font-weight: 900;
	border-color: #888888;
}
.lang-left {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.lang-right {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
}
.lang-active {
	border: 1px solid #ccc;
	background: #53e32f;
	font-weight: 900;
	color: white;
}
.lang-active.lang-left {
	border-right: none;
}
.lang-active.lang-right {
	border-left: none;
}
</style>
