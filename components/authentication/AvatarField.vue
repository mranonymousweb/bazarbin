<template>
  <div>
    <div>
      <img
        v-if="avatar_src"
        :src="avatar_src"
        alt=""
        :class="`w-24 h-24 mb-12 object-cover rounded-full border border-${borderColor} mx-auto cursor-pointer`"
        @click="$refs.file.click()"
      >
      <label v-else ref="label" for="avatar-input" class="relative w-28 h-32 mx-auto block text-center mb-12 cursor-pointer">
        <i :class="`flaticon-037-photo-camera border-2 border-${borderColor} rounded-full mx-auto text-4xl w-24 h-24 flex items-center justify-center`"></i>
        <i :class="`flaticon-043-plus border-2 border-${borderColor} rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center left-3 bottom-8 absolute bg-white`"></i>
        <span :class="labelClass">{{ label }}</span>
      </label>
      <input id="avatar-input" ref="file" type="file" class="hidden" @input="checkFile"/>
    </div>

    <p v-if="uploading">
      <i class="flaticon-034-cancel font-bold text-base cursor-pointer" @click="cancelUploadFile"></i>
      <span class="text-sm">{{ upload_text }}</span>
    </p>

  </div>
</template>

<script>
export default {
  name: "AuthenticationAvatarField",
  props: {
    autoUpload: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: null
    },
    borderColor: {
      type: String,
      default: 'blue-450'
    },
    label: {
      type: String,
      default: 'افزودن عکس'
    },
    labelClass: {
      type: String,
      default: 'font-medium'
    }
  },
  data() {
    return {
      avatar: null,
      avatar_src: null,
      uploading: false,
      upload_text: 0,
      upload_percent: 0,
      uploadFileCancelTokenSource: null,
      baseUrl: process.env.storagePath,
    }
  },
  watch: {
    value(value) {
      if (value) {
        this.avatar_src = this.baseUrl + value
      }
    }
  },
  created() {
    if (this.value) {
      this.avatar_src = this.baseUrl + this.value
    }
  },
  methods: {
    checkFile() {
      const [file] = this.$refs.file.files
      if (file) {
        if (this.autoUpload) {
          this.uploadFile(file)
        } else {
          this.avatar_src = URL.createObjectURL(file)
          this.$emit('input', file)
        }
      }
    },
    uploadFile(file) {
      const formData = new FormData();
      formData.append('image', file);

      const headers = {'Content-Type': 'multipart/form-data'}
      const onUploadProgress = e => {
        this.upload_percent = Math.round((e.loaded * 100) / e.total)
        this.upload_text = e.loaded < e.total
          ? `${this.convertSize(e.loaded)} / ${this.convertSize(e.total)}`
          : 'در حال پردازش'
      }

      this.uploading = true
      this.upload_percent = 0
      this.uploadFileCancelTokenSource = this.$axios.CancelToken.source();

      this.$axios.$post('upload', formData, {
        headers,
        onUploadProgress,
        cancelToken: this.uploadFileCancelTokenSource.token
      })
        .then(response => {
          this.avatar_src = this.baseUrl + response.path
          this.$emit('input', response.path)
          this.uploading = false
          this.$refs.input.value = ''
        })
        .catch(error => {
          if (error.response) {
            this.$refs.input.value = ''
          }
        })
    },
    cancelUploadFile() {
      this.$refs.input.value = ''
      this.uploadFileCancelTokenSource.cancel();
      this.uploading = false;
      this.$nextTick(() => this.fixHeight())
    },
    convertSize(value) {
      if (value >= 1024 * 1024) {
        return Number((value / (1024 * 1024)).toFixed(2)) + ' MB'
      }
      if (value >= 1024) {
        return Number((value / 1024).toFixed(2)) + ' KB'
      }
      return value + ' B'
    }
  }
}
</script>
