
<template>
  <div>
    <label>
      <input type="checkbox" v-model="isPrivate" @change="togglePrivate" />
      Private Account
    </label>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      isPrivate: false,
    };
  },
  async mounted() {
    this.isPrivate = this.$store.state.user.is_private || false;
  },
  methods: {
    async togglePrivate() {
      await axios.post('/api/toggle-private', { is_private: this.isPrivate });
      this.$store.commit('updateUser', { is_private: this.isPrivate });
    },
  },
};
</script>