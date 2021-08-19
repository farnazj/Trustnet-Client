import commentServices from '@/services/commentServices'

export default {
  namespaced: true,
  state() {
    return {
      comments: {},
      postIdOfComments: null,
      historyVisibility: false,
      history: [],
      historyOwner: {}
    }
  },
  mutations: {
    populate_comments: (state, payload) => {
      state.comments = payload.comments;
      state.postIdOfComments = payload.postIdOfComments;
    },

    set_history_visibility: (state, visiblity) => {
      state.historyVisibility  = visiblity;
    },

    populate_comment_history: (state, payload) => {
      state.history = payload.history;
      state.historyOwner = payload.author;
    }
  },
  actions: {
    getPostComments: (context, payload) => {
      // console.log("getPostComments")
      return new Promise((resolve, reject) => {
        commentServices.getCommentsForPost(payload.postIdOfComments)
        .then(response => {
          let comments = response.data.length ? response.data : [];
          context.commit('populate_comments', {
            postIdOfComments: payload.postIdOfComments,
            comments: comments
          });
          // console.log(response);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    postComment: (context, payload) => {
      // console.log("submitComment")
      return new Promise((resolve, reject) => {
        commentServices.postComment(context.state.postIdOfComments, payload)
        .then(response => {
          // console.log(response);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    editComment: (context, payload) => {
      // console.log("editComment");
      return new Promise((resolve, reject) => {
        commentServices.editComment(payload.setIdOfComment, payload)
        .then(response => {
          // console.log(response);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    deleteComment: (context, payload) => {
      // console.log("deleteComment")
      return new Promise((resolve, reject) => {
        // console.log(context.state);
        commentServices.deleteComment(payload.setIdOfComment)
        .then(response => {
          // console.log(response);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    setHistoryVisibility: (context, payload) => {
      context.commit('set_history_visibility', payload);
    },

    populateCommentHistory: (context, payload) => {
      context.commit('populate_comment_history', payload);
    }
  }
}
