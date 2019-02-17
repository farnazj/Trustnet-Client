import postServices from '../../../services/postServices'

export default {
  namespaced: true,
  state: {
    validity_filter: 'All',
    source_filter: 'All',
    source_usernames: [],
    articles: [],
    offset: 0,
    limit: 10,
  },
  getters: {
    articles: state => {return state.articles;}
  },
  mutations: {
    append_articles: (state, posts) => {
      state.articles.push(...posts);
      state.offset += posts.length;

    },

    refresh_articles: (state, posts) => {

      state.articles = posts;
      state.offset = posts.length;
    },

    change_filter_value: (state, filters) => {
      state.validity_filter = filters.filters.validity ? filters.filters.validity : 'All';
      state.source_filter = filters.filters.sources ?
        (filters.filters.sources == 'Selected Sources' ?  'usernames' : filters.filters.sources)
        : 'All';

      state.validity_filter = state.validity_filter.toLowerCase();
      state.source_filter = state.source_filter.toLowerCase();

      state.source_usernames = filters.source_usernames;
      state.offset = 0;
    }
  },
  actions: {

    getArticles: (context) => {

      return new Promise((resolve, reject) => {

        postServices.getBoosts({offset: context.state.offset, limit: context.state.limit},
          { source: context.state.source_filter,
            validity: context.state.validity_filter,
            source_usernames: context.state.source_usernames.toString()})
        .then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error)
        })
      })
    },

    getMoreBoosts: (context) => {
      return new Promise((resolve, reject) => {

        context.dispatch('getArticles')
        .then(posts => {
           context.commit('append_articles', posts);
           resolve(); })
        .catch(error => {
          console.log("in actions", error);
          reject(error);
        })

      })
    },

    applyFilter: (context, payload) => {
      context.commit('change_filter_value', payload);
      context.dispatch('getArticles')
      .then(posts => {
        console.log('going to refresh page with ', posts.length)
        context.commit('refresh_articles', posts);
       })
      .catch(error => {
        console.log("in actions", error);
      })
    }
  }
}
