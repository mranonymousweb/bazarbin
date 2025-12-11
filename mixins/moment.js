import moment from "~/utils/moment";

export default {
  data() {
    return {
      moment
    }
  },
  methods: {
    formatDate(date, format) {
      return moment(date).format(format)
    }
  }
}
