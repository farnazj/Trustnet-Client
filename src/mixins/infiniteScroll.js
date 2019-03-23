export default {
  data: () => {
    return {
      endOfResults: false,
      scrollDisabled: false
    }
  },
  methods: {
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

        if (!this.scrollDisabled && !this.endOfResults && bottomOfWindow) {
          console.log('bottom of window')
          this.extend();

          // if (response.body.length < this.limit)
          //   this.endOfResults = true;
        }


      };
    },
  },
  mounted() {
    this.scroll();
  }
}
