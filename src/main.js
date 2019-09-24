import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import VueRouter from 'vue-router'
import Routes from './routes'
import Firebase from 'firebase'
import app from './firebaseApp'
import VueLazyload from 'vue-lazyload'
import * as VueGoogleMaps from 'vue2-google-maps'
import MultiLanguage from 'vue-multilanguage'
import {VueMasonryPlugin} from 'vue-masonry';

Vue.use(VueMasonryPlugin)

Vue.use(MultiLanguage, {
  default: 'bg',
  en: {
    companyName: 'yuitex',
    menuHome: 'Home',
    menuClothes: 'Clothes',
    menuAbout: 'About',
    menuContact: 'Contact',
    address: '2700 Blagoevgrad, ul. "Stefan Stambolov" 51B',
    sendMsg: 'Send Message',
    aboutTitle: 'About Company',
    services: 'Features',
    greeting: 'Hello, {name}!',
    slider1Main: '"Yuitex" EOOD',
    slider1Sub: 'Uniform and work wear',
    slider2Main: 'Online catalogue',
    slider2Sub: 'Pick and order easily',
    catalogue: 'to the catalogue',
    contactUs: 'Contact us',
    feature1Name: 'Our Offers',
    feature1Desc: 'We take orders for uniform and work wear production.',
    feature2Name: 'Aims',
    feature2Desc: 'Our goal is to provide quality service and proper fulfilment of and given order, in order to keep customers satisfied.',
    feature3Name: 'Online catalogue',
    feature3Desc: 'Created to be convenient for customers, wishing to inquire about the available items and to send their queries.',
    feature4Name: 'Store',
    feature4Desc: 'Near the centre of Blagoevgrad, offers excellent service and a possibility for customers to try items on the spot.',
    aboutDesc: '"Yuitex" is a family firm, which  is devoted to completing orders for uniform and work wear. We aim to offer the best prices, quality service and a standart in our choice of materials. Our store is situated in Blagoevgrad, at (on) 51 “Stefan Stambolov” street. You can contact us on this number – 0889461992 or per email – yuitex@abv.bg. Every query will be completed in a short term and our customers will receive their items at the firm store.',
    gallery: "Gallery",
  },
  bg: {
    companyName: 'юитекс',
    menuHome: 'Начало',
    menuClothes: 'Дрехи',
    menuAbout: 'За Нас',
    menuContact: 'Контакти',
    address: '2700 Благоевград, ул. Стефан Стамболов 51Б',
    sendMsg: 'Изпрати',
    aboutTitle: 'За нашата фирма',
    services: 'Характеристики',
    greeting: 'Здравей, {name}!',
    slider1Main: 'Юитекс ЕООД',
    slider1Sub: 'Униформено и работно облекло',
    slider2Main: 'Онлайн каталог',
    slider2Sub: 'Изберете и поръчайте - лесно и удобно',
    catalogue: 'Към каталога',
    contactUs: 'Свържете се с нас',
    feature1Name: 'Нашите предложения ',
    feature1Desc: 'Изпълняваме поръчки за униформено и работно облекло по заявка.',
    feature2Name: 'Цели',
    feature2Desc: 'Стремим се да предложим качествено обслужване и коректно изпълненение на всяка поръчка, за да бъдат нашите клиенти доволни. ',
    feature3Name: 'Онлайн каталог ',
    feature3Desc: 'Създаден, за удобство на клиентите, които биха искали да се усведомят за предлаганите артикули и да подадат своята заявка онлайн.',
    feature4Name: 'Фирмен магазин ',
    feature4Desc: 'В близост до центъра на Благоевград, предлага отлично обслужване и възможност за проба на място.',
    aboutDesc: '"Юитекс" е семейна фирма, която се занимава с производство на униформено и работно облекло по поръчка. Стараем се да предлагаме най-добрите цени, качествено обслужване и стандарт в избора на материали. Нашият магазин се намира в Благоевград, на улица ,, Стефан Стамболов“ 51. Можете да се свържете с нас на телефон 0889461992 или на имейл yuitex@abv.bg. Всяка подадена заявка ще се изпълнява в кратък срок и нашите клиенти ще получават своите артикули при посещение в магазина.',
    gallery: "Галерия",
  }
});

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBvWE_sIwKbWkiuJQOf8gSk9qzpO96fhfY',
    libraries: 'places',
  }
})

Vue.use(VueFire);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: Routes
});

router.beforeEach((to, from, next) => {

  let docTitle = "Юитекс ЕООД - Униформи и униформено облекло";
  if(to.meta.title){
    docTitle = to.meta.title;
  }
  document.title=docTitle;

  Firebase.auth().onAuthStateChanged(user => {
    if(user){
      if(user.email !== 'admin@yuitex.com' && to.path === '/admin'){
        next(false);
        location.reload();
      }else{
        next();
      }
    }else{
      if(to.path === '/profile' || to.path === '/admin' || to.path === '/ordmsg'){
        next('/login');
      }else{
        next();
      }
    }
  });
});

var vue = new Vue({
  el: '#app',
  render: h => h(App),
  router: router
});

Vue.use(VueLazyload, {
  preLoad: 0.5,
  attempt: 3,
  loading: '../static/Ripple.svg'
});
