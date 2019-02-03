export default {
  data: () => {
    return {
      offset: 0,
      limit: 15,
      endOfResults: false
    }
  },
  methods: {
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

        if (!this.endOfResults && bottomOfWindow) {
          console.log('bottom of window')
          this.$http.get(this.url + '?limit='+ this.limit + "&offset=" + this.offset,
          {credentials: true}
          ).then(response => {
            this.offset += response.body.length;
            this.extension.push(...response.body);

            if (response.body.length < this.limit)
              this.endOfResults = true;
          });
        }
      };
    },
  },
  mounted() {
    this.offset = this.limit;
    this.scroll();
  }
}
