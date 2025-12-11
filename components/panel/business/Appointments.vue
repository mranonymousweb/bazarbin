<template>
  <div>
    <div class="mt-8 mb-4">
      <span class="font-medium">نوبت ها را تنظیم کنید</span>
      <button class="text-blue-450 text-sm mr-12" @click="addNewAppointment">
        <i class="flaticon-043-plus"></i>
        <span>افزودن نوبت جدید</span>
      </button>
    </div>

    <div class="space-y-2">
      <div v-for="(item, index) in notSavedAppointments" :key="index" class="flex">
        <Input
          v-model="item.name"
          placeholder="عنوان"
          class="w-1/3"
        />
        <Input
          v-model="item.description"
          placeholder="توضحیات"
          class="w-1/3 mx-4"
        />
        <button class="mr-12" @click="notSavedAppointments.splice(index,1)">
          <i class="flaticon-133-trash text-base text-red-550"></i>
        </button>
      </div>
    </div>

    <div v-if="notSavedAppointments.length" class="my-4 pt-4 border-t flex justify-center">
      <submit-btn
        label="افزودن"
        icon="flaticon-043-plus"
        @click="saveAppointments"
      />
    </div>

    <div v-if="editingItemIndex !== null" class="flex my-4">
      <Input
        v-model="editingItemName"
        placeholder="عنوان"
        class="w-1/3"
      />
      <Input
        v-model="editingItemDescription"
        placeholder="توضیحات"
        class="w-1/3 mx-4"
      />
      <button class="mr-12" @click="saveEdit">
        <i class="flaticon-151-check font-bold text-lg text-blue-450"></i>
      </button>
    </div>

    <div class="flex flex-wrap w-1/2 justify-center mx-auto" dir="ltr">
      <div
        v-for="(item,index) in appointments"
        :key="item.id ? item.id : 'index-'+index"
        class="relative"
        @mouseover="hoveredItem = index"
        @mouseleave="hoveredItem = null"
      >
        <span class="bg-gray-50 w-12 h-12 m-1 flex items-center justify-center">{{ index + 1 }}</span>
        <div
          class="absolute right-6 top-6 bg-white shadow rounded p-4 text-sm mt-2 mr-2"
          :class="[hoveredItem === index ? '' : 'hidden']"
          dir="rtl"
          style="min-width: 280px"
        >
          <div class="border-cyan-250 border-b flex justify-between whitespace-nowrap pb-2 mb-2">
            <span class="ml-8">{{ item.name }}</span>
            <span>{{ item.description }}</span>
          </div>
          <div class="flex justify-between">
            <button @click="editItem(index)">
              <i class="flaticon-162-edit text-base"></i>
            </button>
            <button @click="removeAppointment(index)">
              <i class="flaticon-133-trash text-base text-red-550"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import moment from "../../../mixins/moment";

export default {
  name: "PanelBusinessAppointments",
  mixins: [moment],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: true,
      appointments: [],
      notSavedAppointments: [],
      editingItemIndex: null,
      editingItemName: '',
      editingItemDescription: '',
      hoveredItem: null,
    }
  },
  async fetch() {
    await this.$axios.$get('home/appointments/product/' + this.product.id)
      .then(response => {
        this.appointments = response
      })
  },
  methods: {
    addNewAppointment() {
      this.notSavedAppointments.push({name: '', description: ''})
    },
    saveAppointments() {
      this.$axios.$post(`home/appointments/product/${this.product.id}`,{appointments: this.notSavedAppointments})
        .then(response => {
          this.appointments = response
          const msg = this.notSavedAppointments.length === 1 ? 'نوبت با موفقیت ذخیره شد' : 'نوبت ها با موفقیت ذخیره شدند.'
          this.notSavedAppointments = []
          this.$store.commit('notification/success', msg)
        })
        .catch(error => {
          this.showError(error)
        })
    },
    editItem(index) {
      this.editingItemIndex = index
      this.editingItemName = this.appointments[index].name
      this.editingItemDescription = this.appointments[index].description
    },
    saveEdit() {
      const appointment = this.appointments[this.editingItemIndex]
      if (appointment.id) {
        const data = {
          name: this.editingItemName,
          description: this.editingItemDescription
        }
        this.$axios.$put(`appointment-titles/${appointment.id}`, data)
          .then(response => {
            appointment.name = response.name
            appointment.description = response.description
            this.editingItemIndex = null
            this.$store.commit('notification/success', 'نوبت با موفقیت ویرایش شد.')
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        appointment.name = this.editingItemName
        appointment.description = this.editingItemDescription
        this.editingItemIndex = null
      }
    },
    removeAppointment(index) {
      const appointment = this.appointments[index]
      if (appointment.id) {
        this.$axios.$delete(`home/appointments/${appointment.id}`)
          .then(() => {
            this.appointments.splice(index, 1)
            this.$store.commit('notification/success', 'نوبت با موفقیت حذف شد.')
          })
          .catch(error => {
            this.showError(error)
          })
      } else {
        this.appointments.splice(index, 1)
      }
    }
  }
}
</script>
