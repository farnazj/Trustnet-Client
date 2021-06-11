import commentServices from '@/services/commentServices'

export default {
  namespaced: true,
  state() {
    return {
      comments: {},
      postIdOfComments: null
    }
  },
  mutations: {
    populate_comments: (state, payload) => {
      state.postIdOfComments = payload.postIdOfComments;
      state.comments = payload.comments;
    }
  },
  actions: {
    getPostComments: (context, payload) => {
      
      return new Promise((resolve, reject) => {
        commentServices.getCommentsForPost(payload.postIdOfComments)
        .then(response => {
          let comments = response.data.length ? response.data : [];
          context.commit('populate_comments', {
            postIdOfComments: payload.postIdOfComments,
            comments: comments
          });
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    postAuthUserComment: (context, payload) => {

      return new Promise((resolve, reject) => {
        commentServices.postComment(context.state.postIdOfComments, payload)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },
  }
}
