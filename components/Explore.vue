<template>
  <div class="grid grid-cols-3 gap-4">
    <div v-for="post in posts" :key="post.id">
      <img v-if="post.media_type.includes('image')" :src="'/storage/' + post.media_url" />
      <video v-else :src="'/storage/' + post.media_url" controls></video>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return { posts: [] };
  },
  async mounted() {
    const response = await axios.get('/api/explore');
    this.posts = response.data;
  },
};
</script>