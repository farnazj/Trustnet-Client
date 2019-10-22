import utils from '@/services/utils'
import postServices from '@/services/postServices'
import sourceServices from '@/services/sourceServices'
import { mapState, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      titleObjects: []
    }
  },
  computed: {
    sortedTitles: function() {
      return this.titleObjects.slice(utils.compareTitles);
    }
  },
  methods: {
    showTitles: function() {
      this.populateArticle(this.post);
      this.fetchCustomTitles()
      .then(res => {
        this.populateTitles(this.titleObjects);
        this.setTitlesVisibility(true);
      })
    },
    fetchCustomTitles: function() {

      this.titleObjects = [];
      let titlesBySetId = {};
      return postServices.getCustomTitles({postId: this.post.id})
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

          let all_proms = [] ;
          for (const [setId, title_obj] of Object.entries(titlesBySetId)) {
            let titlesetProms = [
              sourceServices.getSourceById(title_obj['lastVersion'].SourceId),
              postServices.hasUserEndorsedTitle({ setId: setId })
            ];

            all_proms.push(Promise.all(titlesetProms)
            .then(resp => {
              titlesBySetId[setId]['author'] = resp[0].data;
              titlesBySetId[setId]['userEndorsed'] = resp[1].data;
              this.titleObjects.push(title_obj);
            }))

          }
          return all_proms;
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

    ...mapActions({
      populateArticle(dispatch, payload) {
        return dispatch(this.detailsNamespace + '/populateArticle', payload)
      },
      populateTitles(dispatch, payload) {
        return dispatch(this.detailsNamespace + '/populateTitles', payload)
      },
      setTitlesVisibility(dispatch, payload) {
        return dispatch(this.detailsNamespace + '/setTitlesVisibility', payload)
      }
    })

  }

}
