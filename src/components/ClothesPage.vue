<template>
	<div id="site-main">

		<div class="cart-icon" v-on:click="toggleCart()" v-show="!isCartEmpty">
			<i class="fa fa-shopping-cart" aria-hidden="true" style="font-size: 20px; margin-right: 10px;"></i>Cart
		</div>
		<div class="cart-container" v-show="!isCartEmpty">
      <table class="table table-striped table-hover">
        <thead class="thead-inverse">
          <tr style="height: 60px;">
						<th colspan="5" style="text-align: left; padding-left: 100px; border: none;" v-lang.greeting="{name: getUsername}"></th>
						<th v-on:click="toggleCart()" style="text-align: right; padding-right: 30px; border: none;">
							<i class="fa fa-times" aria-hidden="true" style="font-size: 20px; cursor: pointer;"></i>
						</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart">
            <td class="hidden-sm-down">
							<div class="img-thumbnail" :style="{ 'background-image': 'url(' + item.imageUrl + ')' }"></div>
						</td>
            <td colspan="2" class="hidden-sm-down" style="text-align: left; padding-left: 10px;">
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{getCartItemName(item)}}<br>
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{item.size}}<br>
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{getCartItemCategory(item)}}
						</td>
						<td colspan="3" class="hidden-md-up" style="text-align: left; padding-left: 10px;">
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{getCartItemName(item)}}<br>
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{item.size}}<br>
							<i class="ti-angle-double-right" style="margin-right: 5px;"></i>{{getCartItemCategory(item)}}
						</td>
						<td>{{item.price}} BGN</td>
						<td colspan="2" style="text-align: right; padding-right: 20px;">
							<i class="fa fa-plus-circle" aria-hidden="true" style="font-size: 16px; cursor: pointer; margin-right: 5px;" v-on:click="increaseItemQuantity(item)"></i>
							{{item.quantity}}
							<i class="fa fa-minus-circle" aria-hidden="true" style="font-size: 16px; cursor: pointer; margin-left: 5px;" v-on:click="decreaseItemQuantity(item)"></i>
						</td>
          </tr>
					<tr>
						<td colspan="4" style="font-size: 16px; text-align: left; padding-left: 20px;">Total price: {{getTotalPrice()}} BGN</td>
						<td colspan="2"><button class="btn btn-danger clear-cart" v-on:click="clearCart(cart)">Clear Cart</button></td>
					</tr>
        </tbody>
				<thead class="thead-default">
          <tr class="cart-footer">
						<th v-show="!clickedOrder" colspan="6" style="text-align: center; padding: 20px 0px;">
							<button class="btn btn-outline-success" style="width: 90%;" v-on:click="toggleClickedOrder()">Order</button>
						</th>
						<th colspan="1" class="footer-title" v-if="clickedOrder">Are you sure?</th>
						<th v-show="clickedOrder" colspan="5" style="text-align: right;">
							<button class="btn btn-outline-success" v-on:click="placeOrder()">Yes</button>
							<button class="btn btn-outline-danger" v-on:click="toggleClickedOrder()">No</button>
						</th>
					</tr>
        </thead>
      </table>
    </div>

		<div v-show="isLoading" class="loader">
			<img src="../assets/images/Ripple.svg">
		</div>

	  <div class="site-narrow-content" v-show="!isLoading">

			<section v-for="category in categories" class="single-category">
				<!-- Name of school -->
	  		<h2 class="site-heading animate-box" data-animate-effect="fadeInLeft">{{getText(category)}}</h2>
	  		<div class="row row-bottom-padded-md" v-masonry transition-duration="0.3s" item-selector=".item-container">

					<!-- A single item -->
					<div v-masonry-tile class="col-lg-3 col-md-4 col-sm-6 col-padding text-center animate-box item-container" v-for="(item, index) in category.items">
						<div class="work image-popup shadow" style="background-image: url('../../static/Ripple.svg');">
							<span class="resize-img"><i class="fa fa-expand" v-on:click="resizeImage($event)" aria-hidden="true"></i></span>
							<img v-bind:src="item.imageUrl" class="cloth-img minimized-img">
							<div class="item-overlay">
								<span class="item-close" v-on:click="closeItem($event)">
									<i class="fa fa-times" aria-hidden="true"></i>
								</span>
								<h4 class="item-title">Choose size:</h4>
								<div class="size-container">
									<!-- All sizes -->
									<span v-for="size in item.sizes" class="item-size" v-bind:class="shouldShowSize(size)" v-on:click="addItem($event, size, item, category)">{{size.value}}</span>
								</div>
							</div>
							<div class="desc">
								<h3>{{getText(item)}}</h3>
								<span v-if="!isLoggedIn"><button class="btn btn-danger" v-on:click="promptLogin()">Order</button></span>
								<span v-else><button class="btn btn-success shadow" v-on:click="chooseSize($event)">{{item.price}} BGN</button></span>
							</div>
						</div>
					</div>

	  		</div>
			</section>

  	</div>

	</div>
</template>

<script>
import changeColorMixin from '../mixins/changeColorMixin'
import animateFunction from '../mixins/animationMixin'
import toast from 'izitoast'
import Firebase from 'firebase'
import app from '../firebaseApp'


export default {
	firebase:{
		categories: app.database().ref('categories'),
	},
  data(){
    return{
			currentUser: {},
			isLoggedIn: '',
			uniqueUserId: 0,
			cart: [],
			clickedOrder: false,
			isLoading: true
    }
  },
	computed:{
		getUsername: function(){
			if(this.currentUser.username){
				return this.currentUser.username;
			}
			return this.currentUser.email;
		},
		isCartEmpty: function(){
			if(this.cart.length === 0){
				return true;
			}
			return false;
		},
	},
  methods:{
		changeColor: changeColorMixin,
		animateEntrance: animateFunction,
		createId: function(timestamp){
			var uniqueCode = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++){
        uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length));
      }
			return timestamp + "_" + uniqueCode;
		},
		getText: function(object){
			var lang = this.$language;
			if(lang === 'bg'){
				return object.name;
			}else{
				return object.nameEn;
			}
		},
		getCartItemName: function(cartItem){
			var lang = this.$language;
			if(lang === 'bg'){
				return cartItem.name;
			}else{
				return cartItem.nameEn;
			}
		},
		getCartItemCategory: function(cartItem){
			var lang = this.$language;
			if(lang === 'bg'){
				return cartItem.categoryName;
			}else{
				return cartItem.categoryNameEn;
			}
		},
		shouldShowSize: function(size){
			if(size.availableQty <= 0){
				return 'noMore active-size';
			}
		},
		getTotalPrice: function(){
			var totalPrice = 0;
			for(var index in this.cart){
				totalPrice += +(this.cart[index].price * this.cart[index].quantity);
			}
			return totalPrice;
		},
		createToast: function(message, time){
			return {
				close: false,
				progressbar: false,
				message: message,
				position: 'topRight',
				timeout: time,
				transitionIn: 'fadeInDown',
				transitionOut: 'fadeOutUp',
				transitionInMobile: 'fadeInDown',
				transitionOutMobile:  'fadeOutUp'
			};
		},
		resizeImage: function($event){
			var el = $event.target;
			$(el).parent().siblings().eq(0).toggleClass('minimized-img');
			$(el).parent().siblings().eq(0).toggleClass('expanded-img');
			$(el).parent().parent().toggleClass('resizeWork');
			this.$redrawVueMasonry();
			$(el).toggleClass('fa-expand');
			$(el).toggleClass('fa-compress');
		},

		toggleCart: function(){
			$('.cart-container').toggleClass('cart-down');
			$('.site-nav-toggle').toggleClass('white');
		},
    clearCart: function(cart){
      for(var itemKey in cart){
        var item = cart[itemKey];
        var categoryId = item.categoryId;
        var itemId = item.refId;
        var sizeId = item.sizeId;
        var qty = item.quantity;
        var sizeRef = app.database().ref('categories/' + categoryId + '/items/' + itemId + '/sizes/' + sizeId);
        sizeRef.child('availableQty').once('value', currentQty => {
          sizeRef.child('availableQty').set(currentQty.val() + qty);
        });
      }
      app.database().ref('users/' + this.uniqueUserId + '/cart').remove();
      toast.error(this.createToast('Cart cleared', 1000));
    },
		promptLogin: function(){
			var self = this;
			toast.warning({
				close: false,
				message: 'Please login to continue',
				position: 'topRight',
				timeout: 2000,
				onOpened: function(){
					setTimeout(function(){
						self.$router.push('/login');
					}, 2000);
				}
			});
		},
		closeItem: function($event) {
			$($event.target).parents().eq(2).removeClass('chosen');
			$($event.target).parent().siblings().eq(1).children().removeClass('active-size');
		},
		chooseSize: function($event){
			$($event.target).parents().eq(2).addClass('chosen');
			setTimeout(function(){
				var sizeElement = $($event.target).parent().parent().siblings().eq(2).children().eq(2);
				$(sizeElement).children().each(function(i){
					var child = $(this);
					setTimeout(function(){
						$(child).addClass('active-size');
					}, i * 50);
				});
			}, 600);
		},
		toggleClickedOrder(){
			this.clickedOrder = !this.clickedOrder;
		},

		increaseItemQuantity: function(item){
			app.database().ref('categories/' + item.categoryId + '/items/' + item.refId + '/sizes/' + item.sizeId + '/availableQty').once('value', qty => {
				if(qty.val() === 0){
					toast.error(this.createToast('No more from this size!', 2000));
				}
				else{
					app.database().ref('categories/' + item.categoryId + '/items/' + item.refId + '/sizes/' + item.sizeId + '/availableQty').set(qty.val() - 1);
					var itemId = item.id + "_" + item.sizeId;
					app.database().ref('users/' + this.uniqueUserId + '/cart/' + item.id + '/quantity').set(item.quantity + 1);
				}
			});
		},
		decreaseItemQuantity: function(item){
			app.database().ref('categories/' + item.categoryId + '/items/' + item.refId + '/sizes/' + item.sizeId + '/availableQty').once('value', qty => {
				app.database().ref('categories/' + item.categoryId + '/items/' + item.refId + '/sizes/' + item.sizeId + '/availableQty').set(qty.val() + 1);
				if(item.quantity - 1 === 0){
					this.deleteItem(item);
				}else{
					app.database().ref('users/' + this.uniqueUserId + '/cart/' + item.id + '/quantity').set(item.quantity - 1);
				}
			});
		},
		addItem: function($event, size, item, category){
			if($($event.target).hasClass('noMore')){
				toast.error(this.createToast('This size is unavailable!', 2000));
				return;
			}

			//Decrease Quantity
			var newQty = size.availableQty - 1;
			app.database().ref('categories/' + category.id + '/items/' + item.id + '/sizes/' + size.id + '/availableQty').set(newQty);
			var itemId = item.id + "_" + size.id;

			app.database().ref('users/' + this.uniqueUserId + '/cart/' + itemId).once('value', cartItem => {
				if(cartItem.val() === null){
					var newItem = {
						categoryId: category.id,
						categoryName: category.name,
						categoryNameEn: category.nameEn,
						sizeId: size.id,
						refId: item.id,
						id: itemId,
						name: item.name,
						nameEn: item.nameEn,
						price: item.price,
						size: size.value,
						quantity: 1,
						imageUrl: item.imageUrl
					};
					app.database().ref('users/' + this.uniqueUserId + '/cart/' + itemId).set(newItem);
					toast.success(this.createToast('Item added', 1000));
				}else{
					app.database().ref('users/' + this.uniqueUserId + '/cart/' + itemId + '/quantity').set(cartItem.val().quantity + 1);
					toast.info(this.createToast('Item updated', 1000));
				}
			});
		},
		deleteItem: function(item){
			app.database().ref('users/' + this.uniqueUserId + '/cart/' + item.id).remove();
			toast.error(this.createToast('Item removed', 2000));
		},
		placeOrder: function(){
			var clothesArray;
			app.database().ref('users/' + this.uniqueUserId + '/cart').once('value', cartSnap => {
				clothesArray = cartSnap.val();
			});
			var totalPrice = this.getTotalPrice();
			var currentTime = new Date().getTime();
			var order = {
				clothes: clothesArray,
				timestamp: currentTime,
				userId: this.uniqueUserId,
				totalPrice: totalPrice,
				id: this.createId(currentTime),
			};
			app.database().ref('orders').child(order.id).set(order);
			app.database().ref('users/' + this.uniqueUserId + '/cart').remove();
			toast.success(this.createToast('Order placed', 2000));
			this.clickedOrder = false;
		},
  },
	mounted(){

		setTimeout(function(){
			$('.work').css('background-image', 'none');
		}, 2000);

		var counter = 0;
		var self = this;
		app.database().ref('categories').once('value', rootSnap => {
			rootSnap.forEach(function(categorySnap){
				counter++;
				categorySnap.child('items').forEach(function(itemSnap){});
				if(counter === rootSnap.numChildren()){
					self.isLoading = false;
				}
			});
		});
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.isLoggedIn = true;
				this.uniqueUserId = user.uid;
				app.database().ref('users/' + this.uniqueUserId).once('value', snap => {
					this.currentUser = snap.val();
				});
				var cartRef = app.database().ref('users/' + this.uniqueUserId + '/cart');
				this.$bindAsArray('cart', cartRef);
      }else{
        this.isLoggedIn = false;
				this.uniqueUserId = 0;
      }
    });
		this.changeColor();
	}
}
</script>

<style scoped>
	.shadow{
		box-shadow:
		0 4px 5px 0 rgba(0,0,0,0.14),
		0 1px 10px 0 rgba(0,0,0,0.12),
		0 2px 4px -1px rgba(0,0,0,0.3);
	}
	.loader{
		position: absolute;
		width: 80%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loader img{
		position: relative;
		width: 50%;
	}
  .itemImage{
  	position: absolute;
		width: 100%;
		height: 100%;
		transition: .3s ease-in-out;
		opacity: 1;
  }
	.cart-container{
		z-index: 100000000;
	  position: fixed;
		overflow-y: auto;
	  top: 0px;
	  right: 20%;
	  max-height: 60vh;
		max-width: 50vw;
	  background: #ececec;
	  transform: translateY(-100%);
	  transition: .5s ease-in-out;
	  border-bottom-left-radius: 5px;
	  border-bottom-right-radius: 5px;
	  box-shadow: 0px 0px 20px -10px black;
		visibility: none;
	}
	.cart-icon{
		z-index: 100;
		border-left: 1px solid #919191;
		border-right: 1px solid #919191;
		border-bottom: 1px solid #919191;
	  position: fixed;
	  top: 0px;
	  right: 22%;
	  padding: 10px 20px;
	  background: #ececec;
	  color: black;
	  font-weight: 400;
	  border-bottom-right-radius: 20px;
	  border-bottom-left-radius: 20px;
	  box-shadow: 0px 0px 5px -10px black;
	  transition: .3s ease-in-out;
	  cursor: pointer;
	}
	.cart-icon:hover{
	  box-shadow: 0px 5px 20px -10px black;
	}
	.cart-down{
		visibility: visible;
	  transform: translateY(0%);
	  box-shadow: 0px 5px 20px -10px black;
	}
	.clear-cart{
		border-radius: 5px;
		cursor: pointer;
		transition: .3s ease-in-out;
		padding: 8px 16px !important;
		margin: 10px 0px;
		font-size: 14px;
	}
	.item-delete i{
		color: white;
	}
	.single-category{
		margin-top: 40px;
	}
	.btn{
		cursor: pointer;
	}
	.item-delete:hover{
		box-shadow: 0px 6px 15px -10px black !important;
	}
  .item-overlay{
  	top: 0;
  	z-index: 100;
		position: absolute;
		width: 100%;
		height: 100%;
		background: #514242;
		background: -moz-linear-gradient(-45deg, #514242 0%, #cee1e2 100%);
		background: -webkit-linear-gradient(-45deg, #514242 0%,#cee1e2 100%);
		background: linear-gradient(135deg, #514242 0%,#cee1e2 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#514242', endColorstr='#cee1e2',GradientType=1 );
		transform: translateY(-100%) scale(0);
		opacity: 0;
		transition: .3s ease-in-out;
  }
	.chosen > .item-overlay{
		transform: translateY(0%) scale(1);
		opacity: 1;
	}
	.chosen > .item-overlay > .item-close{
		transform: translateY(0px);
	}
	.item-close{
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 30px;
		font-weight: 100;
		color: white;
		cursor: pointer;
		transform: translateY(-70px);
		transition: .3s ease-in-out .4s;
	}
	.item-size{
		padding: 2px 10px;
		background: #555555;
		outline: none;
		opacity: 1;
		border-radius: 10px;
		color: white;
		cursor: pointer;
		font-size: 16px;
		margin: 2px 2px;
		font-weight: bold;
		transform: translateX(-10px);
		opacity: 0;
		transition: .3s ease-in-out;
	}
	.active-size{
		transform: translateX(0px);
		opacity: 1;
	}
	.item-title{
		position: relative;
		top: 30%;
		font-size: 22px;
		font-style: italic;
		color: white;
		text-align: center;
	}
	.size-container{
		top: 25%;
		position: relative;
		width: 80%;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.table th, .table td{
		vertical-align: middle;
		padding: 5px 15px;
	}
	.table th{
		font-size: 15px;
		font-weight: normal;
	}
	.table{
		margin-bottom: 0px;
	}
	.table td{
		font-size: 16px;
		text-align: center;
		color: #212121;
		font-weight: bold;
	}
	.footer-title{
		padding: 30px 0px !important;
		font-weight: 400 !important;
		text-align: center !important;
		font-size: 18px !important;
	}
	.img-thumbnail{
		width: 10vmin;
		height: 10vmin;
		background-size: cover;
		background-position: center;
		padding: 10px;
		border: 5px solid white;
	}
	.noMore{
		background: rgb(196, 49, 49);
		color: #b0b0b0;
	}
	.cloth-img{
		display: block;
		position: relative;
		width: 100%;
		transition: .3s;
	}
	.minimized-img{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.expanded-img ~ .desc{
		display: none;
	}
	.resize-img{
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 24px;
		color: black;
		z-index: 100;
		cursor: pointer;
	}
	.resizeWork{
		height: auto;
	}
	@media (max-width: 800px){
	  .cart-container{
	    right: 0px;
			max-width: 100vh;
	    width: 100vw;
	    max-height: 100vh;
	  }
		.table th, .table td{
			vertical-align: middle;
			padding: 5px 5px;
		}
		.loader{
			width: 100%;
		}
	}
</style>
