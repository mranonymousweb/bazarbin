// src/components/FollowRequests.vue
<template>
  <div>
    <h2>Follow Requests</h2>
    <div v-for="request in followRequests" :key="request.id">
      <p>{{ request.name }}</p>
      <button @click="acceptRequest(request.id)" class="bg-green-500 text-white px-2 py-1">Accept</button>
      <button @click="rejectRequest(request.id)" class="bg-red-500 text-white px-2 py-1">Reject</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      followRequests: [],
    };
  },
  async mounted() {
    const response = await axios.get('/api/follow-requests');
    this.followRequests = response.data;
  },
  methods: {
    async acceptRequest(followerId) {
      await axios.post(`/api/accept-follow/${followerId}`);
      this.followRequests = this.followRequests.filter(
        (request) => request.id !== followerId
      );
    },
    async rejectRequest(followerId) {
      await axios.post(`/api/reject-follow/${followerId}`);
      this.followRequests = this.followRequests.filter(
        (request) => request.id !== followerId
      );
    },
  },
};
</script>