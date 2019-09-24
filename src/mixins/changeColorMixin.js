import Firebase from 'firebase'
import '../firebaseApp'



var changeColor = function(){
  Firebase.auth().onAuthStateChanged(function(user){
    if(user){
      $('.main-circle').removeClass('signedOut');
      $('.main-circle').addClass('signedIn');
    }else{
      $('.main-circle').removeClass('signedIn');
      $('.main-circle').addClass('signedOut');
    }
  });
}

export default changeColor
