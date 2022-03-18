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
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 250);

        if (!this.scrollDisabled && !this.endOfResults && bottomOfWindow) {
          // console.log('bottom of window')
          this.scrollDisabled = true;
          this.extend()
          .then(() => {
            this.scrollDisabled = false;
          })
        }

      };
    }
  },
  mounted() {
    this.scroll();
  }
}
