<template>
  <div class="bg-white rounded p-3 lg:p-6">

    <div class="flex items-center">
      <i class="text-base flaticon-063-picture ml-2"></i>
      <span class="flex-grow lg:text-gray-500 font-bold">تصویر کسب و کار</span>
      <span class="cursor-pointer text-blue-450" @click="open = !open">
        <i v-if="!open" class="flaticon-043-plus"></i>
        <span>{{ open ? 'بستن' : 'افزودن تصویر' }}</span>
      </span>
    </div>

    <slide-down :open="open">

      <div class="flex flex-wrap -ml-2 lg:-ml-6 pt-4">

        <add-image-btn
          v-for="(image, index) in images"
          :key="index"
          v-model="images[index]"
          :remove-btn="true"
          class="ml-2 lg:ml-6 mt-2 lg:mt-4"
          css-class="w-24 h-24 lg:w-32 lgh:h-32"
          icon-class="w-10 h-10 mb-1 lg:w-12 lg:h-12 lg:mb-2"
          label-class="font-medium"
          @input="update()"
        />

        <template v-if="6 - images.length > 0">
          <div v-for="i in 6 - images.length" :key="'empty-'+i" class="ml-2 lg:ml-6 mt-2 lg:mt-4">
            <div
              class="w-24 h-24 lg:w-32 lgh:h-32 border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center text-gray-400"
            >
              <i class="flaticon-063-picture text-3xl lg:text-4xl lg:mb-1"></i>
              <span class="font-medium">عکس</span>
            </div>
          </div>
        </template>

      </div>

    </slide-down>
  </div>
</template>

<script>
import errorParser from "~/mixins/error_parser";

export default {
  name: "PanelBusinessEditGallery",
  mixins: [errorParser],
  props: {
    value: {
      type: Array,
      required: true
    },
    exist: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      open: ! this.exist,
      images: [''],
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.data.roles.findIndex(x => x.name === 'super-admin') >= 0
    },
    url() {
      return this.isAdmin ? `admin/businesses/${this.$route.params.id}` : `home/business/${this.$route.params.id}`
    },
  },
  watch: {
    value() {
      this.images = this.value
    }
  },
  mounted() {
    this.images = this.value

    if (this.images.findIndex(x => !x) === -1 && (this.isAdmin || this.images.length < 6)) {
      this.images.push('')
    }

  },
  methods: {
    update() {
      if (this.images.findIndex(x => !x) === -1 && (this.isAdmin || this.images.length < 6)) {
        this.images.push('')
      }

      if (this.exist) {
        this.$axios.$put(this.url,{gallery: this.images.filter(x => !!x)})
          .then(() => {
            this.$store.commit('notification/success', 'گالری با موفقیت بروزرسانی شد.')
            this.$emit('input', this.images)
          })
          .catch(error => this.showError(error))
      } else {
        this.$emit('input', this.images)
      }

    }
  }
}
</script>
