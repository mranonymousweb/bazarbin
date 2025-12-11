<template>
  <div class="flex">
    <div v-for="story in stories" :key="story.id">
      <img v-if="story.media_type.includes('image')" :src="'/storage/' + story.media_url" />
      <video v-else :src="'/storage/' + story.media_url" controls></video>
      <p>{{ story.user.name }}</p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return { stories: [] };
  },
  async mounted() {
    const response = await axios.get('/api/stories');
    this.stories = response.data;
  },
};
</script>