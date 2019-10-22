import Vue from 'vue'
import postServices from '@/services/postServices'

export default {
  namespaced: true,
  state: {
    validityFilter: 'All',
    sourceFilter: 'Followed',
    seenFilter: 'Not Seen',
    sourceUsernames: [],
    articles: [],
    offset: 0,
    limit: 10,
    articlesFetched: false
  },
  mutations: {
    append_articles: (state, posts) => {
      let articleIds = state.articles.map(article => article.id);
      let filteredPosts = posts.filter(post => !articleIds.includes(post.id) );
      state.articles.push(...filteredPosts);
      state.offset += posts.length;
    },

    refresh_articles: (state) => {
      state.articles = [];
      state.offset = 0;
    },

    change_filter_value: (state, filters) => {
      state.validityFilter = filters.filters.validity ? filters.filters.validity : 'All';
      state.sourceFilter = filters.filters.sources ?
        (filters.filters.sources == 'Selected Sources' ?  'usernames' : filters.filters.sources)
        : 'All';

      state.seenFilter = filters.filters.seenStatus ? filters.filters.seenStatus : 'All';

      state.validityFilter = state.validityFilter.toLowerCase();
      state.sourceFilter = state.sourceFilter.toLowerCase();
      state.seenFilter = state.seenFilter.toLowerCase();

      state.sourceUsernames = filters.sourceUsernames;
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
      state.articlesFetched = status;
    }
  },
  actions: {

    getArticles: (context) => {

      return new Promise((resolve, reject) => {

        postServices.getBoosts({
            offset: context.state.offset,
            limit: context.state.limit
          },
          {
            source: context.state.sourceFilter,
            validity: context.state.validityFilter,
            seenstatus: context.state.seenFilter,
            usernames: context.state.sourceUsernames.toString()
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
          { source: context.state.sourceFilter,
            validity: context.state.validityFilter,
            usernames: context.state.sourceUsernames.toString()
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
