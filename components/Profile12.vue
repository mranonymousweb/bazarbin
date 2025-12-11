<template>
  <div>
    <p>Followers: {{ followersCount }}</p>
    <p>Following: {{ followingCount }}</p>
    <FollowButton :userId="userId" />
  </div>
</template>
<script>
import axios from 'axios';
export default {
  props: ['userId'],
  data() {
    return { followersCount: 0, followingCount: 0 };
  },
  async mounted() {
    const followers = await axios.get(`/api/users/${this.userId}/followers`);
    const following = await axios.get(`/api/users/${this.userId}/following`);
    this.followersCount = followers.data.length;
    this.followingCount = following.data.length;
  },
};
</script>