import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import VerifyAccount from './views/VerifyAccount.vue'
import Sources from './views/Sources.vue'
import Settings from './views/Settings.vue'
import Profile from './views/Profile.vue'
import Invalid from './views/Invalid.vue'
import SinglePost from './views/SinglePost.vue'
import News from './views/News.vue'
import ExternalAssessmentCollector from './views/ExternalAssessmentCollector.vue'
import store from './store/store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/:postid',
      name: 'singlePost',
      component: SinglePost,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sources',
      name: 'sources',
      component: Sources,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:username',
      name: 'profile',
      props: true,
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup/:mode',
      name: 'signup',
      props: true,
      component: Signup
    },
    {
      path: '/signup',
      name: 'signupNoMode',
      component: Signup
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword
    },
    {
      path: '/reset-password/:token',
      name: 'resetPassword',
      props: true,
      component: ResetPassword
    },
    {
      path: '/verify-new-account/:mode/:token',
      name: 'verifyNewAccount',
      props: true,
      component: VerifyAccount
    },
    {
      path: '/verify-existing-account/:mode/:token',
      name: 'verifyExistingAccount',
      props: true,
      component: VerifyAccount
    },
    {
      path: '/assessment-request/:postid/:token',
      name: 'assessmentRequest',
      props: true,
      component: ExternalAssessmentCollector
    },
    {
      path: '/invalid',
      name: 'invalid',
      component: Invalid,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/news',
      name: 'news',
      component: News,
      meta: {
        title: 'Social news reading tools'
      }
    },
    {
      path: '/about/:activeTab?',
      props: true,
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '*',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isLoggedIn']) {
      next();
      window.scrollTo(0, 0);
      return;
    }
    else
      next('/login');
  } else {
    next();
  }
})

router.afterEach((to, from) => {
  if (to.meta.title)
    Vue.nextTick(() => {
        document.title = to.meta.title;
        document.querySelector('meta[property="og:title"]').setAttribute("content", to.meta.title);
    });
});

export default router;
