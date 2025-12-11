// src/components/FollowButton.vue
<template>
  <button
    v-if="user.is_private && !isFollowing && !hasRequested"
    @click="requestFollow"
    class="bg-blue-500 text-white px-4 py-2"
  >
    Request Follow
  </button>
  <button
    v-else-if="isFollowing"
    @click="unfollow"
    class="bg-gray-500 text-white px-4 py-2"
  >
    Unfollow
  </button>
  <button
    v-else-if="hasRequested"
    disabled
    class="bg-gray-300 text-white px-4 py-2"
  >
    Requested
  </button>
  <button
    v-else
    @click="follow"
    class="bg-blue-500 text-white px-4 py-2"
  >
    Follow
  </button>
</template>
<script>
import axios from 'axios';

export default {
  props: ['userId', 'user'],
  data() {
    return {
      isFollowing: false,
      hasRequested: false,
    };
  },
  async mounted() {
    const followers = await axios.get(`/api/users/${this.userId}/followers`);
    this.isFollowing = followers.data.some(
      (follower) => follower.id === this.$store.state.user.id
    );
    if (!this.isFollowing && this.user.is_private) {
      const requests = await axios.get('/api/follow-requests');
      this.hasRequested = requests.data.some(
        (request) => request.id === this.userId
      );
    }
  },
  methods: {
    async requestFollow() {
      await axios.post(`/api/follow/${this.userId}`);
      this.hasRequested = true;
    },
    async follow() {
      await axios.post(`/api/follow/${this.userId}`);
      this.isFollowing = true;
    },
    async unfollow() {
      await axios.delete(`/api/unfollow/${this.userId}`);
      this.isFollowing = false;
    },
  },
};
</script>