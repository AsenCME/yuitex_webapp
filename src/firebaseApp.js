import Firebase from 'firebase'

var config = {
  apiKey: "AIzaSyD3mBb02tZK5WED3-BBhKzvsL7OWSgIstg",
  authDomain: "yuitex-7fe2a.firebaseapp.com",
  databaseURL: "https://yuitex-7fe2a.firebaseio.com",
  projectId: "yuitex-7fe2a",
  storageBucket: "yuitex-7fe2a.appspot.com",
  messagingSenderId: "599239995035"
};

const app = Firebase.initializeApp(config);

export default app
