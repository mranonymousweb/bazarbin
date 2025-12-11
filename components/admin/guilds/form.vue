<template>
  <div class="rounded p-4 bg-white">
    <h3 class="mb-4 flex items-center">
      <i v-if="item" class="flaticon-162-edit w-7 font-bold"></i>
      <i v-else class="flaticon-043-plus w-7 font-bold"></i>
      <span v-if="item" class="font-semibold text-sm">
        ویرایش صنف
        "<b>{{ item.name }}</b>"
      </span>
      <span v-else class="font-semibold text-sm">افزودن صنف</span>
    </h3>
    <form class="text-sm px-7" @submit.prevent="submit">
      <Input
        v-model="form.name"
        class="mb-4"
        label="نام صنف"
        :errors="errors && errors.hasOwnProperty('name') ? errors.name : []"
      />
      <div class="mb-4">
        <label class="block pb-2">تگ ها</label>
        <TagsInput
          v-model="form.tags"
        />
        <ul v-if="errors && errors.hasOwnProperty('tags')" class="mt-2 text-red-550">
          <li v-for="(e,index) in errors.tags" :key="index" v-text="e"></li>
        </ul>
      </div>
      <div class="flex items-center mb-4">
        <input id="enable-input" v-model="form.status" type="checkbox"
               class="h-4 w-4 ml-2 text-blue-450 focus:ring-blue-450 border-gray-300 rounded">
        <label for="enable-input" class="ml-2 block text-sm text-gray-900">
          وضعیت (فعال یا غیرفعال)
        </label>
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
export default {
  name: 'AdminGuildsForm',
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
      form: {
        name: '',
        tags: '',
        status: true,
      }
    }
  },
  watch: {
    item(obj) {
      if (obj) {
        this.form.name = obj.name
        this.form.tags = obj.tags
        this.form.status = obj.status
      } else {
        this.form.name = ''
        this.form.tags = ''
        this.form.status = true
      }
    },
  },
  methods: {
    submit() {
      this.$emit('submit')
      this.errors = null
      this.item
        ? this.editItem()
        : this.addItem()
    },
    editItem() {
      this.loading = true
      this.$axios.$put(`admin/guilds/${this.item.id}/update`, this.form)
        .then(() => {
          this.form.name = null
          this.form.tags = null
          this.form.status = true
          this.$emit('edit-item')
        })
        .catch(error => {
          this.$emit('error', error.response.data.message, error.response.status)
        })
        .finally(() => {
          this.loading = false
        })
    },
    addItem() {
      this.loading = true
      this.$axios.$post('admin/guilds', this.form)
        .then(response => {
          this.form.name = null
          this.form.tags = null
          this.form.status = true
          this.$emit('add-item', response.guild)
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
