<template>
  <div id="site-main">
    <div class="row">
      <div class="login-container">
        <div class="login-card"></div>
        <div class="login-card">
          <h1 class="login-title">View Profile</h1>
          <form v-on:submit.prevent="updateUser()">
            <div class="login-input-container">
              <input onclick="this.focus();this.select()" type="text" id="#{label}" v-model="currentUser.username"/>
              <label for="#{label}">Username</label>
              <div class="login-bar"></div>
            </div>
            <div class="login-input-container">
              <input onclick="this.focus();this.select()" type="email" id="#{label}" v-model="currentUser.email" required/>
              <label for="#{label}">Email</label>
              <div class="login-bar"></div>
            </div>
            <div class="login-input-container">
              <input onclick="this.focus();this.select()" type="text" id="#{label}" v-model="currentUser.address" required/>
              <label for="#{label}">Address</label>
              <div class="login-bar"></div>
            </div>
            <div class="login-input-container">
              <input onclick="this.focus();this.select()" type="text" id="#{label}" v-model="currentUser.phone" required/>
              <label for="#{label}">Phone</label>
              <div class="login-bar"></div>
            </div>
            <div class="login-button-container">
              <button type="submit"><span>Go</span></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/css/loginForm.css'
import changeColorMixin from '../mixins/changeColorMixin'
import animateFunction from '../mixins/animationMixin'
import toast from 'izitoast'
import Firebase from 'firebase'
import app from '../firebaseApp'

export default {
  data(){
    return{
			currentUser: ''
    }
  },
  methods:{
		changeColor: changeColorMixin,
		animateEntrance: animateFunction,
    updateUser: function(){
      var self = this;
      var user = Firebase.auth().currentUser;
      if(user){
        app.database().ref('users/' + user.uid).once('value', snap => {
          if(this.currentUser.username === snap.val().username && this.currentUser.phone === snap.val().phone && this.currentUser.email === snap.val().email && this.currentUser.address === snap.val().address){
            toast.info({
              message: 'No changes have been made',
              position: 'topRight',
              timeout: 2000
            });
          }else if(this.currentUser.email !== snap.val().email){
            user.updateEmail(this.currentUser.email).then(function(){
              app.database().ref('users/' + user.uid + '/email').set(self.currentUser.email);
              toast.success({
                message: 'Profile updated',
                position: 'topRight',
                timeout: 2000
              });
            }).catch(function(err){
              if(err.code === 'auth/requires-recent-login'){
                toast.warning({
                  message: err.message,
                  position: 'topRight',
                  timeout: 2000,
                  onOpened: function(){
                    setTimeout(function(){
                      self.$router.push('/login');
                    }, 2000);
                  }
                });
              }else{
                toast.error({
                  message: err.message,
                  position: 'topRight',
                  timeout: 4000
                });
              }
            });
          }else{
            app.database().ref('users/' + user.uid).set(this.currentUser);
            toast.success({
              message: 'Profile updated',
              position: 'topRight',
              timeout: 2000
            });
          }
        });
      }
    }
  },
  beforeCreate(){
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
        var userRef = app.database().ref('users/' + user.uid);
        userRef.on('value', snapshot => {
          this.currentUser = snapshot.val();
        });
      }else{

      }
    });
  },
	mounted(){
		this.animateEntrance();
		this.changeColor();
	}
}
</script>
<style scoped>
  @media (max-width: 800px){
    .login-container{
      width: 95vw;
      margin-top: 7vh;
      margin-bottom: 2vh;
    }
  }
</style>
