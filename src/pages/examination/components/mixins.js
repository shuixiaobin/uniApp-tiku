import { mapState, mapMutations } from 'vuex'

export const handleIndex = (namespace) => ({
  computed: {
    ...mapState(namespace, ['answers', 'currentIndex']),
  },
  methods: {
    next () {
      const len = this.answers.length
      const index = this.currentIndex + 1
      if (index < len) {
        this.setCurrentIndex(index)
      } else {
        this.$emit('nextFuse')
      }
    },
    last () {
      const index = this.currentIndex - 1
      if (index > -1) {
        this.setCurrentIndex(index)
      } else {
        return false
      }
    },
    ...mapMutations(namespace, ['setCurrentIndex'])
  }
})