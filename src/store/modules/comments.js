import commentServices from '@/services/commentServices'

export default {
  namespaced: true,
  state() {
    return {
      comments: [],
      postIdOfComments: null,
      historyVisibility: false,
      history: [],
      historyOwner: {}
    }
  },
  mutations: {
    add_comments: (state, payload) => {
      state.comments = [...state.comments, ...payload.comments]; // Add new comments to old, without mutating
      if (payload.postIdOfComments)
        state.postIdOfComments = payload.postIdOfComments;
    },

    delete_comment: (state, {setId}) => {
      state.comments = state.comments.filter(comment => comment.setId !== setId);
    },

    set_history_visibility: (state, visiblity) => {
      state.historyVisibility  = visiblity;
    },

    populate_comment_history: (state, payload) => {
      state.history = payload.history;
      state.historyOwner = payload.author;
    },

    set_comments: (state, {comments}) => {
      state.comments = comments;
    }
  },
  actions: {
    getPostComments: (context, payload) => {
      return new Promise((resolve, reject) => {
        commentServices.getCommentsForPost({
          postId: payload.postIdOfComments,
          limit: payload.limit,
          offset: payload.offset
        })
        .then(response => {
          let comments = response.data.length ? response.data : [];
          context.commit('add_comments', {
            postIdOfComments: payload.postIdOfComments,
            comments: comments
          });
          resolve(comments);
        })
        .catch(err => {
          reject(err);
        })
      })
    },
    getReplyComments: (context, payload) => {
      return new Promise((resolve, reject) => {
        commentServices.getReplyComments({
          rootSetId: payload.rootSetId,
          limit: payload.limit,
          offset: payload.offset
        })
        .then(response => {
          let replyComments = response.data.length ? response.data : [];
          context.commit('add_comments', {
            comments: replyComments
          });
          resolve(replyComments);
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    postComment: (context, payload) => {
      return new Promise((resolve, reject) => {
        commentServices.postComment(context.state.postIdOfComments, payload)
        .then(response => {
          let newComment = response.data.data;
          let newFormattedComment = {...newComment, Source: context.rootGetters['auth/user']};
          let newCommentList = response.data.data ? [newFormattedComment] : [];

          context.commit('add_comments', {
            comments: newCommentList
          });
          resolve(newCommentList);
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    editComment: (context, payload) => {
      return new Promise((resolve, reject) => {
        commentServices.editComment(payload.setIdOfComment, payload)
        .then(response => {
          let newComment = response.data.data;
          let newFormattedComment = {...newComment, Source: context.rootGetters['auth/user']};
          let newCommentList = response.data.data ? [newFormattedComment] : [];

          context.commit('delete_comment', {
            setId: payload.setIdOfComment
          });
          context.commit('add_comments', {
            comments: newCommentList
          });

          resolve(newCommentList);
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    deleteComment: (context, payload) => {
      return new Promise((resolve, reject) => {
        commentServices.deleteComment(payload.setIdOfComment)
        .then(response => {
          let dummyComment = response.data.data;
          let dummyFormattedComment = {...dummyComment, Source: context.rootGetters['auth/user']};
          let dummyCommentList = response.data.data ? [dummyFormattedComment] : [];
          
          context.commit('delete_comment', {
            setId: payload.setIdOfComment
          });
          context.commit('add_comments', {
            comments: dummyCommentList
          });

          resolve(dummyCommentList);
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
    },

    clearComments: (context) => {
      context.commit('set_comments', {
        comments: []
      })
    }
  }
}
