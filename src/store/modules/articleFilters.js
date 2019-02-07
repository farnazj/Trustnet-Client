import postServices from '../../../services/postServices'

export default {
  namespaced: true,
  state: {
    validity_filter: 'all',
    cred_filter: 'all',
    articles: [],
    offset: 0,
    limit: 10,
    //validity_filter: 'all' // values in: [confirmed, refuted, debated, all]
    //cred_filter: '' //values in : [trusted, me, arr_of_usernames, all] -> all unmuted followees
  },
  getters: {
    articles: state => {return state.articles;}
  },
  mutations: {
    append_articles: (state, posts) => {
      state.articles.push(...posts);
      state.offset += state.limit;
    }
  },
  actions: {
    getMoreBoosts: (context) => {
      return new Promise((resolve, reject) => {

        postServices.getBoosts({offset: context.state.offset, limit: context.state.limit},
          { source: context.cred_filter,
            validity: context.validity_filter})
        .then(response => {
          return response.data; })
        .then(posts => {
           context.commit('append_articles', posts);
           resolve(); })
        .catch(error => {
          console.log("in actions", error);
          reject(error);
        })

      })
    }
  }
}
