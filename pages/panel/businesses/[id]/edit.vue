<template>
<div class="select-none text-sm md:text-base">

  <div v-if="business">

    <panel-business-navigation :id="business.id" :has-category="has_category"/>

    <panel-business-edit-icon v-model="iconInfo" :business="business" class="mb-4"/>

    <panel-business-edit-gallery v-model="gallery" :exist="true" class="mb-4"/>

    <panel-business-edit-info v-model="info" :business="business" :exist="true" class="mb-4"/>

    <panel-business-edit-address v-model="address" :business="business" :exist="true" class="mb-4"/>

    <panel-business-edit-contacts v-model="contacts" :exist="true" class="mb-4"/>

    <panel-business-edit-work-times v-model="active_hour" :exist="true" class="mb-4"/>

    <panel-business-edit-tags v-model="tags" :exist="true" class="mb-4"/>

    <panel-business-edit-form v-model="form" :exist="true"/>

  </div>

</div>
</template>

<script>

export default {
  layout: 'panel',
  middleware: 'load.cities',
  data() {
    return {
      business: null,
      imagePanelOpen: true,
      loading: false,
      iconInfo: {
        active: true,
        admin_note: '',
        subscription: '',
        avatar: '',
      },
      gallery: [''],
      info: {
        owner_id: '',
        name: '',
        guild_id: '',
        description: '',
        services: '',
        link: '',
      },
      address: {
        city_id: '',
        streets: [],
        address: '',
        lat: 35.6892,
        lng: 51.3890,
      },
      contacts: [],
      active_hour: [],
      form: {
        form_id: '',
        send_reminder: '',
        appointments: [],
        holidays: [],
        required_fields: [],
      },
      tags: '',
      has_category: true,
    }
  },
  async fetch() {
    await this.$axios.$get('home/businesses/' + this.$route.params.id)
      .then(response => {
        this.iconInfo.active = response.data.active
        this.iconInfo.avatar = response.data.avatar || ''
        this.iconInfo.subscription = response.data.subscription || ''
        this.gallery = response.data.gallery || []
        this.info.owner_id = response.data.owner_id
        this.info.link = response.data.link || ''
        this.info.name = response.data.name
        this.info.guild_id = response.data.guild_id
        this.info.description = response.data.description || ''
        this.info.services = response.data.services || ''
        this.tags = response.data.tags || ''
        this.address.city_id = response.data.city_id
        this.address.streets = response.data.streets?.map(x => x.id) || []
        this.address.address = response.data.address
        this.address.lat = response.data.lat
        this.address.lng = response.data.lng
        this.form.form_id = response.data.form_id || ''
        this.form.required_fields = response.data.required_fields || []
        this.form.holidays = response.data.holidays || []
        this.form.appointments = response.data.business_appointments || []
        this.form.send_reminder = response.data.send_reminder
        this.contacts = response.data.contacts || []
        this.active_hour = response.data.active_hour || []
        this.has_category = response.data.has_category
        this.$nextTick(() => {
          this.business = response.data
        })
      })
  },
  watch: {
    tags() {
      if (!this.business)
        return
      this.$axios.$put(`home/business/${this.$route.params.id}`,{tags: this.tags})
        .then(() => {
          this.$store.commit('notification/success', 'برچسب ها با موفقیت بروزرسانی شد.')
          this.$emit('input', this.images)
        })
    }
  },
}
</script>
