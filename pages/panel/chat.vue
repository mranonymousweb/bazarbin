<template>
<div>
  <panel-chat
    v-if="chats !== null"
    :chats="chats"
    @new-chat="chats = [$event, ...chats]"
    @new-message="chats.find(x => x.id === $event).unseen++"
  />
</div>
</template>

<script>

import PanelChat from "../../components/panel/chat";
export default {
  name: "PanelChatPage",
  components: {PanelChat},
  layout: 'panel',
  data() {
    return {
      chats: null
    }
  },
  async fetch() {
    await this.$axios.$get('/chat')
      .then(response => {
        this.chats = response.data
      })
  }
}
</script>
