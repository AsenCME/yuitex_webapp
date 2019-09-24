<template>
  <div id="site-main">
    <div class="site-more-contact">
      <div class="site-narrow-content">
        <div class="row">
          <div class="col-md-4">
            <div class="site-feature site-feature-sm animate-box" data-animate-effect="fadeInLeft">
              <div class="site-icon">
                <i class="icon-globe"></i>
              </div>
              <div class="site-text">
                <p><a href="https://www.google.com">www.yuitex.com</a></p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="site-feature site-feature-sm animate-box" data-animate-effect="fadeInLeft">
              <div class="site-icon">
                <i class="icon-map"></i>
              </div>
              <div class="site-text">
                <p v-lang.address></p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="site-feature site-feature-sm animate-box" data-animate-effect="fadeInLeft">
              <div class="site-icon">
                <i class="icon-phone"></i>
              </div>
              <div class="site-text">
                <p><a href="tel://+359 889 461 992" style="display: block;">+359 889 461 992</a><a href="tel://+359 889 461 992">+359 889 839 898</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="site-narrow-content animate-box" data-animate-effect="fadeInLeft">
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <textarea onclick="this.focus();this.select()" style="resize: vertical;" id="message" cols="30" rows="7" class="form-control" :placeholder="getText('message')" v-model="messageContent" :disabled="!isLoggedIn"></textarea>
          </div>
          <div class="form-group">
            <button v-on:click="sendMsg()" class="btn btn-primary btn-md" value="Send Message" :disabled="!isLoggedIn" v-lang.sendMsg></button>
          </div>
        </div>
      </div>
    </div>
    <gmap-map
      ref="map"
      :center="{lat:42.02595529565199, lng:23.097522407770157}"
      :zoom="12"
      map-type-id="roadmap"
      scroll-wheel='false'
      style="width: 100%; height: 700px">
        <gmap-info-window :position="{lat:42.02595529565199, lng:23.097522407770157}">
          <span v-lang.address></span>
        </gmap-info-window>
        <gmap-marker :position="{lat:42.02595529565199, lng:23.097522407770157}">
        </gmap-marker>
      </gmap-map>
  </div>
</template>

<script>
import changeColorMixin from '../mixins/changeColorMixin'
import animateFunction from '../mixins/animationMixin'
import toast from 'izitoast'
import Firebase from 'firebase'
import app from '../firebaseApp'

export default {
  data(){
    return{
      isLoggedIn: '',
      messageContent: '',
      uniqueUserId: 0
    }
  },
  methods: {
    changeColor: changeColorMixin,
    animateEntrance: animateFunction,
    createId: function(time){
      var uniqueCode = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++){
        uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return time + "_" + uniqueCode;
    },
    getText: function(name){
      var lang = this.$language;
      if(name === 'message'){
        if(lang === 'en') return 'Message here';
        else return 'Вашето съобщение';
      }
    },
    sendMsg: function(){
      if(this.messageContent === ''){
        toast.warning({
          position: 'topRight',
          timeout: 2000,
          message: 'Message cannot be empty'
        });
        return;
      }
      var time = new Date().getTime();
      if(this.uniqueUserId !== 0){
        var msg = {
          timestamp: time,
          senderId: this.uniqueUserId,
          content: this.messageContent,
        };
        app.database().ref('messages').push(msg);
        toast.success({
          position: 'topRight',
          timeout: 2000,
          message: 'Message sent'
        });
      }else{
        toast.error({
          position: 'topRight',
          timeout: 2000,
          message: 'You need to login'
        });
      }
      this.messageContent = '';
    }
  },
	mounted(){
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.isLoggedIn = true;
        this.uniqueUserId = user.uid;
      }else{
        this.isLoggedIn = false;
        this.uniqueUserId = 0;
      }
    });
    this.animateEntrance();
    this.changeColor();
	}
}
</script>
