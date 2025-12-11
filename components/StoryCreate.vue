<template>
  <form @submit.prevent="createStory">
    <input type="file" accept="image/*,video/*" ref="media" />
    <button type="submit">Post Story</button>
  </form>
</template>
<script>
import axios from 'axios';
export default {
  methods: {
    async createStory() {
      const formData = new FormData();
      formData.append('media', this.$refs.media.files[0]);
      await axios.post('/api/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      this.$emit('storyPosted');
      this.$refs.media.value = '';
    },
  },
};
</script>