import Vue from 'vue'
import sourceListServices from '@/services/sourceListServices'

export default {
  namespaced: true,
  state: {
    sourceLists: []
  },
  getters: {
    isSourceInList: (state) => {

      return (listId, sourceId) => {

        let listIndex = state.sourceLists.findIndex(sourceList => sourceList.id == listId);
        let sourceIndex = state.sourceLists[listIndex].ListEntities.findIndex(source =>
          source.id == sourceId);
        if (sourceIndex == -1)
          return false;
        return true;
      }
    }
  },
  mutations: {
    set_lists: (state, lists) => {
      state.sourceLists = lists;
    },

    remove_list: (state, listId) => {
      let index = state.sourceLists.findIndex(sourceList => sourceList.id == listId);
      state.sourceLists.splice(index, 1);
    },

    add_source_to_list: (state, payload) => {
      let listIndex = state.sourceLists.findIndex(sourceList => sourceList.id == payload.listId);
      let listCopy = Object.assign({}, state.sourceLists[listIndex]);
      listCopy.ListEntities.push({ id: payload.sourceId });
      Vue.set(state.sourceLists, listIndex, listCopy);
    },

    remove_source_from_list: (state, payload) => {
      let listIndex = state.sourceLists.findIndex(sourceList => sourceList.id == payload.listId);
      let sourceIndex = state.sourceLists[listIndex].ListEntities.findIndex(source => source.id == payload.sourceId);

      let listCopy = Object.assign({}, state.sourceLists[listIndex]);
      listCopy.ListEntities.splice(sourceIndex, 1);
      Vue.set(state.sourceLists, listIndex, listCopy);
    }
  },
  actions: {
    fetchLists: function(context) {

      return new Promise((resolve, reject) => {
        sourceListServices.getLists({})
        .then(response => {
          context.commit('set_lists', response.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    addList: function(context, payload) {

      return new Promise((resolve, reject) => {
        sourceListServices.addList({ name: payload.listName })
        .then(response => {
          context.dispatch('fetchLists');
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    removeList: function(context, payload) {

      return new Promise((resolve, reject) => {
        sourceListServices.deleteList({ listId: payload.listId })
        .then(response => {
          context.commit('remove_list', payload.listId);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    addSourceToList: function(context, payload) {

      return new Promise((resolve, reject) => {
        sourceListServices.addSourceToList(
          { listId: payload.listId },
          { username: payload.source.userName }
        )
        .then(response => {
          context.commit('add_source_to_list', {
            listId: payload.listId,
            sourceId: payload.source.id
          });
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    removeSourceFromList: function(context, payload) {

      return new Promise((resolve, reject) => {
        sourceListServices.removeSourceFromList(
          { listId: payload.listId },
          { username: payload.source.userName }
        )
        .then(response => {
          context.commit('remove_source_from_list', {
            listId: payload.listId,
            sourceId: payload.source.id
          });
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    }

  }
}
