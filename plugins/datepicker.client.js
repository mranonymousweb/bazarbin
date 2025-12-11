import VuePersianDatetimePicker from 'vue3-persian-datetime-picker'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePersianDatetimePicker, {
    props: {
      format: 'YYYY-MM-DD',
      displayFormat: 'dddd jDD jMMMM jYYYY',
      editable: false,
      inputClass: 'form-control py-1',
      placeholder: 'تاریخ را انتخاب کنید',
      altFormat: 'YYYY-MM-DD',
      color: '#10b981'
    }
  })

  nuxtApp.vueApp.component('DatePicker', VuePersianDatetimePicker)
})



