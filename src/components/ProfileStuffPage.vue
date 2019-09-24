<template>
  <div id="admin-page">

    <div class="goBack" v-on:click="$router.push('/')">
      <i class="fa fa-arrow-left" aria-hidden="true"></i> Back
    </div>


    <div class="messages-container data-container shadow">
      <header class="card-header" style="background: #F3BB45; color: white; font-weight: 900;">
        Messages
        <div class="close"><i class="ti-close" aria-hidden="true" data-id="messages" v-on:click="toggleTab('messages')"></i></div>
      </header>
      <div v-if="replies.length === 0" style="padding: 20px;">
        There are no messages!
      </div>
      <header class="single-module" v-for="reply in replies">
        <div class="row">
          <div class="col-sm-12">
            <span class="msg-span">
              The Admin replied:
            </span>
            <span class="pull-right timestamp">{{getDate(reply.timestamp)}}</span>
          </div>
          <div class="col-sm-12" style="padding-left: 35px;">{{reply.content}}</div>
          <div class="col-sm-12">
            <button class="btn btn-danger delete" v-on:click="deleteReply(reply)"><i class="ti-trash"></i> Delete</button>
            <button class="btn btn-warning delete" v-on:click="openReply(reply)"><i class="ti-comment-alt"></i> Reply</button>
          </div>
        </div>
      </header>
    </div>

    <div class="orders-container data-container shadow">
      <header class="card-header" style="background: #7AC29A; color: white; font-weight: 900;">
        Orders
        <div class="close"><i class="ti-close" aria-hidden="true" data-id="orders" v-on:click="toggleTab('orders')"></i></div>
      </header>
      <div v-if="ordersCount === 0" style="padding: 20px;">
        There are no messages!
      </div>
      <header class="single-module" v-for="order in filteredOrders" v-bind:class="isOrderCompleted(order)">
        <div class="row">
          <div class="col-sm-12">
            <span class="msg-span">
              <span class="pull-right timestamp">{{getDate(order.timestamp)}}</span>
              {{order.totalPrice}} BGN <span v-if="order.completed" style="color: #ccc;"> - COMPLETED</span>
            </span>
          </div>
          <div class="col-sm-12">
            <ul class="clothes">
              <li v-for="item in order.clothes">
                <i class="ti-angle-double-right"></i>
                <span style="font-weight: 900;">{{item.name}}</span><br>
                <span style="font-weight: 900; margin-left: 30px;">{{item.size}}</span> |
                <span style="font-weight: 900;">{{item.quantity}}</span> ({{item.price}} BGN)
              </li>
            </ul>
          </div>
          <div class="col-sm-12">
            <button class="btn btn-danger delete" v-if="!order.completed" v-on:click="cancelOrder(order)"><i class="ti-close"></i> Cancel order</button>
            <button class="btn agree" v-else v-on:click="deleteOrder(order)"><i class="ti-check"></i> OK</button>
          </div>
        </div>
      </header>
    </div>


    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col-5">
            <div class="icon-card" style="color: #F3BB45;">
              <i class="ti-comment-alt"></i>
            </div>
          </div>
          <div class="col-7">
            <div class="card-numbers">
              {{replies.length}}
            </div>
          </div>
        </div>
      </div>
      <hr style="width: 90%; margin: 5px auto;">
      <button class="btn btn-warning btn-block" style="width: 80%; margin: 10px auto; border: none;" v-on:click="toggleTab('messages')">Open</button>
    </div>

    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col-5">
            <div class="icon-card" style="color: #7AC29A;">
              <i class="ti-shopping-cart-full"></i>
            </div>
          </div>
          <div class="col-7">
            <div class="card-numbers">
              {{ordersCount}}
            </div>
          </div>
        </div>
      </div>
      <hr style="width: 90%; margin: 5px auto;">
      <button class="btn btn-success btn-block" style="width: 80%; margin: 10px auto; border: none;" v-on:click="toggleTab('orders')">Open</button>
    </div>

    <div class="add-container reply">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeReply()"></i>
        </div>
        <textarea onclick="this.focus();this.select()" v-model="newMessageContent" type="text" class="form-control" placeholder="Your reply" style="width: 100%; margin-bottom: 10px;"></textarea>
        <button type="text" style="margin-top: 20px;" class="btn btn-warning" v-on:click="reply()">Send Reply</button>
      </div>
    </div>

  </div>
</template>

<script>
import Firebase from 'firebase'
import app from '../firebaseApp'
import toast from 'izitoast'
import '../assets/css/adminStyles.css'

export default {
  firebase:{
    orders: app.database().ref('orders'),
  },
  data(){
    return{
      userId: 0,
      ordersCount: 0,
      replies: [],
      newMessageContent: '',
      replyToDelete: ''
    }
  },
  computed: {
    filteredOrders: function(){
      var filtered = this.orders.filter(o => o.userId === this.userId);
      this.ordersCount = filtered.length;
      return filtered;
    },
  },
  methods:{
    openReply: function(reply){
      this.replyToDelete = reply;
      $('.reply').addClass('active-add');
    },
    closeReply: function(){
      $('.reply').removeClass('active-add');
    },
    reply: function(){
      var newMsg = {
        content: this.newMessageContent,
        timestamp: new Date().getTime(),
        senderId: this.replyToDelete.senderId,
      }

      app.database().ref('messages').push(newMsg);
      this.closeReply();

      this.deleteReply(this.replyToDelete);
      this.newMessageContent = '';
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
				transitionOutMobile:  'fadeOutUp',
        opacity: 1
			};
		},
    toggleTab: function(modalName){
      if(modalName === 'messages'){
        $('.messages-container').toggleClass('active-card');
      }else if(modalName === 'orders'){
        $('.orders-container').toggleClass('active-card');
      }
    },
    getDate: function(milliseconds){
      var date = new Date(milliseconds);
      var dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
      return dateString;
    },
    isOrderCompleted: function(order){
      if(order.completed){
        return 'completed-order';
      }
    },

    cancelOrder: function(order){
      var clothes = order.clothes;
      for(var itemKey in clothes){
        var item = clothes[itemKey];
        var categoryId = item.categoryId;
        var itemId = item.refId;
        var sizeId = item.sizeId;
        var qty = item.quantity;
        var sizeRef = app.database().ref('categories/' + categoryId + '/items/' + itemId + '/sizes/' + sizeId);
        sizeRef.child('availableQty').once('value', currentQty => {
          sizeRef.child('availableQty').set(currentQty.val() + qty);
        });
      }
      app.database().ref('orders/' + order.id).remove();
      toast.error(this.createToast('Order cancelled', 1000));
    },
    deleteOrder: function(order){
      app.database().ref('orders/' + order.id).remove();
      toast.error(this.createToast('Order deleted', 1000));
    },
    deleteReply: function(reply){
      app.database().ref('users/' + reply.senderId + '/replies/' + reply[".key"]).remove();
      toast.error(this.createToast('Reply deleted', 1000));
    },
  },
  mounted(){
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.userId = user.uid;
        var repliesRef = app.database().ref('users/' + user.uid + '/replies');
        this.$bindAsArray('replies', repliesRef);
      }else{
        this.$router.push('/');
      }
    });
  }
}
</script>
