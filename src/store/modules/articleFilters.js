import Vue from 'vue'
import postServices from '@/services/postServices'
import consts from '@/services/constants'

export default {
  namespaced: true,
  state: {
    accuracyFilter: 'all',
    sourceFilters: ['followed'],
    seenFilter: 'not seen',
    exploreFilter: false,
    filteredUsernames: [],
    filteredLists: [],
    filteredTags: [],
    articles: [],
    offset: 0,
    limit: 10,
    articlesFetched: false,
    articlesCommentOwnership: {} //mapping of post id to Boolean indicating whether the post has comments
  },
  getters: {

    filters: (state) => {
      return {
        accuracyFilter: state.accuracyFilter,
        sourceFilters: state.sourceFilters,
        seenFilter: state.seenFilter,
        exploreFilter: state.exploreFilter,
        filteredUsernames: state.filteredUsernames,
        filteredLists: state.filteredLists,
        filteredTags: state.filteredTags
      }
    },
    postHasComment: (state) => 
      (postId) => {
        return state.articlesCommentOwnership[postId];
      }
    

  },
  mutations: {
    append_articles: (state, posts) => {
      let articleIds = state.articles.map(article => article.id);
      let filteredPosts = posts.filter(post => !articleIds.includes(post.id) );
      state.articles.push(...filteredPosts);
      state.offset += posts.length;

      filteredPosts.forEach(post => {
        let postId = post.id;
        let newAttr = {};
        newAttr[postId] = false;
        state.articlesCommentOwnership = Object.assign({}, state.articlesCommentOwnership, newAttr);
      })
      
    },

    refresh_articles: (state) => {
      state.articles = [];
      state.offset = 0;
    },

    change_filter_value: (state, filters) => {

      state.accuracyFilter = filters.filters.accuracy ?
        consts.ACCURACY_REQ_MAPPING[filters.filters.accuracy.toLowerCase()] : 'all';

      state.sourceFilters = filters.filters.sources ? filters.filters.sources : ['followed'];

      state.seenFilter = filters.filters.seenStatus ?
        consts.SEEN_STATUS_REQ_MAPPING[filters.filters.seenStatus.split(' ')
        .map(el => el.toLowerCase()).join(' ')] : 'all';

      state.exploreFilter = filters.filters.explore ? filters.filters.explore : false;

      state.filteredUsernames = filters.filteredUsernames;
      state.filteredLists = filters.filteredLists;
    },

    update_boost: (state, boost) => {
      let index = state.articles.findIndex(article => article.id == boost.id);
      Vue.set(state.articles, index, boost);
    },

    remove_boost: (state, postId) => {
      let index = state.articles.findIndex(article => article.id == postId);
      state.articles.splice(index, 1);
    },

    set_fetch_status: (state, status) =>{
      state.articlesFetched = status;
    },

    update_titles: (state, payload) => {
      let index = state.articles.findIndex(article => article.id == payload.postId);

      let articleCopy = Object.assign({}, state.articles[index]);
      articleCopy.PostStandAloneTitles = payload.standaloneTitles;
      Vue.set(state.articles, index, articleCopy);
    },

    add_or_remove_tag_in_filters: (state, payload) => {
      if (payload.add)
        state.filteredTags.push(payload.tag);
      else {
        let index = state.filteredTags.findIndex(tag => tag.id == payload.tag.id);
        state.filteredTags.splice(index, 1);
      }

    },

    update_has_comments: (state, payload) => {
      let postId = payload.postId;

      if (postId in state.articlesCommentOwnership)
        Vue.set(state.articlesCommentOwnership, postId, payload.hasComments);
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
            sources: JSON.stringify(context.state.sourceFilters),
            accuracy: context.state.accuracyFilter,
            seenstatus: context.state.seenFilter,
            explore: context.state.exploreFilter,
            usernames: JSON.stringify(context.state.filteredUsernames),
            lists: JSON.stringify(context.state.filteredLists),
            tags: JSON.stringify(context.state.filteredTags.map(el => el.id))
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
          resolve();
        })
        .catch(error => {
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
          {
            sources: JSON.stringify(context.state.sourceFilters),
            accuracy: context.state.accuracyFilter,
            explore: context.state.exploreFilter,
            usernames: JSON.stringify(context.state.filteredUsernames),
            lists: JSON.stringify(context.state.filteredLists),
            tags: JSON.stringify(context.state.filteredTags.map(el => el.id))
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

    removeArticle: (context, payload) => {
      context.commit('remove_boost', payload);
    },

    getSingleArticle: (context, payload) => {
      context.dispatch('loader/setLoading', true, { root: true });

      context.commit('refresh_articles');
      
      return new Promise((resolve, reject) => {
        postServices.getBoostByPostId({ postId: payload.postId })
        .then((res) => {
          context.commit('set_fetch_status', false);
          context.commit('append_articles', [res.data]);
          resolve();
        })
        .catch(error => {
          reject(error);
        })
      })
    },

    /*
    Called from fetchPostTitles in titles module
    */
    updateTitles: (context, payload) => {
      context.commit('update_titles', payload)
    },

    addOrRemoveTagInFilters: (context, payload) => {
      context.commit('add_or_remove_tag_in_filters', payload);
      return new Promise((resolve, reject) => {

        context.dispatch('refreshArticles')
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })

    },

    updateHasComments: (context, payload) => {
      context.commit('update_has_comments', payload);
    }

  }
}
