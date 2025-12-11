<template>
  <form @submit.prevent="createPost">
    <input type="file" accept="image/*,video/*" ref="media" />
    <textarea v-model="caption" placeholder="Write a caption..."></textarea>
    <button type="submit">Post</button>
  </form>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return { caption: '' };
  },
  methods: {
    async createPost() {
      const formData = new FormData();
      formData.append('media', this.$refs.media.files[0]);
      formData.append('caption', this.caption);
      await axios.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      this.$emit('posted');
      this.caption = '';
      this.$refs.media.value = '';
    },
  },
};
</script>