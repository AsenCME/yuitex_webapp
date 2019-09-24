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
      <div v-if="messages.length === 0" style="padding: 20px;">
        There are no messages!
      </div>
      <header class="single-module" v-for="msg in messages">
        <div class="row">
          <div class="col-sm-12">
            <span class="msg-span">
              <span class="pull-right timestamp">{{getDate(msg.timestamp)}}</span>
              {{getUser(msg.senderId).email}}<br>
              <span v-if="!msg.completed" style="position: relative; top: -5px;" v-show="getUser(msg.senderId).phone">{{getUser(msg.senderId).phone}}</span>
              <br>
              <span v-if="!msg.completed" style="position: relative; top: -10px;" v-show="getUser(msg.senderId).address">{{getUser(msg.senderId).address}}</span>
            </span>
          </div>
          <div class="col-sm-12" style="padding-left: 35px;">{{msg.content}}</div>
          <div class="col-sm-12">
            <button class="btn btn-danger delete" v-on:click="deleteMessage($event, msg)"><i class="ti-trash"></i> Delete</button>
            <button class="btn btn-warning delete" v-on:click="openReply(msg)"><i class="ti-comment-alt"></i> Reply</button>
          </div>
        </div>
      </header>
    </div>

    <div class="orders-container data-container shadow">
      <header class="card-header" style="background: #7AC29A; color: white; font-weight: 900;">
        Orders
        <div class="close"><i class="ti-close" aria-hidden="true" data-id="orders" v-on:click="toggleTab('orders')"></i></div>
      </header>
      <div v-if="orders.length === 0" style="padding: 20px;">
        There are no orders!
      </div>
      <header class="single-module" v-for="order in orders" v-bind:class="isOrderCompleted(order)">
        <div class="row">
          <div class="col-sm-12">
            <span class="msg-span">
              <span class="pull-right timestamp">{{getDate(order.timestamp)}}</span>
              {{getUser(order.userId).email}} - {{order.totalPrice}} BGN
              <span v-if="!order.completed" style="position: relative; top: -5px;" v-show="getUser(order.userId).phone">{{getUser(order.userId).phone}}</span>
              <br>
              <span v-if="!order.completed" style="position: relative; top: -10px;" v-show="getUser(order.userId).address">{{getUser(order.userId).address}}</span>
            </span>
          </div>
          <div class="col-sm-12" v-if="!order.completed">
            <ul class="clothes">
              <li v-for="item in order.clothes">
                <i class="ti-angle-double-right"></i>
                <span style="font-weight: 900;">{{item.name}}</span><br>
                <span style="font-weight: 900; margin-left: 30px;">{{item.size}}</span> |
                <span style="font-weight: 900;">{{item.quantity}}</span> ({{item.price}} BGN)
              </li>
            </ul>
          </div>
          <div class="col-sm-12" v-if="!order.completed">
            <button class="btn btn-success delete" v-on:click="completeOrder($event, order)"><i class="ti-check"></i> Complete</button>
          </div>
        </div>
      </header>
    </div>

    <div class="categories-container data-container shadow">
      <header class="card-header" style="background: #DD0330; color: white; font-weight: 900;">
        Categories
        <button v-on:click="openAddCategory()" class="btn btn-success" style="margin-left: 20px; padding: 5px 8px !important;">
          <i class="ti-plus"></i>
        </button>
        <div class="close" style="transform: translateY(-120%);"><i class="ti-close" data-id="categories" v-on:click="toggleTab('categories')"></i></div>
      </header>
      <header class="single-module" v-for="category in categories">
        <div class="row">
          <div class="col-6 d-flex justify-content-start align-items-center">
            <h4 style="margin-bottom: 0px; font-size: 1.3rem;">
              <span class="category-name" v-on:click="toggleItems($event)">{{category.name}}</span>
            </h4>
          </div>
          <div class="col-6 d-flex justify-content-end align-items-center" style="padding: 0px;">
            <button class="btn btn-success edit-btn right" style="padding: 5px 8px !important;" v-on:click="openAddItem(category)">
              <i class="ti-plus"></i>
            </button>
            <button class="btn btn-warning edit-btn right" style="padding: 5px 8px !important;" v-on:click="openEditCategory(category)">
              <i class="ti-pencil"></i>
            </button>
            <button class="btn btn-danger edit-btn right" style="margin-bottom: 4px; margin-right: 20px; padding: 5px 8px !important;" v-on:click="deleteCategory(category)">
              <i class="ti-trash"></i>
            </button>
          </div>
          <div class="items">
            <section v-for="item in category.items" class="single-item">
              <div class="row">
                <div class="col-sm-12 col-md-10" style="padding: 0px;">
                  <span v-on:click="toggleSizes($event)" style="transition: .3s; cursor: pointer;">
                    <i class="ti-angle-double-right"></i>
                    {{item.name}} | {{item.price}} BGN
                  </span>
                </div>
                <div class="col-sm-12 col-md-2 d-flex justify-content-end align-items-center" style="padding: 0px;">
                  <button class="btn btn-success edit-btn right" style="padding: 3px 6px !important;">
                    <i class="ti-plus" v-on:click="openAddSize(category, item)"></i>
                  </button>
                  <button class="btn btn-warning edit-btn right" style="padding: 3px 6px !important;" v-on:click="openEditItem(category, item)">
                    <i class="ti-pencil"></i>
                  </button>
                  <button class="btn btn-danger edit-btn right" style="padding: 3px 6px !important;" v-on:click="deleteItem(category, item)">
                    <i class="ti-trash"></i>
                  </button>
                </div>
                <div class="sizes">
                  <span class="size" v-for="size in item.sizes">
                    <div class="row d-flex align-items-center justify-content-start">
                      <div class="col-6 d-flex align-items-center justify-content-start" style="padding: 0px;">
                        <i class="ti-arrow-right" style="margin-right: 10px;"></i>
                        <span style="font-weight: bold; margin-right: 8px;">{{size.value}}</span>| {{size.availableQty}}
                      </div>
                      <div class="col-6 d-flex align-items-center justify-content-end" style="padding: 0px;">
                        <button class="btn btn-warning edit-btn right" style="padding: 1px 4px !important; margin: 0px; margin-left: 2px;" v-on:click="openEditSize(category, item, size)">
                          <i class="ti-pencil"></i>
                        </button>
                        <button class="btn btn-danger edit-btn right" style="padding: 1px 4px !important; margin: 0px; margin-left: 2px;" v-on:click="deleteSize(category, item, size)">
                          <i class="ti-trash"></i>
                        </button>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </section>
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
              {{messages.length}}
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
              {{orders.length}}
            </div>
          </div>
        </div>
      </div>
      <hr style="width: 90%; margin: 5px auto;">
      <button class="btn btn-success btn-block" style="width: 80%; margin: 10px auto; border: none;" v-on:click="toggleTab('orders')">Open</button>
    </div>

    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col-5">
            <div class="icon-card" style="color: #DD0330;">
              <i class="ti-layers-alt"></i>
            </div>
          </div>
          <div class="col-7">
            <div class="card-numbers">
              {{categories.length}}
            </div>
          </div>
        </div>
      </div>
      <hr style="width: 90%; margin: 5px auto;">
      <button class="btn btn-danger btn-block" style="width: 80%; margin: 10px auto; border: none;" v-on:click="toggleTab('categories')">Open</button>
    </div>


    <!-- XXX Adding/Editing Modals XXX -->
    <div class="add-container add-category">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="openAddCategory()"></i>
        </div>
        <input  onclick="this.focus();this.select()" v-model="newCategoryName" type="text" class="form-control" placeholder="Category name" style="width: 100%;  margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="newCategoryNameEn" type="text" class="form-control" placeholder="Category name (english)" style="width: 100%;">
        <button type="text" style="margin-top: 20px;" class="btn btn-success" v-on:click="addCategory()">Add Category</button>
      </div>
    </div>

    <div class="add-container edit-category">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeEditCategory()"></i>
        </div>
        <input  onclick="this.focus();this.select()" v-model="categoryBeingEdited.name" type="text" class="form-control" placeholder="Category name" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="categoryBeingEdited.nameEn" type="text" class="form-control" placeholder="Category name (english)" style="width: 100%;">

        <button type="text" style="margin-top: 20px;" class="btn btn-warning" v-on:click="editCategory()">Edit Category</button>
      </div>
    </div>

    <div class="add-container add-item">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeAddItem()"></i>
        </div>
        <input  onclick="this.focus();this.select()" type="file" class="form-control" placeholder="Upload item picture" style="width: 100%; margin-bottom: 10px;">
        <div class="item-progress">
          <div class="item-progress-bar">
          </div>
        </div>
        <input  onclick="this.focus();this.select()" v-model="newItemName" type="text" class="form-control" placeholder="Item name" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="newItemNameEn" type="text" class="form-control" placeholder="Item name (english)" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="newItemPrice" type="text" class="form-control" placeholder="Item price" style="width: 100%;">
        <button type="text" style="margin-top: 20px;" class="btn btn-success" v-on:click="addItem($event)">Add Item</button>
      </div>
    </div>

    <div class="edit-container edit-item">
      <div class="edit-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeEditItem()"></i>
        </div>
        <input  onclick="this.focus();this.select()" type="file" class="form-control" placeholder="Upload item picture" style="width: 100%; margin-bottom: 10px;">
        <div class="item-progress">
          <div class="item-progress-bar">
          </div>
        </div>
        <img v-lazy="itemBeingEdited.imageUrl" style="width: 100%; margin-bottom: 10px;"/>
        <input  onclick="this.focus();this.select()" v-model="itemBeingEdited.name" type="text" class="form-control" placeholder="Item name" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="itemBeingEdited.nameEn" type="text" class="form-control" placeholder="Item name (english)" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="itemBeingEdited.price" type="text" class="form-control" placeholder="Item price" style="width: 100%;">
        <button type="text" style="margin-top: 20px;" class="btn btn-warning" v-on:click="editItem($event)">Edit Item</button>
      </div>
    </div>

    <div class="add-container add-size">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeAddSize()"></i>
        </div>
        <input  onclick="this.focus();this.select()" v-model="newSizeValue" type="text" class="form-control" placeholder="Size value" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="newSizeQty" type="text" class="form-control" placeholder="Size quantity" style="width: 100%;">
        <button type="text" style="margin-top: 20px;" class="btn btn-success" v-on:click="addSize()">Add Size</button>
      </div>
    </div>

    <div class="add-container edit-size">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeEditSize()"></i>
        </div>
        <input  onclick="this.focus();this.select()" v-model="sizeBeingEdited.value" type="text" class="form-control" placeholder="Size value" style="width: 100%; margin-bottom: 10px;">
        <input  onclick="this.focus();this.select()" v-model="sizeBeingEdited.availableQty" type="text" class="form-control" placeholder="Size quantity" style="width: 100%;">
        <button type="text" style="margin-top: 20px;" class="btn btn-warning" v-on:click="editSize()">Edit Size</button>
      </div>
    </div>

    <div class="add-container reply">
      <div class="add-modal shadow">
        <div style="width: 100%; margin-bottom: 20px;">
          <i style="float: right; cursor: pointer;" class="ti-close" v-on:click="closeReply()"></i>
        </div>
        <textarea onclick="this.focus();this.select()" v-model="replyContent" type="text" class="form-control" placeholder="Your reply" style="width: 100%; margin-bottom: 10px;"></textarea>
        <button type="text" style="margin-top: 20px;" class="btn btn-warning" v-on:click="sendReply()">Send Reply</button>
      </div>
    </div>

  </div>
</template>

<script>
import Firebase from 'firebase'
import app from '../firebaseApp'
import toast from 'izitoast'
import '../assets/css/adminStyles.css'

var messagesRef = app.database().ref('messages');
var ordersRef = app.database().ref('orders');
var usersRef = app.database().ref('users');
var catRef = app.database().ref('categories');

export default {
  firebase:{
    messages: messagesRef,
    orders: ordersRef,
    users: usersRef,
    categories: catRef
  },
  data(){
    return{
      newCategoryName: '',
      newCategoryNameEn: '',
      categoryBeingEdited: '',

      newItemName: '',
      newItemNameEn: '',
      newItemPrice: '',
      newItemCategory: '',

      itemBeingEdited: '',
      itemBeingEditedCategory: '',

      newSizeValue: '',
      newSizeQty: '',
      newSizeCategory: '',
      newSizeItem: '',

      sizeBeingEdited: '',
      sizeBeingEditedCategory: '',
      sizeBeingEditedItem: '',

      replyContent: '',
      msgToDelete: '',
      userBeingRepliedTo: ''
    }
  },
  methods: {
    generateId: function(name){
    	var output = '';
    	for (var i = 0; i < name.length; i ++) {
    		var c = name[i];
    		if (c.match(/[a-z]/i)) {
    			var code = name.charCodeAt(i);
    			if ((code >= 65) && (code <= 90))
    				c = String.fromCharCode(((code - 65 + 10) % 26) + 65);
    			else if ((code >= 97) && (code <= 122))
    				c = String.fromCharCode(((code - 97 + 10) % 26) + 97);
    		}
    		output += c;
    	}
      var uniqueCode = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++){
        uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      var id = output.replace(" ", "_") + "_" + uniqueCode;
      return id;
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
    toggleItems: function($event){
      $($event.target).toggleClass('active-name');
      var el = $($event.target).parent().parent().siblings().eq(1);
      el.toggleClass('active-items');
    },
    toggleSizes: function($event){
      $($event.target).parent().siblings().eq(1).toggleClass('active-sizes');
      $($event.target).toggleClass('active-item');
    },
    getDate: function(milliseconds){
      var date = new Date(milliseconds);
      var dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
      return dateString;
    },
    getUser: function(userId){
      var user = this.users.filter(user => user[".key"] == userId)[0];
      return user;
    },
    toggleTab: function(modalName){
      if(modalName === 'messages'){
        $('.messages-container').toggleClass('active-card');
      }else if(modalName === 'orders'){
        $('.orders-container').toggleClass('active-card');
      }else if(modalName === 'categories'){
        $('.categories-container').toggleClass('active-card');
      }
    },
    isOrderCompleted: function(order){
      if(order.completed){
        return 'completed-order';
      }
    },

    openReply: function(msg){
      this.userBeingRepliedTo = msg.senderId;
      this.msgToDelete = msg;
      $('.reply').addClass('active-add');
    },
    closeReply: function(){
      $('.reply').removeClass('active-add');
    },
    sendReply: function(){
      if(this.replyContent === ''){
        toast.warning(this.createToast('Plase enter text', 1000));
        return;
      }
      var time = new Date().getTime();
      var newMsg = {
        timestamp: time,
        content: this.replyContent,
        senderId: this.userBeingRepliedTo,
      };
      app.database().ref('users/' + newMsg.senderId + '/replies').push(newMsg);
      app.database().ref('messages/' + this.msgToDelete[".key"]).remove();
      toast.success(this.createToast('Reply Success', 1000));
      $('.reply').removeClass('active-add');
      this.replyContent = '';
      this.msgToDelete = '';
      this.userBeingRepliedTo = '';
    },

    deleteMessage: function($event, msg){
      app.database().ref('messages/' + msg[".key"]).remove();
      toast.success(this.createToast('Message deleted', 1000));
    },
    completeOrder: function($event, order){
      app.database().ref('orders/' + order.id + '/completed').set(true);
      toast.success(this.createToast('Order completed', 1000));
    },

    openAddCategory: function(){
      $('.add-category').toggleClass('active-add');
    },
    addCategory: function(){
      var name = this.newCategoryName;
      var nameEn = this.newCategoryNameEn;
      if(name.length === 0){
        toast.warning(this.createToast('Name cannot be empty', 2000));
        return;
      }
      var id = this.generateId(nameEn);
      var newCategory = {
        name: name,
        nameEn: nameEn,
        id: id,
        items: {}
      }
      app.database().ref('categories').child(id).set(newCategory);
      toast.success(this.createToast('Category added', 1000));
      this.newCategoryName = '';
      this.newCategoryNameEn = '';
    },
    openEditCategory: function(category){
      this.categoryBeingEdited = category;
      $('.edit-category').addClass('active-add');
    },
    closeEditCategory: function(){
      this.categoryBeingEdited = '';
      $('.edit-category').removeClass('active-add');
    },
    editCategory: function(){
      var category = this.categoryBeingEdited;
      app.database().ref('categories/' + category.id + '/name').set(category.name);
      app.database().ref('categories/' + category.id + '/nameEn').set(category.nameEn);
      $('.edit-category').toggleClass('active-add');
      toast.warning(this.createToast('Category changed', 1000))
      this.categoryBeingEdited = '';
    },
    deleteCategory: function(category){
      var catRef = app.database().ref('categories/' + category.id);
      catRef.child('items').once('value', snap => {
        snap.forEach(item => {
          var id = item.val().id;
          app.storage().ref().child(id).delete();
        });
        catRef.remove();
      });

      toast.success(this.createToast('Category deleted', 1000));
    },

    openAddItem: function(category){
      this.newItemCategory = category;
      $('.add-item').addClass('active-add');
    },
    closeAddItem: function(){
      this.newItemCategory = '';
      $('.add-item').removeClass('active-add');
    },
    addItem($event){
      var self = this;
      var category = this.newItemCategory;
      var name = this.newItemName;
      var nameEn = this.newItemNameEn;
      var price = this.newItemPrice;
      var progressBar = $('.item-progress-bar');
      var id = this.generateId(nameEn);
      var file = $($event.target).siblings().eq(1)[0].files[0];

      if(!file || category.length === 0 || price.length === 0 || name.length === 0){
        toast.warning(this.createToast('Fill all fields', 2000));
        return;
      }

      var upload = Firebase.storage().ref().child(id).put(file);
      upload.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.css("width", progress);
      }, function(error) {
        toast.error(self.createToast('Some error occured', 1500));
      }, function() {
        progressBar.css("width", "100%");
        var downloadURL = upload.snapshot.downloadURL;
        var newItem = {
          name: name,
          nameEn: nameEn,
          price: price,
          id: id,
          imageUrl: downloadURL
        }
        app.database().ref('categories/' + category.id + '/items/').child(id).set(newItem);
        self.newItemName = '';
        self.newItemNameEn = '';
        self.newItemPrice = '';
        self.newItemCategory = '';
        setTimeout(function(){
          progressBar.css("width", "0%");
          $($event.target).siblings().eq(1)[0].value = '';
        }, 1000)
        toast.success(self.createToast('Item added', 2000));
      });
    },
    openEditItem: function(category, item){
      this.itemBeingEdited = item;
      this.itemBeingEditedCategory = category;
      $('.edit-item').addClass('active-edit');
    },
    closeEditItem: function(){
      this.itemBeingEdited = '';
      this.itemBeingEditedCategory = '';
      $('.edit-item').removeClass('active-edit');
    },
    editItem: function($event){
      var item = this.itemBeingEdited;
      var category = this.itemBeingEditedCategory;
      var file = $($event.target).siblings().eq(1)[0].files[0];
      var progressBar = $('.item-progress-bar');
      var self = this;

      var itemRef = app.database().ref('categories/' + category.id + '/items/' + item.id);
      itemRef.child('name').set(item.name);
      itemRef.child('nameEn').set(item.nameEn);
      itemRef.child('price').set(item.price);

      if(file){
        app.storage().ref().child(item.id).delete();
        var upload = app.storage().ref().child(item.id).put(file);
        upload.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressBar.css("width", progress);
        }, function(error) {
          toast.error(self.createToast(error.message, 3000));
        }, function() {
          progressBar.css("width", "100%");
          var downloadURL = upload.snapshot.downloadURL;
          itemRef.child('imageUrl').set(downloadURL);
          setTimeout(function(){
            progressBar.css("width", "0%");
            $($event.target).siblings().eq(1)[0].value = '';
          }, 1000);
          toast.warning(self.createToast('Item changed', 1000));
        });
      }else{
        toast.warning(self.createToast('Item changed', 1000));
      }
    },
    deleteItem: function(category, item){
      var self = this;
      app.storage().ref().child(item.id).delete().then(function() {
        app.database().ref('categories/' + category.id + '/items/' + item.id).remove();
        toast.success(self.createToast('Item deleted', 1000));
      }).catch(function(error) {
        toast.error(self.createToast('An error occured - ' + error.message, 3000));
      });
    },

    openAddSize: function(category, item){
      this.newSizeCategory = category;
      this.newSizeItem = item;
      $('.add-size').addClass('active-add');
    },
    closeAddSize: function(){
      this.newSizeCategory = '';
      this.newSizeItem = '';
      $('.add-size').removeClass('active-add');
    },
    addSize: function(){
      var value = this.newSizeValue;
      var qty = this.newSizeQty;
      var category = this.newSizeCategory;
      var item = this.newSizeItem;
      var id = this.generateId(value);
      this.newSizeQty = '';
      this.newSizeValue = '';

      var newSize = {
        id: id,
        value: value,
        availableQty: qty
      }
      app.database().ref('categories/' + category.id + '/items/' + item.id + '/sizes/').child(id).set(newSize);
      toast.success(this.createToast('Size added', 1000));
    },
    openEditSize: function(category, item, size){
      this.sizeBeingEdited = size;
      this.sizeBeingEditedCategory = category;
      this.sizeBeingEditedItem = item;
      $('.edit-size').addClass('active-add');
    },
    closeEditSize: function(){
      this.sizeBeingEdited = '';
      this.sizeBeingEditedCategory = '';
      this.sizeBeingEditedItem = '';
      $('.edit-size').removeClass('active-add');
    },
    editSize: function(){
      var category = this.sizeBeingEditedCategory;
      var item = this.sizeBeingEditedItem;
      var size = this.sizeBeingEdited;
      var sizeRef = app.database().ref('categories/' + category.id + '/items/' + item.id + '/sizes/' + size.id);
      sizeRef.child('value').set(size.value);
      sizeRef.child('availableQty').set(size.availableQty);
      toast.warning(this.createToast('Size changed', 1000));
    },
    deleteSize: function(category, item, size){
      app.database().ref('categories/' + category.id + '/items/' + item.id + '/sizes/' + size.id).remove();
      toast.error(this.createToast('Size deleted', 1000));
    },
  },
  mounted(){
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
      }else{
        this.$router.push('/');
      }
    });
  }
}
</script>
