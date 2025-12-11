<template>
  <div class="select-none">
    <div v-if="business">
      <panel-business-navigation :id="+$route.params.id" :has-category="business.has_category"/>
      <panel-chat :business="business"/>
    </div>
  </div>
</template>

<script>

import PanelChat from "../../../../components/panel/chat";
import PanelBusinessNavigation from "../../../../components/panel/business/navigation";

export default {
  name: "AdminEditBusinessProductsPage",
  components: {PanelChat, PanelBusinessNavigation},
  layout: 'admin',
  data() {
    return {
      business: null
    }
  },
  async fetch() {
    await this.$axios.$get('admin/businesses/' + this.$route.params.id + '?chats=1')
      .then(response => {
        this.business = response.data
      })
  }
}
</script>
