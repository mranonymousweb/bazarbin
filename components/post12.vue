// src/components/Post.vue
<template>
  <div>
    <img v-if="post.media_type.includes('image')" :src="'/storage/' + post.media_url" />
    <video v-else :src="'/storage/' + post.media_url" controls></video>
    <p>{{ post.caption }}</p>
    <button @click="likePost">Like ({{ likesCount }})</button>
    <form @submit.prevent="addComment">
      <input v-model="comment" placeholder="Add a comment..." />
      <button type="submit">Comment</button>
    </form>
    <div v-for="comment in comments" :key="comment.id">
      <p>{{ comment.user.name }}: {{ comment.content }}</p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  props: ['post'],
  data() {
    return { likesCount: this.post.likes_count || 0, comment: '', comments: this.post.comments || [] };
  },
  methods: {
    async likePost() {
      await axios.post(`/api/posts/${this.post.id}/like`);
      this.likesCount++;
    },
    async addComment() {
      const response = await axios.post(`/api/posts/${this.post.id}/comment`, { content: this.comment });
      this.comments.push(response.data);
      this.comment = '';
    },
  },
};
</script>