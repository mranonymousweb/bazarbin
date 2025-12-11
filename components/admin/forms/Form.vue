<template>
<div class="select-none">

  <div class="rounded p-4 pb-8 bg-white ">
    <div class="mb-4 flex items-center justify-between">
      <h3>
        <i class="flaticon-044-file text-lg pl-2"></i>
        <span class="font-semibold text-sm">اطلاعات فرم</span>
      </h3>
      <span class="text-sm text-blue-450 cursor-pointer" @click="openInfo = !openInfo">
        <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
        بستن
      </span>
    </div>

    <slide-down :open="openInfo">

      <div>
        <div class="flex mb-8 px-1">
          <Input
            v-model="form.name"
            label="نام فرم"
            class="w-1/2 pl-8"
          />
          <Input
            v-model="form.submit_text"
            label="متن دکمه سفارش"
            class="w-1/2 pl-16"
          />
        </div>

        <div class="flex mb-12 px-1">
          <checkbox
            v-model="form.dateable"
            label="نیاز به تاریخ دارد"
            class="pl-8"
            input-class="text-cyan-250 focus:ring-cyan-250 border-cyan-250 border-2"
          />
          <checkbox
            v-model="form.status"
            label="وضعیت (فعال یا غیرفعال)"
            class="pl-8"
            input-class="text-cyan-250 focus:ring-cyan-250 border-cyan-250 border-2"
          />
          <checkbox
            v-model="form.show_in_index"
            label="قرارگیری در صفحه اصلی کسب و کار"
            input-class="text-cyan-250 focus:ring-cyan-250 border-cyan-250 border-2"
          />
        </div>

        <div class="flex justify-center">
          <nuxt-link
            to="/admin/forms"
            class="py-2 rounded border-2 px-8 border-blue-450 text-blue-450 flex items-center justify-center mx-4"
          >
            بازگشت
          </nuxt-link>
          <submit-btn :loading="loading" @click="submit"/>
        </div>

      </div>

    </slide-down>

  </div>

  <div v-if="$route.params.id" class="rounded p-4 bg-white mt-4">
    <h3 class="mb-4">
      <i class="flaticon-144-layout text-lg pl-2"></i>
      <span class="font-semibold text-sm">فیلد ها</span>
    </h3>

    <Input
      v-model="form.title"
      label="عنوان بخش فیلد ها"
      class="mb-8"
    />

    <div class="flex justify-between mb-4">
      <span>برای اضافه کردن به قسمت خالی سمت چپ بکشید.</span>
      <span class="text-sm text-blue-450 cursor-pointer" @click="addFieldModal = true">
        <i class="flaticon-043-plus w-7 font-bold text-xs"></i>
        افزودن فیلد جدید
      </span>
    </div>

    <div class="flex justify-between">
      <div class="w-1/3 not-used-fields" @drop="drop" @dragover="allowDrop">
        <ul>
          <li
            v-for="(field, index) in notUsedFields"
            :key="field.name"
            class="bg-gray-50 rounded py-2 px-4 cursor-move mb-4"
            draggable="true"
            :data-index="index"
            data-list="notUsedFields"
            @dragstart="drag"
          >
            {{ field.title }}
          </li>
        </ul>
      </div>

      <div class="w-2/3 flex justify-around used-fields pb-12" @drop="drop" @dragover="allowDrop">
        <ul class="w-1/2">
          <li
            v-for="(field, index) in usedFields"
            :key="field.name"
            class="bg-gray-50 rounded py-2 px-4 cursor-move mb-4"
            draggable="true"
            :data-index="index"
            data-list="usedFields"
            @dragstart="drag"
          >
            {{ field.title }}
          </li>
        </ul>
      </div>
    </div>

  </div>

  <admin-forms-add-field-modal
    v-if="$route.params.id"
    :show="addFieldModal"
    @close="addFieldModal = false"
    @add="addNewField"
  />

</div>
</template>

<script>
export default {
  name: "AdminFormsForm",
  data() {
    return {
      loading: false,
      openInfo: true,
      addFieldModal: false,
      fields: [],
      usedFields: [],
      fieldForm: {
        key: '',
        value: '',
      },
      form: {
        name: '',
        title: 'مشخصات خود را وارد نمایید',
        submit_text: '',
        dateable: false,
        show_in_index: false,
        status: false,
      },
    }
  },
  async fetch() {

    if (!this.fields.length) {
      await this.$axios.$get('admin/fields')
        .then(response => {
          this.fields = response
        })
    }

    if (this.$route.params.id) {
      await this.$axios.$get(`admin/forms/${this.$route.params.id}`)
        .then(response => {
          this.form.name = response.name
          this.form.title = response.title
          this.form.submit_text = response.submit_text
          this.form.dateable = !! response.dateable
          this.form.show_in_index = !! response.show_in_index
          this.form.status = !! response.status
          this.usedFields = response.fields
        })
    }
  },
  computed: {
    notUsedFields() {
      return this.fields.filter(x => !this.usedFields.find(y => x.name === y.name))
    }
  },

  methods: {
    submit() {
      const method = this.$route.params.id ? '$put' : '$post'
      const url = this.$route.params.id ? `/admin/forms/${this.$route.params.id}/update` : '/admin/forms/create'
      this.$axios[method](url, this.form)
        .then(response => {
          if (this.$route.params.id) {
            this.$fetch()
          } else {
            this.$router.push(`/admin/forms/${response.id}`)
          }
        })
    },
    closeFieldModal() {
      this.addFieldModal = false
      this.fieldForm.key = ''
      this.fieldForm.value = ''
    },
    allowDrop(event) {
      event.preventDefault();
    },
    drag(event) {
      event.target.classList.remove('bg-gray-50')
      event.target.classList.add('bg-gray-200')
      event.dataTransfer.setData("text", `${event.target.dataset.list}|${event.target.dataset.index}`);
    },
    drop(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData("text").split('|')
      const index = +data[1]
      const startList = data[0]
      const targetList = event.target.closest('.used-fields') ? 'usedFields' : 'notUsedFields'

      if (startList === 'usedFields') {
        if (targetList === 'notUsedFields') {
          this.detachFields(index)
        }
        /* else if (targetList === 'usedFields' && event.target.nodeName === 'LI') {
          const targetIndex = +event.target.dataset.index
          this.usedFields.splice(targetIndex, 0, this.usedFields.splice(index,1)[0])
        } */
      }

      else if (startList === 'notUsedFields') {
        if (targetList === 'usedFields') {
          this.attachFields(index)
          /* if (event.target.nodeName === 'LI') {
            this.usedFields.splice(+event.target.dataset.index, 0, this.notUsedFields[index]);
          } else {
            this.usedFields.push(this.notUsedFields[index])
          } */
        }
      }
    },
    addNewField(data) {
      this.fields.push(data)
      this.addFieldModal = false
      setTimeout(() => this.attachFields(this.notUsedFields.length - 1),0)
    },
    detachFields(index) {
      const data = {detach_fields: [this.usedFields[index].name]}
      this.$axios.$put(`/admin/forms/${this.$route.params.id}/update`, data)
        .then(response => {
          this.usedFields.splice(index, 1)
          this.$fetch()
        })
    },
    attachFields(index) {
      const field = {}
      field[this.notUsedFields[index].name] = this.notUsedFields[index].title
      const data = {attach_fields: field}
      this.$axios.$put(`/admin/forms/${this.$route.params.id}/update`, data)
        .then(response => {
          this.usedFields.push(this.notUsedFields[index])
          this.$fetch()
        })
    }
  }
}
</script>
