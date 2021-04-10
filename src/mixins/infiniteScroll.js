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
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 150);

        if (!this.scrollDisabled && !this.endOfResults && bottomOfWindow) {
          console.log('bottom of window')
          this.extend();
        }

      };
    }
  },
  mounted() {
    this.scroll();
  }
}
