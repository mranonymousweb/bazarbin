<template>
  <modal :show="show" class="mt-8">
    <div class="p-8 pt-4">
      <h3 class="mb-8">
        <i class="flaticon-043-plus text-lg pl-2"></i>
        <span class="font-semibold text-sm">افزودن فیلد جدید</span>
      </h3>

      <div>
        <Input
          ref="title"
          v-model="title"
          label="عنوان فیلد"
          class="mb-8"
          placeholder="مثل: نام خانوادگی"
        />
        <Input
          v-model="name"
          label="نام فیلد"
          class="mb-8"
          placeholder="مثل: last_name"
          @keyup="enterKey"
        />
      </div>

      <div class="flex justify-center">
        <button
          class="py-2 rounded border-2 px-8 border-blue-450 text-blue-450 flex items-center justify-center mx-4"
          @click="$emit('close')"
        >
          انصراف
        </button>
        <submit-btn label="ثبت" class="mx-4" @click="submit"/>
      </div>

    </div>
  </modal>
</template>

<script>
export default {
  name: "AdminFormsAddFieldModal",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      name: '',
      title: '',
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$nextTick(() => this.$refs.title.focus())
      }
    }
  },
  methods: {
    submit() {
      this.$emit('add', {name: this.name, title: this.title})
    },
    enterKey(event) {
      if (event.keyCode === 13) {
        this.submit()
      }
    }
  }
}
</script>
