<template>
  <div class="border border-coolGray-300 rounded overflow-hidden">
    <div class="flex items-center bg-gray-50 h-12 lg:h-14">
      <img :src="baseUrl + template.picture" alt="" class="w-8 h-8 mx-2 md:mx-3">
      <span class="flex-grow flex-shrink whitespace-nowrap">{{ template.name }}</span>
      <button :class="['mx-2 md:mx-4 transition-all', open ? 'rotate-180 transform' : '']" @click="open = !open" >
        <icons-solid-chevron-up class="w-7 h-7 text-coolGray-600"/>
      </button>
    </div>

    <slide-down :open="open">
      <div class="p-4 border-t border-coolGray-300">
        <Input
          v-model="title"
          @input="update"
          label="عنوان"
          class="mb-4"
        />
        <Input
          v-model="val"
          @input="update"
          label="مقدار"
        />
        <div class="flex justify-center mt-6">
          <button v-if="exist" class="mx-4" @click="submit">
            <i class="flaticon-151-check text-blue-450 font-bold text-lg"></i>
          </button>
          <button class="mx-4" @click="remove">
            <i class="flaticon-133-trash text-lg text-red-550"></i>
          </button>
        </div>
      </div>
    </slide-down>

  </div>
</template>

<script>
import SlideDown from "../../SlideDown";
import Input from "../../Input";
import IconsSolidChevronUp from "../../icons/solid/ChevronUp";
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessContactInfo",
  components: {IconsSolidChevronUp, Input, SlideDown},
  mixins: [errorParser],
  props: {
    value: {
      type: Object,
      required: true
    },
    template: {
      type: Object,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: !this.value?.id,
      title: '',
      val: '',
      baseUrl: process.env.storagePath,
    }
  },
  created() {
    this.title = this.value.title
    this.val = this.value.value
  },
  watch: {
    value(val) {
      this.title = val.title
      this.val = val.value
    }
  },
  methods: {
    update() {
      this.$emit('input', {
        title: this.title,
        value: this.val,
        template_id: this.value.template_id,
        id: this.value.id
      })
    },
    remove() {
      if (!this.exist || !this.value.id) {
        this.$emit('delete')
        return
      }
      this.$axios.$delete(`home/business/${this.$route.params.id}/contacts/${this.value.id}`)
        .then(() => {
          this.$emit('delete')
        })
    },
    submit() {
      const method = this.value.id ? '$put' : '$post'
      const url = this.value.id
        ? `home/business/${this.$route.params.id}/contacts/${this.value.id}`
        : `home/business/${this.$route.params.id}/contacts`
      this.$axios[method](url, {title: this.title, value: this.val, template_id: this.value.template_id})
        .then(response => {
          this.$store.commit('notification/success', 'اطلاعات تماس با موفقیت ذخیره شد.')
          if (!this.value.id) {
            this.$emit('input', {
              title: response.title,
              value: response.value,
              id: this.value.id || response.id,
              template_id: response.template_id,
            })
          }
        })
        .catch(error => {
          this.showError(error)
        })
    }
  }
}
</script>
