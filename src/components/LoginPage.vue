<template>
  <div id="login-form">
    <div class="login-container">
      <div class="login-card"></div>
      <div class="login-card">
        <h1 class="login-title">Login</h1>
        <form v-on:submit.prevent="login()">
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="email" id="#{label}" required="required" v-model="email"/>
            <label for="#{label}">Email</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="password" id="#{label}" required="required" v-model="password"/>
            <label for="#{label}">Password</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-button-container">
            <button type="submit"><span>Go</span></button>
          </div>
        </form>
      </div>
      <div class="login-card login-alt">
        <div v-on:click="toggleRegister()" class="login-toggle"></div>
        <h1 class="login-title">Register
          <div v-on:click="toggleRegister()" class="login-close"></div>
        </h1>
        <form v-on:submit.prevent="register()">
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="email" id="#{label}" required="required" v-model="email"/>
            <label for="#{label}">Email</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="password" id="#{label}" required="required" v-model="password"/>
            <label for="#{label}">Password</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="text" id="#{label}" required="required" v-model="address"/>
            <label for="#{label}">Address</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-input-container">
            <input onclick="this.focus();this.select()" type="phone" id="#{label}" required="required" v-model="phone"/>
            <label for="#{label}">Phone</label>
            <div class="login-bar"></div>
          </div>
          <div class="login-button-container">
            <button type="submit"><span>Next</span></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/css/loginForm.css'
import Firebase from 'firebase'
import app from '../firebaseApp'
import toast from 'izitoast'

export default {
  data(){
    return{
      email: '',
      address: '',
      phone: '',
      password: '',
      uniqueUserId: 0
    }
  },
  methods:{
    login: function(){
      var $this = this;
      Firebase.auth().signInWithEmailAndPassword($this.email, $this.password).then(function(){
        setTimeout(function(){
          $this.$router.push('/');
          toast.success({
            timeout: 1000,
            message: 'Successfully logged in',
            position: 'topRight',
            zindex: 9999999
          });
        }, 1000);
      }).catch(err => {
        toast.error({
          timeout: 3000,
          message: err.message,
          position: 'topRight',
          zindex: 9999999
        });
      });
    },
    toggleRegister: function(){
      $('.login-container').toggleClass('login-active');
    },
    register: function(){
      var $this = this;
      Firebase.auth().createUserWithEmailAndPassword($this.email, $this.password).then(function(){
        var newUser = {
          email: $this.email,
          phone: $this.phone,
          address: $this.address
        };
        setTimeout(function(){
          var users = app.database().ref('users').child($this.uniqueUserId).set(newUser);
          Firebase.auth().currentUser.sendEmailVerification().then(function(){
            $this.$router.push('/');
            location.reload();
          },function(err){
            toast.success({
              timeout: 1000,
              message: err.message,
              position: 'topRight',
              zindex: 9999999
            });
          });
          toast.success({
            timeout: 1000,
            message: 'Successfully signed in',
            position: 'topRight',
            zindex: 9999999
          });
          setTimeout(function(){
            $this.$router.push('/');
            location.reload();
          }, 1000);
        }, 1000)
      }).catch(function(err){
        toast.error({
          timeout: 3000,
          message: err.message,
          position: 'topRight',
          zindex: 9999999
        });
      });
    }
  },
  mounted(){
    Firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.uniqueUserId = user.uid;
      }else{
        this.uniqueUserId = 0;
      }
    });
  }
}
</script>

<style scoped>
  body{overflow-y: hidden;}
  @media (max-width: 800px) {
    .login-card .login-input-container {
      position: relative;
      margin: 20px 50px;
    }
    .login-container{
      width: 95%;
    }
  }
</style>
