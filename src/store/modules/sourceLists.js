import Vue from 'vue'
import sourceListServices from '@/services/sourceListServices'

export default {
  namespaced: true,
  state: {
    sourceLists: [],
    isFullListDisplayed: false,
    displayedFullList: {}
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
      let sourceIndex = state.sourceLists[listIndex].ListEntities.findIndex(source =>
        source.id == payload.sourceId);

      let listCopy = Object.assign({}, state.sourceLists[listIndex]);
      listCopy.ListEntities.splice(sourceIndex, 1);
      Vue.set(state.sourceLists, listIndex, listCopy);

      if (Object.entries(state.displayedFullList).length !== 0 &&
        payload.listId == state.displayedFullList.id) {

        state.displayedFullList.ListEntities = listCopy.ListEntities;
      }
    },

    update_list_name: (state, payload) => {
      let listIndex = state.sourceLists.findIndex(sourceList => sourceList.id == payload.listId);
      state.sourceLists[listIndex].name = payload.listName;

      if (Object.entries(state.displayedFullList).length !== 0 &&
      payload.listId == state.displayedFullList.id) {

        state.displayedFullList.name = payload.listName;
      }
    },

    set_full_list_visibility: (state, payload) => {
      state.isFullListDisplayed = payload;
    },

    populate_displayed_list: (state, payload) => {
      state.displayedFullList = payload;
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

          if (context.state.isFullListDisplayed) {
            if (context.state.displayedFullList.id == payload.listId) {
              context.dispatch('setFullListVisibility', false);
            }
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    updateListName: function(context, payload) {

      return new Promise((resolve, reject) => {

        sourceListServices.updateList(
          { listId: payload.listId },
          { name: payload.listName }
        )
        .then(response => {
          context.commit('update_list_name', payload);
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
    },

    setFullListVisibility: (context, payload) => {

      context.commit('set_full_list_visibility', payload);
      if (payload == false)
        context.dispatch('populateDisplayedList', {});
    },

    populateDisplayedList: (context, payload) => {
      context.commit('populate_displayed_list', payload);
    }

  }
}
