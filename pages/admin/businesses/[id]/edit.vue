<template>
  <div class="select-none">
    <div v-if="loaded">
      <panel-business-navigation :id="+$route.params.id" :has-category="business.has_category"/>

      <panel-business-edit-icon
        v-model="iconInfo"
        :business="business"
        class="mb-4"
        :exist="true"
        @update-title="business.custom_titles[$event.label] = $event.title"
      />

      <panel-business-edit-gallery v-model="gallery" :exist="true" class="mb-4"/>

      <panel-business-edit-info v-model="info" :exist="true" class="mb-4"/>

      <panel-business-edit-address v-model="address" :exist="true" class="mb-4"/>

      <panel-business-edit-contacts v-model="contacts" :exist="true" class="mb-4"/>

      <panel-business-edit-work-times v-model="active_hour" :exist="true" class="mb-4"/>

      <div class="bg-white rounded p-6 mb-4">

        <div class="flex mb-4">
          <i class="flaticon-050-tag ml-2"></i>
          <span class="flex-grow text-gray-500">برچسب ها</span>
        </div>

        <div>
          <tags-input v-model="tags"/>
        </div>

      </div>

      <panel-business-edit-form v-model="form" :exist="true" @submit="submit"/>

    </div>
  </div>
</template>

<script>

import PanelBusinessEditContacts from "../../../../components/panel/business/EditContacts";
import PanelBusinessEditWorkTimes from "../../../../components/panel/business/EditWorkTimes";
import errorParser from "~/mixins/error_parser";

export default {
  name: "AdminEditBusinessPage",
  components: {PanelBusinessEditWorkTimes, PanelBusinessEditContacts},
  mixins:[errorParser],
  layout: 'admin',
  middleware: 'load.cities',
  data() {
    return {
      business: null,
      iconInfo: {
        active: true,
        status: true,
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
      imagePanelOpen: true,
      loading: false,
      loaded: false
    }
  },
  async fetch() {
    await this.$axios.$get('admin/businesses/' + this.$route.params.id)
      .then(response => {
        this.business = response.data
        this.iconInfo.active = response.data.active
        this.iconInfo.status = response.data.status
        this.iconInfo.features = response.data.features
        this.iconInfo.avatar = response.data.avatar || ''
        this.iconInfo.subscription = response.data.subscription || ''
        this.iconInfo.admin_note = response.data.admin_note || ''
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
        this.active_hour = response.data.active_hour || ''
        this.$nextTick(() => {this.loaded = true})
      })
  },
  watch: {
    tags() {
      if (!this.loaded)
        return
      this.$axios.$put(`admin/businesses/${this.$route.params.id}`,{tags: this.tags})
        .then(() => {
          this.$store.commit('notification/success', 'برچسب ها با موفقیت بروزرسانی شد.')
          this.$emit('input', this.images)
        })
    }
  },
  methods: {
    submit() {
      const formData = {
        ...this.info,
        ...this.form,
        ...this.address,
        ...this.iconInfo,
        ...this.contacts,
        gallery: this.gallery.filter(x => !!x),
        tags: this.tags,
        active_hour: this.active_hour,
        active: true
      }

      this.$axios.$put(`admin/businesses/${this.$route.params.id}`, formData)
        .then(() => {
          this.$store.commit('notification/success', 'اطلاعات کسب و کار با موفقیت بروزرسانی شد.')
          this.$router.push('/admin/businesses')
        })
        .catch(error => {
          this.showError(error)
        })
    }
  }
}
</script>
