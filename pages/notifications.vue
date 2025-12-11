<template>
  <div>
    notifications
  </div>
</template>

<script>

import moment from "~/mixins/moment";

export default {
  name: "NotificationsPage",
  mixins: [moment],
  data() {
    return {
      item: null,
      loaded: false,
      baseUrl: process.env.storagePath
    }
  },
  async fetch() {
    await this.$axios.$get('home/notifications')
      .then(response => {
        this.item = response.data
        this.loaded = true
      })
      .catch(error => {
        this.$store.commit('notification/error',{message: error.response.data.message, code: error.response.status})
      })
  },
}

</script>
