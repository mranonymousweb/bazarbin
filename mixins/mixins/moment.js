import moment from "moment-jalaali";
import fa from "moment/src/locale/fa";
moment.locale("fa", fa);
moment.loadPersian({dialect: 'persian-modern'});

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
