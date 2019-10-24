import utils from '@/services/utils'
import postServices from '@/services/postServices'
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
      return this.titleObjects.slice(utils.compareTitles);
    },
    titles: function() {
      return this.state.titles;
    },
    postId: function() {
      return this.state.postId;
    },
    ...mapState({
       state (state) {
         return state[this.titlesNamespace];
       }
    }),
  },
  methods: {

    fetchCustomTitles: function() {

      this.titleObjects = [];
      let titlesBySetId = {};
      return postServices.getCustomTitles({ postId: this.postId })
      .then(res => {
        if (res.data.length) {
          res.data.forEach(title => {

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
              postServices.hasUserEndorsedTitle({ setId: setId })
            ];

            allProms.push(Promise.all(titlesetProms)
            .then(resp => {
              titlesBySetId[setId]['author'] = resp[0].data;
              titlesBySetId[setId]['userEndorsed'] = resp[1].data;
              this.titleObjects.push(titlesBySetId[setId]);
              console.log('pushed to titleObjects', JSON.stringify(titlesBySetId[setId]))
            }))

          }
          return Promise.all(allProms);
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

    ...mapActions({
      setPostId(dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setPostId', payload)
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
