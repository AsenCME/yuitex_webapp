import Home from './components/HomePage.vue'
import Clothes from './components/ClothesPage.vue'
import About from './components/AboutPage.vue'
import Contact from './components/ContactPage.vue'
import Login from './components/LoginPage.vue'
import Profile from './components/ProfilePage.vue'
import Admin from './components/AdminPage.vue'
import ProfileStuff from './components/ProfileStuffPage.vue'

export default [
  {path: '/', component: Home},
  {path: '/clothes', component: Clothes, meta:{title: 'Юитекс | Каталог униформи'}},
  {path: '/about', component: About, meta:{title: 'Юитекс | За Нас'}},
  {path: '/contact', component: Contact, meta:{title: 'Юитекс | Контакти'}},
  {path: '/login', component: Login, meta:{title: 'Юитекс | Вход'}},
  {path: '/profile', component: Profile, meta:{title: 'Юитекс | профил'}},
  {path: '/admin', component: Admin, meta:{title: 'Юитекс | Администратор'}},
  {path: '/dashboard', component: ProfileStuff, meta:{title: 'Юитекс | Личен панел'}}
]
