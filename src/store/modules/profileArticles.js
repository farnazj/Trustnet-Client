import Vue from 'vue'
import postServices from '@/services/postServices'

export default {
  namespaced: true,
  state: {
    username: '',
    articles: [],
    filteredTags: [],
    offset: 0,
    limit: 10,
    articlesCommentOwnership: {} //mapping of post id to Boolean indicating whether the post has comments
  },
  getters: {
    filters: (state) => {
      return {
        filteredTags: state.filteredTags
      }
    },
    postHasComment: (state) => 
      (postId) => {
        return state.articlesCommentOwnership[postId];
      }
  },
  mutations: {

    set_username: (state, username) => {
      state.username = username;
    },

    append_articles: (state, posts) => {
      let articleIds = state.articles.map(article => article.id);
      let filteredPosts = posts.filter(post => !articleIds.includes(post.id) );
      state.articles.push(...filteredPosts);
      state.offset += filteredPosts.length;

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

    update_boost: (state, boost) => {
      let index = state.articles.findIndex(article => article.id == boost.id);
      Vue.set(state.articles, index, boost);
    },

    remove_boost: (state, postId) => {
      let index = state.articles.findIndex(article => article.id == postId);
      state.articles.splice(index, 1);
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

    setUsername: (context, payload) => {
      context.commit('set_username', payload);
    },

    getArticles: (context) => {

      return new Promise((resolve, reject) => {

        let headers = context.state.filteredTags.length ?
        { tags: JSON.stringify(context.state.filteredTags.map(el => el.id)) } :
        {};

        postServices.getActivity({
          username: context.state.username,
          offset: context.state.offset,
          limit: context.state.limit
        }, headers)
        .then(response => {
          resolve(response.data);
        }).catch(error => {
          console.log('what is going on?', error)
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
        })
      })
    },

    updateStateArticle: (context, payload) => {

      return new Promise((resolve, reject) => {

        postServices.getActivityByPostId(
          {
            postId: payload.postId,
            username: context.state.username
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
