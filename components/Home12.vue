<template>
  <div>
    <PostCreate @posted="$fetchPosts" />
    <div v-for="post in posts" :key="post.id">
      <img v-if="post.media_type.includes('image')" :src="'/storage/' + post.media_url" />
      <video v-else :src="'/storage/' + post.media_url" controls></video>
      <p>{{ post.caption }}</p>
      <p>Posted by: {{ post.user.name }}</p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import PostCreate from './PostCreate.vue';
export default {
  components: { PostCreate },
  data() {
    return { posts: [] };
  },
  async mounted() {
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      const response = await axios.get('/api/posts');
      this.posts = response.data;
    },
  },
};
</script>