import utils from '@/services/utils'
import titleServices from '@/services/titleServices'
import sourceServices from '@/services/sourceServices'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    titlesNamespace: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      titleObjects: []
    }
  },
  computed: {
    sortedTitles: function() {
      return this.titleObjects.slice().sort(utils.compareTitles);
    },
    titles: function() {
      return this.state.titles;
    },
    postId: function() {
      return this.state.postId;
    },
    standaloneTitleId: function() {
      return this.state.standaloneTitleId;
    },
    customTitlesVisible: function() {
      return this.state.customTitlesVisible;
    },
    ...mapState({
       state (state) {
         return state[this.titlesNamespace];
       }
    })
  },
  methods: {

    arrangeCustomTitles: function(resTitles) {

      this.titleObjects = [];
      let titlesBySetId = {};

      if (resTitles) {
        resTitles.forEach(title => {

          if (!(title.setId in titlesBySetId )) {
              let titleObj = {};
              titleObj['history'] = [];
              titlesBySetId[title.setId] = titleObj;
          }

          if (title.version != 1) {
            titlesBySetId[title.setId]['history'].push(title);
          }
          else {
            titlesBySetId[title.setId]['lastVersion'] = title;
          }
        })

        let allProms = [] ;
        for (const [setId, titleObj] of Object.entries(titlesBySetId)) {
          let titlesetProms = [
            sourceServices.getSourceById(titleObj['lastVersion'].SourceId),
            titleServices.hasUserEndorsedTitle({ setId: setId })
          ];

          allProms.push(Promise.all(titlesetProms)
          .then(resp => {
            titlesBySetId[setId]['author'] = resp[0].data;
            titlesBySetId[setId]['userEndorsed'] = resp[1].data;
            this.titleObjects.push(titlesBySetId[setId]);
          }))

        }
        return Promise.all(allProms);
      }

      return Promise.resolve();
    },

    ...mapActions({
      setPostTitleId(dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setPostTitleId', payload)
      },
      setTitleId(dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setTitleId', payload)
      },
      populateTitles(dispatch, payload) {
        return dispatch(this.titlesNamespace + '/populateTitles', payload)
      },
      setTitlesVisibility(dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setTitlesVisibility', payload)
      }
    })

  }

}
