<template>
  <div
    class="bg-white pt-4 lg:pt-8 pb-8 2xl:px-32 lg:px-20 px-8 rounded relative step step-1 transition-opacity"
    :class="active ? 'active' : 'opacity-40'"
  >

    <div class="text-center mb-8">
      <i class="flaticon-032-briefcase text-coolGray-750"></i>
      <br>
      <span class="text-lg font-black text-blue-450">افزودن کسب و کار</span>
    </div>

    <div>
      <slot/>
    </div>

    <div class="flex flex-wrap lg:flex-nowrap mt-8">

      <button
        v-if="step === 4"
        class="border-blue-450 rounded px-3 py-2 text-blue-450 w-full lg:w-1/2 lg:ml-4 mb-4 lg:mb-0 text-center border-2"
        @click="$emit('click-my-location-btn')"
      >برو به موقعیت من</button>

      <button
        class="border-blue-450 rounded px-3 py-2 text-blue-450 w-full lg:w-1/2 lg:ml-4 mb-4 lg:mb-0 text-center border-2"
        @click="$emit('click-prev-btn')"
      >بازگشت</button>

      <button
        class="bg-blue-450 rounded px-3 py-2 text-white w-full lg:w-1/2 lg:mr-4"
        @click="$emit('click-next-btn')"
      >{{ nextBtnLabel }}</button>

    </div>

  </div>
</template>

<script>
export default {
  name: "PanelBusinessNewStep",
  props: {
    active: {
      type: Boolean,
      required: true
    },
    step: {
      type: Number,
      default: 0
    },
    nextBtnLabel: {
      type: String,
      default: 'ادامه'
    }
  }
}
</script>
