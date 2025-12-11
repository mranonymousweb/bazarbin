<template>
  <div>
    <panel-business-edit-icon v-model="iconInfo" class="mb-4"/>

    <panel-business-edit-gallery v-model="gallery" :exist="false" class="mb-4"/>

    <panel-business-edit-info v-model="info" :exist="false" class="mb-4"/>

    <panel-business-edit-address v-model="address" :exist="false" class="mb-4"/>

    <panel-business-edit-contacts v-model="contacts" :exist="false" class="mb-4"/>

    <panel-business-edit-work-times v-model="active_hour" :exist="false" class="mb-4"/>

    <div class="bg-white rounded p-6 mb-4">

      <div class="flex mb-4">
        <i class="flaticon-050-tag ml-2"></i>
        <span class="flex-grow text-gray-500">برچسب ها</span>
      </div>

      <div>
        <tags-input v-model="tags"/>
      </div>

    </div>

    <panel-business-edit-form v-model="form" :exist="false" @submit="submit"/>

  </div>
</template>

<script>

import TagsInput from "../../../components/TagsInput";
import PanelBusinessEditForm from "../../../components/panel/business/EditForm";
import errorParser from "~/mixins/error_parser";

export default {
  name: "AdminNewBusinessPage",
  components: {PanelBusinessEditForm, TagsInput},
  mixins:[errorParser],
  layout: 'admin',
  middleware: 'load.cities',
  data() {
    return {
      iconInfo: {
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
      active_hour: null,
      form: {
        form_id: '',
        send_reminder: '',
        appointments: [],
        holidays: [],
        required_fields: [],
      },
      tags: ''
    }
  },
  computed: {
    formData() {
      return {
        ...this.info,
        ...this.form,
        ...this.address,
        ...this.iconInfo,
        contacts: this.contacts,
        gallery: this.gallery.filter(x => !!x),
        tags: this.tags,
        active_hour: this.active_hour,
        active: true
      }
    }
  },
  methods: {
    submit() {
      this.$axios.$post('admin/businesses', this.formData)
        .then(response => {
          this.$store.commit('notification/success', 'کسب و کار با موفقیت ثبت شد.')
          this.$router.push('/admin/businesses')
        })
        .catch(error => {
          this.showError(error)
        })
    }
  }
}
</script>
