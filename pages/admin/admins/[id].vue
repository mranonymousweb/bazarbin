<template>
  <div>
    <admin-admins-form
      v-if="user"
      :user="user"
    />
    <div v-else class="flex justify-center my-12">
      <span class="loader w-8 h-8 border-2 rounded-full border-blue-300"></span>
    </div>
  </div>
</template>

<script>
import AdminAdminsForm from "../../../components/admin/AdminsForm";
export default {
  name: 'AdminAdminEditPage',
  components: {AdminAdminsForm},
  layout: 'admin',
  data() {
    return {
      user: null
    }
  },
  async fetch() {
    await this.$axios.$get(`/admin/admins/${this.$route.params.id}`)
      .then(response => {
        this.user = response
      })
  },
}
</script>
