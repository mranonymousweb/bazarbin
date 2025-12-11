<template>
  <div :class="[rootClass, 'relative']">
    <button
      v-if="src && removeBtn"
      class="absolute z-10 top-0 left-0 bg-gray-500 px-2 py-0.5 rounded-br-2xl"
      @click="$emit('input',null)"
    >
      <i class="flaticon-133-trash text-base text-white inline-block cursor-pointer"></i>
    </button>
    <div
      v-if="src"
      :class="['rounded-xl overflow-hidden cursor-pointer', cssClass]"
      @click="openFile"
    >
      <img :src="src" alt="" :class="imageClass">
    </div>
    <div
      v-else
      :class="['border-2 border-dashed border-gray-400 rounded-xl flex flex-col justify-center items-center text-gray-500 cursor-pointer', cssClass]"
      @click="openFile"
    >
      <icons-camera-plus :class="iconClass"/>
      <span :class="labelClass">افزودن عکس</span>
    </div>
    <p v-if="uploading">
      <i class="flaticon-034-cancel font-bold text-base cursor-pointer" @click="cancelUploadFile"></i>
      {{ upload_text }}
    </p>
    <input ref="file" type="file" class="hidden" @change="selectFile">
  </div>
</template>

<script>
export default {
  name: "AddImageBtn",
  props: {
    value: {
      type: String,
      required: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    removeBtn: {
      type: Boolean,
      default: false
    },
    rootClass: {
      type: String,
      default: ''
    },
    cssClass: {
      type: String,
      default: 'w-40 h-40'
    },
    imageClass: {
      type: String,
      default: 'min-w-full min-h-full object-contain'
    },
    iconClass: {
      type: String,
      default: 'w-20 h-20 mb-4'
    },
    labelClass: {
      type: String,
      default: 'text-xl font-semibold'
    }
  },
  data() {
    return {
      src: '',
      baseUrl: process.env.storagePath,
      upload_percent: 0,
      upload_text: 0,
      uploading: false,
      uploadFileCancelTokenSource: null,
    }
  },
  watch: {
    value(val) {
      this.src = val ? this.baseUrl + val : ''
    }
  },
  created() {
    if (this.value) {
      this.src = this.baseUrl + this.value
    }
  },
  methods: {
    openFile() {
      this.$refs.file.click()
    },
    selectFile() {
      if (this.$refs.file.files[0]) {
        this.src = URL.createObjectURL(this.$refs.file.files[0])
        if (this.autoUpload) {
          this.uploadFile()
        } else {
          this.$emit('select-file', this.$refs.file.files[0])
        }
      }
    },
    uploadFile() {
      const formData = new FormData();
      formData.append('image', this.$refs.file.files[0]);

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
          this.src = this.baseUrl + response.path
          this.$emit('input', response.path)
          this.uploading = false
          this.$refs.file.value = ''
        })
        .catch(error => {
          if (error.response) {
            this.$refs.file.value = ''
          }
        })
    },
    cancelUploadFile() {
      this.uploadFileCancelTokenSource.cancel();
      this.uploading = false;
      this.src = this.value ? this.baseUrl + this.value : ''
      this.$refs.file.value = ''
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
