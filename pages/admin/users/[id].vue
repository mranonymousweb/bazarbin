<template>
  <div>
    <admin-users-form
      v-if="user"
      :user="user"
    />
    <div v-else class="flex justify-center my-12">
      <span class="loader w-8 h-8 border-2 rounded-full border-blue-300"></span>
    </div>
  </div>
</template>

<script>
import AdminUsersForm from "../../../components/admin/UsersForm";
export default {
  name: 'AdminUserEditPage',
  components: {AdminUsersForm},
  layout: 'admin',
  data() {
    return {
      user: null
    }
  },
  async fetch() {
    await this.$axios.$get(`/admin/users/${this.$route.params.id}`)
      .then(response => {
        this.user = response
      })
  },
}
</script>
