import Vue from 'vue'
import postServices from '@/services/postServices'

export default {
  namespaced: true,
  state: {
    validity_filter: 'All',
    source_filter: 'Followed',
    seen_filter: 'Not Seen',
    source_usernames: [],
    articles: [],
    offset: 0,
    limit: 10,
    articles_fetched: false
  },
  mutations: {
    append_articles: (state, posts) => {
      let article_ids = state.articles.map(article => article.id);
      let filtered_posts = posts.filter(post => !article_ids.includes(post.id) );
      state.articles.push(...filtered_posts);
      state.offset += posts.length;
    },

    refresh_articles: (state) => {
      state.articles = [];
      state.offset = 0;
    },

    change_filter_value: (state, filters) => {
      state.validity_filter = filters.filters.validity ? filters.filters.validity : 'All';
      state.source_filter = filters.filters.sources ?
        (filters.filters.sources == 'Selected Sources' ?  'usernames' : filters.filters.sources)
        : 'All';

      state.seen_filter = filters.filters.seen_status ? filters.filters.seen_status : 'All';

      state.validity_filter = state.validity_filter.toLowerCase();
      state.source_filter = state.source_filter.toLowerCase();
      state.seen_filter = state.seen_filter.toLowerCase();

      state.source_usernames = filters.source_usernames;
    },

    update_boost: (state, boost) => {
      let index = state.articles.findIndex(article => article.id == boost.id);
      Vue.set(state.articles, index, boost);
    },

    remove_boost: (state, post_id) => {
      let index = state.articles.findIndex(article => article.id == post_id);
      state.articles.splice(index, 1);
    },

    set_fetch_status: (state, status) =>{
      state.articles_fetched = status;
    }
  },
  actions: {

    getArticles: (context) => {

      return new Promise((resolve, reject) => {

        postServices.getBoosts({offset: context.state.offset, limit: context.state.limit},
          { source: context.state.source_filter,
            validity: context.state.validity_filter,
            seenstatus: context.state.seen_filter,
            usernames: context.state.source_usernames.toString()
          })
        .then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error)
        })
      })
    },

    getMoreBoosts: (context) => {
      context.dispatch('loader/setLoading', true, { root: true });
      return new Promise((resolve, reject) => {

        context.dispatch('getArticles')
        .then(posts => {
           context.commit('append_articles', posts);
           resolve(); })
        .catch(error => {
          console.log("in actions", error);
          reject(error);
        })
        .finally(() => {
          context.dispatch('loader/setLoading', false, { root: true });
        })

      })
    },
    refreshArticles: (context) => {
      context.dispatch('loader/setLoading', true, { root: true });
      context.commit('refresh_articles');
      context.commit('set_fetch_status', false);
      return new Promise((resolve, reject) => {
        context.dispatch('getMoreBoosts')
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
        .finally(() => {
          context.dispatch('loader/setLoading', false, { root: true });
          context.commit('set_fetch_status', true);
        })
      })
    },

    applyFilter: (context, payload) => {
      context.dispatch('loader/setLoading', true, { root: true });

      context.commit('refresh_articles');
      context.commit('set_fetch_status', false);
      context.commit('change_filter_value', payload);

      context.dispatch('getArticles')

      .then(posts => {
        context.commit('append_articles', posts);
       })
      .catch(error => {
        console.log("in actions", error);
      })
      .finally(() => {
        context.dispatch('loader/setLoading', false, { root: true });
        context.commit('set_fetch_status', true);
      })
    },

    updateStateArticle: (context, payload) => {
      return new Promise((resolve, reject) => {

        postServices.getBoostByPostId(payload,
          { source: context.state.source_filter,
            validity: context.state.validity_filter,
            usernames: context.state.source_usernames.toString()
          })
          .then(response => {
            context.commit('update_boost', response.data);
            resolve();
          })
          .catch(error => {
            reject(error);
          })
      })
    },

    removeArticle: (context, payload) =>{
      context.commit('remove_boost', payload);
    }

  }
}
