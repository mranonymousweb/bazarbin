<template>
  <div class="rounded p-4 bg-white">
    <h3 class="mb-4 flex items-center">
      <i v-if="item" class="flaticon-162-edit w-7 font-bold"></i>
      <i v-else class="flaticon-043-plus w-7 font-bold"></i>
      <span v-if="item" class="font-semibold text-sm">
        ویرایش اطلاعات تماس
        "<b>{{ item.name }}</b>"
      </span>
      <span v-else class="font-semibold text-sm">افزودن اطلاعات تماس</span>
    </h3>
    <form class="text-sm px-7" @submit.prevent="submit">
      <Input
        v-model="form.name"
        class="mb-4"
        label="نام اطلاعات تماس"
        :errors="errors && errors.hasOwnProperty('name') ? errors.name : []"
      />
      <Input
        v-model="form.title"
        class="mb-4"
        label="عنوان"
        :errors="errors && errors.hasOwnProperty('title') ? errors.title : []"
      />
      <Input
        v-model="form.field_title"
        class="mb-4"
        label="عنوان مقدار"
        :errors="errors && errors.hasOwnProperty('field_title') ? errors.field_title : []"
      />
      <Input
        v-model="form.link"
        class="mb-4"
        label="لینک"
        :errors="errors && errors.hasOwnProperty('link') ? errors.link : []"
      />

      <div class="my-8">

        <div class="flex justify-center">
          <AddImageBtn v-model="form.picture" @select-file="file = $event" />
        </div>

        <ul v-if="errors && errors.hasOwnProperty('picture')" :class="'mt-2 text-red-550'">
          <li v-for="(e, index) in errors.picture" :key="index" v-text="e"></li>
        </ul>

      </div>

      <div class="flex justify-center">
        <button class="flex items-center bg-blue-450 text-white rounded py-2" type="submit">
          <i v-if="!loading" class="flaticon-151-check font-bold px-4"></i>
          <span v-if="!loading && item" class="pl-8">بروزرسانی</span>
          <span v-else-if="!loading" class="pl-8">ثبت</span>
          <span v-else class="loader mx-8 w-5 h-5 border-2 rounded-full border-blue-300"></span>
        </button>

        <button v-if="item" type="button" class="flex items-center border border-blue-450 text-blue-450 rounded py-2 px-8 mr-4" @click="$emit('cancel-edit')">
          <span>انصراف</span>
        </button>
      </div>

    </form>
  </div>
</template>

<script>
import AddImageBtn from "../../AddImageBtn";
export default {
  name: 'AdminContactsForm',
  components: {AddImageBtn},
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading : false,
      errors: null,
      file: null,
      form: {
        name: '',
        title: '',
        field_title: '',
        link: '',
        picture: '',
      }
    }
  },
  watch: {
    item(obj) {
      if (obj) {
        this.form.name = obj.name
        this.form.title = obj.title
        this.form.field_title = obj.field_title
        this.form.link = obj.link
        this.form.picture = obj.picture
      } else {
        this.form.name = ''
        this.form.title = ''
        this.form.field_title = ''
        this.form.link = ''
        this.form.picture = ''
      }
    },
  },
  methods: {
    submit() {
      this.$emit('submit')
      this.errors = null

      const method = this.item ? '$put' : '$post'
      const url = this.item ? `admin/contacts/${this.item.id}` : 'admin/contacts'
      this.loading = true
      this.$axios[method](url, this.form)
        .then(response => {
          this.form.name = ''
          this.form.title = ''
          this.form.field_title = ''
          this.form.link = ''
          this.form.picture = ''
          this.$emit(this.item ? 'edit-item' : 'add-item', response)
        })
        .catch(error => {
          this.$emit('error', error.response.data.message, error.response.status)
          this.errors = error.response.data?.errors
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
